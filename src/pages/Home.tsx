import { useNavigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import logoSur from '../assets/Logo_SUR25.svg';

// Lazy load para que solo se cargue en Home
const Bird3DCanvas = lazy(() => import('../components/Bird/Bird3DCanvas'));

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom, #e0f2fe, #e5e7eb)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{ 
        width: '100%',
        maxWidth: '896px',
        backgroundColor: 'white',
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{ 
          backgroundColor: '#6b7280',
          color: 'white',
          padding: '24px',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '30px', fontWeight: 'bold', margin: 0 }}>
            Pájaros de Ciudad
          </h1>
        </div>

        {/* Content */}
        <div style={{ padding: '48px' }}>
          <div style={{ 
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '32px',
            flexWrap: 'wrap'
          }}>
            {/* Modelo 3D */}
            <div style={{ 
              flex: '1',
              minWidth: '300px',
              height: '400px'
            }}>
              <Suspense fallback={<div style={{ width: '100%', height: '400px' }}></div>}>
                <Bird3DCanvas modelPath="/models/birb.glb" />
              </Suspense>
            </div>
            
            {/* Texto y botones */}
            <div style={{ flex: '1', minWidth: '300px' }}>
              <p style={{ 
                color: '#374151',
                fontSize: '18px',
                lineHeight: '1.75',
                marginBottom: '32px'
              }}>
                Respiramos el mismo aire, pero no nos afecta igual. Descubre cómo recibes el aire en tu día a día
                y qué puedes hacer para cuidarte.
              </p>

              <div style={{ 
                display: 'flex',
                gap: '16px',
                flexDirection: 'column'
              }}>
                <button
                  onClick={() => navigate('/quiz')}
                  style={{
                    backgroundColor: '#fbbf24',
                    color: '#111827',
                    fontWeight: 'bold',
                    padding: '16px 32px',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '18px',
                    cursor: 'pointer',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  Hacer test
                </button>
                
                <button
                  onClick={() => {
                    window.location.href = '/map';
                  }}
                  style={{
                    backgroundColor: '#fbbf24',
                    color: '#111827',
                    fontWeight: 'bold',
                    padding: '16px 32px',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '18px',
                    cursor: 'pointer',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  Explorar mapa
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ 
          backgroundColor: '#f9fafb',
          padding: '24px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '32px',
          borderTop: '1px solid #e5e7eb',
          flexWrap: 'wrap'
        }}>
          <img 
            src={logoSur} 
            alt="Instituto del Sur Urbano" 
            style={{ height: '40px' }}
          />
          <div style={{ color: '#4b5563', fontWeight: '600' }}>
            Breathe Cities
          </div>
        </div>
      </div>
    </div>
  );
}