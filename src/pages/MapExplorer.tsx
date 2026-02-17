import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MapView from '../components/Map/MapView';
import { coloniaService } from '../services/coloniaService';
import type { Colonia } from '../types';

type FiltroRiesgo = 'todos' | 'bajo' | 'medio' | 'alto';

// ============================================================
// Tooltip content — from Contenidos_de_la_metaficha.pdf
// ============================================================

const TOOLTIPS: Record<string, string> = {
  'contaminantes': `Hay muchos contaminantes en el aire que afectan nuestra salud, como el Ozono, el material particulado (PM), el bióxido de azufre, el óxido de nitrógeno o el monóxido de carbono.\n\nAquí proyectamos información sobre dos principales en la CDMX: el ozono y el material particulado 2.5 (PM2.5).`,

  'pm25': `¿Qué es el PM2.5?\n\nEl PM2.5 son partículas contaminantes muy pequeñas que flotan en el aire y miden menos de 2.5 micrómetros (¡más delgadas que un cabello humano!). Pueden incluir polvo, hollín, metales pesados y sustancias químicas orgánicas.\n\nFuentes principales: emisiones vehiculares (especialmente motor a diésel), automóviles y camiones, fábricas, quema de madera y combustibles fósiles, actividades de construcción y polvo suspendido.\n\nEfectos en la salud: Las PM2.5 penetran profundamente en los pulmones y causan problemas como accidentes cardiovasculares, enfermedades respiratorias crónicas, cáncer de pulmón y otras enfermedades.`,

  'ozono': `¿Qué es el ozono?\n\nOzono (O₃): El componente invisible del smog. Se forma cuando contaminantes emitidos por vehículos, industrias y otras fuentes reaccionan químicamente bajo la luz solar. Los niveles de ozono son más elevados durante las tardes y en días calurosos y soleados.\n\nFuentes principales: Vehículos automotores, aviones, trenes, emisiones industriales, actividades de construcción, granjas, tintorerías y el uso de solventes.\n\nEfectos en la salud: El ozono puede irritar los pulmones, causar inflamación y agravar enfermedades crónicas, incluso en niveles bajos de exposición.`,

  'salud_general': `¿Por qué hablar de condiciones de salud?\n\nLa contaminación atmosférica es el mayor riesgo medioambiental para la salud en el mundo según la OMS, con más de 4.2 millones de muertes al año.\n\nNo todas las personas reaccionamos igual al mismo aire. Las enfermedades como la diabetes e hipertensión, o enfermedades respiratorias y cardiovasculares, hacen que el cuerpo sea más vulnerable a los efectos del aire contaminado y del calor urbano.\n\nEl riesgo es estructural, no individual.`,

  'diabetes': `¿Cómo se relaciona la diabetes y la calidad del aire?\n\nLa relación es doble. Por un lado, las personas con diabetes son más vulnerables a los efectos del aire contaminado, especialmente a problemas del corazón y la circulación.\n\nPor otro lado, respirar aire contaminado durante largos periodos puede aumentar el riesgo de desarrollar diabetes tipo 2. Las partículas finas favorecen la inflamación y el estrés oxidativo, procesos que dificultan el uso de la insulina.`,

  'hipertension': `¿Cómo se relaciona la hipertensión y la calidad del aire?\n\nVivir durante años en zonas con aire contaminado incrementa el riesgo de desarrollar hipertensión, incluso cuando los niveles de contaminación no parecen extremos.\n\nLas partículas que respiramos (PM2.5 y PM10) generan inflamación, alteran los vasos sanguíneos y afectan el equilibrio del sistema nervioso, haciendo que el cuerpo mantenga la presión más alta de lo normal.`,

  'respiratorias': `¿Cómo se relacionan las enfermedades respiratorias crónicas y la calidad del aire?\n\nLa mala calidad del aire empeora los síntomas de personas con asma, EPOC o bronquitis crónica. Las partículas finas, el ozono y otros contaminantes irritan las vías respiratorias, aumentan la inflamación y provocan crisis más frecuentes.\n\nRespirar aire contaminado durante años daña progresivamente el tejido pulmonar y favorece la aparición de estas enfermedades incluso en personas sanas.`,

  'cardiovasculares': `¿Cómo se relacionan las enfermedades cardiovasculares y la calidad del aire?\n\nLa contaminación del aire es una de las principales amenazas ambientales para el sistema cardiovascular. Respirar aire con altas concentraciones de partículas finas:\n\n• Aumenta el riesgo de infartos y arritmias\n• Favorece eventos cerebrovasculares\n• Eleva la mortalidad por enfermedades del corazón\n\nLas partículas entran por los pulmones, pasan a la sangre y provocan inflamación generalizada.`,

  'subindice_salud': `🩺 ¿Qué es el subíndice de salud de la zona?\n\nEs un indicador compuesto que combina la presencia de diabetes, hipertensión, enfermedades respiratorias y cardiovasculares para estimar qué tan vulnerable es la población ante mala calidad del aire y calor extremo.\n\nPermite entender el riesgo acumulado, no solo la exposición.`,

  'poblacion_sensible': `¿Quiénes son la población con mayor sensibilidad?\n\nLas infancias son más vulnerables porque sus sistemas respiratorio y nervioso aún están en desarrollo. Las personas mayores enfrentan un mayor riesgo debido al desgaste biológico natural.\n\nLas personas fumadoras también forman parte de la población más sensible, ya que sus pulmones están más expuestos al daño del aire contaminado.`,

  'no_fumadores': `🚭 ¿Por qué importa saber cuántas personas no fuman en la zona?\n\nPorque fumar triplica el riesgo de muerte por enfermedades asociadas a la contaminación del aire. Una mayor proporción de no fumadores indica mejor resiliencia respiratoria y cardiovascular frente a contaminantes.`,

  'derechohabiencia': `¿Qué es la derechohabiencia?\n\nEs el acceso a servicios médicos gratuitos por parte del estado. Indica el porcentaje de la población que cuenta con seguridad social o acceso a servicios de salud públicos.`,

  'infraestructura': `¿Qué es la infraestructura sanitaria?\n\nMide la densidad de médicos y camas hospitalarias en comparación con el estándar de la OCDE. Una mayor infraestructura sanitaria significa mejor acceso a atención médica en la zona.`,

  'proximidad_medica': `¿Qué es la proximidad a infraestructura médica?\n\nMide qué tan cerca se encuentran los centros de salud, hospitales y clínicas de la zona. Una mayor proximidad facilita el acceso oportuno a atención médica, especialmente durante emergencias relacionadas con la contaminación.`,

  'socioeconomico': `🧭 ¿Por qué se incluyen indicadores socioeconómicos cuando hablamos de aire?\n\nPorque el impacto de la contaminación depende también de las condiciones de vida. El acceso a salud, información y vivienda adecuada influye en la capacidad de prevenir, atender y recuperarse de enfermedades.\n\nEl riesgo ambiental se distribuye de forma desigual.`,

  'desarrollo': `🏙 ¿Qué nos dice el índice de desarrollo de la zona?\n\nResume condiciones de bienestar, servicios e infraestructura urbana. Ayuda a entender qué tan preparada está una comunidad para protegerse y adaptarse frente a riesgos ambientales como contaminación, calor y eventos extremos.`,

  'cambio_climatico': `🌡 ¿Qué nos dice el subíndice de cambio climático?\n\nIntegra la exposición al calor urbano (isla de calor) y el riesgo de inundaciones para evaluar la vulnerabilidad climática de cada zona.`,

  'frescura': `🌡 ¿Qué significa la frescura de una zona?\n\nIndica si un área es más caliente o más templada que su entorno urbano. Las zonas con poca vegetación y mucho concreto acumulan más calor, lo que intensifica los efectos de la contaminación y eleva el riesgo para la salud.`,

  'inundaciones': `🌧 ¿Por qué se considera el riesgo de inundación?\n\nPorque revela fragilidad ambiental e infraestructura insuficiente. Las zonas con mayor riesgo de inundación suelen enfrentar también otras vulnerabilidades que afectan la salud y la estabilidad de la vida cotidiana.`,
};

