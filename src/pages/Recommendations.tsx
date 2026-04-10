import { useEffect } from 'react';

export default function Recommendations() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="rec">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap');

        .rec {
          min-height: 100vh;
          background: linear-gradient(170deg, #9DD0F3 0%, #7CB9E2 30%, #6AADDA 60%, #5A9FCC 100%);
          font-family: 'Space Mono', monospace;
          color: #fff;
          padding: 40px 24px 80px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .rec-container {
          max-width: 680px;
          width: 100%;
        }

        .rec-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(36px, 8vw, 56px);
          font-weight: 400;
          letter-spacing: 2px;
          line-height: 1.1;
          margin-bottom: 16px;
          text-align: center;
        }

        .rec-intro {
          font-size: 14px;
          line-height: 1.8;
          opacity: 0.9;
          text-align: center;
          margin-bottom: 40px;
          max-width: 560px;
          margin-left: auto;
          margin-right: auto;
        }

        .rec-section {
          margin-bottom: 36px;
        }

        .rec-section-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 24px;
          font-weight: 400;
          letter-spacing: 2px;
          margin-bottom: 20px;
          padding-bottom: 8px;
          border-bottom: 2px solid rgba(255,255,255,0.2);
        }

        .rec-icon {
          display: inline-block;
          margin-right: 8px;
        }

        .rec-item {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 12px;
          padding: 16px 20px;
          margin-bottom: 12px;
          font-size: 13px;
          line-height: 1.7;
          transition: background 0.25s ease;
        }

        .rec-item:hover {
          background: rgba(255,255,255,0.15);
        }

        .rec-item-title {
          font-weight: 700;
          font-size: 13px;
          margin-bottom: 4px;
          color: #fff;
        }

        .rec-item-body {
          opacity: 0.85;
        }

        .rec-closing {
          margin-top: 40px;
          padding: 24px;
          background: rgba(28,35,51,0.5);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1.5px solid rgba(255,255,255,0.2);
          border-radius: 16px;
          text-align: center;
          font-size: 14px;
          line-height: 1.8;
          font-style: italic;
        }

        .rec-closing strong {
          color: #86efac;
          font-style: normal;
        }

        .rec-report {
          margin-top: 20px;
          text-align: center;
          font-size: 13px;
          line-height: 1.7;
          opacity: 0.95;
        }

        .rec-report a {
          color: #ffffff;
          font-weight: 700;
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .rec-report a:hover {
          opacity: 0.85;
        }

        @media (max-width: 600px) {
          .rec { padding: 24px 16px 60px; }
          .rec-item { padding: 14px 16px; font-size: 12px; }
          .rec-section-title { font-size: 20px; }
        }
      `}</style>

      <div className="rec-container">
        <h1 className="rec-title">¿Qué hago yo con todo esto?</h1>

        <p className="rec-intro">
          Mejorar el aire no depende sólo de decisiones individuales, pero sí empieza por ellas.
          Estas son formas concretas de actuar —como persona y como parte de una comunidad:
        </p>

        {/* Individual */}
        <div className="rec-section">
          <h2 className="rec-section-title">
            A nivel individual
          </h2>

          <div className="rec-item">
            <div className="rec-item-title">Muévete de forma más limpia</div>
            <div className="rec-item-body">
              Prioriza transporte público, caminar o usar bicicleta. Sistemas eléctricos como metro o cablebús reducen significativamente las emisiones por persona.
            </div>
          </div>

          <div className="rec-item">
            <div className="rec-item-title">Evita generar contaminación adicional en días críticos</div>
            <div className="rec-item-body">
              No pintes, no barnices, no uses solventes y, si puedes, pospón cargar gasolina o usar electrodomésticos intensivos.
            </div>
          </div>

          <div className="rec-item">
            <div className="rec-item-title">Reduce el uso del coche</div>
            <div className="rec-item-body">
              Especialmente en trayectos cortos. Menos autos = mejor aire para todos.
            </div>
          </div>

          <div className="rec-item">
            <div className="rec-item-title">Cuida tu exposición si eres población sensible</div>
            <div className="rec-item-body">
              Si eres niña, niño, persona mayor o con enfermedades respiratorias, cuida tu exposición y busca atención médica si hay síntomas.
            </div>
          </div>

          <div className="rec-item">
            <div className="rec-item-title">Infórmate</div>
            <div className="rec-item-body">
              Revisar la calidad del aire te permite tomar mejores decisiones diarias.
            </div>
          </div>
        </div>

        {/* Colectivo */}
        <div className="rec-section">
          <h2 className="rec-section-title">
            A nivel colectivo
          </h2>

          <div className="rec-item">
            <div className="rec-item-title">Defiende y cuida las áreas verdes</div>
            <div className="rec-item-body">
              Ayudan a mitigar contaminantes y a regular la temperatura urbana.
            </div>
          </div>

          <div className="rec-item">
            <div className="rec-item-title">Exige mejores sistemas de transporte público</div>
            <div className="rec-item-body">
              Ciudades con transporte digno, accesible y de bajas emisiones tienen mejor calidad del aire.
            </div>
          </div>

          <div className="rec-item">
            <div className="rec-item-title">Pide más y mejor monitoreo</div>
            <div className="rec-item-body">
              Ampliar las estaciones permite entender el problema y actuar mejor.
            </div>
          </div>

          <div className="rec-item">
            <div className="rec-item-title">Apoya políticas públicas que reduzcan emisiones</div>
            <div className="rec-item-body">
              En industria, transporte y energía: la evidencia muestra que las mejoras sostenidas en calidad del aire vienen de decisiones estructurales.
            </div>
          </div>

          <div className="rec-item">
            <div className="rec-item-title">Involúcrate en tu comunidad</div>
            <div className="rec-item-body">
              Cambios locales en movilidad, uso del espacio y regulación también impactan el aire que respiras.
            </div>
          </div>
        </div>

        {/* Closing */}
        <div className="rec-closing">
          <strong>Respirar aire limpio no debería depender de decisiones individuales. Es un derecho.</strong>
          <br /><br />
          Pero mientras avanzamos hacia políticas más ambiciosas, nuestras acciones cotidianas pueden reducir riesgos y acelerar el cambio.
        </div>

        <p className="rec-report">
          Si encuentras errores o información desactualizada, repórtalo en nuestras redes sociales o en{' '}
          <a
            href="https://www.github.com/surinstitute/aire-libre"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          . También puedes escribirnos por{' '}
          <a
            href="https://www.instagram.com/surinstitute/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>{' '}
          o{' '}
          <a
            href="https://www.facebook.com/institutodelsururbano/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook
          </a>
          .
        </p>
      </div>
    </div>
  );
}
