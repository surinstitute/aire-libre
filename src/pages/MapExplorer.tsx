import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MapView from '../components/Map/MapView';
import { coloniaService } from '../services/coloniaService';
import type { Colonia } from '../types';

type FiltroRiesgo = 'todos' | 'bajo' | 'medio' | 'alto';

export default function MapExplorer() {
  const navigate = useNavigate();
  const [allColonias, setAllColonias] = useState<Colonia[]>([]);
  const [coloniasFiltradas, setColoniasFiltradas] = useState<Colonia[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedColonia, setSelectedColonia] = useState<Colonia | null>(null);
  const [searchCP, setSearchCP] = useState('');
  const [filtroRiesgo, setFiltroRiesgo] = useState<FiltroRiesgo>('todos');

  // Cargar datos iniciales
  useEffect(() => {
    coloniaService.getAllColonias()
      .then(data => {
        setAllColonias(data);
        setColoniasFiltradas(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error cargando colonias:', error);
        setLoading(false);
      });
  }, []);

  // Aplicar filtro cuando cambia
  useEffect(() => {
    if (filtroRiesgo === 'todos') {
      setColoniasFiltradas(allColonias);
    } else {
      setColoniasFiltradas(allColonias.filter(c => c.categoria_riesgo === filtroRiesgo));
    }
  }, [filtroRiesgo, allColonias]);

  // Buscar por código postal
  const handleSearch = async () => {
    if (!searchCP.trim()) return;
    
    const colonia = await coloniaService.getColoniaByCP(searchCP.trim());
    if (colonia) {
      // IMPORTANTE: Resetear filtro a "todos" para asegurar que el CP sea visible
      setFiltroRiesgo('todos');
      setSelectedColonia(colonia);
    } else {
      alert('Código postal no encontrado');
    }
  };

  // Formatear porcentaje
  const formatPct = (val: number) => `${(val * 100).toFixed(1)}%`;

  // Color según categoría
  const getRiesgoColor = (categoria: string) => {
    switch (categoria) {
      case 'alto': return '#ef4444';
      case 'medio': return '#fbbf24';
      case 'bajo': return '#4ade80';
      default: return '#6b7280';
    }
  };

  // Contar por categoría
  const contarPorCategoria = (categoria: FiltroRiesgo) => {
    if (categoria === 'todos') return allColonias.length;
    return allColonias.filter(c => c.categoria_riesgo === categoria).length;
  };

  if (loading) {
    return (
      <div style={{ 
        width: '100vw', 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ 
          width: '48px', 
          height: '48px', 
          border: '4px solid #e5e7eb',
          borderTopColor: '#fbbf24',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ fontSize: '18px', color: '#6b7280' }}>Cargando mapa...</div>
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* Header */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        padding: '12px 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap'
      }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold', color: '#1f2937' }}>
          Mapa de Calidad del Aire - CDMX y Área Metropolitana
        </h1>

        {/* Buscador de CP */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Buscar CP..."
            value={searchCP}
            onChange={(e) => setSearchCP(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              fontSize: '14px',
              width: '120px'
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              backgroundColor: '#fbbf24',
              color: '#111827',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px'
            }}
          >
            Buscar
          </button>
        </div>

        <button
          onClick={() => navigate('/')}
          style={{
            backgroundColor: '#6b7280',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px'
          }}
        >
          Volver al inicio
        </button>
      </div>

      {/* Filtros por nivel de riesgo */}
      <div style={{
        position: 'absolute',
        top: '70px',
        left: '20px',
        backgroundColor: 'white',
        padding: '12px 16px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <div style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
          Filtrar por riesgo
        </div>
        
        <FilterButton 
          label="Todos" 
          count={contarPorCategoria('todos')}
          isActive={filtroRiesgo === 'todos'}
          color="#6b7280"
          onClick={() => setFiltroRiesgo('todos')}
        />
        <FilterButton 
          label="Bajo" 
          count={contarPorCategoria('bajo')}
          isActive={filtroRiesgo === 'bajo'}
          color="#4ade80"
          onClick={() => setFiltroRiesgo('bajo')}
        />
        <FilterButton 
          label="Medio" 
          count={contarPorCategoria('medio')}
          isActive={filtroRiesgo === 'medio'}
          color="#fbbf24"
          onClick={() => setFiltroRiesgo('medio')}
        />
        <FilterButton 
          label="Alto" 
          count={contarPorCategoria('alto')}
          isActive={filtroRiesgo === 'alto'}
          color="#ef4444"
          onClick={() => setFiltroRiesgo('alto')}
        />
      </div>

      {/* Mapa */}
      <div style={{ 
        width: '100%', 
        height: '100%', 
        paddingTop: '60px' 
      }}>
        <MapView 
          colonias={coloniasFiltradas}
          onColoniaClick={setSelectedColonia}
          selectedCP={selectedColonia?.codigo_postal}
        />
      </div>

      {/* Panel de información */}
      {selectedColonia && (
        <div style={{
          position: 'absolute',
          top: '70px',
          right: '20px',
          width: '360px',
          maxHeight: 'calc(100vh - 100px)',
          overflowY: 'auto',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          zIndex: 10
        }}>
          {/* Header del panel */}
          <div style={{ 
            padding: '20px', 
            borderBottom: '1px solid #e5e7eb',
            position: 'sticky',
            top: 0,
            backgroundColor: 'white',
            borderRadius: '12px 12px 0 0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <h2 style={{ margin: '0 0 4px 0', fontSize: '22px', color: '#111827' }}>
                  CP {selectedColonia.codigo_postal}
                </h2>
                <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                  {selectedColonia.municipio}, {selectedColonia.estado}
                </p>
              </div>
              <button
                onClick={() => setSelectedColonia(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: 0,
                  lineHeight: 1,
                  color: '#9ca3af'
                }}
              >
                ×
              </button>
            </div>

            {/* Badge de riesgo */}
            <div style={{ marginTop: '12px' }}>
              <span style={{
                display: 'inline-block',
                padding: '6px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 'bold',
                color: 'white',
                backgroundColor: getRiesgoColor(selectedColonia.categoria_riesgo)
              }}>
                Riesgo {selectedColonia.categoria_riesgo.toUpperCase()}
              </span>
              <span style={{ 
                marginLeft: '12px', 
                fontSize: '14px', 
                color: '#6b7280' 
              }}>
                Índice: {(selectedColonia.indice_resumen * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Contenido del panel */}
          <div style={{ padding: '20px' }}>
            
            {/* Exposición a contaminantes */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ 
                fontSize: '13px', 
                fontWeight: '600', 
                color: '#6b7280', 
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Exposición a Contaminantes
              </h3>
              <div style={{ display: 'grid', gap: '8px' }}>
                <InfoRow label="Días con aire limpio (PM2.5)" value={formatPct(selectedColonia.dias_aire_limpio_pm25)} />
                <InfoRow label="Días con aire limpio (Ozono)" value={formatPct(selectedColonia.dias_aire_limpio_ozono)} />
                <InfoRow label="Concentración alta PM2.5" value={formatPct(selectedColonia.concentracion_alta_pm25)} warning />
                <InfoRow label="Concentración alta Ozono" value={formatPct(selectedColonia.concentracion_alta_ozono)} warning />
                <InfoRow label="Subíndice de aire" value={formatPct(selectedColonia.subindice_aire)} />
              </div>
            </div>

            {/* Condiciones de salud */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ 
                fontSize: '13px', 
                fontWeight: '600', 
                color: '#6b7280', 
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Condiciones de Salud en la Zona
              </h3>
              <div style={{ display: 'grid', gap: '8px' }}>
                <InfoRow label="Pob. sin diabetes" value={formatPct(selectedColonia.pob_sin_diabetes)} />
                <InfoRow label="Pob. sin hipertensión" value={formatPct(selectedColonia.pob_sin_hipertension)} />
                <InfoRow label="Pob. sin enf. respiratorias" value={formatPct(selectedColonia.pob_sin_enf_respiratorias)} />
                <InfoRow label="Pob. sin enf. cardiovasculares" value={formatPct(selectedColonia.pob_sin_enf_cardiovasculares)} />
                <InfoRow label="Subíndice de salud" value={formatPct(selectedColonia.subindice_salud)} />
              </div>
            </div>

            {/* Población */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ 
                fontSize: '13px', 
                fontWeight: '600', 
                color: '#6b7280', 
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Población
              </h3>
              <div style={{ display: 'grid', gap: '8px' }}>
                <InfoRow label="Población total" value={selectedColonia.poblacion_total?.toLocaleString() || 'N/A'} />
                <InfoRow label="Población sensible" value={formatPct(selectedColonia.poblacion_sensible)} />
                <InfoRow label="Pob. no fumadores" value={formatPct(selectedColonia.pob_no_fumadores)} />
              </div>
            </div>

            {/* Acceso a salud */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ 
                fontSize: '13px', 
                fontWeight: '600', 
                color: '#6b7280', 
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Acceso a Servicios de Salud
              </h3>
              <div style={{ display: 'grid', gap: '8px' }}>
                <InfoRow label="Pob. derechohabiente" value={formatPct(selectedColonia.pob_derechohabiente)} />
                <InfoRow label="Infraestructura sanitaria" value={formatPct(selectedColonia.indice_infraestructura_sanitaria)} />
              </div>
            </div>

            {/* Socioeconómica */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ 
                fontSize: '13px', 
                fontWeight: '600', 
                color: '#6b7280', 
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Indicadores Socioeconómicos
              </h3>
              <div style={{ display: 'grid', gap: '8px' }}>
                <InfoRow label="Años de escolaridad" value={formatPct(selectedColonia.anos_escolaridad)} />
                <InfoRow label="Viviendas con internet" value={formatPct(selectedColonia.viviendas_internet)} />
                <InfoRow label="Viviendas con lavadora" value={formatPct(selectedColonia.viviendas_lavadora)} />
                <InfoRow label="Viviendas con refrigerador" value={formatPct(selectedColonia.viviendas_refrigerador)} />
                <InfoRow label="Subíndice socioeconómico" value={formatPct(selectedColonia.subindice_socioeconomico)} />
              </div>
            </div>

            {/* Índices finales */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ 
                fontSize: '13px', 
                fontWeight: '600', 
                color: '#6b7280', 
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Índices de Desarrollo
              </h3>
              <div style={{ display: 'grid', gap: '8px' }}>
                <InfoRow label="Índice de desarrollo" value={formatPct(selectedColonia.indice_desarrollo)} />
                <InfoRow label="Prioridad sensible" value={formatPct(selectedColonia.indice_prioridad_sensible)} />
              </div>
            </div>

            {/* Colonias */}
            {selectedColonia.colonias && (
              <div>
                <h3 style={{ 
                  fontSize: '13px', 
                  fontWeight: '600', 
                  color: '#6b7280', 
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Colonias en este CP
                </h3>
                <p style={{ 
                  fontSize: '13px', 
                  color: '#374151', 
                  lineHeight: '1.6',
                  margin: 0 
                }}>
                  {selectedColonia.colonias}
                </p>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}

// Componente de botón de filtro
function FilterButton({ 
  label, 
  count, 
  isActive, 
  color, 
  onClick 
}: { 
  label: string; 
  count: number; 
  isActive: boolean; 
  color: string; 
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 12px',
        borderRadius: '8px',
        border: isActive ? `2px solid ${color}` : '2px solid transparent',
        backgroundColor: isActive ? `${color}15` : 'transparent',
        cursor: 'pointer',
        transition: 'all 0.2s',
        width: '100%'
      }}
    >
      <div style={{ 
        width: '12px', 
        height: '12px', 
        borderRadius: '50%', 
        backgroundColor: color 
      }} />
      <span style={{ 
        fontSize: '13px', 
        fontWeight: isActive ? '600' : '400',
        color: '#374151',
        flex: 1,
        textAlign: 'left'
      }}>
        {label}
      </span>
      <span style={{ 
        fontSize: '12px', 
        color: '#9ca3af',
        fontWeight: '500'
      }}>
        {count.toLocaleString()}
      </span>
    </button>
  );
}

// Componente de fila de información
function InfoRow({ label, value, warning = false }: { label: string; value: string; warning?: boolean }) {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '6px 0',
      borderBottom: '1px solid #f3f4f6'
    }}>
      <span style={{ fontSize: '13px', color: '#374151' }}>{label}</span>
      <span style={{ 
        fontSize: '13px', 
        fontWeight: '600', 
        color: warning ? '#ef4444' : '#111827' 
      }}>
        {value}
      </span>
    </div>
  );
}
