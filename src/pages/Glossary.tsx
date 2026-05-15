import { useEffect } from 'react';

type GlossaryItem = {
  slug: string;
  term: string;
  definition: string;
  category: 'aire' | 'salud' | 'ciudad' | 'datos';
};

const GLOSSARY: GlossaryItem[] = [
  {
    slug: 'pm25',
    term: 'PM2.5',
    category: 'aire',
    definition: 'Partículas microscópicas suspendidas en el aire con un diámetro menor a 2.5 micras. Son tan pequeñas que pueden entrar profundo en los pulmones e incluso pasar al torrente sanguíneo.',
  },
  {
    slug: 'ozono-troposferico',
    term: 'Ozono troposférico',
    category: 'aire',
    definition: 'Gas contaminante que no sale directamente de un escape, sino que se forma cuando la luz solar reacciona con otros contaminantes emitidos por autos e industrias. Suele empeorar en tardes soleadas y calurosas.',
  },
  {
    slug: 'exposicion-cronica',
    term: 'Exposición crónica',
    category: 'salud',
    definition: 'Contacto repetido o prolongado con un contaminante durante meses o años. Aunque no provoque síntomas inmediatos, puede aumentar el riesgo de enfermedad con el tiempo.',
  },
  {
    slug: 'exposicion-aguda',
    term: 'Exposición aguda',
    category: 'salud',
    definition: 'Contacto intenso con un contaminante en un periodo corto. Puede detonar síntomas rápidos, como irritación, dificultad para respirar o empeoramiento de un padecimiento existente.',
  },
  {
    slug: 'torrente-sanguineo',
    term: 'Torrente sanguíneo',
    category: 'salud',
    definition: 'Circulación de la sangre dentro del cuerpo. Algunas partículas muy finas pueden pasar de los pulmones a la sangre y desde ahí afectar corazón, cerebro y otros órganos.',
  },
  {
    slug: 'inflamacion-sistemica',
    term: 'Inflamación sistémica',
    category: 'salud',
    definition: 'Respuesta de defensa del cuerpo que no se queda en una sola zona, sino que se extiende a varios órganos y sistemas. La contaminación del aire puede dispararla y aumentar riesgos cardiovasculares.',
  },
  {
    slug: 'estres-oxidativo',
    term: 'Estrés oxidativo',
    category: 'salud',
    definition: 'Desequilibrio entre moléculas inestables y las defensas del cuerpo para neutralizarlas. Cuando aumenta, daña células y tejidos, y se relaciona con envejecimiento y enfermedad.',
  },
  {
    slug: 'morbilidad',
    term: 'Morbilidad',
    category: 'datos',
    definition: 'Cantidad de personas que viven con una enfermedad o que enferman en una población determinada. No significa muertes; habla de carga de enfermedad.',
  },
  {
    slug: 'vulnerabilidad',
    term: 'Vulnerabilidad',
    category: 'salud',
    definition: 'Mayor probabilidad de sufrir daño frente a un riesgo. Puede deberse a edad, embarazo, enfermedades previas, pobreza, barreras de acceso a salud o condiciones del entorno.',
  },
  {
    slug: 'resiliencia-climatica',
    term: 'Resiliencia climática',
    category: 'ciudad',
    definition: 'Capacidad de un barrio o una ciudad para resistir y adaptarse a calor extremo, lluvias intensas e inundaciones sin que eso se convierta en daño severo para la población.',
  },
  {
    slug: 'isla-de-calor',
    term: 'Isla de calor',
    category: 'ciudad',
    definition: 'Zona urbana que se calienta más que sus alrededores por exceso de concreto, asfalto y poca vegetación. Ese calor extra también favorece la formación de ozono.',
  },
  {
    slug: 'superficie-permeable',
    term: 'Superficie permeable',
    category: 'ciudad',
    definition: 'Suelo o material que permite que el agua se infiltre. Ayuda a reducir inundaciones y mejora el comportamiento térmico del barrio frente al calor.',
  },
  {
    slug: 'promedio-multiplicativo',
    term: 'Promedio multiplicativo',
    category: 'datos',
    definition: 'Forma de combinar indicadores donde un valor muy bajo no queda escondido por otros altos. Sirve para reflejar mejor desigualdades acumuladas.',
  },
  {
    slug: 'indicador',
    term: 'Indicador',
    category: 'datos',
    definition: 'Medida concreta que resume una condición del entorno o de la población, por ejemplo calidad del aire, acceso a salud o nivel de calor urbano.',
  },
  {
    slug: 'derechohabiencia',
    term: 'Derechohabiencia',
    category: 'salud',
    definition: 'Condición de estar afiliada o tener acceso reconocido a un sistema de salud, como IMSS, ISSSTE o servicios públicos estatales.',
  },
  {
    slug: 'epoc',
    term: 'EPOC',
    category: 'salud',
    definition: 'Enfermedad Pulmonar Obstructiva Crónica. Es un daño respiratorio persistente que dificulta la salida del aire de los pulmones y vuelve a la persona más sensible a la contaminación.',
  },
  {
    slug: 'compuestos-organicos-volatiles',
    term: 'Compuestos orgánicos volátiles (COV)',
    category: 'aire',
    definition: 'Sustancias químicas que se evaporan fácilmente y participan en la formación de ozono. Pueden venir de combustibles, solventes, pinturas e industrias.',
  },
  {
    slug: 'oxidos-de-nitrogeno',
    term: 'Óxidos de nitrógeno (NOx)',
    category: 'aire',
    definition: 'Gases generados sobre todo por motores y procesos de combustión. Reaccionan con la luz solar y con otros compuestos para formar ozono.',
  },
  {
    slug: 'contaminante-secundario',
    term: 'Contaminante secundario',
    category: 'aire',
    definition: 'Contaminante que se forma en la atmósfera a partir de otros compuestos y no se emite directamente desde una fuente. El ozono es el ejemplo más conocido.',
  },
  {
    slug: 'determinante-social',
    term: 'Determinante social',
    category: 'ciudad',
    definition: 'Condición social o económica que influye en la salud, como ingreso, vivienda, educación, acceso a información o cercanía a servicios públicos.',
  },
  {
    slug: 'carga-ambiental',
    term: 'Carga ambiental',
    category: 'ciudad',
    definition: 'Acumulación de riesgos en un mismo territorio, por ejemplo contaminación, calor extremo, inundaciones y falta de servicios. No suele venir sola, sino combinada.',
  },
  {
    slug: 'terciles',
    term: 'Terciles',
    category: 'datos',
    definition: 'Forma de dividir una lista ordenada en tres grupos del mismo tamaño. Se usa para clasificar colonias en niveles relativos, como mejor, medio o más rezagado.',
  },
  {
    slug: 'oms',
    term: 'OMS',
    category: 'datos',
    definition: 'Organización Mundial de la Salud. Publica guías y límites recomendados para proteger la salud, entre ellos los relacionados con contaminación del aire.',
  },
  {
    slug: 'nom-172-semarnat-2023',
    term: 'NOM-172-SEMARNAT-2023',
    category: 'datos',
    definition: 'Norma Oficial Mexicana que define la forma de comunicar riesgos por calidad del aire en México. Establece criterios para reportes y alertas a la población.',
  },
];

