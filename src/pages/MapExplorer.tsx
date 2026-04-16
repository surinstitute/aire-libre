import { useEffect, useState, Suspense, lazy } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MapView from '../components/Map/MapView';
import { coloniaService } from '../services/coloniaService';
import type { Colonia } from '../types';

const FrogBirdViewer = lazy(() => import('../components/Bird/FrogBirdViewer'));

type Filtro = 'todos' | 'bajo' | 'medio' | 'alto' | 'sin_datos';

const CUMPL_LABEL: Record<string, string> = { bajo: 'BAJO', medio: 'PROMEDIO', alto: 'MEJOR', sin_datos: 'SIN DATOS' };
const CUMPL_COLORS: Record<string, string> = { bajo: '#ef4444', medio: '#eab308', alto: '#22c55e', sin_datos: '#9ca3af' };

// ── Tooltips (unchanged) ──
const TT: Record<string, { title: string; body: string }> = {
  'cumplimiento_bajo': { title: 'Equidad y Resiliencia Baja', body: `Estar en una colonia con cumplimiento bajo significa formar parte del tercio de la ciudad donde ejercer derechos —como respirar aire limpio y acceder a servicios de salud— es más difícil. Aquí la calidad del aire se cruza con otros factores: infraestructura, acceso a atención médica, condiciones socioeconómicas y capacidad para resistir eventos climáticos extremos.\n\nY algo importante: esto no quiere decir que en el resto de la ciudad todo esté bien. Si observamos únicamente el aire, el 99% de los días en la Zona Metropolitana del Valle de México superan los niveles considerados saludables por la Organización Mundial de la Salud.\n\nLa diferencia no es si hay problema o no.\nEs quién lo enfrenta con más desventaja.` },
  'cumplimiento_medio': { title: 'Equidad y Resiliencia Promedio', body: `Una colonia con cumplimiento promedio forma parte del tercio intermedio en la garantía de derechos dentro de la Zona Metropolitana del Valle de México. Esto significa que no se encuentra entre las zonas con mayores desventajas, pero tampoco entre aquellas con mejores condiciones en calidad del aire y factores que influyen en el bienestar: acceso a servicios de salud, infraestructura, situación socioeconómica y capacidad de adaptación ante el cambio climático.\n\nSin embargo, estar en el punto medio no equivale a vivir en condiciones óptimas. Incluso si consideramos solo la calidad del aire, el 99% de los días en la ciudad superan los niveles recomendados para proteger la salud.\n\nAquí la pregunta no es solo dónde estás.\nEs cuánto puede mejorar la ciudad en su conjunto.` },
  'cumplimiento_alto': { title: 'Mejor Equidad y Resiliencia', body: `Una colonia con el mejor cumplimiento forma parte del tercio con mejores condiciones relativas en la garantía de derechos dentro de la Zona Metropolitana del Valle de México. Esto indica que presenta niveles comparativos más altos en calidad del aire y en factores que influyen en el bienestar: infraestructura, acceso a servicios de salud, condiciones socioeconómicas y resiliencia frente al cambio climático.\n\nAun así, esto no significa que las condiciones sean plenamente saludables. Ninguna colonia de la ciudad tiene un cumplimiento mayor al 80% ni está completamente libre de exposición a contaminantes: la calidad del aire supera los niveles recomendados el 99% de los días.\n\nLa diferencia no es la ausencia de riesgo, sino la desigual distribución de sus impactos.` },
  'indice_equidad': { title: 'Índice de Equidad', body: `El Índice de Equidad evalúa qué tan cerca está tu colonia de ofrecer un entorno justo y saludable. A diferencia de las herramientas que solo miden la contaminación, integra cuatro dimensiones que influyen en la vida cotidiana y en el ejercicio de derechos: calidad del aire, salud, condiciones socioeconómicas y resiliencia frente al cambio climático.\n\nNo solo cuenta contaminantes; también analiza si el barrio tiene servicios de salud cercanos, infraestructura adecuada y capacidad para enfrentar olas de calor o inundaciones. Entre más alto el porcentaje, mejores son las condiciones para el bienestar. Un puntaje bajo no descalifica a las personas, sino las brechas estructurales que aumentan riesgos y desigualdades.\n\nCuando el aire se deteriora, los barrios más expuestos lo resienten primero. Este índice ayuda a ver qué tan protegido (o expuesto) está un territorio frente a esos riesgos.` },
  'contaminantes': { title: 'Exposición a Contaminantes', body: `La contaminación del aire es hoy el mayor riesgo ambiental para la salud. Cada año provoca más de 4.2 millones de muertes en el mundo, según estimaciones internacionales.\n\nEn el aire hay distintos contaminantes que pueden afectar nuestro cuerpo, como el ozono, el material particulado (PM), el bióxido de azufre, el óxido de nitrógeno y el monóxido de carbono. En esta plataforma nos enfocamos en dos de los más relevantes en la Ciudad de México: el ozono y el material particulado fino PM2.5.\n\nSon partículas y gases que no siempre vemos, pero que respiramos todos los días. Entender su presencia es el primer paso para comprender cómo influyen en nuestra salud y en la forma en que habitamos la ciudad.` },
  'dias_pm25': { title: 'Días al año con aire limpio (PM2.5)', body: `Este indicador muestra el porcentaje de días al año en que los niveles de PM2.5 se mantienen por debajo del límite recomendado por la OMS.` },
  'calidad_pm25': { title: 'Calidad del aire en días malos (PM2.5)', body: `100% = aire saludable. 0% = aire muy peligroso. Los valores intermedios indican qué tanto nos alejamos o acercamos al nivel saludable.` },
  'dias_ozono': { title: 'Días al año con aire limpio (Ozono)', body: `Este indicador muestra el porcentaje de días al año en que los niveles de ozono se mantienen por debajo del límite recomendado por la OMS.` },
  'calidad_ozono': { title: 'Calidad del aire en días malos (Ozono)', body: `100% = aire saludable. 0% = aire muy peligroso.` },
  'calificacion_aire': { title: 'Calificación general del aire', body: `Es una calificación total del aire. 100% = aire muy limpio. 0% = aire muy contaminado.` },
  'salud_acceso': { title: 'Condiciones de Salud y Acceso a Servicios Médicos', body: `La contaminación del aire es el mayor riesgo ambiental para la salud en el mundo. No todas las personas reaccionamos igual ante el mismo aire.` },
  'pob_sensible_edad': { title: 'Población sensible por edad', body: `Las infancias menores de 12 años y las personas mayores de 64 son especialmente vulnerables por razones biológicas.` },
  'diabetes': { title: 'Diabetes y calidad del aire', body: `Las personas con diabetes tienen mayor riesgo de complicaciones cardiovasculares cuando están expuestas al aire contaminado.` },
  'hipertension': { title: 'Hipertensión y calidad del aire', body: `Vivir en zonas con aire contaminado aumenta el riesgo de desarrollar hipertensión arterial.` },
  'respiratorias': { title: 'Enfermedades respiratorias crónicas', body: `La calidad del aire impacta directamente en los pulmones.` },
  'no_fuma': { title: 'Población que no fuma', body: `Fumar triplica el riesgo de muerte cuando se añade a mala calidad de aire.` },
  'acceso_salud': { title: 'Acceso efectivo al sistema de salud', body: `Combina derechohabiencia y disponibilidad/cercanía de servicios.` },
  'calificacion_salud': { title: 'Calificación general de salud', body: `Resume las condiciones de salud y acceso a servicios médicos.` },
  'socio_clima': { title: 'Condiciones Socioeconómicas y de Cambio Climático', body: `Hablar de aire es hablar de desigualdad.` },
  'desarrollo': { title: 'Desarrollo socioeconómico', body: `Considera factores como nivel de escolaridad y acceso a información.` },
  'frescura': { title: 'Frescura', body: `Evalúa la capacidad de una colonia para disipar el calor.` },
  'inundaciones': { title: 'Seguridad ante inundaciones', body: `El diseño urbano influye en la exposición a lluvias extremas.` },
  'resiliencia': { title: 'Resiliencia climática', body: `Integra frescura y seguridad ante inundaciones.` },
};

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
  const [showBird, setShowBird] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => { coloniaService.getAllColonias().then(d => { setAllColonias(d); setColoniasFiltradas(d); setLoading(false); }).catch(() => setLoading(false)); }, []);
  useEffect(() => { const cp = searchParams.get('cp'); if (cp && allColonias.length) coloniaService.getColoniaByCP(cp).then(c => { if (c) { setSelected(c); setSearchCP(cp); } }); }, [allColonias, searchParams]);
  useEffect(() => { setColoniasFiltradas(filtro === 'todos' ? allColonias : allColonias.filter(c => c.categoria_riesgo === filtro)); }, [filtro, allColonias]);
  useEffect(() => { if (!loading && !isMobile) { const t = setTimeout(() => setShowBird(true), 3000); return () => clearTimeout(t); } }, [loading, isMobile]);

  const search = async () => { if (!searchCP.trim()) return; const c = await coloniaService.getColoniaByCP(searchCP.trim()); if (c) { setFiltro('todos'); setSelected(c); } else alert('Código postal no encontrado'); };
  const fmt = (v: number | null | undefined) => v == null || isNaN(v) ? 'N/D' : `${(v * 100).toFixed(1)}%`;
  const cnt = (f: Filtro) => f === 'todos' ? allColonias.length : allColonias.filter(c => c.categoria_riesgo === f).length;
  const toggle = (k: string) => setTip(tip === k ? null : k);

  if (loading) return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, background: 'linear-gradient(170deg, #9DD0F3 0%, #7CB9E2 50%, #5A9FCC 100%)' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width: 48, height: 48, border: '4px solid rgba(255,255,255,0.2)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', fontFamily: "'Space Mono', monospace", letterSpacing: '1px' }}>Cargando mapa...</div>
    </div>
  );

  const cat = selected?.categoria_riesgo || 'medio';

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');

        .me-header {
          position: absolute; top: 0; left: 0; right: 0;
          background: linear-gradient(90deg, #6AADDA 0%, #7CB9E2 100%);
          padding: 12px 24px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.1);
          z-index: 10;
          display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;
        }
        .me-header-title { flex: 1; min-width: 200px; }
        .me-header-title h1 {
          margin: 0; font-family: 'Bebas Neue', sans-serif; font-size: 22px;
          font-weight: 400; color: #fff; letter-spacing: 2px;
        }
        .me-header-title p {
          margin: 2px 0 0; font-size: 11px; color: rgba(255,255,255,0.7);
          font-family: 'Space Mono', monospace;
        }
        .me-header-actions {
          display: flex; gap: 8px; align-items: center;
        }
        .me-search-input {
          padding: 8px 12px; border-radius: 8px; border: 1.5px solid rgba(255,255,255,0.3);
          font-size: 13px; width: 120px; font-family: 'Space Mono', monospace;
          background: rgba(255,255,255,0.15); color: #fff; backdrop-filter: blur(8px);
          outline: none;
        }
        .me-search-input::placeholder { color: rgba(255,255,255,0.5); }
        .me-header-btn {
          background-color: rgba(28,35,51,0.65); color: #fff; padding: 8px 16px; border-radius: 8px;
          border: 1.5px solid rgba(255,255,255,0.35); cursor: pointer; font-weight: 700;
          font-size: 12px; font-family: 'Space Mono', monospace; backdrop-filter: blur(8px);
        }
        .me-header-btn--light {
          background-color: rgba(255,255,255,0.12);
          border: 1.5px solid rgba(255,255,255,0.25);
        }

        /* ── Filters panel — desktop ── */
        .me-filters {
          position: absolute; bottom: 30px; left: 20px;
          background-color: white; padding: 12px 16px; border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 10;
          display: flex; flex-direction: column; gap: 8px;
        }

        /* ── Legend — desktop ── */
        .me-legend {
          position: absolute; bottom: 30px; left: 20px;
          background-color: white; padding: 12px 16px; border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 10;
        }

        /* ── Info panel — desktop ── */
        .me-info {
          position: absolute; top: 80px; right: 20px; width: 400px;
          max-height: calc(100vh - 110px); overflow-y: auto;
          background-color: white; border-radius: 12px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.2); z-index: 10;
          font-size: 13px; color: #1f2937; font-family: 'Space Mono', monospace;
        }

        /* ── Bird — desktop only ── */
        .me-bird {
          position: absolute; bottom: 280px; left: -25px;
          width: 300px; height: 180px; z-index: 5; pointer-events: none;
        }

        .me-map-container {
          width: 100%; height: 100%; padding-top: 66px;
        }
        @media (max-width: 768px) {
          .me-map-container { padding-top: 110px; }
        }
        .me-filters-fab {
          display: none;
        }

        /* ── Mobile ── */
        @media (max-width: 768px) {
          .me-header {
            flex-direction: column; align-items: stretch; gap: 8px; padding: 10px 16px;
          }
          .me-header-title h1 { font-size: 18px; }
          .me-header-title p { font-size: 10px; display: block; }
          .me-header-actions { width: 100%; flex-wrap: wrap; }
          .me-search-input { flex: 1; min-width: 0; width: auto; font-size: 12px; }

          /* Hide bird on mobile */
          .me-bird { display: none; }

          /* Filters: hidden by default, toggle via FAB */
          .me-filters {
            position: fixed;
            bottom: 80px;
            left: 12px;
            right: 12px;
            top: auto;
            border-radius: 12px;
            display: none;
            flex-direction: column;
            gap: 6px;
            padding: 14px;
            box-shadow: 0 -4px 20px rgba(0,0,0,0.25);
            max-height: 60vh;
            overflow-y: auto;
            z-index: 20;
          }
          .me-filters--open { display: flex; }
          .me-filters .me-filters-label {
            width: 100%;
            margin-bottom: 4px;
            font-size: 12px !important;
          }

          /* FAB for filters */
          .me-filters-fab {
            display: flex;
            position: fixed;
            bottom: 20px;
            left: 16px;
            width: 52px;
            height: 52px;
            border-radius: 50%;
            background: white;
            border: none;
            box-shadow: 0 4px 14px rgba(0,0,0,0.3);
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 25;
            font-size: 22px;
            font-weight: 700;
          }
      `}</style>

      {/* Header */}
      <div className="me-header">
        <div className="me-header-title">
          <h1>Mapa de Equidad y Resiliencia</h1>
          <p>CDMX y Zona Metropolitana — Aire, salud y acceso a servicios</p>
        </div>
        <div className="me-header-actions">
          <input
            type="text" placeholder="Buscar CP..." value={searchCP}
            onChange={e => setSearchCP(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && search()}
            className="me-search-input"
          />
          <button onClick={search} className="me-header-btn">Buscar</button>
          <button onClick={() => navigate('/')} className="me-header-btn me-header-btn--light">Inicio</button>
        </div>
      </div>

      {/* Filters FAB — mobile only */}
      <button className="me-filters-fab" onClick={() => setFiltersOpen(!filtersOpen)}>
        {filtersOpen ? '✕' : '☰'}
      </button>

      {/* Filters */}
      <div className={`me-filters ${filtersOpen || !isMobile ? '' : ''} ${isMobile && filtersOpen ? 'me-filters--open' : ''}`}
        style={!isMobile ? {} : (filtersOpen ? {} : { display: 'none' })}>
        <div className="me-filters-label" style={{ fontSize: 11, fontWeight: 700, color: '#374151', marginBottom: 4, fontFamily: "'Space Mono', monospace", letterSpacing: '0.5px' }}>
          Nivel de equidad y resiliencia
        </div>
        <FBtn label="Todos los CP" n={cnt('todos')} on={filtro === 'todos'} c="#6b7280" click={() => { setFiltro('todos'); if (isMobile) setFiltersOpen(false); }} />
        <FBtn label="Mejor" n={cnt('alto')} on={filtro === 'alto'} c="#4ade80" click={() => { setFiltro('alto'); if (isMobile) setFiltersOpen(false); }} />
        <FBtn label="Promedio" n={cnt('medio')} on={filtro === 'medio'} c="#fbbf24" click={() => { setFiltro('medio'); if (isMobile) setFiltersOpen(false); }} />
        <FBtn label="Bajo" n={cnt('bajo')} on={filtro === 'bajo'} c="#ef4444" click={() => { setFiltro('bajo'); if (isMobile) setFiltersOpen(false); }} />
        <FBtn label="Sin datos" n={cnt('sin_datos')} on={filtro === 'sin_datos'} c="#d1d5db" click={() => { setFiltro('sin_datos'); if (isMobile) setFiltersOpen(false); }} />  
      </div>

     

      {/* Map */}
      <div className="me-map-container">
        <MapView colonias={coloniasFiltradas} onColoniaClick={setSelected} selectedCP={selected?.codigo_postal} />
      </div>

      {/* Bird — desktop only (hidden on mobile via CSS) */}
      {showBird && (
        <div className="me-bird">
          <Suspense fallback={null}>
            <FrogBirdViewer width="300px" height="180px" autoRotateSpeed={0} backgroundColor={null} cameraDistance={2.8} animation="fly" />
          </Suspense>
        </div>
      )}

      {/* Info Panel */}
      {selected && (
        <div className="me-info">
          {/* Drag handle — mobile only */}
          <div className="me-info-drag" style={isMobile ? {} : { display: 'none' }}>
            <div className="me-info-drag-bar" />
          </div>

          <div style={{ padding: 20, borderBottom: '2px solid #e5e7eb', position: 'sticky', top: 0, backgroundColor: 'white', borderRadius: '12px 12px 0 0', zIndex: 2 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2 style={{ margin: '0 0 2px', fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, fontWeight: 400, letterSpacing: '1px', color: '#1f2937' }}>CP {selected.codigo_postal}</h2>
                {selected.colonias && <p style={{ margin: '0 0 2px', fontSize: 12, color: '#374151', wordBreak: 'break-word' }}>{selected.colonias}</p>}
                <p style={{ margin: 0, fontSize: 11, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{selected.municipio}, {selected.estado}</p>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#9ca3af', padding: '0 0 0 12px', lineHeight: 1, flexShrink: 0 }}>×</button>
            </div>
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 4, fontSize: 11, fontWeight: 700, color: 'white', backgroundColor: CUMPL_COLORS[cat] || '#6b7280', letterSpacing: '0.5px' }}>
                {cat === 'alto' ? 'Mejor equidad' : `Equidad ${CUMPL_LABEL[cat]}`}
              </span>
              <IB k={`cumplimiento_${cat}`} a={tip} t={toggle} />
              <span style={{ fontSize: 12, color: '#374151' }}>Índice: {fmt(selected.indice_resumen)}</span>
              <IB k="indice_equidad" a={tip} t={toggle} />
            </div>
            <p style={{ margin: '8px 0 0', fontSize: 11, color: '#6b7280' }}>Población: {selected.poblacion_total?.toLocaleString() || ''}</p>
          </div>

          <div style={{ padding: '16px 20px' }}>
            <Sec title="EXPOSICIÓN A CONTAMINANTES" ik="contaminantes" a={tip} t={toggle} />
            <Row l="Días aire limpio (PM2.5)" v={fmt(selected.dias_aire_limpio_pm25)} ik="dias_pm25" a={tip} t={toggle} />
            <Row l="Calidad días malos (PM2.5)" v={fmt(selected.concentracion_alta_pm25)} ik="calidad_pm25" a={tip} t={toggle} />
            <Row l="Días aire limpio (Ozono)" v={fmt(selected.dias_aire_limpio_ozono)} ik="dias_ozono" a={tip} t={toggle} />
            <Row l="Calidad días malos (Ozono)" v={fmt(selected.concentracion_alta_ozono)} ik="calidad_ozono" a={tip} t={toggle} />
            <Row l="Calificación general aire" v={fmt(selected.subindice_aire)} ik="calificacion_aire" a={tip} t={toggle} />
            <Sep />
            <Sec title="SALUD Y ACCESO A SERVICIOS" ik="salud_acceso" a={tip} t={toggle} />
            <Row l="Población sensible (edad)" v={fmt(selected.poblacion_sensible)} ik="pob_sensible_edad" a={tip} t={toggle} />
            <Row l="Sin diabetes" v={fmt(selected.pob_sin_diabetes)} ik="diabetes" a={tip} t={toggle} />
            <Row l="Sin hipertensión" v={fmt(selected.pob_sin_hipertension)} ik="hipertension" a={tip} t={toggle} />
            <Row l="Sin enf. respiratorias" v={fmt(selected.pob_sin_enf_respiratorias)} ik="respiratorias" a={tip} t={toggle} />
            <Row l="No fuma" v={fmt(selected.pob_no_fumadores)} ik="no_fuma" a={tip} t={toggle} />
            <Row l="Acceso a salud" v={fmt(selected.indice_infraestructura_sanitaria)} ik="acceso_salud" a={tip} t={toggle} />
            <Row l="Calificación salud" v={fmt(selected.subindice_salud)} ik="calificacion_salud" a={tip} t={toggle} />
            <Sep />
            <Sec title="SOCIOECONÓMICO Y CAMBIO CLIMÁTICO" ik="socio_clima" a={tip} t={toggle} />
            <Row l="Desarrollo socioeconómico" v={fmt(selected.subindice_socioeconomico)} ik="desarrollo" a={tip} t={toggle} />
            <Row l="Frescura" v={fmt(selected.indice_frescura)} ik="frescura" a={tip} t={toggle} />
            <Row l="Seguridad inundaciones" v={fmt(selected.seguridad_inundaciones)} ik="inundaciones" a={tip} t={toggle} />
            <Row l="Resiliencia climática" v={fmt(selected.subindice_cambio_climatico)} ik="resiliencia" a={tip} t={toggle} />
          </div>
        </div>
      )}

      {/* Tooltip Modal */}
      {tip && TT[tip] && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }} onClick={() => setTip(null)}>
          <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 24, maxWidth: 480, maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', fontFamily: "'Space Mono', monospace" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #7CB9E2, #5A9FCC)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 'bold', color: '#fff', flexShrink: 0 }}>i</div>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>{TT[tip].title}</h3>
              </div>
              <button onClick={() => setTip(null)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#9ca3af', padding: 0, lineHeight: 1 }}>×</button>
            </div>
            <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{TT[tip].body}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sub-components ──
function IB({ k, a, t }: { k: string; a: string | null; t: (k: string) => void }) {
  const on = a === k;
  return <button onClick={() => t(k)} style={{ width: 20, height: 20, borderRadius: 4, border: 'none', cursor: 'pointer', backgroundColor: on ? '#7CB9E2' : '#3b82f6', color: '#fff', fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: "'Space Mono', monospace" }}>i</button>;
}
function Sec({ title, ik, a, t }: { title: string; ik: string; a: string | null; t: (k: string) => void }) {
  return <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, marginTop: 4 }}><h3 style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#111827', letterSpacing: '0.5px', fontFamily: "'Space Mono', monospace" }}>{title}</h3><IB k={ik} a={a} t={t} /></div>;
}
function Row({ l, v, ik, a, t }: { l: string; v: string; ik?: string; a?: string | null; t?: (k: string) => void }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '7px 0', borderBottom: '1px solid #e5e7eb' }}>
      <div style={{ flex: 1, paddingRight: 12, minWidth: 0 }}>
        <span style={{ fontSize: 12, color: '#374151', display: 'block', fontFamily: "'Space Mono', monospace" }}>{l}</span>
        {ik && t && <div style={{ marginTop: 4 }}><IB k={ik} a={a!} t={t} /></div>}
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color: '#111827', flexShrink: 0, paddingTop: 1, fontFamily: "'Space Mono', monospace" }}>{v}</span>
    </div>
  );
}
function Sep() { return <div style={{ height: 8, borderBottom: '2px solid #111827', marginBottom: 12 }} />; }
function FBtn({ label, n, on, c, click }: { label: string; n: number; on: boolean; c: string; click: () => void }) {
  return (
    <button onClick={click} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, border: on ? `2px solid ${c}` : '2px solid transparent', backgroundColor: on ? `${c}15` : 'transparent', cursor: 'pointer', width: '100%', fontFamily: "'Space Mono', monospace" }}>
      <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: c }} />
      <span style={{ fontSize: 12, fontWeight: on ? 700 : 400, color: '#374151', flex: 1, textAlign: 'left' }}>{label}</span>
      <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 500 }}>{n.toLocaleString()}</span>
    </button>
  );
}