import { useNavigate } from 'react-router-dom';
import { useState, useEffect, Suspense, lazy } from 'react';

const HomeModel3D = lazy(() => import('../components/Bird/FrogBirdViewer'));

export default function Home() {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [anim, setAnim] = useState<'idle' | 'fly'>('idle');

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Keyboard: 1 = idle, 2 = surprise
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '1') setAnim('idle');
      if (e.key === '2') setAnim('fly');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className={`hp ${loaded ? 'hp--in' : ''}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Lilita+One&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap');

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        .hp {
          min-height: 100vh;
          background:
            radial-gradient(ellipse 80% 60% at 42% 48%, rgba(255,255,255,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 50% 70% at 80% 70%, rgba(74,141,191,0.2) 0%, transparent 50%),
            radial-gradient(ellipse 60% 50% at 15% 30%, rgba(157,208,243,0.25) 0%, transparent 50%),
            linear-gradient(170deg, #9DD0F3 0%, #7CB9E2 30%, #6AADDA 60%, #5A9FCC 100%);
          font-family: 'Space Mono', monospace;
          position: relative;
          overflow: hidden;
        }

        /* ── Desktop: absolute positioning (unchanged) ── */
        .hp-hero {
          position: relative;
          width: 100%;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hp-title {
          position: absolute;
          font-weight: 400;
          color: #fff;
          text-transform: uppercase;
          line-height: 0.88;
          margin: 0;
          user-select: none;
        }

        .hp-title--aire {
          font-family: 'Lilita One', cursive;
          font-size: clamp(120px, 16vw, 220px);
          right: 55%;
          top: 20%;
          z-index: 3;
          letter-spacing: 2px;
          opacity: 0;
          transform: translateX(-50px);
          transition: opacity 0.9s ease 0.15s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s;
        }
        .hp--in .hp-title--aire { opacity: 1; transform: translateX(0); }

        .hp-title--libre {
          font-family: 'Bebas Neue', 'Impact', sans-serif;
          font-size: clamp(100px, 13vw, 190px);
          left: 53%;
          top: 24%;
          z-index: 3;
          letter-spacing: 2px;
          opacity: 0;
          transform: translateX(50px);
          transition: opacity 0.9s ease 0.25s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.25s;
        }
        .hp--in .hp-title--libre { opacity: 1; transform: translateX(0); }

        .hp-model {
          position: absolute;
          left: 45%; top: 46%;
          transform: translate(-50%, -50%);
          width: clamp(300px, 38vw, 500px);
          height: clamp(280px, 36vw, 460px);
          z-index: 8;
          opacity: 0;
          transition: opacity 0.8s ease 0.35s;
        }
        .hp--in .hp-model { opacity: 1; }

        .hp-desc {
          position: absolute; left: 8%; top: 56%;
          font-family: 'Space Mono', monospace;
          font-size: 14px; font-weight: 700; color: #fff;
          line-height: 1.9; letter-spacing: 0.8px;
          text-transform: uppercase; max-width: 310px;
          z-index: 4; opacity: 0; transform: translateY(16px);
          transition: opacity 0.6s ease 0.55s, transform 0.6s ease 0.55s;
        }
        .hp--in .hp-desc { opacity: 0.85; transform: translateY(0); }

        .hp-ctas {
          position: absolute;
          left: 50%; top: 62%;
          transform: translateX(-50%) translateY(16px);
          display: flex; gap: 12px; z-index: 12;
          opacity: 0;
          transition: opacity 0.6s ease 0.65s, transform 0.6s ease 0.65s;
        }
        .hp--in .hp-ctas { opacity: 1; transform: translateX(-50%) translateY(0); }

        .hp-btn {
          padding: 12px 24px; border-radius: 8px;
          border: 1.5px solid rgba(255,255,255,0.35);
          background: rgba(28,35,51,0.65);
          backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
          color: #fff; font-family: 'Space Mono', monospace;
          font-size: 12.5px; font-weight: 700; letter-spacing: 0.6px;
          cursor: pointer; transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .hp-btn:hover {
          background: rgba(255,255,255,0.14);
          border-color: rgba(255,255,255,0.6);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }

        .hp-tagline {
          position: absolute; bottom: 14%; left: 50%;
          transform: translateX(-50%);
          font-family: 'Space Mono', monospace;
          font-size: 18px; font-weight: 700; font-style: italic;
          color: #fff; letter-spacing: 0.5px; white-space: normal; text-align: center;
          max-width: 520px;
          z-index: 10; opacity: 0;
          transition: opacity 0.6s ease 0.8s;
        }
        .hp--in .hp-tagline { opacity: 0.9; }

        .hp-quote {
          position: absolute; right: 8%; bottom: 8%;
          font-family: 'Space Mono', monospace;
          font-size: 16px; font-weight: 700; color: #fff;
          letter-spacing: 1.5px; text-transform: uppercase;
          line-height: 2; text-align: right; max-width: 300px;
          z-index: 10; opacity: 0; transform: translateY(12px);
          transition: opacity 0.6s ease 0.9s, transform 0.6s ease 0.9s;
        }
        .hp--in .hp-quote { opacity: 0.8; transform: translateY(0); }

        @media (max-width: 1100px) {
          .hp-title--aire { right: 52%; top: 22%; }
          .hp-title--libre { left: 48%; top: 26%; }
          .hp-desc { left: 6%; }
        }

        /* ── Mobile: flex column layout ── */
        @media (max-width: 768px) {
          .hp-hero {
            height: auto;
            min-height: 100vh;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            padding: 24px 20px 40px;
          }

          /* Titles — side by side at top */
          .hp-titles-row {
            display: flex;
            align-items: baseline;
            justify-content: center;
            gap: 12px;
            width: 100%;
            margin-bottom: 0;
            position: relative;
            z-index: 3;
          }

          .hp-title {
            position: relative;
            top: auto; left: auto; right: auto; bottom: auto;
          }

          .hp-title--aire {
            font-size: clamp(64px, 18vw, 100px) !important;
            right: auto;
            top: auto;
          }
          .hp-title--libre {
            font-size: clamp(52px, 15vw, 88px) !important;
            left: auto;
            top: auto;
          }

          /* Model — centered, no overlap */
          .hp-model {
            position: relative;
            left: auto; top: auto;
            transform: none;
            width: clamp(220px, 55vw, 300px);
            height: clamp(200px, 50vw, 280px);
            margin: -8px auto 0;
            z-index: 8;
          }

          /* Description — flows below model */
          .hp-desc {
            position: relative;
            left: auto; top: auto;
            text-align: center;
            max-width: 320px;
            font-size: 11px;
            line-height: 1.7;
            margin: 0 auto 20px;
            transform: none;
          }
          .hp--in .hp-desc { transform: none; }

          /* CTAs — below description */
          .hp-ctas {
            position: relative;
            left: auto; top: auto;
            transform: none;
            margin: 0 auto 20px;
          }
          .hp--in .hp-ctas { transform: none; }

          /* Tagline */
          .hp-tagline {
            position: relative;
            left: auto; bottom: auto;
            transform: none;
            font-size: 13px;
            max-width: 340px;
            margin: 0 auto 16px;
          }

          /* Quote */
          .hp-quote {
            position: relative;
            right: auto; bottom: auto;
            transform: none;
            text-align: center;
            font-size: 10px;
            line-height: 1.8;
            max-width: 300px;
            margin: 0 auto;
          }
          .hp--in .hp-quote { transform: none; }
        }
      `}</style>

      <div className="hp-hero">
        {/* Mobile: titles in a row wrapper; Desktop: absolute positioned */}
        <div className="hp-titles-row">
          <h1 className="hp-title hp-title--aire">AIRE</h1>
          <h1 className="hp-title hp-title--libre">LIBRE</h1>
        </div>

        <div className="hp-model">
          <Suspense fallback={
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{
                width: 36, height: 36,
                border: '3px solid rgba(255,255,255,0.2)',
                borderTopColor: '#fff',
                borderRadius: '50%',
                animation: 'hp-spin 1s linear infinite',
              }} />
              <style>{`@keyframes hp-spin{to{transform:rotate(360deg)}}`}</style>
            </div>
          }>
            <HomeModel3D
              width="100%"
              height="100%"
              autoRotateSpeed={0}
              backgroundColor={null}
              cameraDistance={2}
              animation={anim}
            />
          </Suspense>
        </div>

        <p className="hp-desc">
          Descubre como el aire, la salud y<br />
          el acceso a servicios indican<br />
          dónde el riesgo se acumula.
        </p>

        <div className="hp-ctas">
          <button className="hp-btn" onClick={() => navigate('/map')}>Ver mapa</button>
          <button className="hp-btn" onClick={() => navigate('/quiz')}>Hacer test</button>
        </div>

        <p className="hp-tagline">conoce tu nivel de riesgo en diferentes puntos de la ciudad</p>

        <p className="hp-quote">
          Porque vivir bajo el mismo<br />
          cielo no significa estar<br />
          igual de protegidos.
        </p>
      </div>
    </div>
  );
}
