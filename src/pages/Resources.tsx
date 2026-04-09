import { useEffect } from 'react';

export default function Resources() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="res">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap');

        .res {
          min-height: 100vh;
          background: linear-gradient(170deg, #9DD0F3 0%, #7CB9E2 30%, #6AADDA 60%, #5A9FCC 100%);
          font-family: 'Space Mono', monospace;
          color: #fff;
          padding: 40px 24px 80px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .res-container {
          max-width: 560px;
          width: 100%;
          text-align: center;
        }

        .res-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(36px, 8vw, 56px);
          font-weight: 400;
          letter-spacing: 2px;
          line-height: 1.1;
          margin-bottom: 16px;
        }

        .res-desc {
          font-size: 14px;
          line-height: 1.8;
          opacity: 0.85;
          margin-bottom: 40px;
        }

        .res-cards {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 32px;
        }

        .res-card {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 16px;
          padding: 24px;
          text-align: left;
          transition: background 0.25s ease;
        }

        .res-card:hover {
          background: rgba(255,255,255,0.15);
        }

        .res-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .res-card-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          font-weight: 400;
          letter-spacing: 1.5px;
        }

        .res-card-badge {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.5px;
          padding: 3px 10px;
          border-radius: 20px;
          background: rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.7);
        }

        .res-card-body {
          font-size: 12px;
          line-height: 1.7;
          opacity: 0.75;
          margin-bottom: 16px;
        }

        .res-download {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.5px;
          color: #1C2333;
          background: #fff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
        }

        .res-download:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        }

        .res-download:active {
          transform: translateY(0);
        }

        .res-note {
          margin-top: 8px;
          font-size: 11px;
          opacity: 0.5;
          line-height: 1.6;
        }

        @media (max-width: 600px) {
          .res { padding: 24px 16px 60px; }
          .res-desc { font-size: 13px; }
          .res-card { padding: 20px; }
          .res-card-body { font-size: 11px; }
          .res-download { font-size: 11px; padding: 10px 20px; }
        }
      `}</style>

      <div className="res-container">
        <h1 className="res-title">Recursos</h1>

        <p className="res-desc">
          Descarga los datos abiertos del proyecto Aire Libre para análisis,
          investigación o desarrollo de herramientas propias.
        </p>

        <div className="res-cards">
          {/* CSV */}
          <div className="res-card">
            <div className="res-card-header">
              <span className="res-card-title">Datos tabulares</span>
              <span className="res-card-badge">CSV</span>
            </div>
            <p className="res-card-body">
              Índices de equidad, calidad del aire, salud y condiciones
              socioeconómicas para los 2,251 códigos postales de la Zona
              Metropolitana del Valle de México. Abre en Excel, Google Sheets o cualquier herramienta de datos.
            </p>
            <a
              href="/datos_aire_libre.csv"
              download="datos_aire_libre.csv"
              className="res-download"
            >
              ↓ Descargar CSV
            </a>
          </div>

          {/* GeoJSON (NUEVA TARJETA) */}
          <div className="res-card">
            <div className="res-card-header">
              <span className="res-card-title">Límites Geográficos</span>
              <span className="res-card-badge">GEOJSON</span>
            </div>
            <p className="res-card-body">
              Geometrías vectoriales ligeras de los códigos postales. 
              Ideal para desarrolladores web (Leaflet, Mapbox, Google Maps API) o visualizaciones interactivas rápidas.
            </p>
            <a
              href="/geometrias_codigos_postales.geojson"
              download="geometrias_codigos_postales.geojson"
              className="res-download"
            >
              ↓ Descargar GeoJSON
            </a>
            <p className="res-note">
              Formato estándar compatible con aplicaciones web y visores GIS.
            </p>
          </div>

          {/* GeoPackage */}
          <div className="res-card">
            <div className="res-card-header">
              <span className="res-card-title">Datos geoespaciales</span>
              <span className="res-card-badge">GPKG</span>
            </div>
            <p className="res-card-body">
              Base de datos geoespacial completa con polígonos de códigos postales,
              límites municipales y estatales, más todos los indicadores del proyecto.
              Abre en QGIS, Python (GeoPandas), R o cualquier herramienta GIS.
            </p>
            <a
              href="/Base_plataforma.gpkg"
              download="Base_plataforma.gpkg"
              className="res-download"
            >
              ↓ Descargar GeoPackage
            </a>
            <p className="res-note">
              Incluye 3 capas: códigos postales, límites municipales y límites estatales
            </p>
          </div>
        </div>

        <p style={{ fontSize: '11px', opacity: 0.5, lineHeight: 1.6 }}>
          Fuente: Instituto del Sur Urbano · Proyecto Aire Libre
        </p>
      </div>
    </div>
  );
}