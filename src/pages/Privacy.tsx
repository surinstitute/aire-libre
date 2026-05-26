import { useEffect } from 'react';

const sections = [
  {
    title: '1. Sobre el sitio y la privacidad',
    paragraphs: [
      'Aire Libre es una plataforma informativa de divulgación sobre calidad del aire, salud y territorio. Esta política explica qué información puede procesarse cuando visitas el sitio y con qué finalidad.',
    ],
  },
  {
    title: '2. Qué datos se utilizan',
    paragraphs: [
      'La plataforma no requiere crear una cuenta ni incorpora formularios para registrar perfiles personales dentro del sitio.',
      'El test interactivo solicita datos como la edad y la colonia seleccionada que se procesan únicamente de manera local y se almacenan temporalmente en sessionStorage dentro de tu navegador para poder mostrar tu resultado durante la misma sesión. Esa información se mantiene del lado del dispositivo del usuario y nunca se envía hacia ninguna base de datos.',
      'El sitio puede procesar información técnica de navegación a través de herramientas de analítica y rendimiento, como Vercel Analytics y Vercel Speed Insights, para entender el uso general del sitio y detectar problemas de desempeño.',
    ],
  },
  {
    title: '3. Finalidades del tratamiento',
    paragraphs: [
      'La información técnica de navegación se usa para medir tráfico agregado, estabilidad y rendimiento del sitio.',
      'La información temporal del test se usa para calcular y mostrar resultados, permitir la navegación entre pantallas del flujo y facilitar funciones como compartir resultados desde el dispositivo del usuario.',
    ],
  },
  {
    title: '4. Base técnica y almacenamiento local',
    paragraphs: [
      'El sitio utiliza almacenamiento de sesión del navegador para conservar respuestas del cuestionario mientras la sesión está activa. Ese almacenamiento puede eliminarse al cerrar la sesión o limpiando los datos del navegador.',
      'La plataforma también carga archivos y recursos necesarios para desplegar mapas, visualizaciones y contenidos del sitio. Esos recursos se usan para la operación normal de la experiencia.',
    ],
  },
  {
    title: '5. Compartición y terceros',
    paragraphs: [
      'El sitio integra servicios de terceros para analítica, medición de rendimiento y enlaces externos. Esos terceros pueden procesar información técnica conforme a sus propios términos y políticas.',
      'Cuando sales del sitio mediante enlaces a plataformas externas, la interacción posterior se rige por las políticas de privacidad de esos servicios.',
    ],
  },
  {
    title: '6. Datos sensibles y decisiones del usuario',
    paragraphs: [
      'La plataforma aborda temas de salud y vulnerabilidad ambiental, pero su contenido es informativo y no sustituye orientación médica, diagnóstica o jurídica.',
      'Recomendamos no compartir información personal sensible en canales públicos asociados a resultados o capturas si no deseas hacerla visible a otras personas.',
    ],
  },
  {
    title: '7. Conservación',
    paragraphs: [
      'La información almacenada en sessionStorage depende del navegador del usuario y de la duración de su sesión. La permanencia exacta puede variar según la configuración del dispositivo y del navegador.',
      'Los datos agregados de analítica y rendimiento pueden conservarse por los proveedores tecnológicos según sus propias reglas de retención.',
    ],
  },
  {
    title: '8. Derechos y control',
    paragraphs: [
      'Puedes controlar parte del tratamiento borrando el almacenamiento local del navegador, cerrando la sesión del navegador o utilizando herramientas de privacidad del propio navegador.',
      'Si deseas limitar analítica o rastreo técnico, puedes apoyarte en configuraciones del navegador, extensiones de bloqueo o controles ofrecidos por los proveedores correspondientes.',
    ],
  },
  {
    title: '9. Cambios a esta política',
    paragraphs: [
      'Esta política puede actualizarse para reflejar cambios funcionales, legales o técnicos del sitio. La versión publicada en esta página será la vigente en cada momento.',
    ],
  },
] as const;

export default function Privacy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="privacy-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');

        .privacy-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(255,255,255,0.16), transparent 26%),
            linear-gradient(170deg, #9DD0F3 0%, #7CB9E2 30%, #6AADDA 60%, #5A9FCC 100%);
          color: #fff;
          font-family: 'Space Mono', monospace;
          padding: 40px 24px 80px;
        }
        .privacy-shell {
          max-width: 840px;
          margin: 0 auto;
        }
        .privacy-hero {
          margin-bottom: 28px;
          padding: 30px 32px;
          border-radius: 24px;
          background: rgba(28, 35, 51, 0.2);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.14);
          box-shadow: 0 18px 48px rgba(20, 39, 60, 0.12);
        }
        .privacy-kicker {
          display: inline-block;
          margin-bottom: 12px;
          font-size: 11px;
          letter-spacing: 1.4px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.72);
        }
        .privacy-title {
          margin: 0 0 14px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(48px, 8vw, 76px);
          line-height: 0.95;
          letter-spacing: 2px;
        }
        .privacy-intro,
        .privacy-updated {
          font-size: 13px;
          line-height: 1.8;
          color: rgba(255,255,255,0.84);
        }
        .privacy-updated {
          margin-top: 10px;
          color: rgba(255,255,255,0.64);
        }
        .privacy-sections {
          display: grid;
          gap: 14px;
        }
        .privacy-card {
          padding: 22px 24px;
          border-radius: 20px;
          background: rgba(28, 35, 51, 0.16);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.12);
        }
        .privacy-card h2 {
          margin: 0 0 12px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px;
          font-weight: 400;
          letter-spacing: 1.3px;
          line-height: 1.1;
        }
        .privacy-card p {
          margin: 0 0 12px;
          font-size: 13px;
          line-height: 1.85;
          color: rgba(255,255,255,0.86);
        }
        .privacy-card p:last-child {
          margin-bottom: 0;
        }
        @media (max-width: 640px) {
          .privacy-page {
            padding: 24px 16px 60px;
          }
          .privacy-hero,
          .privacy-card {
            padding: 22px 20px;
          }
          .privacy-card h2 {
            font-size: 24px;
          }
        }
      `}</style>

      <div className="privacy-shell">
        <section className="privacy-hero">
          <span className="privacy-kicker">Información legal del sitio</span>
          <h1 className="privacy-title">Política de privacidad</h1>
          <p className="privacy-intro">
            Esta página resume cómo Aire Libre usa información técnica de navegación y almacenamiento
            local necesario para operar funciones como el test, la visualización de resultados y la
            medición general del rendimiento del sitio.
          </p>
          <p className="privacy-updated">Última actualización: 26 de mayo de 2026.</p>
        </section>

        <div className="privacy-sections">
          {sections.map(section => (
            <section className="privacy-card" key={section.title}>
              <h2>{section.title}</h2>
              {section.paragraphs.map(paragraph => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}