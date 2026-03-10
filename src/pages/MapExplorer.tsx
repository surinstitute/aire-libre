import { useEffect, useState, Suspense, lazy } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MapView from '../components/Map/MapView';
import { coloniaService } from '../services/coloniaService';
import type { Colonia } from '../types';

const Bird3DViewer = lazy(() => import('../components/Bird/Bird3DViewer'));

type Filtro = 'todos' | 'bajo' | 'medio' | 'alto';

// DB categoria_riesgo → display label
const CUMPL_LABEL: Record<string, string> = {
  bajo: 'BAJO',
  medio: 'PROMEDIO',
  alto: 'MEJOR CUMPLIMIENTO',
};

const CUMPL_COLORS: Record<string, string> = {
  bajo: '#ef4444', medio: '#eab308', alto: '#22c55e',
};

// ============================================================
// Tooltips — Latest client text
// ============================================================
const TT: Record<string, { title: string; body: string }> = {
  'cumplimiento_bajo': { title: 'Cumplimiento Bajo', body: `Estar en una colonia con cumplimiento bajo significa formar parte del tercio de la ciudad donde ejercer derechos —como respirar aire limpio y acceder a servicios de salud— es más difícil. Aquí la calidad del aire se cruza con otros factores: infraestructura, acceso a atención médica, condiciones socioeconómicas y capacidad para resistir eventos climáticos extremos.\n\nY algo importante: esto no quiere decir que en el resto de la ciudad todo esté bien. Si observamos únicamente el aire, el 99% de los días en la Zona Metropolitana del Valle de México superan los niveles considerados saludables por la Organización Mundial de la Salud.\n\nLa diferencia no es si hay problema o no.\nEs quién lo enfrenta con más desventaja.` },

  'cumplimiento_medio': { title: 'Cumplimiento Promedio', body: `Una colonia con cumplimiento promedio forma parte del tercio intermedio en la garantía de derechos dentro de la Zona Metropolitana del Valle de México. Esto significa que no se encuentra entre las zonas con mayores desventajas, pero tampoco entre aquellas con mejores condiciones en calidad del aire y factores que influyen en el bienestar: acceso a servicios de salud, infraestructura, situación socioeconómica y capacidad de adaptación ante el cambio climático.\n\nSin embargo, estar en el punto medio no equivale a vivir en condiciones óptimas. Incluso si consideramos solo la calidad del aire, el 99% de los días en la ciudad superan los niveles recomendados para proteger la salud.\n\nAquí la pregunta no es solo dónde estás.\nEs cuánto puede mejorar la ciudad en su conjunto.` },

  'cumplimiento_alto': { title: 'Mejor Cumplimiento', body: `Una colonia con el mejor cumplimiento forma parte del tercio con mejores condiciones relativas en la garantía de derechos dentro de la Zona Metropolitana del Valle de México. Esto indica que presenta niveles comparativos más altos en calidad del aire y en factores que influyen en el bienestar: infraestructura, acceso a servicios de salud, condiciones socioeconómicas y resiliencia frente al cambio climático.\n\nAun así, esto no significa que las condiciones sean plenamente saludables. Ninguna colonia de la ciudad tiene un cumplimiento mayor al 80% ni está completamente libre de exposición a contaminantes: la calidad del aire supera los niveles recomendados el 99% de los días.\n\nLa diferencia no es la ausencia de riesgo, sino la desigual distribución de sus impactos.` },

  'indice_equidad': { title: 'Índice de Equidad', body: `El Índice de Equidad evalúa qué tan cerca está tu colonia de ofrecer un entorno justo y saludable. A diferencia de las herramientas que solo miden la contaminación, integra cuatro dimensiones que influyen en la vida cotidiana y en el ejercicio de derechos: calidad del aire, salud, condiciones socioeconómicas y resiliencia frente al cambio climático.\n\nNo solo cuenta contaminantes; también analiza si el barrio tiene servicios de salud cercanos, infraestructura adecuada y capacidad para enfrentar olas de calor o inundaciones. Entre más alto el porcentaje, mejores son las condiciones para el bienestar. Un puntaje bajo no descalifica a las personas, sino las brechas estructurales que aumentan riesgos y desigualdades.\n\nCuando el aire se deteriora, los barrios más expuestos lo resienten primero. Este índice ayuda a ver qué tan protegido (o expuesto) está un territorio frente a esos riesgos.` },

  'contaminantes': { title: 'Exposición a Contaminantes', body: `La contaminación del aire es hoy el mayor riesgo ambiental para la salud. Cada año provoca más de 4.2 millones de muertes en el mundo, según estimaciones internacionales.\n\nEn el aire hay distintos contaminantes que pueden afectar nuestro cuerpo, como el ozono, el material particulado (PM), el bióxido de azufre, el óxido de nitrógeno y el monóxido de carbono. En esta plataforma nos enfocamos en dos de los más relevantes en la Ciudad de México: el ozono y el material particulado fino PM2.5.\n\nSon partículas y gases que no siempre vemos, pero que respiramos todos los días. Entender su presencia es el primer paso para comprender cómo influyen en nuestra salud y en la forma en que habitamos la ciudad.` },

  'dias_pm25': { title: 'Días al año con aire limpio (PM2.5)', body: `Este indicador muestra el porcentaje de días al año en que los niveles de PM2.5 se mantienen por debajo del límite recomendado por la Organización Mundial de la Salud (OMS). Es decir, cuántos días el aire cumple con lo que se considera seguro para proteger la salud.\n\n¿Qué es el PM2.5?\nEl PM2.5 son partículas muy pequeñas que flotan en el aire (más delgadas que un cabello humano) y por eso no podemos verlas. Pueden estar compuestas por hollín, metales pesados, polvo y residuos de combustión. Sus principales fuentes son las emisiones vehiculares, especialmente de motores a diésel, así como la actividad industrial, la quema de madera y combustibles fósiles, las obras de construcción y el polvo suspendido.\n\nEn el pasado, en las minas se llevaban canarios porque eran más sensibles a los gases tóxicos: si el ave se debilitaba, era señal de que el aire no era seguro. Hoy no necesitamos un pájaro para advertirnos, pero el principio es el mismo: cuando el porcentaje de días con aire limpio es bajo, significa que respiramos niveles de contaminación que superan lo recomendado para la salud.\n\nDebido a su tamaño microscópico, el PM2.5 puede penetrar profundamente en los pulmones e incluso entrar al torrente sanguíneo. La exposición prolongada se asocia con enfermedades cardiovasculares, respiratorias crónicas y cáncer de pulmón. Las infancias, las personas mayores y quienes viven con enfermedades cardíacas o pulmonares son especialmente vulnerables.` },

  'calidad_pm25': { title: 'Calidad del aire en días malos (PM2.5)', body: `Este indicador muestra qué tan cerca está el aire que respiramos de los niveles considerados seguros por la Organización Mundial de la Salud (OMS).\n\nEn términos simples:\n• 100% = aire saludable. Las concentraciones de PM2.5 están dentro del nivel recomendado.\n• 0% = aire muy peligroso. Las concentraciones están muy por encima de lo seguro.\n• Los valores intermedios indican qué tanto nos alejamos o acercamos al nivel saludable.\n\nCuando el porcentaje baja, significa que el cielo está más cargado de partículas invisibles que pueden afectar nuestra salud.\n\n¿Qué es el PM2.5?\nEl PM2.5 son partículas contaminantes extremadamente pequeñas que flotan en el aire. Miden menos de 2.5 micrómetros (tan diminutas que varias podrían caber dentro del punto final de esta frase), por eso no podemos verlas. Pueden estar formadas por polvo, hollín, metales pesados y otras sustancias derivadas de la combustión.\n\nProvienen principalmente de emisiones vehiculares (especialmente de motores a diésel), automóviles y camiones, fábricas, la quema de madera y combustibles fósiles, obras de construcción y polvo suspendido.\n\nPor su tamaño microscópico, pueden penetrar profundamente en los pulmones e incluso ingresar al torrente sanguíneo. La exposición prolongada se asocia con enfermedades cardiovasculares, problemas respiratorios crónicos y cáncer de pulmón.\n\nAunque no las veamos, están presentes en el aire que compartimos. Y cuando el cielo se vuelve más denso, las personas más vulnerables lo resienten primero.` },

  'dias_ozono': { title: 'Días al año con aire limpio (Ozono)', body: `Este indicador muestra el porcentaje de días al año en que los niveles de ozono (O₃) se mantienen por debajo del límite recomendado por la Organización Mundial de la Salud (OMS). Es decir, cuántos días el aire cumple con el estándar considerado seguro para la salud.\n\n¿Qué es el ozono?\nEl ozono a nivel del suelo es un contaminante secundario: no se emite directamente. Se forma cuando óxidos de nitrógeno (NOₓ) y compuestos orgánicos volátiles (COV), liberados principalmente por vehículos e industrias, reaccionan químicamente en presencia de radiación solar. Por eso sus concentraciones suelen aumentar durante las tardes y en días calurosos y soleados.\n\nSus principales fuentes son las emisiones de automóviles, camiones, autobuses y motocicletas, así como procesos industriales, uso de solventes, actividades de construcción y otras fuentes que liberan NOₓ y COV a la atmósfera.\n\nEfectos en la salud: El ozono es un oxidante fuerte que puede irritar las vías respiratorias, causar inflamación pulmonar y reducir la función respiratoria. La exposición, incluso en niveles relativamente bajos, puede agravar enfermedades como el asma. Las infancias, las personas mayores y quienes realizan actividad física al aire libre son especialmente vulnerables.\n\nAunque no lo veamos, el ozono se forma en el mismo cielo que parece despejado. Y cuando las condiciones lo favorecen, el aire puede volverse más reactivo de lo que aparenta.` },

  'calidad_ozono': { title: 'Calidad del aire en días malos (Ozono)', body: `Este indicador muestra qué tan cerca está el aire que respiramos de los niveles considerados seguros por la Organización Mundial de la Salud (OMS).\n\nEn términos simples:\n• 100% = aire saludable. Las concentraciones de ozono están dentro del nivel recomendado.\n• 0% = aire muy peligroso. Las concentraciones están muy por encima de lo seguro.\n• Los valores intermedios indican qué tanto nos acercamos o nos alejamos del nivel considerado saludable.\n\n¿Qué es el ozono?\nEl ozono a nivel del suelo es el principal componente del smog. Es un contaminante secundario: no se emite directamente, sino que se forma cuando óxidos de nitrógeno (NOₓ) y compuestos orgánicos volátiles (COV), liberados por vehículos e industrias, reaccionan químicamente en presencia de radiación solar.\n\nEfectos en la salud: El ozono es un oxidante fuerte que puede irritar las vías respiratorias, provocar inflamación pulmonar y agravar enfermedades crónicas, incluso en niveles bajos de exposición. Las personas que pasan largos periodos al aire libre, las infancias y las personas mayores son particularmente vulnerables.\n\nAunque el cielo se vea despejado, el aire puede estar químicamente activo. Y cuando las condiciones favorecen esa reacción, lo más sensible lo resiente primero.` },

  'calificacion_aire': { title: 'Calificación general del aire', body: `Es una calificación total del aire: junta todos los indicadores anteriores y los convierte en una sola nota para entender, de forma rápida, qué tan saludable es el aire que se respira en ese lugar.\n\n100% = aire muy limpio → bajos niveles de contaminación y muchos días con aire seguro.\n0% = aire muy contaminado → altos niveles de contaminación y pocos días limpios.` },

  'salud_acceso': { title: 'Condiciones de Salud y Acceso a Servicios Médicos', body: `¿Por qué hablar de condiciones de salud y acceso a servicios médicos?\n\nLa contaminación del aire es el mayor riesgo ambiental para la salud en el mundo, según la Organización Mundial de la Salud (OMS), y está asociada con más de 4.2 millones de muertes al año.\n\nSin embargo, no todas las personas reaccionamos igual ante el mismo aire. Existen condiciones de salud que aumentan la vulnerabilidad, como la diabetes, la hipertensión, y las enfermedades respiratorias o cardiovasculares. Hay cuerpos que enfrentan mayor riesgo ante la misma exposición.\n\nAdemás, no todas las colonias cuentan con el mismo acceso a clínicas, hospitales o servicios médicos públicos. La infraestructura de salud y la cobertura de atención varían entre territorios, lo que significa que algunas comunidades tienen mayor capacidad de respuesta ante una crisis y otras quedan más expuestas.\n\nIncorporar estas dimensiones permite entender por qué dos colonias con niveles similares de contaminación pueden enfrentar impactos distintos. El riesgo no es solo ambiental: también es estructural.` },

  'pob_sensible_edad': { title: 'Población sensible por edad', body: `No todas las edades enfrentan el mismo riesgo frente a la contaminación del aire. Las infancias menores de 12 años y las personas mayores de 64 son especialmente vulnerables por razones biológicas.\n\nEn las infancias, los pulmones y el sistema inmunológico aún están en desarrollo. Respiran más rápido y, en proporción a su tamaño, inhalan más contaminantes. Esto puede afectar el crecimiento pulmonar y aumentar el riesgo de asma, infecciones respiratorias y menor capacidad pulmonar a lo largo de la vida.\n\nEn las personas mayores, el organismo suele presentar mayor desgaste cardiovascular y respiratorio, así como una mayor presencia de enfermedades crónicas. La exposición al aire contaminado puede provocar inflamación sistémica, alteraciones en la presión arterial y aumentar el riesgo de eventos graves como infartos o accidentes cerebrovasculares.\n\nHablar de población sensible por edad nos permite entender que el riesgo no depende solo de lo que hay en el aire, sino también de quién lo respira. En colonias con mayor proporción de infancias y personas mayores, el impacto potencial de la mala calidad del aire es estructuralmente más alto.` },

  'diabetes': { title: '¿Cómo se relaciona la diabetes y la calidad del aire?', body: `Las personas que viven con diabetes tienen mayor riesgo de sufrir complicaciones cardiovasculares cuando están expuestas al aire contaminado. Esto se debe a que su organismo ya enfrenta un estado de inflamación crónica, mayor estrés oxidativo y una vulnerabilidad previa del sistema cardiovascular.\n\nLa exposición a contaminantes atmosféricos puede empeorar el control metabólico. Las partículas finas que ingresan al torrente sanguíneo pueden aumentar la resistencia a la insulina y dificultar la regulación de los niveles de glucosa en sangre.\n\nAdemás, la contaminación puede alterar el funcionamiento del sistema nervioso autónomo, encargado de regular la frecuencia cardíaca y la presión arterial. En personas con diabetes (especialmente si existe daño nervioso previo) esta alteración puede incrementar el riesgo de arritmias, cambios bruscos en la presión arterial e incluso eventos cardiovasculares graves como infartos.\n\nHablar de esta condición permite entender que el riesgo no es uniforme: hay cuerpos que enfrentan mayor impacto ante la misma calidad del aire.` },

  'hipertension': { title: '¿Cómo se relaciona la hipertensión y la calidad del aire?', body: `Vivir durante años en zonas con aire contaminado aumenta el riesgo de desarrollar hipertensión arterial, incluso cuando los niveles de contaminación no parecen extremos. Las partículas finas que respiramos (especialmente PM2.5 y PM10) pueden generar inflamación en el organismo, dañar los vasos sanguíneos y alterar el sistema nervioso autónomo, que regula la presión arterial. Con el tiempo, estos efectos favorecen que la presión se mantenga elevada de manera sostenida.\n\nPor otro lado, las personas que ya viven con hipertensión son más vulnerables a los efectos inmediatos de la contaminación. Cuando las partículas contaminantes ingresan al torrente sanguíneo, producen estrés oxidativo e inflamación adicional en un sistema cardiovascular que ya está comprometido. Esto puede actuar como desencadenante de complicaciones graves.\n\nIncorporar esta dimensión permite entender que la calidad del aire no solo afecta los pulmones: también impacta directamente la salud cardiovascular, y lo hace con mayor intensidad en quienes ya enfrentan una condición previa.` },

  'respiratorias': { title: 'Enfermedades respiratorias crónicas y calidad del aire', body: `La calidad del aire impacta directamente en los pulmones. En personas que ya viven con asma, EPOC o bronquitis crónica, la contaminación puede intensificar los síntomas. Las partículas finas, el ozono y otros contaminantes irritan las vías respiratorias, aumentan la inflamación y pueden provocar crisis más frecuentes y más graves, así como una disminución progresiva de la capacidad respiratoria.\n\nAdemás, la exposición prolongada al aire contaminado daña el tejido pulmonar con el tiempo. Este daño acumulativo puede favorecer la aparición de asma, bronquitis crónica o EPOC, incluso en personas que antes no tenían estas condiciones.\n\nIncluir esta dimensión permite entender que la contaminación no solo agrava enfermedades existentes, sino que también puede contribuir a que se desarrollen. El impacto no depende únicamente de los niveles de contaminación, sino de cómo ese aire interactúa con los pulmones que lo respiran.` },

  'no_fuma': { title: 'Población que no fuma', body: `Este indicador muestra el porcentaje de personas que no fuman en una colonia. Es un factor protector, porque el tabaco debilita los pulmones y el corazón, y hace que el cuerpo sea más vulnerable frente a la contaminación del aire. Hay estudios que demuestran que fumar triplica el riesgo de muerte cuando se añade a mala calidad de aire.\n\nRespirar aire contaminado ya exige un esfuerzo extra al organismo. Fumar suma otra fuente de humo al mismo sistema, como si los pulmones tuvieran que trabajar el doble. Esta combinación aumenta el riesgo, especialmente en infancias, personas mayores y quienes ya viven con enfermedades respiratorias o cardiovasculares.\n\nCuando más personas no fuman, hay mejores condiciones para cuidar la salud colectiva. Porque si el cielo ya está cargado, reducir el humo que sí podemos evitar le da al cuerpo más espacio para respirar.` },

  'acceso_salud': { title: 'Acceso efectivo al sistema de salud', body: `El acceso efectivo al sistema de salud combina dos elementos:\n\n• Derechohabiencia: si las personas de la colonia están afiliadas a un sistema público de salud (IMSS o ISSSTE)\n• Disponibilidad y cercanía de servicios: qué tan cerca hay clínicas u hospitales, y si cuentan con médicos, enfermeras, camas y consultorios suficientes para la densidad poblacional.\n\n¿Por qué importa para hablar de calidad del aire?\n\nPorque cuando la contaminación desencadena una crisis asmática, una descompensación por hipertensión o un evento cardiovascular, el tiempo y la capacidad de respuesta pueden marcar la diferencia entre una atención oportuna y una complicación grave.\n\nNo todas las colonias cuentan con la misma cobertura médica ni con la misma infraestructura de salud. Ante el mismo nivel de contaminación, algunas comunidades tienen más recursos para responder y otras quedan más expuestas.\n\nEl aire puede ser el mismo, pero la posibilidad de enfrentar sus efectos no lo es. Y esa diferencia también es parte de la desigualdad urbana.` },

  'calificacion_salud': { title: 'Calificación general de condiciones de salud y acceso', body: `Este indicador resume las condiciones de salud de la población y su acceso a servicios médicos en una sola medida.\n\nIntegra:\n• La proporción de personas sin enfermedades crónicas asociadas a mayor vulnerabilidad.\n• La presencia de población que no fuma.\n• El nivel de acceso efectivo al sistema de salud.\n\nSu objetivo es ofrecer una fotografía clara del nivel de protección o vulnerabilidad estructural de la colonia frente a los impactos de la contaminación atmosférica.` },

  'socio_clima': { title: 'Condiciones Socioeconómicas y de Cambio Climático', body: `Hablar de aire es hablar de desigualdad.\n\nLa exposición no se distribuye al azar, y tampoco la capacidad de respuesta frente a sus efectos.\n\nLas condiciones socioeconómicas y climáticas determinan qué tan expuesta está una colonia y qué tan preparada está para enfrentar los impactos ambientales.` },

  'desarrollo': { title: 'Desarrollo socioeconómico', body: `Este indicador considera factores como nivel de escolaridad, presencia de computadora, lavadora y refrigerador en el hogar. Puede parecer que estos elementos no están relacionados con la calidad del aire, pero sí lo están.\n\nEl desarrollo socioeconómico influye en la capacidad de las personas para:\n• Acceder a información sobre alertas ambientales.\n• Tomar decisiones informadas (por ejemplo, evitar actividades al aire libre en días críticos).\n• Contar con mejores condiciones de vivienda.\n• Acceder a servicios médicos rápidamente para atender alguna crisis de salud por mala calidad de aire.\n\nLos factores socioeconómicos son fundamentales para hablar de riesgo, pues proveen a las personas de elementos clave para defenderse de las consecuencias de la mala calidad del aire, y también ayudan a prevenir la sobreexposición al mismo y tomar las medidas necesarias.` },

  'frescura': { title: 'Frescura', body: `La frescura evalúa la capacidad de una colonia para disipar el calor. No depende solo de los árboles (aunque son muy importantes), sino también del diseño urbano: la presencia de sombra, vegetación, materiales y colores que reflejen la luz y permitan que el barrio "respire" y se enfríe durante la noche.\n\nCuando el calor queda atrapado en el asfalto y el concreto, se forman islas de calor. Estas zonas no solo aumentan la sensación térmica —el llamado "efecto horno"—, sino que también pueden favorecer la formación de contaminantes como el ozono y generar mayor estrés en el cuerpo.\n\nMás calor significa:\n• Mayor formación de contaminantes como el ozono.\n• Más riesgo para la salud: estrés cardiovascular, infartos y crisis respiratorias.\n• Mayor consumo de energía y mayor vulnerabilidad ante olas de calor.\n\nUna colonia fresca no es solo más cómoda: es más saludable y más resiliente frente al cambio climático.` },

  'inundaciones': { title: 'Seguridad ante inundaciones', body: `El diseño urbano de una colonia influye directamente en su exposición a lluvias extremas y en su capacidad para manejar el agua. Cuando predominan materiales como el asfalto y el concreto —los llamados "suelos sellados"—, el agua no puede filtrarse ni fluir con facilidad. Si a esto se suman factores como pendientes pronunciadas, cercanía a puntos críticos de inundación o lluvias intensas, el riesgo aumenta.\n\nLa falta de superficies permeables convierte la lluvia en una amenaza: puede provocar inundaciones, favorecer enfermedades y generar accidentes.\n\nUna colonia propensa a inundarse vive en una especie de interrupción constante. Se afectan servicios básicos y de emergencia —incluidos los de salud—, la movilidad se bloquea, se pierden bienes materiales y las personas más vulnerables quedan aisladas. No es solo un problema de agua acumulada; es un problema de continuidad de la vida cotidiana.` },

  'resiliencia': { title: 'Resiliencia climática', body: `Este índice integra dos dimensiones clave:\n• La frescura (si la temperatura es alta y persistente)\n• La seguridad ante inundaciones\n\nAl combinarlas, obtenemos un mapa real de la resiliencia: la capacidad de un entorno urbano para amortiguar los golpes de la meteorología característica de la crisis climática.\n\n¿Por qué importa para hablar de calidad del aire?\n\nPorque el cambio climático y la contaminación del aire no actúan por separado: se potencian entre sí. El calor extremo no solo estresa al cuerpo, también acelera la formación de ozono. Es decir, el aire puede volverse más tóxico justo cuando el organismo está más exigido por las altas temperaturas.\n\nAdemás, las inundaciones bloquean la movilidad y dificultan el acceso a servicios de salud. Cuando una colonia no es resiliente, los riesgos se acumulan: el calor, la contaminación y la falta de infraestructura se combinan, dejando a las personas más vulnerables con menos capacidad de respuesta durante contingencias ambientales u olas de calor.\n\nEn un entorno frágil, no solo se deteriora el aire: también se compromete el refugio. Como un nido expuesto a tormentas repetidas, una colonia sin resiliencia enfrenta riesgos que se superponen y se intensifican. La calidad del aire no depende solo del cielo, sino de qué tan protegido está el territorio bajo las nubes.` },
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
  const [selected, setSelected] = useState<Colonia | null>(null);
  const [searchCP, setSearchCP] = useState('');
  const [filtro, setFiltro] = useState<Filtro>('todos');
  const [tip, setTip] = useState<string | null>(null);

  useEffect(() => { coloniaService.getAllColonias().then(d => { setAllColonias(d); setColoniasFiltradas(d); setLoading(false); }).catch(() => setLoading(false)); }, []);
  useEffect(() => { const cp = searchParams.get('cp'); if (cp && allColonias.length) coloniaService.getColoniaByCP(cp).then(c => { if (c) { setSelected(c); setSearchCP(cp); } }); }, [allColonias, searchParams]);
  useEffect(() => { setColoniasFiltradas(filtro === 'todos' ? allColonias : allColonias.filter(c => c.categoria_riesgo === filtro)); }, [filtro, allColonias]);

  const search = async () => { if (!searchCP.trim()) return; const c = await coloniaService.getColoniaByCP(searchCP.trim()); if (c) { setFiltro('todos'); setSelected(c); } else alert('Código postal no encontrado'); };
  const fmt = (v: number | null | undefined) => v == null || isNaN(v) ? 'N/D' : `${(v * 100).toFixed(1)}%`;
  const cnt = (f: Filtro) => f === 'todos' ? allColonias.length : allColonias.filter(c => c.categoria_riesgo === f).length;
  const toggle = (k: string) => setTip(tip === k ? null : k);

  if (loading) return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{ width: 48, height: 48, border: '4px solid #e5e7eb', borderTopColor: '#fbbf24', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ fontSize: 18, color: '#6b7280' }}>Cargando mapa...</div>
    </div>
  );

  const cat = selected?.categoria_riesgo || 'medio';

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* Header */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: 'white', padding: '10px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          <h1 style={{ margin: 0, fontSize: 17, fontWeight: 'bold', color: '#1f2937' }}>Mapa Integral de Riesgo Ambiental en CDMX y Zona Metropolitana</h1>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: '#6b7280' }}>Este mapa te muestra la ciudad desde el vuelo de un pájaro. Aquí se cruzan el aire, la salud y el acceso a servicios para mostrar dónde el riesgo se acumula y dónde hay más protección.</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input type="text" placeholder="Buscar CP..." value={searchCP} onChange={e => setSearchCP(e.target.value)} onKeyDown={e => e.key === 'Enter' && search()} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, width: 120 }} />
          <button onClick={search} style={{ backgroundColor: '#fbbf24', color: '#111827', padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>Buscar</button>
        </div>
        <button onClick={() => navigate('/')} style={{ backgroundColor: '#6b7280', color: 'white', padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>Volver al inicio</button>
      </div>

      {/* Filters */}
      <div style={{ position: 'absolute', top: 90, left: 20, backgroundColor: 'white', padding: '12px 16px', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Nivel de cumplimiento</div>
        <FBtn label="Todos" n={cnt('todos')} on={filtro === 'todos'} c="#6b7280" click={() => setFiltro('todos')} />
        <FBtn label="Mejor cumplimiento" n={cnt('alto')} on={filtro === 'alto'} c="#4ade80" click={() => setFiltro('alto')} />
        <FBtn label="Promedio" n={cnt('medio')} on={filtro === 'medio'} c="#fbbf24" click={() => setFiltro('medio')} />
        <FBtn label="Bajo" n={cnt('bajo')} on={filtro === 'bajo'} c="#ef4444" click={() => setFiltro('bajo')} />
      </div>

      {/* Legend */}
      <div style={{ position: 'absolute', bottom: 30, left: 20, backgroundColor: 'white', padding: '12px 16px', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 10 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8 }}>NIVEL DE CUMPLIMIENTO</div>
        {[['Mejor cumplimiento', '#4ade80'], ['Promedio', '#fbbf24'], ['Bajo', '#ef4444']].map(([l, c]) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: c }} />
            <span style={{ fontSize: 12, color: '#374151' }}>{l}</span>
          </div>
        ))}
      </div>

      {/* Map */}
      <div style={{ width: '100%', height: '100%', paddingTop: 70 }}>
        <MapView colonias={coloniasFiltradas} onColoniaClick={setSelected} selectedCP={selected?.codigo_postal} />
      </div>

      {/* Floating bird mascot — bottom-left, above legend */}
      <div style={{
        position: 'absolute', bottom: 140, left: 24, width: 100, height: 100,
        zIndex: 5, pointerEvents: 'none', opacity: 0.85,
      }}>
        <Suspense fallback={null}>
          <Bird3DViewer
            variant={2}
            width="100px"
            height="100px"
            autoRotateSpeed={0.3}
            showControls={false}
            backgroundColor={null}
            cameraDistance={3.5}
          />
        </Suspense>
      </div>

      {/* ── Info Panel ── */}
      {selected && (
        <div style={{ position: 'absolute', top: 90, right: 20, width: 400, maxHeight: 'calc(100vh - 120px)', overflowY: 'auto', backgroundColor: 'white', borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.2)', zIndex: 10, fontSize: 14, color: '#1f2937' }}>
          <div style={{ padding: 20, borderBottom: '2px solid #e5e7eb', position: 'sticky', top: 0, backgroundColor: 'white', borderRadius: '12px 12px 0 0', zIndex: 2 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div style={{ flex: 1 }}>
                <h2 style={{ margin: '0 0 2px', fontSize: 22, fontWeight: 700 }}>CP {selected.codigo_postal}</h2>
                {selected.colonias && <p style={{ margin: '0 0 2px', fontSize: 13, color: '#374151' }}>{selected.colonias}</p>}
                <p style={{ margin: 0, fontSize: 13, color: '#6b7280', textTransform: 'uppercase' }}>{selected.municipio}, {selected.estado}</p>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#9ca3af', padding: 0, lineHeight: 1 }}>×</button>
            </div>
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-block', padding: '5px 14px', borderRadius: 4, fontSize: 13, fontWeight: 700, color: 'white', backgroundColor: CUMPL_COLORS[cat] || '#6b7280' }}>
                {cat === 'alto' ? 'Mejor cumplimiento' : `Cumplimiento ${CUMPL_LABEL[cat]}`}
              </span>
              <IB k={`cumplimiento_${cat}`} a={tip} t={toggle} />
              <span style={{ fontSize: 13, color: '#374151' }}>Índice de equidad: {fmt(selected.indice_resumen)}</span>
              <IB k="indice_equidad" a={tip} t={toggle} />
            </div>
            <p style={{ margin: '8px 0 0', fontSize: 13, color: '#6b7280' }}>Población total: {selected.poblacion_total?.toLocaleString() || ''}</p>
          </div>

          <div style={{ padding: '16px 20px' }}>
            <Sec title="EXPOSICIÓN A CONTAMINANTES" ik="contaminantes" a={tip} t={toggle} />
            <Row l="Días al año con aire limpio (PM2.5)" v={fmt(selected.dias_aire_limpio_pm25)} ik="dias_pm25" a={tip} t={toggle} />
            <Row l="Calidad del aire en días malos (PM2.5)" v={fmt(selected.concentracion_alta_pm25)} ik="calidad_pm25" a={tip} t={toggle} />
            <Row l="Días al año con aire limpio de Ozono" v={fmt(selected.dias_aire_limpio_ozono)} ik="dias_ozono" a={tip} t={toggle} />
            <Row l="Calidad del aire en días malos (Ozono)" v={fmt(selected.concentracion_alta_ozono)} ik="calidad_ozono" a={tip} t={toggle} />
            <Row l="Calificación general de aire" v={fmt(selected.subindice_aire)} ik="calificacion_aire" a={tip} t={toggle} />
            <Sep />
            <Sec title="CONDICIONES DE SALUD Y ACCESO A SERVICIOS MÉDICOS" ik="salud_acceso" a={tip} t={toggle} />
            <Row l="Población sensible por edad" v={fmt(selected.poblacion_sensible)} ik="pob_sensible_edad" a={tip} t={toggle} />
            <Row l="Población sin diabetes" v={fmt(selected.pob_sin_diabetes)} ik="diabetes" a={tip} t={toggle} />
            <Row l="Población sin hipertensión" v={fmt(selected.pob_sin_hipertension)} ik="hipertension" a={tip} t={toggle} />
            <Row l="Población sin enfermedades respiratorias crónicas" v={fmt(selected.pob_sin_enf_respiratorias)} ik="respiratorias" a={tip} t={toggle} />
            <Row l="Población que no fuma" v={fmt(selected.pob_no_fumadores)} ik="no_fuma" a={tip} t={toggle} />
            <Row l="Acceso efectivo a servicios de salud" v={fmt(selected.indice_infraestructura_sanitaria)} ik="acceso_salud" a={tip} t={toggle} />
            <Row l="Calificación general de condiciones de salud y acceso a servicios médicos" v={fmt(selected.subindice_salud)} ik="calificacion_salud" a={tip} t={toggle} />
            <Sep />
            <Sec title="CONDICIONES SOCIOECONÓMICAS Y DE CAMBIO CLIMÁTICO" ik="socio_clima" a={tip} t={toggle} />
            <Row l="Desarrollo socioeconómico" v={fmt(selected.subindice_socioeconomico)} ik="desarrollo" a={tip} t={toggle} />
            <Row l="Frescura" v={fmt(selected.indice_frescura)} ik="frescura" a={tip} t={toggle} />
            <Row l="Seguridad ante inundaciones" v={fmt(selected.seguridad_inundaciones)} ik="inundaciones" a={tip} t={toggle} />
            <Row l="Resiliencia climática" v={fmt(selected.subindice_cambio_climatico)} ik="resiliencia" a={tip} t={toggle} />
          </div>
        </div>
      )}

      {/* Tooltip Modal */}
      {tip && TT[tip] && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }} onClick={() => setTip(null)}>
          <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 24, maxWidth: 480, maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 'bold', color: '#111827', flexShrink: 0 }}>i</div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{TT[tip].title}</h3>
              </div>
              <button onClick={() => setTip(null)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#9ca3af', padding: 0, lineHeight: 1 }}>×</button>
            </div>
            <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{TT[tip].body}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sub-components ──
function IB({ k, a, t }: { k: string; a: string | null; t: (k: string) => void }) {
  const on = a === k;
  return <button onClick={() => t(k)} style={{ width: 20, height: 20, borderRadius: 4, border: 'none', cursor: 'pointer', backgroundColor: on ? '#fbbf24' : '#3b82f6', color: on ? '#111827' : '#fff', fontSize: 12, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>i</button>;
}
function Sec({ title, ik, a, t }: { title: string; ik: string; a: string | null; t: (k: string) => void }) {
  return <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, marginTop: 4 }}><h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#111827' }}>{title}</h3><IB k={ik} a={a} t={t} /></div>;
}
function Row({ l, v, ik, a, t }: { l: string; v: string; ik?: string; a?: string | null; t?: (k: string) => void }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
      <div style={{ flex: 1, paddingRight: 12 }}>
        <span style={{ fontSize: 13, color: '#374151', display: 'block' }}>{l}</span>
        {ik && t && <div style={{ marginTop: 4 }}><IB k={ik} a={a!} t={t} /></div>}
      </div>
      <span style={{ fontSize: 14, fontWeight: 600, color: '#111827', flexShrink: 0, paddingTop: 1 }}>{v}</span>
    </div>
  );
}
function Sep() { return <div style={{ height: 8, borderBottom: '2px solid #111827', marginBottom: 12 }} />; }
function FBtn({ label, n, on, c, click }: { label: string; n: number; on: boolean; c: string; click: () => void }) {
  return (
    <button onClick={click} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, border: on ? `2px solid ${c}` : '2px solid transparent', backgroundColor: on ? `${c}15` : 'transparent', cursor: 'pointer', width: '100%' }}>
      <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: c }} />
      <span style={{ fontSize: 13, fontWeight: on ? 600 : 400, color: '#374151', flex: 1, textAlign: 'left' }}>{label}</span>
      <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500 }}>{n.toLocaleString()}</span>
    </button>
  );
}
