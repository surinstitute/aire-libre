import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Colonia } from '../../types';

interface MapViewProps {
  colonias: Colonia[];
  onColoniaClick?: (colonia: Colonia) => void;
  selectedCP?: string;
}

const TILESET_ID = 'loungelizard7.bcqgjoe8';
const SOURCE_LAYER = 'codigos_postales-43psgh';

// ── Colors: mapped by DB categoria_riesgo ──
// DB "bajo"  (low risk)  → GREEN  (cumplimiento alto = more rights)
// DB "medio"             → YELLOW
// DB "alto"  (high risk) → RED    (cumplimiento bajo = fewer rights)
const COLORS = {
  bajo: '#86efac',   // green — cumplimiento alto
  medio: '#fcd34d',  // yellow
  alto: '#fca5a5',   // red — cumplimiento bajo
  default: '#9ca3af',
  border: '#1f2937',
  borderHover: '#000000'
};

// DB categoria_riesgo → cumplimiento label
const getCumplimiento = (categoriaRiesgo: string): string => {
  switch (categoriaRiesgo) {
    case 'bajo': return 'ALTO';
    case 'medio': return 'MEDIO';
    case 'alto': return 'BAJO';
    default: return 'MEDIO';
  }
};

// Color for cumplimiento badge in popup
const getCumplColor = (categoriaRiesgo: string): string => {
  switch (categoriaRiesgo) {
    case 'bajo': return '#22c55e';   // green
    case 'medio': return '#eab308';  // yellow
    case 'alto': return '#ef4444';   // red
    default: return '#6b7280';
  }
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
    colonias.forEach(c => { lookup.set(c.codigo_postal, c); });
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
      setMapReady(true);
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(new mapboxgl.ScaleControl({ maxWidth: 100, unit: 'metric' }), 'bottom-right');

    return () => {
      if (map.current) { map.current.remove(); map.current = null; }
    };
  }, []);

  useEffect(() => {
    if (!mapReady || !map.current || colonias.length === 0) return;

    const layersToRemove = ['polygons-fill', 'polygons-outline-hover', 'points-circle'];
    layersToRemove.forEach(layer => {
      if (map.current!.getLayer(layer)) map.current!.removeLayer(layer);
    });
    if (map.current.getSource('points')) map.current.removeSource('points');

    // Build color expression — uses DB categoria_riesgo with inverted color meaning
    const colorExpression: any[] = ['match', ['to-string', ['get', 'codigo_postal']]];
    colonias.forEach(colonia => {
      const color = colonia.categoria_riesgo === 'alto' ? COLORS.alto :
                    colonia.categoria_riesgo === 'medio' ? COLORS.medio :
                    colonia.categoria_riesgo === 'bajo' ? COLORS.bajo : COLORS.default;
      colorExpression.push(String(colonia.codigo_postal), color);
    });
    colorExpression.push(COLORS.default);

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

    map.current.addLayer({
      id: 'polygons-outline-hover',
      type: 'line',
      source: 'polygons',
      'source-layer': SOURCE_LAYER,
      paint: {
        'line-color': COLORS.borderHover,
        'line-width': ['case', ['boolean', ['feature-state', 'hover'], false], 2, 0],
        'line-opacity': 1
      }
    });

    // Points for high zoom
    const pointsData: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: colonias
        .filter(c => c.latitud && c.longitud)
        .map(colonia => ({
          type: 'Feature',
          properties: { codigo_postal: colonia.codigo_postal, categoria_riesgo: colonia.categoria_riesgo },
          geometry: { type: 'Point', coordinates: [colonia.longitud, colonia.latitud] }
        }))
    };

    map.current.addSource('points', { type: 'geojson', data: pointsData });

    map.current.addLayer({
      id: 'points-circle',
      type: 'circle',
      source: 'points',
      minzoom: 14,
      paint: {
        'circle-color': [
          'match', ['get', 'categoria_riesgo'],
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
        if (colonia && onColoniaClick) onColoniaClick(colonia);

        const coordinates = e.lngLat;
        const cumpl = getCumplimiento(colonia?.categoria_riesgo || 'medio');
        const color = getCumplColor(colonia?.categoria_riesgo || 'medio');

        new mapboxgl.Popup({ offset: 15, closeButton: true, closeOnClick: false })
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
                Cumplimiento ${cumpl}
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
      map.current.flyTo({ center: [colonia.longitud, colonia.latitud], zoom: 14, duration: 1500 });
    }
  }, [selectedCP, isLoaded, colonias]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />

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

export default MapView;
