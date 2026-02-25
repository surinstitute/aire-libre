import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MapView from '../components/Map/MapView';
import { coloniaService } from '../services/coloniaService';
import type { Colonia } from '../types';

type FiltroCumplimiento = 'todos' | 'bajo' | 'medio' | 'alto';

// DB categoria_riesgo → Cumplimiento (inverted)
const getCumplimiento = (cat: string): string => {
  switch (cat) { case 'bajo': return 'alto'; case 'medio': return 'medio'; case 'alto': return 'bajo'; default: return 'medio'; }
};
const getCumplColor = (cumpl: string) => {
  switch (cumpl) { case 'alto': return '#22c55e'; case 'medio': return '#eab308'; case 'bajo': return '#ef4444'; default: return '#6b7280'; }
};
const cumplToRiesgo = (cumpl: string): string => {
  switch (cumpl) { case 'alto': return 'bajo'; case 'medio': return 'medio'; case 'bajo': return 'alto'; default: return ''; }
};

// ============================================================
// Tooltips — Metaficha v3
// ============================================================
const TOOLTIPS: Record<string, { title: string; body: string }> = {
  'cumplimiento_bajo': {
    title: 'Cumplimiento Bajo',
    body: `Estar en una colonia con cumplimiento bajo significa formar parte del tercio de la ciudad donde ejercer derechos —como respirar aire limpio y acceder a servicios de salud— es más difícil. Aquí la calidad del aire se cruza con otros factores: infraestructura, acceso a atención médica, condiciones socioeconómicas y capacidad para resistir eventos climáticos extremos.\n\nY algo importante: esto no quiere decir que en el resto de la ciudad todo esté bien. Si observamos únicamente el aire, el 99% de los días en la Zona Metropolitana del Valle de México superan los niveles considerados saludables por la OMS.\n\nLa diferencia no es si hay problema o no.\nEs quién lo enfrenta con más desventaja.`
  },
  'cumplimiento_medio': {
    title: 'Cumplimiento Medio',
    body: `Una colonia con cumplimiento medio forma parte del tercio intermedio en la garantía de derechos dentro de la Zona Metropolitana del Valle de México. No se encuentra entre las zonas con mayores desventajas, pero tampoco entre aquellas con mejores condiciones.\n\nSin embargo, estar en el punto medio no equivale a vivir en condiciones óptimas. Incluso si consideramos solo la calidad del aire, el 99% de los días en la ciudad superan los niveles recomendados para proteger la salud.\n\nAquí la pregunta no es solo dónde estás.\nEs cuánto puede mejorar la ciudad en su conjunto.`
  },
  'cumplimiento_alto': {
    title: 'Cumplimiento Alto',
    body: `Una colonia con cumplimiento alto forma parte del tercio con mejores condiciones relativas en la garantía de derechos. Presenta mejores niveles comparativos en calidad del aire y en factores que influyen en el bienestar: infraestructura, acceso a servicios de salud, condiciones socioeconómicas y resiliencia frente al cambio climático.\n\nAun así, esto no significa que las condiciones sean plenamente saludables. Ninguna colonia de la ciudad está completamente libre de exposición a contaminantes.\n\nLa diferencia no es la ausencia de riesgo,\nsino la desigual distribución de sus impactos.`
  },
  'indice_equidad': {
    title: 'Índice de Equidad',
    body: `El Índice de Equidad evalúa qué tan cerca está tu colonia de ofrecer un entorno justo y saludable. Integra cuatro dimensiones: calidad del aire, salud, condiciones socioeconómicas y resiliencia frente al cambio climático.\n\nNo solo cuenta contaminantes; también analiza si el barrio tiene servicios de salud cercanos, infraestructura adecuada y capacidad para enfrentar olas de calor o inundaciones.\n\nEntre más alto el porcentaje, mejores son las condiciones para el bienestar. Un puntaje bajo no habla de las personas, sino de brechas estructurales que aumentan riesgos y desigualdades.`
  },
  'contaminantes': {
    title: 'Exposición a Contaminantes',
    body: `La contaminación del aire es hoy el mayor riesgo ambiental para la salud. Cada año provoca más de 4.2 millones de muertes en el mundo.\n\nEn el aire hay distintos contaminantes que pueden afectar nuestro cuerpo, como el ozono, el material particulado (PM), el bióxido de azufre, el óxido de nitrógeno y el monóxido de carbono. En esta plataforma nos enfocamos en dos de los más relevantes en la Ciudad de México: el ozono y el material particulado fino PM2.5.\n\nSon partículas y gases que no siempre vemos, pero que respiramos todos los días.`
  },
  'dias_pm25': {
    title: 'Días al año con aire limpio (PM2.5)',
    body: `Este indicador muestra el porcentaje de días al año en que los niveles de PM2.5 se mantienen por debajo del límite recomendado por la OMS.\n\n¿Qué es el PM2.5?\nSon partículas muy pequeñas que flotan en el aire (más delgadas que un cabello humano). Pueden estar compuestas por hollín, metales pesados, polvo y residuos de combustión.\n\nFuentes principales: emisiones vehiculares (especialmente motores a diésel), actividad industrial, quema de madera y combustibles fósiles, obras de construcción y polvo suspendido.\n\nDebido a su tamaño microscópico, pueden penetrar profundamente en los pulmones e incluso entrar al torrente sanguíneo. La exposición prolongada se asocia con enfermedades cardiovasculares, respiratorias crónicas y cáncer de pulmón.`
  },
  'calidad_pm25': {
    title: 'Calidad del aire en días malos (PM2.5)',
    body: `Muestra qué tan cerca está el aire de los niveles considerados seguros por la OMS.\n\n• 100% = aire saludable. Las concentraciones de PM2.5 están dentro del nivel recomendado.\n• 0% = aire muy peligroso. Las concentraciones están muy por encima de lo seguro.\n• Los valores intermedios indican qué tanto nos alejamos o acercamos al nivel saludable.\n\nCuando el porcentaje baja, significa que el cielo está más cargado de partículas invisibles que pueden afectar nuestra salud.`
  },
  'dias_ozono': {
    title: 'Días al año con aire limpio (Ozono)',
    body: `Muestra el porcentaje de días al año en que los niveles de ozono (O₃) se mantienen por debajo del límite recomendado por la OMS.\n\n¿Qué es el ozono?\nEl ozono a nivel del suelo es un contaminante secundario. Se forma cuando óxidos de nitrógeno y compuestos orgánicos volátiles reaccionan químicamente en presencia de radiación solar. Sus concentraciones suelen aumentar durante las tardes y en días calurosos.\n\nEl ozono es un oxidante fuerte que puede irritar las vías respiratorias, causar inflamación pulmonar y reducir la función respiratoria, incluso en niveles relativamente bajos.`
  },
  'calidad_ozono': {
    title: 'Calidad del aire en días malos (Ozono)',
    body: `Muestra qué tan cerca está el aire de los niveles considerados seguros por la OMS.\n\n• 100% = aire saludable. Las concentraciones de ozono están dentro del nivel recomendado.\n• 0% = aire muy peligroso. Las concentraciones están muy por encima de lo seguro.\n• Los valores intermedios indican qué tanto nos acercamos o alejamos del nivel saludable.`
  },
  'calificacion_aire': {
    title: 'Calificación general del aire',
    body: `Junta todos los indicadores anteriores y los convierte en una sola nota para entender qué tan saludable es el aire en ese lugar.\n\n100% = aire muy limpio → bajos niveles de contaminación y muchos días con aire seguro.\n0% = aire muy contaminado → altos niveles de contaminación y pocos días limpios.`
  },
  'salud_acceso': {
    title: 'Condiciones de Salud y Acceso a Servicios Médicos',
    body: `La contaminación del aire es el mayor riesgo ambiental para la salud según la OMS, con más de 4.2 millones de muertes al año.\n\nNo todas las personas reaccionamos igual ante el mismo aire. Existen condiciones de salud que aumentan la vulnerabilidad, como la diabetes, la hipertensión, y las enfermedades respiratorias o cardiovasculares.\n\nAdemás, no todas las colonias cuentan con el mismo acceso a clínicas, hospitales o servicios médicos públicos.\n\nIncorporar estas dimensiones permite entender por qué dos colonias con niveles similares de contaminación pueden enfrentar impactos distintos. El riesgo no es solo ambiental: también es estructural.`
  },
  'pob_sensible_edad': {
    title: 'Población sensible por edad',
    body: `No todas las edades enfrentan el mismo riesgo. Las infancias menores de 12 años y las personas mayores de 64 son especialmente vulnerables por razones biológicas.\n\nEn las infancias, los pulmones y el sistema inmunológico aún están en desarrollo. Respiran más rápido y, en proporción a su tamaño, inhalan más contaminantes.\n\nEn las personas mayores, el organismo suele presentar mayor desgaste cardiovascular y respiratorio. La exposición al aire contaminado puede provocar inflamación sistémica y aumentar el riesgo de eventos graves como infartos.\n\nEn colonias con mayor proporción de infancias y personas mayores, el impacto potencial es estructuralmente más alto.`
  },
  'diabetes': {
    title: '¿Cómo se relaciona la diabetes y la calidad del aire?',
    body: `Las personas con diabetes tienen mayor riesgo de complicaciones cardiovasculares cuando están expuestas al aire contaminado. Su organismo ya enfrenta inflamación crónica, mayor estrés oxidativo y una vulnerabilidad previa del sistema cardiovascular.\n\nLa exposición a contaminantes puede empeorar el control metabólico. Las partículas finas pueden aumentar la resistencia a la insulina y dificultar la regulación de los niveles de glucosa.\n\nAdemás, la contaminación puede alterar el sistema nervioso autónomo, incrementando el riesgo de arritmias, cambios bruscos en la presión arterial e incluso eventos cardiovasculares graves.`
  },
  'hipertension': {
    title: '¿Cómo se relaciona la hipertensión y la calidad del aire?',
    body: `Vivir durante años en zonas con aire contaminado aumenta el riesgo de desarrollar hipertensión arterial, incluso cuando los niveles de contaminación no parecen extremos.\n\nLas partículas finas (PM2.5 y PM10) pueden generar inflamación, dañar los vasos sanguíneos y alterar el sistema nervioso autónomo, que regula la presión arterial.\n\nLas personas que ya viven con hipertensión son más vulnerables a los efectos inmediatos de la contaminación. Las partículas producen estrés oxidativo e inflamación adicional en un sistema cardiovascular ya comprometido.`
  },
  'respiratorias': {
    title: 'Enfermedades respiratorias crónicas y calidad del aire',
    body: `En personas con asma, EPOC o bronquitis crónica, la contaminación puede intensificar los síntomas. Las partículas finas, el ozono y otros contaminantes irritan las vías respiratorias, aumentan la inflamación y provocan crisis más frecuentes y graves.\n\nLa exposición prolongada daña el tejido pulmonar con el tiempo. Este daño acumulativo puede favorecer la aparición de asma, bronquitis crónica o EPOC, incluso en personas que antes no tenían estas condiciones.`
  },
  'no_fuma': {
    title: 'Población que no fuma',
    body: `Este indicador muestra el porcentaje de personas que no fuman en una colonia. Es un factor protector, porque el tabaco debilita los pulmones y el corazón.\n\nRespirar aire contaminado ya exige un esfuerzo extra al organismo. Fumar suma otra fuente de humo, como si los pulmones tuvieran que trabajar el doble.\n\nCuando más personas no fuman, hay mejores condiciones para cuidar la salud colectiva. Porque si el cielo ya está cargado, reducir el humo que sí podemos evitar le da al cuerpo más espacio para respirar.`
  },
  'acceso_salud': {
    title: 'Acceso efectivo a servicios de salud',
    body: `Combina dos elementos:\n\n• Derechohabiencia: si las personas están afiliadas a un sistema público de salud (IMSS o ISSSTE)\n• Disponibilidad y cercanía de servicios: qué tan cerca hay clínicas u hospitales, y si cuentan con personal y equipo suficiente\n\nCuando la contaminación desencadena una crisis asmática o un evento cardiovascular, el tiempo y la capacidad de respuesta pueden marcar la diferencia. El aire puede ser el mismo, pero la posibilidad de enfrentar sus efectos no lo es.`
  },
  'calificacion_salud': {
    title: 'Calificación general de salud y acceso',
    body: `Resume las condiciones de salud de la población y su acceso a servicios médicos en una sola medida.\n\nIntegra:\n• Proporción de personas sin enfermedades crónicas asociadas a mayor vulnerabilidad\n• Presencia de población que no fuma\n• Nivel de acceso efectivo al sistema de salud\n\nOfrece una fotografía clara del nivel de protección o vulnerabilidad estructural de la colonia frente a los impactos de la contaminación.`
  },
  'socio_clima': {
    title: 'Condiciones Socioeconómicas y de Cambio Climático',
    body: `Hablar de aire es hablar de desigualdad.\n\nLa exposición no se distribuye al azar, y tampoco la capacidad de respuesta frente a sus efectos.\n\nLas condiciones socioeconómicas y climáticas determinan qué tan expuesta está una colonia y qué tan preparada está para enfrentar los impactos ambientales.`
  },
  'desarrollo': {
    title: 'Desarrollo socioeconómico',
    body: `Considera factores como nivel de escolaridad, presencia de computadora, lavadora y refrigerador en el hogar.\n\nEl desarrollo socioeconómico influye en la capacidad para:\n• Acceder a información sobre alertas ambientales\n• Tomar decisiones informadas (evitar actividades al aire libre en días críticos)\n• Contar con mejores condiciones de vivienda\n• Acceder a servicios médicos rápidamente\n\nLos factores socioeconómicos proveen elementos clave para defenderse de las consecuencias de la mala calidad del aire.`
  },
  'frescura': {
    title: 'Frescura',
    body: `Evalúa la capacidad de una colonia para disipar el calor. No depende solo de los árboles, sino también del diseño urbano: sombra, vegetación, materiales y colores que reflejen la luz.\n\nCuando el calor queda atrapado en el asfalto y el concreto, se forman islas de calor. Estas zonas favorecen la formación de contaminantes como el ozono y generan estrés en el cuerpo.\n\nMás calor significa:\n• Mayor formación de contaminantes como el ozono\n• Más riesgo para la salud: estrés cardiovascular, infartos y crisis respiratorias\n• Mayor consumo de energía y vulnerabilidad ante olas de calor\n\nUna colonia fresca no es solo más cómoda: es más saludable y más resiliente.`
  },
  'inundaciones': {
    title: 'Seguridad ante inundaciones',
    body: `El diseño urbano influye directamente en la exposición a lluvias extremas. Cuando predominan "suelos sellados" (asfalto y concreto), el agua no puede filtrarse ni fluir con facilidad.\n\nLa falta de superficies permeables convierte la lluvia en una amenaza: puede provocar inundaciones, favorecer enfermedades y generar accidentes.\n\nUna colonia propensa a inundarse vive en una especie de interrupción constante. Se afectan servicios básicos y de emergencia, la movilidad se bloquea y las personas más vulnerables quedan aisladas.`
  },
  'resiliencia': {
    title: 'Resiliencia climática',
    body: `Integra dos dimensiones clave:\n• La frescura (si la temperatura es alta y persistente)\n• La seguridad ante inundaciones\n\nAl combinarlas, obtenemos un mapa real de la resiliencia: la capacidad de un entorno urbano para amortiguar los golpes del cambio climático.\n\nEl calor extremo no solo estresa al cuerpo, también acelera la formación de ozono. El aire puede volverse más tóxico justo cuando el organismo está más exigido por las altas temperaturas.\n\nEn un entorno frágil, no solo se deteriora el aire: también se compromete el refugio.`
  },
};