export default function MapExplorer() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [allColonias, setAllColonias] = useState<Colonia[]>([]);
  const [coloniasFiltradas, setColoniasFiltradas] = useState<Colonia[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedColonia, setSelectedColonia] = useState<Colonia | null>(null);
  const [searchCP, setSearchCP] = useState('');
  const [filtroRiesgo, setFiltroRiesgo] = useState<FiltroRiesgo>('todos');
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
    if (filtroRiesgo === 'todos') { setColoniasFiltradas(allColonias); }
    else { setColoniasFiltradas(allColonias.filter(c => c.categoria_riesgo === filtroRiesgo)); }
  }, [filtroRiesgo, allColonias]);

  const handleSearch = async () => {
    if (!searchCP.trim()) return;
    const colonia = await coloniaService.getColoniaByCP(searchCP.trim());
    if (colonia) { setFiltroRiesgo('todos'); setSelectedColonia(colonia); }
    else { alert('Código postal no encontrado'); }
  };

  const formatPct = (val: number | null | undefined) => {
    if (val == null || isNaN(val)) return 'N/D';
    return `${(val * 100).toFixed(1)}%`;
  };

  const getRiesgoColor = (cat: string) => {
    switch (cat) { case 'alto': return '#ef4444'; case 'medio': return '#fbbf24'; case 'bajo': return '#4ade80'; default: return '#6b7280'; }
  };

  const contarPorCategoria = (cat: FiltroRiesgo) => {
    if (cat === 'todos') return allColonias.length;
    return allColonias.filter(c => c.categoria_riesgo === cat).length;
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

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* Header */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: 'white', padding: '12px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold', color: '#1f2937' }}>Mapa de Calidad del Aire - CDMX y Área Metropolitana</h1>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input type="text" placeholder="Buscar CP..." value={searchCP} onChange={(e) => setSearchCP(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', width: '120px' }} />
          <button onClick={handleSearch} style={{ backgroundColor: '#fbbf24', color: '#111827', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>Buscar</button>
        </div>
        <button onClick={() => navigate('/')} style={{ backgroundColor: '#6b7280', color: 'white', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>Volver al inicio</button>
      </div>

      {/* Filtros */}
      <div style={{ position: 'absolute', top: '70px', left: '20px', backgroundColor: 'white', padding: '12px 16px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Filtrar por riesgo</div>
        <FilterButton label="Todos" count={contarPorCategoria('todos')} isActive={filtroRiesgo === 'todos'} color="#6b7280" onClick={() => setFiltroRiesgo('todos')} />
        <FilterButton label="Bajo" count={contarPorCategoria('bajo')} isActive={filtroRiesgo === 'bajo'} color="#4ade80" onClick={() => setFiltroRiesgo('bajo')} />
        <FilterButton label="Medio" count={contarPorCategoria('medio')} isActive={filtroRiesgo === 'medio'} color="#fbbf24" onClick={() => setFiltroRiesgo('medio')} />
        <FilterButton label="Alto" count={contarPorCategoria('alto')} isActive={filtroRiesgo === 'alto'} color="#ef4444" onClick={() => setFiltroRiesgo('alto')} />
      </div>

      {/* Mapa */}
      <div style={{ width: '100%', height: '100%', paddingTop: '60px' }}>
        <MapView colonias={coloniasFiltradas} onColoniaClick={setSelectedColonia} selectedCP={selectedColonia?.codigo_postal} />
      </div>

      {/* Panel de información */}
      {selectedColonia && (
        <div style={{ position: 'absolute', top: '70px', right: '20px', width: '360px', maxHeight: 'calc(100vh - 100px)', overflowY: 'auto', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)', zIndex: 10 }}>
          {/* Header */}
          <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, backgroundColor: 'white', borderRadius: '12px 12px 0 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <h2 style={{ margin: '0 0 4px 0', fontSize: '22px', color: '#111827' }}>CP {selectedColonia.codigo_postal}</h2>
                {selectedColonia.colonias && (
                  <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#374151', lineHeight: '1.5' }}>{selectedColonia.colonias}</p>
                )}
                <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>{selectedColonia.municipio}, {selectedColonia.estado}</p>
              </div>
              <button onClick={() => setSelectedColonia(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', padding: 0, lineHeight: 1, color: '#9ca3af' }}>×</button>
            </div>
            <div style={{ marginTop: '12px' }}>
              <span style={{ display: 'inline-block', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold', color: 'white', backgroundColor: getRiesgoColor(selectedColonia.categoria_riesgo) }}>
                Riesgo {selectedColonia.categoria_riesgo.toUpperCase()}
              </span>
              <span style={{ marginLeft: '12px', fontSize: '14px', color: '#6b7280' }}>Índice: {formatPct(selectedColonia.indice_resumen)}</span>
            </div>
          </div>

          <div style={{ padding: '20px' }}>
            {/* Exposición a contaminantes */}
            <div style={{ marginBottom: '20px' }}>
              <SectionHeader title="Exposición a Contaminantes" tooltipKey="contaminantes" activeTooltip={activeTooltip} onToggle={toggleTooltip} />
              <div style={{ display: 'grid', gap: '8px' }}>
                <InfoRow label="Días con aire limpio (PM2.5)" value={formatPct(selectedColonia.dias_aire_limpio_pm25)} tooltipKey="pm25" activeTooltip={activeTooltip} onToggle={toggleTooltip} />
                <InfoRow label="Días con aire limpio (Ozono)" value={formatPct(selectedColonia.dias_aire_limpio_ozono)} tooltipKey="ozono" activeTooltip={activeTooltip} onToggle={toggleTooltip} />
                <InfoRow label="PM2.5 sobre OMS" value={formatPct(selectedColonia.concentracion_alta_pm25)} warning tooltipKey="pm25" activeTooltip={activeTooltip} onToggle={toggleTooltip} />
                <InfoRow label="Ozono sobre OMS" value={formatPct(selectedColonia.concentracion_alta_ozono)} warning tooltipKey="ozono" activeTooltip={activeTooltip} onToggle={toggleTooltip} />
                <InfoRow label="Subíndice de aire" value={formatPct(selectedColonia.subindice_aire)} />
              </div>
            </div>

            {/* Condiciones de salud */}
            <div style={{ marginBottom: '20px' }}>
              <SectionHeader title="Condiciones de Salud en la Zona" tooltipKey="salud_general" activeTooltip={activeTooltip} onToggle={toggleTooltip} />
              <div style={{ display: 'grid', gap: '8px' }}>
                <InfoRow label="Pob. sin diabetes" value={formatPct(selectedColonia.pob_sin_diabetes)} tooltipKey="diabetes" activeTooltip={activeTooltip} onToggle={toggleTooltip} />
                <InfoRow label="Pob. sin hipertensión" value={formatPct(selectedColonia.pob_sin_hipertension)} tooltipKey="hipertension" activeTooltip={activeTooltip} onToggle={toggleTooltip} />
                <InfoRow label="Pob. sin enf. respiratorias" value={formatPct(selectedColonia.pob_sin_enf_respiratorias)} tooltipKey="respiratorias" activeTooltip={activeTooltip} onToggle={toggleTooltip} />
                <InfoRow label="Pob. sin enf. cardiovasculares" value={formatPct(selectedColonia.pob_sin_enf_cardiovasculares)} tooltipKey="cardiovasculares" activeTooltip={activeTooltip} onToggle={toggleTooltip} />
                <InfoRow label="Subíndice de salud" value={formatPct(selectedColonia.subindice_salud)} tooltipKey="subindice_salud" activeTooltip={activeTooltip} onToggle={toggleTooltip} />
              </div>
            </div>

            {/* Población con mayor sensibilidad */}
            <div style={{ marginBottom: '20px' }}>
              <SectionHeader title="Población con Mayor Sensibilidad" tooltipKey="poblacion_sensible" activeTooltip={activeTooltip} onToggle={toggleTooltip} />
              <div style={{ display: 'grid', gap: '8px' }}>
                <InfoRow label="Población total" value={selectedColonia.poblacion_total?.toLocaleString() || 'N/D'} />
                <InfoRow label="Población sensible" value={formatPct(selectedColonia.poblacion_sensible)} />
                <InfoRow label="Pob. no fumadores" value={formatPct(selectedColonia.pob_no_fumadores)} tooltipKey="no_fumadores" activeTooltip={activeTooltip} onToggle={toggleTooltip} />
              </div>
            </div>

            {/* Acceso a salud */}
            <div style={{ marginBottom: '20px' }}>
              <SectionHeader title="Acceso a Servicios de Salud" />
              <div style={{ display: 'grid', gap: '8px' }}>
                <InfoRow label="Derechohabiencia" value={formatPct(selectedColonia.pob_derechohabiente)} tooltipKey="derechohabiencia" activeTooltip={activeTooltip} onToggle={toggleTooltip} />
                <InfoRow label="Densidad médicos y camas (vs OCDE)" value={formatPct(selectedColonia.indice_infraestructura_sanitaria)} tooltipKey="infraestructura" activeTooltip={activeTooltip} onToggle={toggleTooltip} />
                <InfoRow label="Proximidad infraestructura médica" value={formatPct(selectedColonia.proximidad_infraestructura_medica)} tooltipKey="proximidad_medica" activeTooltip={activeTooltip} onToggle={toggleTooltip} />
              </div>
            </div>

            {/* Socioeconómica */}
            <div style={{ marginBottom: '20px' }}>
              <SectionHeader title="Indicadores Socioeconómicos" tooltipKey="socioeconomico" activeTooltip={activeTooltip} onToggle={toggleTooltip} />
              <div style={{ display: 'grid', gap: '8px' }}>
                <InfoRow label="Años de escolaridad" value={formatPct(selectedColonia.anos_escolaridad)} />
                <InfoRow label="Viviendas con computadora" value={formatPct(selectedColonia.viviendas_computadora)} />
                <InfoRow label="Viviendas con lavadora" value={formatPct(selectedColonia.viviendas_lavadora)} />
                <InfoRow label="Viviendas con refrigerador" value={formatPct(selectedColonia.viviendas_refrigerador)} />
                <InfoRow label="Subíndice socioeconómico" value={formatPct(selectedColonia.subindice_socioeconomico)} />
              </div>
            </div>

            {/* Índices de desarrollo */}
            <div style={{ marginBottom: '20px' }}>
              <SectionHeader title="Índices de Desarrollo" tooltipKey="desarrollo" activeTooltip={activeTooltip} onToggle={toggleTooltip} />
              <div style={{ display: 'grid', gap: '8px' }}>
                <InfoRow label="Índice de desarrollo" value={formatPct(selectedColonia.indice_desarrollo)} />
                <InfoRow label="Prioridad sensible" value={formatPct(selectedColonia.indice_prioridad_sensible)} />
              </div>
            </div>

            {/* Cambio climático */}
            <div style={{ marginBottom: '20px' }}>
              <SectionHeader title="Cambio Climático" tooltipKey="cambio_climatico" activeTooltip={activeTooltip} onToggle={toggleTooltip} />
              <div style={{ display: 'grid', gap: '8px' }}>
                <InfoRow label="Subíndice cambio climático" value={formatPct(selectedColonia.subindice_cambio_climatico)} />
                <InfoRow label="Frescura (isla de calor)" value={formatPct(selectedColonia.indice_frescura)} tooltipKey="frescura" activeTooltip={activeTooltip} onToggle={toggleTooltip} />
                <InfoRow label="Seguridad ante inundaciones" value={formatPct(selectedColonia.seguridad_inundaciones)} tooltipKey="inundaciones" activeTooltip={activeTooltip} onToggle={toggleTooltip} />
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Tooltip Modal */}
      {activeTooltip && TOOLTIPS[activeTooltip] && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }} onClick={() => setActiveTooltip(null)}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', maxWidth: '450px', maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold', color: '#111827' }}>i</div>
              <button onClick={() => setActiveTooltip(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#9ca3af', padding: 0, lineHeight: 1 }}>×</button>
            </div>
            <div style={{ fontSize: '14px', color: '#374151', lineHeight: '1.7', whiteSpace: 'pre-line' }}>{TOOLTIPS[activeTooltip]}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionHeader({ title, tooltipKey, activeTooltip, onToggle }: { title: string; tooltipKey?: string; activeTooltip?: string | null; onToggle?: (key: string) => void; }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
      <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</h3>
      {tooltipKey && onToggle && (
        <button onClick={() => onToggle(tooltipKey)} style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: activeTooltip === tooltipKey ? '#fbbf24' : '#e5e7eb', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold', color: activeTooltip === tooltipKey ? '#111827' : '#6b7280', transition: 'all 0.2s' }}>i</button>
      )}
    </div>
  );
}

function FilterButton({ label, count, isActive, color, onClick }: { label: string; count: number; isActive: boolean; color: string; onClick: () => void; }) {
  return (
    <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '8px', border: isActive ? `2px solid ${color}` : '2px solid transparent', backgroundColor: isActive ? `${color}15` : 'transparent', cursor: 'pointer', transition: 'all 0.2s', width: '100%' }}>
      <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: color }} />
      <span style={{ fontSize: '13px', fontWeight: isActive ? '600' : '400', color: '#374151', flex: 1, textAlign: 'left' }}>{label}</span>
      <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '500' }}>{count.toLocaleString()}</span>
    </button>
  );
}

function InfoRow({ label, value, warning = false, tooltipKey, activeTooltip, onToggle }: { label: string; value: string; warning?: boolean; tooltipKey?: string; activeTooltip?: string | null; onToggle?: (key: string) => void; }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #f3f4f6' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '13px', color: '#374151' }}>{label}</span>
        {tooltipKey && onToggle && (
          <button onClick={() => onToggle(tooltipKey)} style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: activeTooltip === tooltipKey ? '#fbbf24' : '#e5e7eb', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold', color: activeTooltip === tooltipKey ? '#111827' : '#6b7280', transition: 'all 0.2s', flexShrink: 0 }}>i</button>
        )}
      </div>
      <span style={{ fontSize: '13px', fontWeight: '600', color: warning ? '#ef4444' : '#111827' }}>{value}</span>
    </div>
  );
}
