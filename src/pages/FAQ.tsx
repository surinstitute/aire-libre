import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FAQ_DATA = [
  {
    q: '¿Por qué la edad es un factor determinante en mi riesgo ante la calidad del aire?',
    a: `Cuando hablamos de contaminación del aire, no todos los cuerpos están en las mismas condiciones para enfrentarla. La edad es uno de los factores biológicos que más influyen en qué tanto daño puede causar el aire que respiramos.

**Infancias de 0 a 12 años**
Los pulmones de las niñas y los niños no terminan de desarrollarse hasta cerca de los 8 años. Además, respiran más rápido que los adultos, lo que significa que inhalan proporcionalmente más contaminantes. Su sistema inmunológico y nervioso tampoco están maduros, por lo que la exposición temprana a PM2.5 y ozono puede afectar el crecimiento pulmonar y el desarrollo cognitivo. Los efectos pueden manifestarse años después: asma, menor capacidad pulmonar o mayor susceptibilidad a enfermedades respiratorias.

**Personas mayores de 65 años**
Con los años, los pulmones pierden elasticidad, el corazón trabaja con mayor esfuerzo y las defensas contra el daño oxidativo se reducen. Esto se suma a enfermedades crónicas comunes como diabetes, hipertensión o enfermedades cardiovasculares. Cuando una persona mayor respira PM2.5, estas partículas pueden llegar al torrente sanguíneo, provocar inflamación sistémica, alterar la presión arterial y desencadenar eventos graves como infartos o accidentes cerebrovasculares.`,
  },
  {
    q: '¿Qué implicaciones diferenciadas tiene fumar?',
    a: `Fumar y respirar aire contaminado no son dos riesgos que simplemente se suman: se multiplican. El humo del tabaco daña el epitelio respiratorio — miles de pequeñas escobitas (cilios) que recubren las vías respiratorias y cuyo trabajo es atrapar y expulsar partículas contaminantes. El tabaco paraliza y destruye esos cilios.

Cuando esa defensa está comprometida, las partículas finas y el ozono penetran con mayor facilidad y profundidad. La evidencia científica señala que fumar triplica el riesgo de muerte durante episodios de contaminación aguda. Además, el consumo de tabaco daña no solo a quien fuma, sino a las personas en el mismo ambiente, convirtiéndolas en fumadoras involuntarias.`,
  },
  {
    q: '¿Qué implicaciones diferenciadas tiene una persona embarazada?',
    a: `El embarazo es uno de los estados de mayor vulnerabilidad frente a la contaminación del aire. Las partículas finas (PM2.5) pueden pasar de los pulmones de la madre al torrente sanguíneo, y desde ahí cruzar la placenta.

La exposición durante el embarazo se asocia con mayor riesgo de parto prematuro, bajo peso al nacer y malformaciones en el desarrollo. Un bebé que nace con bajo peso tiene mayor probabilidad de desarrollar asma, enfermedades crónicas y complicaciones cardiovasculares en la vida adulta.

La contaminación puede generar inflamación sistémica, interfiriendo con el funcionamiento de la placenta y comprometiendo el suministro de oxígeno y nutrientes al feto.`,
  },
  {
    q: '¿Por qué el desarrollo socioeconómico impacta en mi salud y en mi relación con la calidad del aire?',
    a: `La contaminación no afecta a todos por igual, y eso no es casualidad — es el resultado de factores sistémicos que determinan tanto el nivel de exposición como nuestra capacidad de respuesta.

Tener refrigerador ahorra tiempo y protege alimentos durante olas de calor. Tener computadora permite consultar reportes de calidad del aire en tiempo real. Tener lavadora reduce la exposición a alérgenos. Tener ventilación adecuada marca la diferencia entre acumular contaminantes de interiores o no.

Las colonias con mayor desarrollo socioeconómico suelen tener mayor acceso a servicios médicos cercanos. Una crisis asmática o un evento cardiovascular en una colonia con menor desarrollo puede tardar más en atenderse, resultando en consecuencias más graves. El riesgo ambiental se acumula donde ya hay desventaja.`,
  },
  {
    q: '¿Por qué utilizamos a los pájaros como los acompañantes en esta plataforma?',
    a: `Los pájaros tienen una historia larga como guardianes del aire. Durante décadas, los mineros llevaban canarios a las minas porque eran más sensibles a los gases tóxicos. Si el canario se debilitaba, era señal de que el aire no era respirable.

En la Ciudad de México, en la década de los ochenta, la contaminación era tan severa que muchas aves murieron. Ese mismo periodo privó a niñas y niños de poder jugar al aire libre. Fue una crisis que detonó políticas públicas importantes: Hoy No Circula, el sistema de contingencias ambientales y el fortalecimiento del monitoreo.

Hay además una razón más íntima: durante cientos de miles de años de evolución, el canto de los pájaros fue señal de seguridad. Si los pájaros cantaban, no había depredadores cerca. Escuchar aves es, para nuestro sistema nervioso, una señal ancestral de que todo está bien.

En este espacio los pájaros son un recordatorio de lo que queremos recuperar: entornos donde respirar sea seguro.`,
  },
  {
    q: '¿Cómo se relaciona con el Mapa de la SEDEMA?',
    a: `El Mapa Integral de Riesgo Ambiental y el mapa de calidad del aire de la SEDEMA son herramientas complementarias.

El mapa de la SEDEMA mide en tiempo real las concentraciones y nos dice qué tan contaminado está el aire hoy. Nuestro mapa identifica el comportamiento observado durante el año: quiénes están más expuestos, quiénes son más vulnerables y en qué colonias el riesgo se acumula de manera estructural.

Trabajamos complementando los estándares de la OMS (que guían nuestro mapa) y los de la NOM-172-SEMARNAT-2023 (que guían el mapa de SEDEMA). El mapa de la SEDEMA es más protector para la exposición aguda (hoy), pero la guía de la OMS es un mejor escudo contra la exposición crónica (largo plazo).`,
  },
  {
    q: '¿En qué se relaciona el índice de frescura y de seguridad ante inundaciones con el cambio climático?',
    a: `El cambio climático y la contaminación del aire se potencian entre sí.

El índice de frescura mide la capacidad para disipar el calor. Cuando una zona está cubierta de concreto sin vegetación suficiente, el calor queda atrapado formando una isla de calor. El aumento de temperatura acelera reacciones químicas que forman ozono, por lo que el aire se vuelve más tóxico justo cuando el cuerpo ya está estresado por el calor.

El índice de seguridad ante inundaciones señala dónde existe mayor protección o peligrosidad ante lluvias, condicionada por volumen, altura, forma y permeabilidad del territorio. El cambio climático está generando fenómenos más extremos, por lo que identificar esta desigualdad es clave para reducir el peligro.`,
  },
  {
    q: '¿Cómo se relaciona el aire limpio con mis derechos humanos?',
    a: `Respirar aire limpio es un derecho humano reconocido a nivel internacional, nacional y local.

En 2021, el Consejo de Derechos Humanos de la ONU reconoció formalmente el derecho a un medio ambiente limpio, saludable y sostenible (resolución 48/13). Los Estados tienen la obligación de garantizarlo.

En México, el artículo 4to constitucional establece el derecho a un medio ambiente sano. La NOM-172-SEMARNAT-2023 operacionaliza esta obligación. En la Ciudad de México, la constitución local reconoce el derecho al medio ambiente sano, a la salud, a la vida digna, a la movilidad segura, al agua y a la ciudad.

Cuando el aire supera los niveles recomendados el 99% de los días, como ocurre en la ZMVM, hay una violación estructural al derecho a la salud.`,
  },
  {
    q: '¿Por qué mi colonia tiene un índice alto si el aire se siente igual que en otros lugares?',
    a: `Uno de los peligros más grandes de la contaminación es que hay contaminantes dañinos que no se pueden ver ni oler.

El PM2.5 y el ozono no tienen color ni olor y no irritan la nariz de inmediato. El PM2.5 son partículas tan pequeñas que cabrían cientos en el grosor de un cabello humano. El ozono es un gas que se forma cuando la luz solar reacciona con emisiones vehiculares e industriales.

Nuestro cuerpo no los detecta de inmediato. No tosemos, no lloramos, no sentimos nada distinto. Pero años de respirar concentraciones que superan lo recomendado por la OMS aumentan el riesgo de enfermedades cardiovasculares, respiratorias crónicas y deterioro cognitivo.

Si tu colonia tiene una calificación baja, significa que la exposición acumulada supera los niveles seguros, aunque tu nariz no te haya avisado.`,
  },
  {
    q: '¿Por qué en algunas colonias el aire es peor que en otras, aunque estemos en la misma ciudad?',
    a: `La distribución de la contaminación es el resultado de décadas de decisiones de planeación urbana. Las colonias con peor calidad del aire suelen estar ubicadas cerca de vialidades de alto tránsito, de industrias de carga pesada, alejadas de parques y áreas verdes.

Estas colonias suelen tener menor acceso a servicios de salud, educación y transporte público. Hay colonias más expuestas que al mismo tiempo tienen menor capacidad de respuesta. Esto no es casualidad: es el resultado de dónde se instalan las industrias, por dónde se trazan las autopistas, en qué colonias se invierte en parques y en cuáles no.`,
  },
  {
    q: '¿Qué puedo hacer yo con esta información?',
    a: `Una vez que conozcas el estado del aire y tu condición personalizada, te invitamos a:

• **Comparte tu calificación** en redes sociales y etiqueta a @SEDEMA, a las autoridades de tu alcaldía y, si aplica, a @PROFEPA.
• **Comparte en tu grupo vecinal** de WhatsApp y abran espacios de diálogo para demandar mejores condiciones.
• **Usa mecanismos de participación ciudadana** como el Presupuesto Participativo para proponer proyectos de reforestación, superficies permeables o infraestructura ciclista.
• **Consulta la Plataforma CDMX digital** sobre permisos de operación de fuentes contaminantes cercanas.
• **Sostén la exigencia en el tiempo** — las contingencias ambientales son síntoma de un problema estructural.

La contaminación en tu colonia no es inevitable; se puede cambiar con política pública, inversión y presión ciudadana organizada. Este mapa existe para darte argumentos.`,
  },
  {
    q: '¿Con qué frecuencia se actualiza esta información?',
    a: `Algunos datos, como los de contaminación del aire, morbilidad o temperatura, se actualizan de manera anual o más frecuente. Otros, como los datos censales, se actualizan aproximadamente cada 10 años.

Este mapa utiliza información estructural que no busca reflejar cambios día a día, sino mostrar cómo se configuran las condiciones del entorno en el mediano y largo plazo, y cómo influyen en el cumplimiento de derechos.`,
  },
  {
    q: '¿Cómo se calculó mi calificación en el test y el índice de mi colonia?',
    a: `El índice de la colonia se construyó evaluando el nivel de cumplimiento en distintos indicadores: calidad del aire, salud, acceso a servicios, condiciones socioeconómicas y resiliencia climática.

Se calcula un promedio multiplicativo: todos los factores importan y un mal resultado en uno no puede compensarse con buenos resultados en otros. Este enfoque refleja de forma más realista las desigualdades, ya que el cumplimiento de derechos depende de múltiples condiciones al mismo tiempo.`,
  },
  {
    q: '¿Cómo me protejo a mí y a mi familia en días de mala calidad del aire?',
    a: `**Muévete mejor**
• Prioriza transporte público (Metro, Metrobús, trolebús).
• Evita usar el coche en días críticos.
• Si caminas o vas en bici, elige calles secundarias con árboles.

**Ajusta tus horarios**
• Evita ejercicio entre 1:00 pm y 6:00 pm (pico de ozono).
• Muévete temprano en la mañana o entrada la noche.

**Protégete en trayectos**
• Usa cubrebocas KN95 o N95 en calles con mucho tráfico.
• En bici, evita rodar pegado a coches o camiones.

**Cuida el aire dentro de casa**
• Evita pintar o usar solventes en días malos.
• No fumes en interiores. Reduce velas e incienso.
• Cocina con ventilación, especialmente si usas gas.

**Ventila con estrategia**
• Abre ventanas cuando el aire esté menos contaminado (temprano o de noche), no en horas pico.

**Lo más importante: esto es colectivo**
• Exige a tu diputado local que tome medidas.
• Usar transporte público o compartir coche no solo te protege a ti: mejora el aire para toda la ciudad.`,
  },
];