// ============================================================
// Component
// ============================================================

export default function MapExplorer() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [allColonias, setAllColonias] = useState<Colonia[]>([]);
  const [coloniasFiltradas, setColoniasFiltradas] = useState<Colonia[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedColonia, setSelectedColonia] = useState<Colonia | null>(null);
  const [searchCP, setSearchCP] = useState('');
  const [filtroCumplimiento, setFiltroCumplimiento] = useState<FiltroCumplimiento>('todos');
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  useEffect(() => {
    coloniaService.getAllColonias()
      .then(data => { setAllColonias(data); setColoniasFiltradas(data); setLoading(false); })
      .catch(error => { console.error('Error cargando colonias:', error); setLoading(false); });
  }, []);

  useEffect(() => {
    const cpFromQuiz = searchParams.get('cp');
    if (cpFromQuiz && allColonias.length > 0) {
      coloniaService.getColoniaByCP(cpFromQuiz).then((colonia) => {
        if (colonia) { setSelectedColonia(colonia); setSearchCP(cpFromQuiz); }
      });
    }
  }, [allColonias, searchParams]);

  useEffect(() => {
    if (filtroCumplimiento === 'todos') { setColoniasFiltradas(allColonias); }
    else { setColoniasFiltradas(allColonias.filter(c => c.categoria_riesgo === cumplToRiesgo(filtroCumplimiento))); }
  }, [filtroCumplimiento, allColonias]);

  const handleSearch = async () => {
    if (!searchCP.trim()) return;
    const colonia = await coloniaService.getColoniaByCP(searchCP.trim());
    if (colonia) { setFiltroCumplimiento('todos'); setSelectedColonia(colonia); }
    else { alert('Código postal no encontrado'); }
  };

  const fmt = (val: number | null | undefined) => {
    if (val == null || isNaN(val)) return 'N/D';
    return `${(val * 100).toFixed(1)}%`;
  };

  const contarPor = (cumpl: FiltroCumplimiento) => {
    if (cumpl === 'todos') return allColonias.length;
    return allColonias.filter(c => c.categoria_riesgo === cumplToRiesgo(cumpl)).length;
  };

  const toggleTooltip = (key: string) => { setActiveTooltip(activeTooltip === key ? null : key); };

  if (loading) {
    return (
      <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
        <div style={{ width: '48px', height: '48px', border: '4px solid #e5e7eb', borderTopColor: '#fbbf24', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ fontSize: '18px', color: '#6b7280' }}>Cargando mapa...</div>
      </div>
    );
  }

  const cumpl = selectedColonia ? getCumplimiento(selectedColonia.categoria_riesgo) : '';

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* Header */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: 'white', padding: '10px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <h1 style={{ margin: 0, fontSize: '17px', fontWeight: 'bold', color: '#1f2937' }}>Mapa Integral de Riesgo Ambiental en CDMX y Zona Metropolitana</h1>
          <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6b7280', lineHeight: 1.4 }}>
            Este mapa te muestra la ciudad desde el vuelo de un pájaro. Aquí se cruzan el aire, la salud y el acceso a servicios para mostrar dónde el riesgo se acumula y dónde hay más protección.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input type="text" placeholder="Buscar CP..." value={searchCP} onChange={(e) => setSearchCP(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', width: '120px' }} />
          <button onClick={handleSearch} style={{ backgroundColor: '#fbbf24', color: '#111827', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>Buscar</button>
        </div>
        <button onClick={() => navigate('/')} style={{ backgroundColor: '#6b7280', color: 'white', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>Volver al inicio</button>
      </div>

      {/* Filters */}
      <div style={{ position: 'absolute', top: '90px', left: '20px', backgroundColor: 'white', padding: '12px 16px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Nivel de cumplimiento</div>
        <FilterBtn label="Todos" count={contarPor('todos')} active={filtroCumplimiento === 'todos'} color="#6b7280" onClick={() => setFiltroCumplimiento('todos')} />
        <FilterBtn label="Alto" count={contarPor('alto')} active={filtroCumplimiento === 'alto'} color="#4ade80" onClick={() => setFiltroCumplimiento('alto')} />
        <FilterBtn label="Medio" count={contarPor('medio')} active={filtroCumplimiento === 'medio'} color="#fbbf24" onClick={() => setFiltroCumplimiento('medio')} />
        <FilterBtn label="Bajo" count={contarPor('bajo')} active={filtroCumplimiento === 'bajo'} color="#ef4444" onClick={() => setFiltroCumplimiento('bajo')} />
      </div>

      {/* Legend */}
      <div style={{ position: 'absolute', bottom: '30px', left: '20px', backgroundColor: 'white', padding: '12px 16px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 10 }}>
        <div style={{ fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>NIVEL DE CUMPLIMIENTO</div>
        {[{ l: 'Alto', c: '#4ade80' }, { l: 'Medio', c: '#fbbf24' }, { l: 'Bajo', c: '#ef4444' }].map(({ l, c }) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: c }} />
            <span style={{ fontSize: '12px', color: '#374151' }}>{l}</span>
          </div>
        ))}
      </div>

      {/* Map */}
      <div style={{ width: '100%', height: '100%', paddingTop: '70px' }}>
        <MapView colonias={coloniasFiltradas} onColoniaClick={setSelectedColonia} selectedCP={selectedColonia?.codigo_postal} />
      </div>

      {/* ── Info Panel ── */}
      {selectedColonia && (
        <div style={{ position: 'absolute', top: '90px', right: '20px', width: '400px', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)', zIndex: 10, fontSize: '14px', color: '#1f2937' }}>
          {/* Panel Header */}
          <div style={{ padding: '20px', borderBottom: '2px solid #e5e7eb', position: 'sticky', top: 0, backgroundColor: 'white', borderRadius: '12px 12px 0 0', zIndex: 2 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div style={{ flex: 1 }}>
                <h2 style={{ margin: '0 0 2px', fontSize: '22px', fontWeight: 700, color: '#111827' }}>CP {selectedColonia.codigo_postal}</h2>
                {selectedColonia.colonias && <p style={{ margin: '0 0 2px', fontSize: '13px', color: '#374151' }}>{selectedColonia.colonias}</p>}
                <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', textTransform: 'uppercase' }}>{selectedColonia.municipio}, {selectedColonia.estado}</p>
              </div>
              <button onClick={() => setSelectedColonia(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#9ca3af', padding: 0, lineHeight: 1 }}>×</button>
            </div>
            {/* Cumplimiento + Índice — same line */}
            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-block', padding: '5px 14px', borderRadius: '4px', fontSize: '13px', fontWeight: 700, color: 'white', backgroundColor: getCumplColor(cumpl) }}>
                Cumplimiento {cumpl.toUpperCase()}
              </span>
              <IBadge k={`cumplimiento_${cumpl}`} active={activeTooltip} toggle={toggleTooltip} />
              <span style={{ fontSize: '13px', color: '#374151' }}>Índice de equidad: {fmt(selectedColonia.indice_resumen)}</span>
              <IBadge k="indice_equidad" active={activeTooltip} toggle={toggleTooltip} />
            </div>
            {/* Población total */}
            <p style={{ margin: '8px 0 0', fontSize: '13px', color: '#6b7280' }}>Población total: {selectedColonia.poblacion_total?.toLocaleString() || ''}</p>
          </div>

          <div style={{ padding: '16px 20px' }}>
            {/* ── EXPOSICIÓN A CONTAMINANTES ── */}
            <Section title="EXPOSICIÓN A CONTAMINANTES" ik="contaminantes" at={activeTooltip} toggle={toggleTooltip} />
            <Row label="Días al año con aire limpio (PM2.5)" value={fmt(selectedColonia.dias_aire_limpio_pm25)} ik="dias_pm25" at={activeTooltip} toggle={toggleTooltip} />
            <Row label="Calidad del aire en días malos (PM2.5)" value={fmt(selectedColonia.concentracion_alta_pm25)} ik="calidad_pm25" at={activeTooltip} toggle={toggleTooltip} />
            <Row label="Días al año con aire limpio de Ozono" value={fmt(selectedColonia.dias_aire_limpio_ozono)} ik="dias_ozono" at={activeTooltip} toggle={toggleTooltip} />
            <Row label="Calidad del aire en días malos (Ozono)" value={fmt(selectedColonia.concentracion_alta_ozono)} ik="calidad_ozono" at={activeTooltip} toggle={toggleTooltip} />
            <Row label="Calificación general de aire" value={fmt(selectedColonia.subindice_aire)} ik="calificacion_aire" at={activeTooltip} toggle={toggleTooltip} />

            <Spacer />

            {/* ── CONDICIONES DE SALUD Y ACCESO A SERVICIOS MÉDICOS ── */}
            <Section title="CONDICIONES DE SALUD Y ACCESO A SERVICIOS MÉDICOS" ik="salud_acceso" at={activeTooltip} toggle={toggleTooltip} />
            <Row label="Población sensible por edad" value={fmt(selectedColonia.poblacion_sensible)} ik="pob_sensible_edad" at={activeTooltip} toggle={toggleTooltip} />
            <Row label="Población sin diabetes" value={fmt(selectedColonia.pob_sin_diabetes)} ik="diabetes" at={activeTooltip} toggle={toggleTooltip} />
            <Row label="Población sin hipertensión" value={fmt(selectedColonia.pob_sin_hipertension)} ik="hipertension" at={activeTooltip} toggle={toggleTooltip} />
            <Row label="Población sin enfermedades respiratorias crónicas" value={fmt(selectedColonia.pob_sin_enf_respiratorias)} ik="respiratorias" at={activeTooltip} toggle={toggleTooltip} />
            <Row label="Población que no fuma" value={fmt(selectedColonia.pob_no_fumadores)} ik="no_fuma" at={activeTooltip} toggle={toggleTooltip} />
            <Row label="Acceso efectivo a servicios de salud" value={fmt(selectedColonia.indice_infraestructura_sanitaria)} ik="acceso_salud" at={activeTooltip} toggle={toggleTooltip} />
            <Row label="Calificación general de condiciones de salud y acceso a servicios médicos" value={fmt(selectedColonia.subindice_salud)} ik="calificacion_salud" at={activeTooltip} toggle={toggleTooltip} />

            <Spacer />

            {/* ── CONDICIONES SOCIOECONÓMICAS Y DE CAMBIO CLIMÁTICO ── */}
            <Section title="CONDICIONES SOCIOECONÓMICAS Y DE CAMBIO CLIMÁTICO" ik="socio_clima" at={activeTooltip} toggle={toggleTooltip} />
            <Row label="Desarrollo socioeconómico" value={fmt(selectedColonia.subindice_socioeconomico)} ik="desarrollo" at={activeTooltip} toggle={toggleTooltip} />
            <Row label="Frescura" value={fmt(selectedColonia.indice_frescura)} ik="frescura" at={activeTooltip} toggle={toggleTooltip} />
            <Row label="Seguridad ante inundaciones" value={fmt(selectedColonia.seguridad_inundaciones)} ik="inundaciones" at={activeTooltip} toggle={toggleTooltip} />
            <Row label="Resiliencia climática" value={fmt(selectedColonia.subindice_cambio_climatico)} ik="resiliencia" at={activeTooltip} toggle={toggleTooltip} />
          </div>
        </div>
      )}

      {/* ── Tooltip Modal ── */}
      {activeTooltip && TOOLTIPS[activeTooltip] && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }} onClick={() => setActiveTooltip(null)}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', maxWidth: '480px', maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 'bold', color: '#111827', flexShrink: 0 }}>i</div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#111827' }}>{TOOLTIPS[activeTooltip].title}</h3>
              </div>
              <button onClick={() => setActiveTooltip(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#9ca3af', padding: 0, lineHeight: 1 }}>×</button>
            </div>
            <div style={{ fontSize: '14px', color: '#374151', lineHeight: '1.7', whiteSpace: 'pre-line' }}>{TOOLTIPS[activeTooltip].body}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sub-components ──

const I_COLORS = { bg: '#3b82f6', bgActive: '#fbbf24', text: '#fff', textActive: '#111827' };

function IBadge({ k, active, toggle }: { k: string; active: string | null; toggle: (k: string) => void }) {
  const isActive = active === k;
  return (
    <button onClick={() => toggle(k)} style={{
      width: '20px', height: '20px', borderRadius: '4px', border: 'none', cursor: 'pointer',
      backgroundColor: isActive ? I_COLORS.bgActive : I_COLORS.bg,
      color: isActive ? I_COLORS.textActive : I_COLORS.text,
      fontSize: '12px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, transition: 'all 0.15s',
    }}>i</button>
  );
}

function Section({ title, ik, at, toggle }: { title: string; ik: string; at: string | null; toggle: (k: string) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', marginTop: '4px' }}>
      <h3 style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#111827', letterSpacing: '0.3px' }}>{title}</h3>
      <IBadge k={ik} active={at} toggle={toggle} />
    </div>
  );
}

function Row({ label, value, ik, at, toggle }: { label: string; value: string; ik?: string; at?: string | null; toggle?: (k: string) => void }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
      <div style={{ flex: 1, paddingRight: '12px' }}>
        <span style={{ fontSize: '13px', color: '#374151', display: 'block' }}>{label}</span>
        {ik && toggle && (
          <div style={{ marginTop: '4px' }}>
            <IBadge k={ik} active={at!} toggle={toggle} />
          </div>
        )}
      </div>
      <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827', flexShrink: 0, paddingTop: '1px' }}>{value}</span>
    </div>
  );
}

function Spacer() {
  return <div style={{ height: '8px', borderBottom: '2px solid #111827', marginBottom: '12px' }} />;
}

function FilterBtn({ label, count, active, color, onClick }: { label: string; count: number; active: boolean; color: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '8px', border: active ? `2px solid ${color}` : '2px solid transparent', backgroundColor: active ? `${color}15` : 'transparent', cursor: 'pointer', transition: 'all 0.2s', width: '100%' }}>
      <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: color }} />
      <span style={{ fontSize: '13px', fontWeight: active ? '600' : '400', color: '#374151', flex: 1, textAlign: 'left' }}>{label}</span>
      <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '500' }}>{count.toLocaleString()}</span>
    </button>
  );
}
