import { useEffect, useState } from 'react';

type Section = {
  title: string;
  content: React.ReactNode;
};

export default function Methodology() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const [openSection, setOpenSection] = useState<number | null>(null);
  const toggle = (i: number) => setOpenSection(openSection === i ? null : i);

  const indicators: Section[] = [
    {
      title: 'Días al año con aire limpio (PM2.5)',
      content: <>
        <p>Este indicador muestra el porcentaje de días al año en que los niveles de PM2.5 se mantienen por debajo del límite recomendado por la OMS. Es decir, <strong>cuántos días el aire cumple con lo que se considera seguro para proteger la salud.</strong></p>
        <h4>¿Qué es el PM2.5?</h4>
        <p>El PM2.5 son partículas muy pequeñas que flotan en el aire (más delgadas que un cabello humano). Pueden estar compuestas por hollín, metales pesados, polvo y residuos de combustión. Sus principales fuentes son las emisiones vehiculares, especialmente de motores a diésel, así como la actividad industrial, la quema de madera y combustibles fósiles, las obras de construcción y el polvo suspendido.</p>
        <p>Debido a su tamaño microscópico, el PM2.5 puede penetrar profundamente en los pulmones e incluso entrar al torrente sanguíneo. La exposición prolongada se asocia con enfermedades cardiovasculares, respiratorias crónicas y cáncer de pulmón.</p>
      </>
    },
    {
      title: 'Calidad del aire en días malos (PM2.5)',
      content: <>
        <p>Este indicador muestra qué tan cerca está el aire que respiramos de los niveles considerados seguros por la OMS.</p>
        <p><strong>100%</strong> = aire saludable. Las concentraciones de PM2.5 están dentro del nivel recomendado.</p>
        <p><strong>0%</strong> = aire muy peligroso. Las concentraciones están muy por encima de lo seguro.</p>
        <p>Los valores intermedios indican qué tanto nos alejamos o acercamos al nivel saludable.</p>
      </>
    },
    {
      title: 'Días al año con aire limpio (Ozono)',
      content: <>
        <p>Este indicador muestra el porcentaje de días al año en que los niveles de ozono (O₃) se mantienen por debajo del límite recomendado por la OMS.</p>
        <h4>¿Qué es el ozono?</h4>
        <p>El ozono a nivel del suelo es un contaminante secundario: no se emite directamente. Se forma cuando óxidos de nitrógeno (NOₓ) y compuestos orgánicos volátiles (COV), liberados principalmente por vehículos e industrias, reaccionan químicamente en presencia de radiación solar. Por eso sus concentraciones suelen aumentar durante las tardes y en días calurosos y soleados.</p>
        <p>El ozono es un oxidante fuerte que puede irritar las vías respiratorias, causar inflamación pulmonar y reducir la función respiratoria.</p>
      </>
    },
    {
      title: 'Calidad del aire en días malos (Ozono)',
      content: <>
        <p><strong>100%</strong> = aire saludable. Las concentraciones de ozono están dentro del nivel recomendado.</p>
        <p><strong>0%</strong> = aire muy peligroso. Las concentraciones están muy por encima de lo seguro.</p>
        <p>Aunque el cielo se vea despejado, el aire puede estar químicamente activo. Y cuando las condiciones favorecen esa reacción, lo más sensible lo resiente primero.</p>
      </>
    },
    {
      title: 'Calificación general del aire',
      content: <p>Es una calificación total del aire: junta todos los indicadores anteriores y los convierte en una sola nota. <strong>100% = aire muy limpio</strong> (bajos niveles de contaminación y muchos días con aire seguro). <strong>0% = aire muy contaminado</strong> (altos niveles de contaminación y pocos días limpios).</p>
    },
    {
      title: 'Población sensible por edad',
      content: <>
        <p>Las infancias menores de 12 años y las personas mayores de 64 son especialmente vulnerables por razones biológicas.</p>
        <p>En las infancias, los pulmones y el sistema inmunológico aún están en desarrollo. Respiran más rápido y, en proporción a su tamaño, inhalan más contaminantes.</p>
        <p>En las personas mayores, el organismo suele presentar mayor desgaste cardiovascular y respiratorio, así como una mayor presencia de enfermedades crónicas.</p>
      </>
    },
    {
      title: 'Diabetes y calidad del aire',
      content: <p>Las personas que viven con diabetes tienen mayor riesgo de sufrir complicaciones cardiovasculares cuando están expuestas al aire contaminado. Su organismo ya enfrenta un estado de inflamación crónica, mayor estrés oxidativo y una vulnerabilidad previa del sistema cardiovascular. La exposición a contaminantes atmosféricos puede empeorar el control metabólico y aumentar la resistencia a la insulina.</p>
    },
    {
      title: 'Hipertensión y calidad del aire',
      content: <p>Vivir durante años en zonas con aire contaminado aumenta el riesgo de desarrollar hipertensión arterial. Las partículas finas que respiramos (especialmente PM2.5 y PM10) pueden generar inflamación en el organismo, dañar los vasos sanguíneos y alterar el sistema nervioso autónomo, que regula la presión arterial.</p>
    },
    {
      title: 'Enfermedades respiratorias crónicas',
      content: <p>En personas que ya viven con asma, EPOC o bronquitis crónica, la contaminación puede intensificar los síntomas. Las partículas finas, el ozono y otros contaminantes irritan las vías respiratorias, aumentan la inflamación y pueden provocar crisis más frecuentes y más graves. Además, la exposición prolongada al aire contaminado daña el tejido pulmonar con el tiempo.</p>
    },
    {
      title: 'Población que no fuma',
      content: <p>El tabaco debilita los pulmones y el corazón, y hace que el cuerpo sea más vulnerable frente a la contaminación del aire. Hay estudios que demuestran que fumar triplica el riesgo de muerte cuando se añade a mala calidad de aire. Cuando más personas no fuman, hay mejores condiciones para cuidar la salud colectiva.</p>
    },
    {
      title: 'Acceso efectivo al sistema de salud',
      content: <>
        <p>Combina dos elementos: <strong>derechohabiencia</strong> (si las personas están afiliadas a un sistema público de salud) y <strong>disponibilidad y cercanía de servicios</strong> (qué tan cerca hay clínicas u hospitales, y si cuentan con médicos, enfermeras, camas y consultorios suficientes).</p>
        <p>Cuando la contaminación desencadena una crisis, el tiempo y la capacidad de respuesta pueden marcar la diferencia entre una atención oportuna y una complicación grave.</p>
      </>
    },
    {
      title: 'Desarrollo socioeconómico',
      content: <p>Considera factores como nivel de escolaridad, presencia de computadora, lavadora y refrigerador en el hogar. Influye en la capacidad de acceder a información sobre alertas ambientales, tomar decisiones informadas, contar con mejores condiciones de vivienda y acceder a servicios médicos rápidamente.</p>
    },
    {
      title: 'Frescura',
      content: <p>Evalúa la capacidad de una colonia para disipar el calor. No depende solo de los árboles, sino también del diseño urbano: la presencia de sombra, vegetación, materiales y colores que reflejen la luz. Cuando el calor queda atrapado en el asfalto y el concreto, se forman islas de calor que favorecen la formación de contaminantes como el ozono.</p>
    },
    {
      title: 'Seguridad ante inundaciones',
      content: <p>El diseño urbano de una colonia influye directamente en su exposición a lluvias extremas. Cuando predominan materiales como el asfalto y el concreto, el agua no puede filtrarse ni fluir con facilidad. La falta de superficies permeables convierte la lluvia en una amenaza: puede provocar inundaciones, favorecer enfermedades y generar accidentes.</p>
    },
    {
      title: 'Resiliencia climática',
      content: <p>Integra frescura y seguridad ante inundaciones. El cambio climático y la contaminación del aire se potencian entre sí: el calor extremo no solo estresa al cuerpo, también acelera la formación de ozono. Además, las inundaciones bloquean la movilidad y dificultan el acceso a servicios de salud.</p>
    },
  ];

  return (
    <div className="meth">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap');
        .meth {
          min-height: 100vh;
          background: linear-gradient(170deg, #9DD0F3 0%, #7CB9E2 30%, #6AADDA 60%, #5A9FCC 100%);
          font-family: 'Space Mono', monospace;
          color: #fff;
          padding: 40px 24px 80px;
          display: flex; flex-direction: column; align-items: center;
        }
        .meth-container { max-width: 720px; width: 100%; }
        .meth-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(32px, 8vw, 52px);
          font-weight: 400; letter-spacing: 2px; line-height: 1.1;
          margin-bottom: 16px; text-align: center;
        }
        .meth-intro {
          font-size: 14px; line-height: 1.8; opacity: 0.9;
          text-align: center; margin-bottom: 40px; max-width: 600px;
          margin-left: auto; margin-right: auto;
        }
        .meth-section { margin-bottom: 32px; }
        .meth-section-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 26px; font-weight: 400; letter-spacing: 2px;
          margin-bottom: 16px; padding-bottom: 8px;
          border-bottom: 2px solid rgba(255,255,255,0.2);
        }
        .meth-text { font-size: 13px; line-height: 1.8; opacity: 0.88; margin-bottom: 16px; }
        .meth-text strong { color: #fff; }
        .meth-text h4 { font-size: 14px; font-weight: 700; margin: 16px 0 8px; opacity: 1; }
        .meth-text p { margin-bottom: 12px; }
        .meth-formula {
          background: rgba(28,35,51,0.4); border-radius: 12px;
          padding: 16px 20px; margin: 16px 0;
          font-family: 'Space Mono', monospace; font-size: 13px;
          text-align: center; letter-spacing: 0.5px;
          border: 1px solid rgba(255,255,255,0.15);
        }
        .meth-table {
          width: 100%; border-collapse: collapse; margin: 16px 0;
          font-size: 12px;
        }
        .meth-table th, .meth-table td {
          padding: 10px 12px; text-align: left;
          border-bottom: 1px solid rgba(255,255,255,0.15);
        }
        .meth-table th {
          font-weight: 700; font-size: 11px;
          letter-spacing: 0.5px; text-transform: uppercase;
          opacity: 0.7;
        }
        .meth-accordion { margin-bottom: 8px; }
        .meth-acc-btn {
          width: 100%; padding: 14px 18px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px; color: #fff;
          font-family: 'Space Mono', monospace;
          font-size: 13px; font-weight: 700;
          cursor: pointer; text-align: left;
          display: flex; justify-content: space-between; align-items: center;
          transition: background 0.2s;
        }
        .meth-acc-btn:hover { background: rgba(255,255,255,0.14); }
        .meth-acc-body {
          padding: 16px 18px 8px;
          border: 1px solid rgba(255,255,255,0.08);
          border-top: none; border-radius: 0 0 10px 10px;
          background: rgba(255,255,255,0.04);
        }
        .meth-downloads { margin-top: 40px; }
        .meth-dl-card {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 16px; padding: 24px;
          margin-bottom: 12px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px; flex-wrap: wrap;
        }
        .meth-dl-info { flex: 1; min-width: 200px; }
        .meth-dl-title { font-weight: 700; font-size: 14px; margin-bottom: 4px; }
        .meth-dl-desc { font-size: 11px; opacity: 0.7; }
        .meth-dl-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 20px; font-family: 'Space Mono', monospace;
          font-size: 12px; font-weight: 700; color: #1C2333;
          background: #fff; border: none; border-radius: 8px;
          cursor: pointer; text-decoration: none;
          transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .meth-dl-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
        .meth-note { margin-top: 24px; font-size: 11px; opacity: 0.5; text-align: center; }
        @media (max-width: 600px) {
          .meth { padding: 24px 16px 60px; }
          .meth-dl-card { flex-direction: column; align-items: stretch; }
          .meth-dl-btn { text-align: center; justify-content: center; }
        }
      `}</style>

      <div className="meth-container">
        <h1 className="meth-title">Metodología</h1>

        <p className="meth-intro">
          Este mapa te muestra la ciudad desde el vuelo de un pájaro. Desde arriba,
          el cielo parece el mismo para todos, pero no todos los barrios ofrecen el mismo resguardo.
          Aquí se cruzan la calidad del aire, la salud y el acceso a servicios diversos para mostrar
          dónde el riesgo se acumula y dónde hay más protección.
        </p>

        {/* Índice de Equidad */}
        <div className="meth-section">
          <h2 className="meth-section-title">Índice de Equidad</h2>
          <div className="meth-text">
            <p>El Índice de Equidad evalúa qué tan cerca está tu colonia de ofrecer un entorno justo y saludable. Integra <strong>cuatro dimensiones que influyen sobre la vida cotidiana y el ejercicio de derechos: calidad del aire, salud, condiciones socioeconómicas y resiliencia frente al cambio climático.</strong></p>
            <p>También analiza si el barrio tiene servicios de salud cercanos, infraestructura adecuada y capacidad para enfrentar olas de calor o inundaciones. Entre más alto el porcentaje, mejores son las condiciones para el bienestar. Un puntaje bajo no descalifica a las personas, sino las brechas estructurales que aumentan riesgos y desigualdades.</p>
            <p>Integra un conjunto de 20 indicadores en un promedio multiplicativo (Índice de Desarrollo). El índice responde a una doble conceptualización: en positivo, como el nivel de ejercicio de derechos, y si se calcula su inverso (1 − I), el nivel de riesgo.</p>
          </div>
          <div className="meth-formula">
            I = I₁ʲ^α₁ × ... × Iₖʲ^αₖ = Π Iₖʲ^αₖ
          </div>
          <div className="meth-text">
            <p>A diferencia del promedio aritmético, este método multiplicativo refleja los principios de indivisibilidad e interdependencia de los Derechos Humanos: los valores bajos no se compensan con valores altos, sino que evidencian las brechas.</p>
          </div>
        </div>

        {/* Categorización */}
        <div className="meth-section">
          <h2 className="meth-section-title">Categorización</h2>
          <div className="meth-text">
            <p>Los resultados se clasifican en categorías relativas por terciles, permitiendo entender la posición de cada colonia en la ciudad:</p>
          </div>
          <table className="meth-table">
            <thead>
              <tr><th>Categoría</th><th>Color</th><th>Significado</th></tr>
            </thead>
            <tbody>
              <tr><td>Mejor equidad</td><td>🟢 Verde</td><td>Tercio superior del Índice de Desarrollo</td></tr>
              <tr><td>Promedio</td><td>🟡 Amarillo</td><td>Tercio intermedio</td></tr>
              <tr><td>Bajo</td><td>🔴 Rojo</td><td>Tercio con mayor desventaja</td></tr>
              <tr><td>Sin datos</td><td>— No visible</td><td>Colonias con menos de 15 habitantes; indicadores reservados por confidencialidad</td></tr>
            </tbody>
          </table>
        </div>

        {/* Indicadores */}
        <div className="meth-section">
          <h2 className="meth-section-title">Indicadores</h2>
          <div className="meth-text">
            <p>A continuación se describe cada indicador utilizado en la plataforma:</p>
          </div>
          {indicators.map((ind, i) => (
            <div className="meth-accordion" key={i}>
              <button className="meth-acc-btn" onClick={() => toggle(i)}>
                {ind.title}
                <span>{openSection === i ? '−' : '+'}</span>
              </button>
              {openSection === i && (
                <div className="meth-acc-body meth-text">
                  {ind.content}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Descargas */}
        <div className="meth-section meth-downloads">
          <h2 className="meth-section-title">Datos abiertos</h2>
          <div className="meth-text">
            <p>Descarga los datos del proyecto para análisis, investigación o desarrollo de herramientas propias.</p>
          </div>

          <div className="meth-dl-card">
            <div className="meth-dl-info">
              <div className="meth-dl-title">Datos tabulares (CSV)</div>
              <div className="meth-dl-desc">Índices y indicadores para los 2,251 CPs. Abre en Excel, Google Sheets o cualquier herramienta de datos.</div>
            </div>
            <a href="/datos_aire_libre.csv" download="datos_aire_libre.csv" className="meth-dl-btn">↓ CSV</a>
          </div>

          <div className="meth-dl-card">
            <div className="meth-dl-info">
              <div className="meth-dl-title">Datos geoespaciales (GeoPackage)</div>
              <div className="meth-dl-desc">Polígonos de CPs + límites municipales/estatales + todos los indicadores. Abre en QGIS, Python o R.</div>
            </div>
            <a href="/Base_plataforma.gpkg" download="Base_plataforma.gpkg" className="meth-dl-btn">↓ GPKG</a>
          </div>
        </div>

        <p className="meth-note">
          Fuente: Instituto del Sur Urbano · Proyecto Aire Libre · Breathe Cities
        </p>
      </div>
    </div>
  );
}