export default function FAQ() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="faq-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap');

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        .faq-page {
          min-height: 100vh;
          background: linear-gradient(170deg, #9DD0F3 0%, #7CB9E2 30%, #6AADDA 60%, #5A9FCC 100%);
          font-family: 'Space Mono', monospace;
          color: #fff;
        }

        /* Header */
        .faq-header {
          padding: 20px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .faq-logo {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 24px;
          color: #fff;
          letter-spacing: 4px;
          cursor: pointer;
        }
        .faq-back {
          padding: 8px 20px;
          border-radius: 8px;
          border: 1.5px solid rgba(255,255,255,0.35);
          background: rgba(28,35,51,0.65);
          backdrop-filter: blur(8px);
          color: #fff;
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .faq-back:hover {
          background: rgba(255,255,255,0.14);
          border-color: rgba(255,255,255,0.6);
          transform: translateY(-1px);
        }

        /* Content */
        .faq-content {
          max-width: 780px;
          margin: 0 auto;
          padding: 20px 24px 80px;
        }
        .faq-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(48px, 8vw, 72px);
          font-weight: 400;
          color: #fff;
          letter-spacing: 2px;
          margin-bottom: 8px;
        }
        .faq-subtitle {
          font-size: 13px;
          color: rgba(255,255,255,0.65);
          margin-bottom: 48px;
          line-height: 1.6;
        }

        /* Accordion */
        .faq-item {
          border-bottom: 1px solid rgba(255,255,255,0.12);
        }
        .faq-question {
          width: 100%;
          background: none;
          border: none;
          padding: 20px 0;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          cursor: pointer;
          text-align: left;
          color: #fff;
          font-family: 'Space Mono', monospace;
          font-size: 14px;
          font-weight: 700;
          line-height: 1.5;
          transition: opacity 0.2s;
        }
        .faq-question:hover { opacity: 0.85; }
        .faq-chevron {
          flex-shrink: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          transition: transform 0.3s ease;
          opacity: 0.6;
        }
        .faq-chevron.open { transform: rotate(180deg); }

        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s ease, opacity 0.3s ease;
          opacity: 0;
        }
        .faq-answer.open {
          max-height: 2000px;
          opacity: 1;
        }
        .faq-answer-inner {
          padding: 0 0 24px;
          font-size: 13px;
          line-height: 1.85;
          color: rgba(255,255,255,0.78);
          white-space: pre-line;
        }
        .faq-answer-inner strong {
          color: #fff;
          font-weight: 700;
        }

        /* CTA bottom */
        .faq-cta-section {
          text-align: center;
          margin-top: 56px;
          padding-top: 32px;
          border-top: 1px solid rgba(255,255,255,0.12);
        }
        .faq-cta-text {
          font-size: 13px;
          color: rgba(255,255,255,0.6);
          margin-bottom: 20px;
        }
        .faq-cta-buttons {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .faq-cta-btn {
          padding: 12px 28px;
          border-radius: 8px;
          border: 1.5px solid rgba(255,255,255,0.35);
          background: rgba(28,35,51,0.65);
          backdrop-filter: blur(8px);
          color: #fff;
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .faq-cta-btn:hover {
          background: rgba(255,255,255,0.14);
          border-color: rgba(255,255,255,0.6);
          transform: translateY(-2px);
        }

        @media (max-width: 640px) {
          .faq-header { padding: 14px 20px; }
          .faq-content { padding: 16px 20px 60px; }
          .faq-question { font-size: 13px; padding: 16px 0; }
          .faq-answer-inner { font-size: 12px; }
        }
      `}</style>

      {/* Header */}
      <header className="faq-header">
        <div className="faq-logo" onClick={() => navigate('/')}>AIRE LIBRE</div>
        <button className="faq-back" onClick={() => navigate('/')}>Inicio</button>
      </header>

      {/* Content */}
      <div className="faq-content">
        <h1 className="faq-title">Preguntas Posibles</h1>
        <p className="faq-subtitle">
          Respuestas a las dudas más comunes sobre calidad del aire, salud y derechos en la Zona Metropolitana del Valle de México.
        </p>

        {/* Accordion */}
        {FAQ_DATA.map((item, i) => (
          <div className="faq-item" key={i}>
            <button className="faq-question" onClick={() => toggle(i)}>
              <span>{item.q}</span>
              <span className={`faq-chevron ${openIndex === i ? 'open' : ''}`}>▾</span>
            </button>
            <div className={`faq-answer ${openIndex === i ? 'open' : ''}`}>
              <div className="faq-answer-inner"
                dangerouslySetInnerHTML={{
                  __html: item.a
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\n/g, '<br/>')
                }}
              />
            </div>
          </div>
        ))}

        {/* CTA */}
        <div className="faq-cta-section">
          <p className="faq-cta-text">¿Quieres conocer el nivel de cumplimiento de tu colonia?</p>
          <div className="faq-cta-buttons">
            <button className="faq-cta-btn" onClick={() => navigate('/map')}>Ver mapa</button>
            <button className="faq-cta-btn" onClick={() => navigate('/quiz')}>Hacer test</button>
          </div>
        </div>
      </div>
    </div>
  );
}
