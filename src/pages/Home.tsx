import { useNavigate } from 'react-router-dom';
import { Suspense, lazy, useState, useEffect } from 'react';
import logoSur from '../assets/Logo_SUR25.svg';
import '@fontsource/playfair-display/400.css';
import '@fontsource/playfair-display/600.css';
import '@fontsource/lora/400.css';
import '@fontsource/lora/600.css';

const Bird3DCanvas = lazy(() => import('../components/Bird/Bird3DCanvas'));

export default function Home() {
  const navigate = useNavigate();
  const [textPhase, setTextPhase] = useState(0);
  const [showButtons, setShowButtons] = useState(false);

  // Animación del texto
  useEffect(() => {
    const timers = [
      setTimeout(() => setTextPhase(1), 500),      // "Respiramos el mismo"
      setTimeout(() => setTextPhase(2), 1500),     // "aire..."
      setTimeout(() => setTextPhase(3), 2500),     // "Pero no nos afecta"
      setTimeout(() => setTextPhase(4), 3500),     // "igual."
      setTimeout(() => setShowButtons(true), 4200) // Mostrar botones
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#F5F0E8',
      fontFamily: 'Lora, serif'
    }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 40px',
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <img 
          src={logoSur} 
          alt="Sur" 
          style={{ height: '45px' }}
        />
        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '24px',
          fontWeight: 400,
          color: '#A62C2B',
          letterSpacing: '12px',
          margin: 0
        }}>
          AIRE LIBRE
        </h1>
      </header>

      {/* Main Content */}
      <main style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 86px)',
        padding: '40px'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1200px',
          width: '100%',
          gap: '60px',
          flexWrap: 'wrap'
        }}>
          {/* Texto animado */}
          <div style={{ 
            flex: '1',
            minWidth: '300px',
            maxWidth: '500px'
          }}>
            <div style={{
              fontSize: '42px',
              fontWeight: 600,
              color: '#A62C2B',
              lineHeight: 1.3,
              fontFamily: 'Lora, serif'
            }}>
              <span style={{
                opacity: textPhase >= 1 ? 1 : 0,
                transition: 'opacity 0.6s ease-in-out',
                display: 'block'
              }}>
                Respiramos el mismo
              </span>
              <span style={{
                opacity: textPhase >= 2 ? 1 : 0,
                transition: 'opacity 0.6s ease-in-out',
                display: 'block'
              }}>
                aire...
              </span>
              <span style={{
                opacity: textPhase >= 3 ? 1 : 0,
                transition: 'opacity 0.6s ease-in-out',
                display: 'block',
                marginTop: '16px'
              }}>
                Pero no nos afecta
              </span>
              <span style={{
                opacity: textPhase >= 4 ? 1 : 0,
                transition: 'opacity 0.6s ease-in-out',
                display: 'block'
              }}>
                igual.
              </span>
            </div>

            {/* Botones */}
            <div style={{
              display: 'flex',
              gap: '20px',
              marginTop: '40px',
              opacity: showButtons ? 1 : 0,
              transform: showButtons ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.6s ease-in-out, transform 0.6s ease-in-out'
            }}>
              <button
                onClick={() => navigate('/quiz')}
                style={{
                  backgroundColor: '#fbbf24',
                  color: '#111827',
                  fontFamily: 'Lora, serif',
                  fontWeight: 600,
                  padding: '14px 32px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '16px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                }}
              >
                Hacer test
              </button>
              
              <button
                onClick={() => {
                  window.location.href = '/map';
                }}
                style={{
                  backgroundColor: 'transparent',
                  color: '#A62C2B',
                  fontFamily: 'Lora, serif',
                  fontWeight: 600,
                  padding: '14px 32px',
                  borderRadius: '8px',
                  border: '2px solid #A62C2B',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s, color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#A62C2B';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#A62C2B';
                }}
              >
                Explorar mapa
              </button>
            </div>
          </div>

          {/* Birb 3D */}
          <div style={{ 
            flex: '1',
            minWidth: '300px',
            maxWidth: '500px',
            height: '450px'
          }}>
            <Suspense fallback={<div style={{ width: '100%', height: '450px' }}></div>}>
              <Bird3DCanvas modelPath="/models/birb.glb" />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}