import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Colonia } from '../../types';

// Importar los GeoJSON
import cdmxPerimetro from '../../data/cdmx_perimetro.json';
import cdmxAlcaldias from '../../data/cdmx_alcaldias_limites.json';

interface MapViewProps {
  colonias: Colonia[];
  onColoniaClick?: (colonia: Colonia) => void;
  selectedCP?: string;
}

// Tileset ID de Mapbox con los polígonos
const TILESET_ID = 'loungelizard7.bcqgjoe8';
const SOURCE_LAYER = 'codigos_postales-43psgh';

// Colores
const COLORS = {
  bajo: '#22c55e',
  medio: '#f59e0b',
  alto: '#ef4444',
  default: '#9ca3af',
  border: '#1f2937',
  borderHover: '#000000',
  cdmxBorder: '#1e40af',      // Azul fuerte para perímetro CDMX
  alcaldiasBorder: '#64748b'  // Gris para límites de alcaldías
};

function MapView({ colonias, onColoniaClick, selectedCP }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [hoveredCP, setHoveredCP] = useState<string | null>(null);

  const coloniasByCP = useRef<Map<string, Colonia>>(new Map());
  
  useEffect(() => {
    const lookup = new Map<string, Colonia>();
    colonias.forEach(c => {
      lookup.set(c.codigo_postal, c);
    });
    coloniasByCP.current = lookup;
  }, [colonias]);

  useEffect(() => {
    if (map.current) return;

    const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
    
    if (!mapboxToken || !mapContainer.current) {
      console.error('Mapbox token o container no encontrado');
      return;
    }

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-99.1332, 19.4326],
      zoom: 10,
      minZoom: 8,
      maxZoom: 18
    });

    map.current.on('load', () => {
      setIsLoaded(true);
      
      map.current!.addSource('polygons', {
        type: 'vector',
        url: `mapbox://${TILESET_ID}`,
        promoteId: 'codigo_postal'
      });

      // Fuente del perímetro de CDMX
      map.current!.addSource('cdmx-perimetro', {
        type: 'geojson',
        data: cdmxPerimetro as GeoJSON.FeatureCollection
      });

      // Fuente de límites de alcaldías
      map.current!.addSource('cdmx-alcaldias', {
        type: 'geojson',
        data: cdmxAlcaldias as GeoJSON.FeatureCollection
      });

      setMapReady(true);
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(new mapboxgl.ScaleControl({ maxWidth: 100, unit: 'metric' }), 'bottom-right');

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapReady || !map.current || colonias.length === 0) return;

    const layersToRemove = ['polygons-fill', 'polygons-outline-hover', 'points-circle', 'cdmx-alcaldias-line', 'cdmx-perimetro-line'];
    layersToRemove.forEach(layer => {
      if (map.current!.getLayer(layer)) {
        map.current!.removeLayer(layer);
      }
    });
    if (map.current.getSource('points')) {
      map.current.removeSource('points');
    }

    const colorExpression: any[] = ['match', ['to-string', ['get', 'codigo_postal']]];
    
    colonias.forEach(colonia => {
      const color = colonia.categoria_riesgo === 'alto' ? COLORS.alto :
                    colonia.categoria_riesgo === 'medio' ? COLORS.medio :
                    colonia.categoria_riesgo === 'bajo' ? COLORS.bajo : COLORS.default;
      colorExpression.push(String(colonia.codigo_postal), color);
    });
    colorExpression.push(COLORS.default);

    // Capa de relleno
    map.current.addLayer({
      id: 'polygons-fill',
      type: 'fill',
      source: 'polygons',
      'source-layer': SOURCE_LAYER,
      paint: {
        'fill-color': colorExpression as any,
        'fill-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          0.85,
          0.7
        ]
      }
    });

    // Contorno solo en hover
    map.current.addLayer({
      id: 'polygons-outline-hover',
      type: 'line',
      source: 'polygons',
      'source-layer': SOURCE_LAYER,
      paint: {
        'line-color': COLORS.borderHover,
        'line-width': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          2,
          0
        ],
        'line-opacity': 1
      }
    });

    // === LÍMITES DE ALCALDÍAS ===
    map.current.addLayer({
      id: 'cdmx-alcaldias-line',
      type: 'line',
      source: 'cdmx-alcaldias',
      paint: {
        'line-color': COLORS.alcaldiasBorder,
        'line-width': [
          'interpolate',
          ['linear'],
          ['zoom'],
          8, 0.5,
          12, 1,
          16, 1.5
        ],
        'line-opacity': 0.6
      }
    });

    // === PERÍMETRO DE CDMX (encima de todo) ===
    map.current.addLayer({
      id: 'cdmx-perimetro-line',
      type: 'line',
      source: 'cdmx-perimetro',
      paint: {
        'line-color': COLORS.cdmxBorder,
        'line-width': [
          'interpolate',
          ['linear'],
          ['zoom'],
          8, 2,
          12, 3,
          16, 4
        ],
        'line-opacity': 1
      }
    });

    // Puntos para zoom alto
    const pointsData: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: colonias
        .filter(c => c.latitud && c.longitud)
        .map(colonia => ({
          type: 'Feature',
          properties: {
            codigo_postal: colonia.codigo_postal,
            categoria_riesgo: colonia.categoria_riesgo
          },
          geometry: {
            type: 'Point',
            coordinates: [colonia.longitud, colonia.latitud]
          }
        }))
    };

    map.current.addSource('points', {
      type: 'geojson',
      data: pointsData
    });

    map.current.addLayer({
      id: 'points-circle',
      type: 'circle',
      source: 'points',
      minzoom: 14,
      paint: {
        'circle-color': [
          'match',
          ['get', 'categoria_riesgo'],
          'bajo', COLORS.bajo,
          'medio', COLORS.medio,
          'alto', COLORS.alto,
          COLORS.default
        ],
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 14, 4, 18, 8],
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff'
      }
    });

    let hoveredFeatureId: string | null = null;

    map.current.on('mousemove', 'polygons-fill', (e) => {
      if (!e.features || e.features.length === 0) return;
      
      map.current!.getCanvas().style.cursor = 'pointer';
      const feature = e.features[0];
      const cp = String(feature.properties?.codigo_postal);
      
      if (hoveredFeatureId !== null && hoveredFeatureId !== cp) {
        map.current!.setFeatureState(
          { source: 'polygons', sourceLayer: SOURCE_LAYER, id: hoveredFeatureId },
          { hover: false }
        );
      }
      
      if (cp) {
        hoveredFeatureId = cp;
        map.current!.setFeatureState(
          { source: 'polygons', sourceLayer: SOURCE_LAYER, id: cp },
          { hover: true }
        );
        setHoveredCP(cp);
      }
    });

    map.current.on('mouseleave', 'polygons-fill', () => {
      map.current!.getCanvas().style.cursor = '';
      if (hoveredFeatureId !== null) {
        map.current!.setFeatureState(
          { source: 'polygons', sourceLayer: SOURCE_LAYER, id: hoveredFeatureId },
          { hover: false }
        );
        hoveredFeatureId = null;
        setHoveredCP(null);
      }
    });

    map.current.on('click', 'polygons-fill', (e) => {
      if (!e.features || e.features.length === 0) return;
      
      const feature = e.features[0];
      const cp = String(feature.properties?.codigo_postal);
      
      if (cp) {
        const colonia = coloniasByCP.current.get(cp);
        if (colonia && onColoniaClick) {
          onColoniaClick(colonia);
        }

        const coordinates = e.lngLat;
        const color = colonia?.categoria_riesgo === 'alto' ? COLORS.alto :
                      colonia?.categoria_riesgo === 'medio' ? COLORS.medio : COLORS.bajo;

        new mapboxgl.Popup({ 
          offset: 15,
          closeButton: true,
          closeOnClick: false
        })
          .setLngLat(coordinates)
          .setHTML(`
            <div style="padding: 16px; min-width: 200px; font-family: system-ui, sans-serif;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                <div style="width: 12px; height: 12px; border-radius: 50%; background-color: ${color};"></div>
                <h3 style="margin: 0; font-size: 18px; font-weight: 700; color: #111827;">CP ${cp}</h3>
              </div>
              <p style="margin: 0 0 12px 0; font-size: 13px; color: #6b7280;">
                ${colonia?.municipio || ''}, ${colonia?.estado || ''}
              </p>
              <span style="
                display: inline-block;
                padding: 5px 14px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 700;
                color: white;
                background-color: ${color};
                text-transform: uppercase;
              ">
                Riesgo ${colonia?.categoria_riesgo || 'N/A'}
              </span>
            </div>
          `)
          .addTo(map.current!);
      }
    });

  }, [mapReady, colonias, onColoniaClick]);

  useEffect(() => {
    if (!isLoaded || !map.current || !selectedCP) return;

    const colonia = colonias.find(c => c.codigo_postal === selectedCP);
    if (colonia && colonia.latitud && colonia.longitud) {
      map.current.flyTo({
        center: [colonia.longitud, colonia.latitud],
        zoom: 14,
        duration: 1500
      });
    }
  }, [selectedCP, isLoaded, colonias]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
      
      {/* Leyenda */}
      <div style={{
        position: 'absolute',
        bottom: '40px',
        left: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: '16px 20px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        fontSize: '14px'
      }}>
        <div style={{ fontWeight: '700', marginBottom: '12px', color: '#111827', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Nivel de Riesgo
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <LegendItem color={COLORS.bajo} label="Bajo" />
          <LegendItem color={COLORS.medio} label="Medio" />
          <LegendItem color={COLORS.alto} label="Alto" />
        </div>
        
        <div style={{ borderTop: '1px solid #e5e7eb', marginTop: '12px', paddingTop: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <div style={{ width: '20px', height: '3px', backgroundColor: COLORS.cdmxBorder, borderRadius: '2px' }} />
            <span style={{ color: '#374151', fontSize: '12px' }}>Límite CDMX</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '20px', height: '1px', backgroundColor: COLORS.alcaldiasBorder }} />
            <span style={{ color: '#374151', fontSize: '12px' }}>Alcaldías</span>
          </div>
        </div>
      </div>

      {/* Contador */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: '10px 16px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        fontSize: '13px',
        color: '#374151',
        fontWeight: '600'
      }}>
        <span style={{ color: '#111827', fontWeight: '700' }}>{colonias.length.toLocaleString()}</span> códigos postales
      </div>

      {hoveredCP && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '60px',
          backgroundColor: 'rgba(17, 24, 39, 0.9)',
          color: 'white',
          padding: '8px 14px',
          borderRadius: '6px',
          fontSize: '13px',
          fontWeight: '500'
        }}>
          CP {hoveredCP}
        </div>
      )}

      <style>{`
        .mapboxgl-popup-content {
          padding: 0 !important;
          border-radius: 12px !important;
          box-shadow: 0 10px 40px rgba(0,0,0,0.2) !important;
        }
        .mapboxgl-popup-close-button {
          font-size: 18px;
          padding: 8px 12px;
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: color }} />
      <span style={{ color: '#374151', fontWeight: '500' }}>{label}</span>
    </div>
  );
}

export default MapView;