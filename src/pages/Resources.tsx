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
          max-width: 520px;
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

        .res-download {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 16px 32px;
          font-family: 'Space Mono', monospace;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.5px;
          color: #1C2333;
          background: #fff;
          border: none;
          border-radius: 10px;
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
          margin-top: 24px;
          font-size: 11px;
          opacity: 0.6;
          line-height: 1.6;
        }

        @media (max-width: 600px) {
          .res { padding: 24px 16px 60px; }
          .res-desc { font-size: 13px; }
          .res-download { font-size: 13px; padding: 14px 28px; }
        }
      `}</style>

      <div className="res-container">
        <h1 className="res-title">Recursos</h1>

        <p className="res-desc">
          Descarga los datos abiertos del proyecto Aire Libre.
          Incluye información de equidad, calidad del aire, salud
          y condiciones socioeconómicas para las 2,251 colonias
          de la Zona Metropolitana del Valle de México.
        </p>

        <a
          href="/datos_aire_libre.csv"
          download="datos_aire_libre.csv"
          className="res-download"
        >
          ↓ Descargar datos (CSV)
        </a>

        <p className="res-note">
          Formato CSV · Datos por código postal · Fuente: Instituto del Sur Urbano
        </p>
      </div>
    </div>
  );
}