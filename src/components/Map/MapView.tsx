import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Colonia } from '../../types';
import cdmxPerimetro from '../../data/cdmx_perimetro.json';

interface MapViewProps {
  colonias: Colonia[];
  onColoniaClick?: (colonia: Colonia) => void;
  selectedCP?: string;
}

const TILESET_ID = 'loungelizard7.bcqgjoe8';
const SOURCE_LAYER = 'codigos_postales-43psgh';

// Direct mapping: bajo=red, medio=yellow, alto=green
const COLORS: Record<string, string> = {
  bajo: '#fca5a5',
  medio: '#fcd34d',
  alto: '#86efac',
  sin_datos: '#d1d5db',
  default: '#9ca3af',
};

const BADGE_COLORS: Record<string, string> = {
  bajo: '#ef4444',
  medio: '#eab308',
  alto: '#22c55e',
  sin_datos: '#9ca3af',
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
    colonias.forEach(c => lookup.set(c.codigo_postal, c));
    coloniasByCP.current = lookup;
  }, [colonias]);

  useEffect(() => {
    if (map.current) return;
    const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
    if (!mapboxToken || !mapContainer.current) return;

    mapboxgl.accessToken = mapboxToken;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-99.1332, 19.4326],
      zoom: 10, minZoom: 8, maxZoom: 18
    });

    map.current.on('load', () => {
      setIsLoaded(true);
      map.current!.addSource('polygons', { type: 'vector', url: `mapbox://${TILESET_ID}`, promoteId: 'codigo_postal' });

      // CDMX perimeter silhouette
      map.current!.addSource('cdmx-perimetro', {
        type: 'geojson',
        data: cdmxPerimetro as GeoJSON.FeatureCollection,
      });
      map.current!.addLayer({
        id: 'cdmx-perimetro-line',
        type: 'line',
        source: 'cdmx-perimetro',
        paint: {
          'line-color': '#1C2333',
          'line-width': 2.5,
          'line-opacity': 0.6,
          'line-dasharray': [4, 2],
        },
      });

      setMapReady(true);
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(new mapboxgl.ScaleControl({ maxWidth: 100, unit: 'metric' }), 'bottom-right');

    return () => { if (map.current) { map.current.remove(); map.current = null; } };
  }, []);

  useEffect(() => {
    if (!mapReady || !map.current || colonias.length === 0) return;

    ['polygons-fill', 'polygons-outline-hover', 'points-circle'].forEach(l => {
      if (map.current!.getLayer(l)) map.current!.removeLayer(l);
    });
    if (map.current.getSource('points')) map.current.removeSource('points');

    const colorExpr: any[] = ['match', ['to-string', ['get', 'codigo_postal']]];
    colonias.forEach(c => {
      colorExpr.push(String(c.codigo_postal), COLORS[c.categoria_riesgo] || COLORS.default);
    });
    colorExpr.push(COLORS.default);

    map.current.addLayer({
      id: 'polygons-fill', type: 'fill', source: 'polygons', 'source-layer': SOURCE_LAYER,
      paint: {
        'fill-color': colorExpr as any,
        'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.85, 0.7]
      }
    });

    map.current.addLayer({
      id: 'polygons-outline-hover', type: 'line', source: 'polygons', 'source-layer': SOURCE_LAYER,
      paint: {
        'line-color': '#000000',
        'line-width': ['case', ['boolean', ['feature-state', 'hover'], false], 2, 0],
        'line-opacity': 1
      }
    });

    const pointsData: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: colonias.filter(c => c.latitud && c.longitud).map(c => ({
        type: 'Feature',
        properties: { codigo_postal: c.codigo_postal, categoria_riesgo: c.categoria_riesgo },
        geometry: { type: 'Point', coordinates: [c.longitud, c.latitud] }
      }))
    };

    map.current.addSource('points', { type: 'geojson', data: pointsData });
    map.current.addLayer({
      id: 'points-circle', type: 'circle', source: 'points', minzoom: 14,
      paint: {
        'circle-color': ['match', ['get', 'categoria_riesgo'], 'bajo', COLORS.bajo, 'medio', COLORS.medio, 'alto', COLORS.alto, COLORS.default],
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 14, 4, 18, 8],
        'circle-stroke-width': 2, 'circle-stroke-color': '#ffffff'
      }
    });

    let hovId: string | null = null;

    map.current.on('mousemove', 'polygons-fill', (e) => {
      if (!e.features?.length) return;
      map.current!.getCanvas().style.cursor = 'pointer';
      const cp = String(e.features[0].properties?.codigo_postal);
      if (hovId && hovId !== cp) map.current!.setFeatureState({ source: 'polygons', sourceLayer: SOURCE_LAYER, id: hovId }, { hover: false });
      if (cp) { hovId = cp; map.current!.setFeatureState({ source: 'polygons', sourceLayer: SOURCE_LAYER, id: cp }, { hover: true }); setHoveredCP(cp); }
    });

    map.current.on('mouseleave', 'polygons-fill', () => {
      map.current!.getCanvas().style.cursor = '';
      if (hovId) { map.current!.setFeatureState({ source: 'polygons', sourceLayer: SOURCE_LAYER, id: hovId }, { hover: false }); hovId = null; setHoveredCP(null); }
    });

    let activePopup: mapboxgl.Popup | null = null;

    map.current.on('click', 'polygons-fill', (e) => {
      if (!e.features?.length) return;
      const cp = String(e.features[0].properties?.codigo_postal);
      if (!cp) return;
      const colonia = coloniasByCP.current.get(cp);
      if (colonia && onColoniaClick) onColoniaClick(colonia);

      const cat = (colonia?.categoria_riesgo || 'medio') as string;
      const color = BADGE_COLORS[cat] || '#6b7280';
      const cumplLabel = cat === 'alto' ? 'Mejor cumplimiento' : cat === 'medio' ? 'Equidad PROMEDIO' : cat === 'sin_datos' ? 'SIN DATOS' : 'Equidad BAJA';

      // Close previous popup
      if (activePopup) { activePopup.remove(); activePopup = null; }

      activePopup = new mapboxgl.Popup({ offset: 15, closeButton: true, closeOnClick: true })
        .setLngLat(e.lngLat)
        .setHTML(`
          <div style="padding:16px;min-width:200px;font-family:system-ui,sans-serif">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
              <div style="width:12px;height:12px;border-radius:50%;background:${color}"></div>
              <h3 style="margin:0;font-size:18px;font-weight:700;color:#111827">CP ${cp}</h3>
            </div>
            <p style="margin:0 0 12px;font-size:13px;color:#6b7280">${colonia?.municipio || ''}, ${colonia?.estado || ''}</p>
            <span style="display:inline-block;padding:5px 14px;border-radius:4px;font-size:12px;font-weight:700;color:white;background:${color};text-transform:uppercase">
              ${cumplLabel}
            </span>
          </div>
        `)
        .addTo(map.current!);
    });

  }, [mapReady, colonias, onColoniaClick]);

  useEffect(() => {
    if (!isLoaded || !map.current || !selectedCP) return;
    const c = colonias.find(c => c.codigo_postal === selectedCP);
    if (c?.latitud && c?.longitud) map.current.flyTo({ center: [c.longitud, c.latitud], zoom: 14, duration: 1500 });
  }, [selectedCP, isLoaded, colonias]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
      {hoveredCP && (
        <div style={{ position: 'absolute', top: '10px', right: '60px', backgroundColor: 'rgba(17,24,39,0.9)', color: 'white', padding: '8px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: '500' }}>
          CP {hoveredCP}
        </div>
      )}
      <style>{`
        .mapboxgl-popup-content { padding:0!important; border-radius:12px!important; box-shadow:0 10px 40px rgba(0,0,0,0.2)!important; }
        .mapboxgl-popup-close-button { font-size:18px; padding:8px 12px; color:#9ca3af; }
      `}</style>
    </div>
  );
}

export default MapView;