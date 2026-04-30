import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Colonia } from "../../types";

const POLYGON_GEOJSON_URL = new URL('../../assets/cp.geojson', import.meta.url).href;
const PERIMETER_GEOJSON_URL = new URL('../../assets/limite_cdmx.geojson', import.meta.url).href;
const MUNICIPIOS_GEOJSON_URL = new URL('../../assets/municipios.geojson', import.meta.url).href;

const VECTOR_STYLE = 'https://tiles.openfreemap.org/styles/fiord';

interface MapViewProps {
  colonias: Colonia[];
  onColoniaClick?: (colonia: Colonia) => void;
  selectedCP?: string;
  selectionTrigger?: number;
}

// Direct mapping: bajo=red, medio=yellow, alto=green
const COLORS: Record<string, string> = {
  bajo: "#fca5a5",
  medio: "#fcd34d",
  alto: "#86efac",
  sin_datos: "#9ca3af",
  default: "#d1d5db",
};

const BADGE_COLORS: Record<string, string> = {
  bajo: "#ef4444",
  medio: "#eab308",
  alto: "#22c55e",
  sin_datos: "#9ca3af",
};

function MapView({ colonias, onColoniaClick, selectedCP, selectionTrigger = 0 }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [hoveredCP, setHoveredCP] = useState<string | null>(null);
  const coloniasByCP = useRef<Map<string, Colonia>>(new Map());
  const polygonDataRef = useRef<GeoJSON.FeatureCollection | null>(null);

  const openColoniaPopup = (
    cp: string,
    colonia: Colonia | undefined,
    lngLat: maplibregl.LngLatLike,
  ) => {
    if (!map.current) return;

    const cat = (colonia?.categoria_riesgo || "sin_datos") as Colonia["categoria_riesgo"];
    const color = BADGE_COLORS[cat] || "#6b7280";
    const cumplLabel =
      cat === "alto"
        ? "Mejor cumplimiento"
        : cat === "medio"
          ? "Equidad PROMEDIO"
          : cat === "sin_datos"
            ? "SIN DATOS"
            : "Equidad BAJA";

    popupRef.current?.remove();
    popupRef.current = new maplibregl.Popup({
      offset: 15,
      closeButton: true,
      closeOnClick: true,
    })
      .setLngLat(lngLat)
      .setHTML(
        `
          <div style="padding:16px;min-width:200px;font-family:system-ui,sans-serif">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
              <div style="width:12px;height:12px;border-radius:50%;background:${color}"></div>
              <h3 style="margin:0;font-size:18px;font-weight:700;color:#111827">CP ${cp}</h3>
            </div>
            <p style="margin:0 0 12px;font-size:13px;color:#6b7280">${colonia?.municipio || ""}, ${colonia?.estado || ""}</p>
            <span style="display:inline-block;padding:5px 14px;border-radius:4px;font-size:12px;font-weight:700;color:white;background:${color};text-transform:uppercase">
              ${cumplLabel}
            </span>
          </div>
        `,
      )
      .addTo(map.current);
  };

  useEffect(() => {
    const lookup = new Map<string, Colonia>();
    colonias.forEach((c) => lookup.set(c.codigo_postal, c));
    coloniasByCP.current = lookup;
  }, [colonias]);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: VECTOR_STYLE,
      center: [-99.1332, 19.4326],
      zoom: 10,
      minZoom: 8,
      maxZoom: 18,
      attributionControl: true,
    });

    map.current.on("load", async () => {
      setIsLoaded(true);

      try {
        const response = await fetch(POLYGON_GEOJSON_URL);
        if (!response.ok)
          throw new Error(`Error loading polygon data: ${response.status}`);
        const polygonData = await response.json();
        polygonDataRef.current = polygonData;

        map.current!.addSource("polygons", {
          type: "geojson",
          data: polygonData,
          promoteId: "codigo_postal",
        });

        const perimeterResponse = await fetch(PERIMETER_GEOJSON_URL);
        if (!perimeterResponse.ok)
          throw new Error(`Error loading perimeter data: ${perimeterResponse.status}`);
        const perimeterData = await perimeterResponse.json();

        map.current!.addSource("cdmx-perimeter", {
          type: "geojson",
          data: perimeterData,
        });

        const municipiosResponse = await fetch(MUNICIPIOS_GEOJSON_URL);
        if (!municipiosResponse.ok)
          throw new Error(`Error loading municipios data: ${municipiosResponse.status}`);
        const municipiosData = await municipiosResponse.json();

        map.current!.addSource("municipios", {
          type: "geojson",
          data: municipiosData,
        });

        map.current!.addLayer({
          id: "municipios-fill",
          type: "fill",
          source: "municipios",
          paint: {
            "fill-color": "rgba(135, 206, 235, 0.08)",
            "fill-outline-color": "rgba(59, 130, 246, 0.22)",
          },
        });

        map.current!.addLayer({
          id: "municipios-line",
          type: "line",
          source: "municipios",
          paint: {
            "line-color": "rgba(59, 130, 246, 0.28)",
            "line-width": 1,
          },
        });

        map.current!.addLayer({
          id: "cdmx-perimeter-fill",
          type: "fill",
          source: "cdmx-perimeter",
          paint: {
            "fill-color": "rgba(106, 173, 218, 0.14)",
            "fill-outline-color": "rgba(106, 173, 218, 0.65)",
          },
        });

        map.current!.addLayer({
          id: "cdmx-perimeter-line",
          type: "line",
          source: "cdmx-perimeter",
          paint: {
            "line-color": "rgba(106, 173, 218, 0.95)",
            "line-width": 4,
            "line-opacity": 0.95,
          },
        });
      } catch (error) {
        console.error(error);
      }

      setMapReady(true);
    });

    map.current.addControl(new maplibregl.NavigationControl(), "top-right");
    map.current.addControl(
      new maplibregl.ScaleControl({ maxWidth: 100, unit: "metric" }),
      "bottom-right",
    );

    return () => {
      popupRef.current?.remove();
      popupRef.current = null;
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (
      !mapReady ||
      !map.current ||
      colonias.length === 0 ||
      !map.current.getSource("polygons") ||
      !polygonDataRef.current
    )
      return;

    ["polygons-background", "polygons-fill", "polygons-outline-hover", "points-circle"].forEach(
      (l) => {
        if (map.current!.getLayer(l)) map.current!.removeLayer(l);
      },
    );
    if (map.current.getSource("points")) map.current.removeSource("points");
    if (map.current.getSource("polygons-highlight")) map.current.removeSource("polygons-highlight");

    const highlightFeatures = polygonDataRef.current.features.filter((feature) => {
      const cp = String(feature.properties?.codigo_postal ?? '').padStart(5, '0');
      return coloniasByCP.current.has(cp);
    });

    const highlightData: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features: highlightFeatures,
    };

    map.current.addSource("polygons-highlight", {
      type: "geojson",
      data: highlightData,
      promoteId: "codigo_postal",
    });

    map.current.addLayer({
      id: "polygons-background",
      type: "fill",
      source: "polygons",
      paint: {
        "fill-color": COLORS.default,
        "fill-opacity": 0.06,
      },
    });

    const colorExpr: any[] = ["match", ["to-string", ["get", "codigo_postal"]]];
    colonias.forEach((c) => {
      colorExpr.push(
        String(c.codigo_postal),
        COLORS[c.categoria_riesgo] || COLORS.default,
      );
    });
    colorExpr.push(COLORS.default);

    map.current.addLayer({
      id: "polygons-fill",
      type: "fill",
      source: "polygons-highlight",
      paint: {
        "fill-color": colorExpr as any,
        "fill-opacity": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          0.85,
          0.7,
        ],
      },
    });

    map.current.addLayer({
      id: "polygons-outline-hover",
      type: "line",
      source: "polygons-highlight",
      paint: {
        "line-color": "#000000",
        "line-width": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          2,
          0,
        ],
        "line-opacity": 1,
      },
    });

    const pointsData: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features: colonias
        .filter((c) => c.latitud && c.longitud)
        .map((c) => ({
          type: "Feature",
          properties: {
            codigo_postal: c.codigo_postal,
            categoria_riesgo: c.categoria_riesgo,
          },
          geometry: { type: "Point", coordinates: [c.longitud, c.latitud] },
        })),
    };

    map.current.addSource("points", { type: "geojson", data: pointsData });
    map.current.addLayer({
      id: "points-circle",
      type: "circle",
      source: "points",
      minzoom: 14,
      paint: {
        "circle-color": [
          "match",
          ["get", "categoria_riesgo"],
          "bajo",
          COLORS.bajo,
          "medio",
          COLORS.medio,
          "alto",
          COLORS.alto,
          "sin_datos",
          COLORS.sin_datos,
          COLORS.default,
        ],
        "circle-radius": ["interpolate", ["linear"], ["zoom"], 14, 4, 18, 8],
        "circle-stroke-width": 2,
        "circle-stroke-color": "#ffffff",
      },
    });

    if (map.current.getLayer("cdmx-perimeter-line")) {
      map.current.moveLayer("cdmx-perimeter-line");
    }
    if (map.current.getLayer("cdmx-perimeter-fill")) {
      map.current.moveLayer("cdmx-perimeter-fill");
    }

    let hovId: string | null = null;

    map.current.on("mousemove", "polygons-fill", (e) => {
      if (!e.features?.length) return;
      map.current!.getCanvas().style.cursor = "pointer";
      const cp = String(e.features[0].properties?.codigo_postal);
      if (hovId && hovId !== cp)
        map.current!.setFeatureState(
          { source: "polygons-highlight", id: hovId },
          { hover: false },
        );
      if (cp) {
        hovId = cp;
        map.current!.setFeatureState(
          { source: "polygons-highlight", id: cp },
          { hover: true },
        );
        setHoveredCP(cp);
      }
    });

    map.current.on("mouseleave", "polygons-fill", () => {
      map.current!.getCanvas().style.cursor = "";
      if (hovId) {
        map.current!.setFeatureState(
          { source: "polygons-highlight", id: hovId },
          { hover: false },
        );
        hovId = null;
        setHoveredCP(null);
      }
    });

    map.current.on("click", "polygons-fill", (e) => {
      if (!e.features?.length) return;
      const cp = String(e.features[0].properties?.codigo_postal);
      if (!cp) return;
      const colonia = coloniasByCP.current.get(cp);
      if (colonia && onColoniaClick) onColoniaClick(colonia);

      openColoniaPopup(cp, colonia, e.lngLat);
    });
  }, [mapReady, colonias, onColoniaClick]);

  useEffect(() => {
    if (!isLoaded || !map.current) return;

    if (!selectedCP) {
      popupRef.current?.remove();
      popupRef.current = null;
      return;
    }

    const c = colonias.find((c) => c.codigo_postal === selectedCP);
    const getPolygonCenter = (cp: string): [number, number] | null => {
      const feature = polygonDataRef.current?.features.find(
        (item) => String(item.properties?.codigo_postal ?? "").padStart(5, "0") === cp,
      );

      if (!feature) return null;

      let minLng = Infinity;
      let minLat = Infinity;
      let maxLng = -Infinity;
      let maxLat = -Infinity;

      const visitCoordinates = (coordinates: unknown) => {
        if (!Array.isArray(coordinates)) return;

        if (
          coordinates.length >= 2 &&
          typeof coordinates[0] === "number" &&
          typeof coordinates[1] === "number"
        ) {
          const lng = coordinates[0];
          const lat = coordinates[1];
          minLng = Math.min(minLng, lng);
          minLat = Math.min(minLat, lat);
          maxLng = Math.max(maxLng, lng);
          maxLat = Math.max(maxLat, lat);
          return;
        }

        coordinates.forEach(visitCoordinates);
      };

      const visitGeometry = (geometry?: GeoJSON.Geometry) => {
        if (!geometry) return;
        if (geometry.type === "GeometryCollection") {
          geometry.geometries.forEach(visitGeometry);
          return;
        }
        visitCoordinates(geometry.coordinates);
      };

      visitGeometry(feature.geometry ?? undefined);

      if (![minLng, minLat, maxLng, maxLat].every(Number.isFinite)) return null;

      return [(minLng + maxLng) / 2, (minLat + maxLat) / 2];
    };

    const lngLat =
      c && Number.isFinite(c.longitud) && Number.isFinite(c.latitud)
        ? [c.longitud, c.latitud] as [number, number]
        : getPolygonCenter(selectedCP);

    if (lngLat) {
      map.current.flyTo({
        center: lngLat,
        zoom: 12.5,
        duration: 1500,
      });
      openColoniaPopup(selectedCP, c, lngLat);
    }
  }, [selectedCP, selectionTrigger, isLoaded, colonias]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
      {hoveredCP && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "60px",
            backgroundColor: "rgba(17,24,39,0.9)",
            color: "white",
            padding: "8px 14px",
            borderRadius: "6px",
            fontSize: "13px",
            fontWeight: "500",
          }}
        >
          CP {hoveredCP}
        </div>
      )}
      <style>{`
        .maplibregl-popup-content { padding:0!important; border-radius:12px!important; box-shadow:0 10px 40px rgba(0,0,0,0.2)!important; }
        .maplibregl-popup-close-button { font-size:18px; padding:8px 12px; color:#9ca3af; }
      `}</style>
    </div>
  );
}

export default MapView;