const CATEGORY_LABELS: Record<GlossaryItem['category'], string> = {
  aire: 'Aire y contaminantes',
  salud: 'Salud y cuerpo',
  ciudad: 'Ciudad y territorio',
  datos: 'Datos y metodología',
};

const CATEGORY_ORDER: GlossaryItem['category'][] = ['aire', 'salud', 'ciudad', 'datos'];

export default function Glossary() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const visibleTerms: GlossaryItem[] = GLOSSARY;

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (!hash) return;

    const target = document.getElementById(hash);
    if (!target) return;

    requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, []);

  return (
    <div className="glossary-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');

        .glossary-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(255,255,255,0.18), transparent 28%),
            radial-gradient(circle at 85% 20%, rgba(255,255,255,0.12), transparent 24%),
            linear-gradient(165deg, #9DD0F3 0%, #76B9E4 38%, #5C9FCC 72%, #3E76A2 100%);
          color: #fff;
          font-family: 'Space Mono', monospace;
          padding: 40px 24px 72px;
        }
        .glossary-shell {
          max-width: 1080px;
          margin: 0 auto;
        }
        .glossary-hero {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(280px, 0.9fr);
          gap: 24px;
          align-items: stretch;
          margin-bottom: 28px;
        }
        .glossary-panel,
        .glossary-note,
        .glossary-item {
          background: rgba(28, 35, 51, 0.22);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.14);
          box-shadow: 0 18px 48px rgba(20, 39, 60, 0.12);
        }
        .glossary-panel {
          border-radius: 26px;
          padding: 32px;
        }
        .glossary-kicker {
          display: inline-block;
          font-size: 11px;
          letter-spacing: 1.4px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.72);
          margin-bottom: 14px;
        }
        .glossary-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(52px, 10vw, 88px);
          line-height: 0.95;
          letter-spacing: 2px;
          margin: 0 0 14px;
        }
        .glossary-intro {
          max-width: 58ch;
          font-size: 14px;
          line-height: 1.8;
          color: rgba(255,255,255,0.86);
        }
        .glossary-note {
          border-radius: 22px;
          padding: 28px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 18px;
        }
        .glossary-note-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px;
          letter-spacing: 1.4px;
        }
        .glossary-note p {
          font-size: 13px;
          line-height: 1.8;
          color: rgba(255,255,255,0.84);
        }
        .glossary-count {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 82px;
          padding: 10px 14px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          color: #1C2333;
          background: #F7F3E8;
        }
        .glossary-filterbar {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 22px;
        }
        .glossary-sections {
          display: grid;
          gap: 22px;
        }
        .glossary-section {
          scroll-margin-top: calc(var(--header-height, 80px) + 24px);
        }
        .glossary-section-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 14px;
        }
        .glossary-section-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(28px, 4vw, 38px);
          letter-spacing: 1.5px;
          line-height: 1;
        }
        .glossary-section-link {
          color: rgba(255,255,255,0.66);
          font-size: 12px;
          text-decoration: none;
        }
        .glossary-section-link:hover {
          color: #fff;
        }
        .glossary-filter {
          text-decoration: none;
          border: 1px solid rgba(255,255,255,0.16);
          background: rgba(255,255,255,0.08);
          color: #fff;
          border-radius: 999px;
          padding: 10px 16px;
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s ease, background 0.2s ease;
        }
        .glossary-filter:hover {
          transform: translateY(-1px);
          background: rgba(255,255,255,0.14);
        }
        .glossary-list {
          display: grid;
          gap: 14px;
        }
        .glossary-item {
          border-radius: 20px;
          padding: 22px;
          scroll-margin-top: calc(var(--header-height, 80px) + 24px);
        }
        .glossary-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          align-items: center;
          margin-bottom: 8px;
        }
        .glossary-chip {
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          padding: 5px 10px;
          font-size: 10px;
          letter-spacing: 1px;
          text-transform: uppercase;
          background: rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.78);
        }
        .glossary-term {
          font-size: clamp(18px, 3vw, 22px);
          font-weight: 700;
          line-height: 1.35;
        }
        .glossary-term-link {
          color: inherit;
          text-decoration: none;
        }
        .glossary-term-link:hover {
          text-decoration: underline;
          text-decoration-thickness: 1.5px;
          text-underline-offset: 3px;
        }
        .glossary-definition-inner {
          font-size: 13px;
          line-height: 1.85;
          color: rgba(255,255,255,0.86);
        }
        .glossary-empty {
          border-radius: 20px;
          padding: 26px;
          background: rgba(28, 35, 51, 0.16);
          border: 1px dashed rgba(255,255,255,0.18);
          color: rgba(255,255,255,0.8);
          font-size: 13px;
        }
        @media (max-width: 860px) {
          .glossary-hero {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 640px) {
          .glossary-page {
            padding: 24px 16px 56px;
          }
          .glossary-panel,
          .glossary-note {
            padding: 24px 20px;
          }
          .glossary-definition-inner {
            font-size: 12px;
          }
        }
      `}</style>

      <div className="glossary-shell">
        <section className="glossary-hero">
          <div className="glossary-panel">
            <span className="glossary-kicker">Diccionario rápido de la plataforma</span>
            <h1 className="glossary-title">Glosario</h1>
            <p className="glossary-intro">
              Aquí reunimos palabras técnicas, científicas y urbanas que aparecen en el mapa,
              el test y la metodología. La idea es simple: que ningún concepto importante se
              quede fuera por sonar demasiado especializado.
            </p>
          </div>

          <aside className="glossary-note">
            <div>
              <h2 className="glossary-note-title">Cómo leerlo</h2>
              <p>
                Cada término tiene un ancla propia. Eso permite enlazar directo a una definición,
                por ejemplo: /glosario#morbilidad. Si un concepto te bloquea, aquí lo bajamos a
                lenguaje claro.
              </p>
            </div>
            <span className="glossary-count">{visibleTerms.length} términos</span>
          </aside>
        </section>

        <div className="glossary-filterbar">
          {CATEGORY_ORDER.map(category => (
            <a key={category} className="glossary-filter" href={`#categoria-${category}`}>
              {CATEGORY_LABELS[category]}
            </a>
          ))}
        </div>

        <div className="glossary-sections">
          {CATEGORY_ORDER.map(category => {
            const categoryTerms = visibleTerms.filter(item => item.category === category);

            if (categoryTerms.length === 0) {
              return null;
            }

            return (
              <section className="glossary-section" id={`categoria-${category}`} key={category}>
                <div className="glossary-section-head">
                  <h2 className="glossary-section-title">{CATEGORY_LABELS[category]}</h2>
                  <a className="glossary-section-link" href={`#categoria-${category}`}>
                    #categoria-{category}
                  </a>
                </div>

                <div className="glossary-list">
                  {categoryTerms.length === 0 ? (
                    <div className="glossary-empty">No hay términos en esta categoría.</div>
                  ) : (
                    categoryTerms.map(item => (
                      <article className="glossary-item" id={item.slug} key={item.slug}>
                        <div className="glossary-meta">
                          <span className="glossary-chip">{CATEGORY_LABELS[item.category]}</span>
                        </div>
                        <h3 className="glossary-term">
                          <a className="glossary-term-link" href={`#${item.slug}`}>
                            {item.term}
                          </a>
                        </h3>
                        <div className="glossary-definition-inner">{item.definition}</div>
                      </article>
                    ))
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}