import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import logoSur from '../assets/Logo_SUR25.svg';

export default function Home() {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  const NAV = [
    { label: 'MAPA', route: '/map' },
    { label: 'TEST', route: '/quiz' },
    { label: 'PREGUNTAS POSIBLES', route: '/faq' },
    { label: 'ACERCA DE AIRE LIBRE', route: '/about' },
    { label: 'RECURSOS', route: '/resources' },
  ];

  return (
    <div className={`hp ${loaded ? 'hp--in' : ''}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Mono:ital,wght@0,400;0,700;1,700&display=swap');

        /* ── Reset ── */
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        .hp {
          --blue: #7CB9E2;
          --blue-dark: #5FA3D4;
          --blue-deep: #4A8DBF;
          --white: #fff;
          --dark: #1C2333;

          min-height: 100vh;
          /* layered gradient for depth */
          background:
            radial-gradient(ellipse 80% 60% at 42% 48%, rgba(255,255,255,0.09) 0%, transparent 60%),
            radial-gradient(ellipse 50% 70% at 80% 70%, rgba(74,141,191,0.25) 0%, transparent 50%),
            radial-gradient(ellipse 60% 50% at 15% 30%, rgba(157,208,243,0.3) 0%, transparent 50%),
            linear-gradient(170deg, #9DD0F3 0%, #7CB9E2 30%, #6AADDA 60%, #5A9FCC 100%);
          font-family: 'Space Mono', monospace;
          position: relative;
          overflow: hidden;
        }

        /* ═══ NAVBAR ═══ */
        .hp-nav {
          position: absolute;
          top: 0; left: 0; right: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 40px;
          z-index: 50;
          opacity: 0;
          transform: translateY(-12px);
          transition: opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s;
        }
        .hp--in .hp-nav { opacity: 1; transform: translateY(0); }

        .hp-nav ul {
          display: flex; gap: 32px;
          list-style: none;
        }
        .hp-nav-btn {
          background: none; border: none;
          color: var(--white);
          font-family: 'Space Mono', monospace;
          font-size: 11px; font-weight: 700;
          letter-spacing: 1.4px;
          text-transform: uppercase;
          cursor: pointer;
          padding: 4px 0;
          position: relative;
          opacity: 0.85;
          transition: opacity 0.25s;
        }
        .hp-nav-btn:hover { opacity: 1; }
        .hp-nav-btn::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 0; height: 1.5px;
          background: var(--white);
          transition: width 0.25s ease;
        }
        .hp-nav-btn:hover::after { width: 100%; }

        .hp-logo { height: 38px; opacity: 0.92; }

        /* ═══ HERO COMPOSITION ═══ */
        .hp-hero {
          position: relative;
          width: 100%;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /*
         * TITLES — positioned to hug the center model area.
         * Using Inter Black for the fat, impactful look from the mockup.
         * The mockup shows very bold, slightly condensed sans-serif titles,
         * not monospace — the monospace is only for body text.
         */
        .hp-title {
          position: absolute;
          font-family: 'Inter', sans-serif;
          font-weight: 900;
          font-size: clamp(100px, 13vw, 200px);
          color: var(--white);
          text-transform: uppercase;
          letter-spacing: -6px;
          line-height: 0.82;
          margin: 0;
          user-select: none;
          /* subtle text shadow for depth */
          text-shadow: 0 2px 40px rgba(0,0,0,0.04);
        }

        .hp-title--aire {
          /* Positioned left, vertically slightly above center */
          right: 56%;
          top: 28%;
          z-index: 3;
          opacity: 0;
          transform: translateX(-50px);
          transition: opacity 0.9s ease 0.15s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s;
        }
        .hp--in .hp-title--aire { opacity: 1; transform: translateX(0); }

        .hp-title--libre {
          /* Positioned right, slightly lower, partially behind model */
          left: 52%;
          top: 27%;
          z-index: 3;
          opacity: 0;
          transform: translateX(50px);
          transition: opacity 0.9s ease 0.25s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.25s;
        }
        .hp--in .hp-title--libre { opacity: 1; transform: translateX(0); }

        /* ═══ MODEL AREA — overlaps titles ═══ */
        .hp-model {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -52%);
          width: clamp(260px, 32vw, 420px);
          height: clamp(240px, 30vw, 380px);
          z-index: 8;
          opacity: 0;
          transition: opacity 0.8s ease 0.35s;
        }
        .hp--in .hp-model { opacity: 1; }

        .hp-model-inner {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 1.5px dashed rgba(255,255,255,0.18);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: radial-gradient(circle at 45% 40%, rgba(255,255,255,0.06), transparent 65%);
        }
        .hp-model-emoji {
          font-size: 40px;
          opacity: 0.25;
        }
        .hp-model-label {
          font-size: 9px;
          color: rgba(255,255,255,0.22);
          letter-spacing: 2.5px;
          text-transform: uppercase;
          text-align: center;
          line-height: 1.6;
        }

        /* ═══ DESCRIPTION — left side below AIRE ═══ */
        .hp-desc {
          position: absolute;
          left: 8%;
          top: 58%;
          font-size: 11.5px;
          font-weight: 400;
          color: var(--white);
          line-height: 1.9;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          max-width: 310px;
          z-index: 4;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.6s ease 0.55s, transform 0.6s ease 0.55s;
        }
        .hp--in .hp-desc { opacity: 0.85; transform: translateY(0); }

        /* ═══ CTA BUTTONS — right of model ═══ */
        .hp-ctas {
          position: absolute;
          right: 14%;
          top: 60%;
          display: flex;
          gap: 12px;
          z-index: 12;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.6s ease 0.65s, transform 0.6s ease 0.65s;
        }
        .hp--in .hp-ctas { opacity: 1; transform: translateY(0); }

        .hp-btn {
          padding: 12px 24px;
          border-radius: 8px;
          border: 1.5px solid rgba(255,255,255,0.35);
          background: rgba(28,35,51,0.65);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          color: var(--white);
          font-family: 'Space Mono', monospace;
          font-size: 12.5px;
          font-weight: 700;
          letter-spacing: 0.6px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .hp-btn:hover {
          background: rgba(255,255,255,0.14);
          border-color: rgba(255,255,255,0.6);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }

        /* ═══ TAGLINE — center bottom ═══ */
        .hp-tagline {
          position: absolute;
          bottom: 14%;
          left: 50%;
          transform: translateX(-50%);
          font-size: 13px;
          font-weight: 700;
          font-style: italic;
          color: var(--white);
          letter-spacing: 0.5px;
          white-space: nowrap;
          z-index: 10;
          opacity: 0;
          transition: opacity 0.6s ease 0.8s;
        }
        .hp--in .hp-tagline { opacity: 0.9; }

        /* ═══ QUOTE — bottom right ═══ */
        .hp-quote {
          position: absolute;
          right: 8%;
          bottom: 8%;
          font-size: 11px;
          font-weight: 700;
          color: var(--white);
          letter-spacing: 1.5px;
          text-transform: uppercase;
          line-height: 2;
          text-align: right;
          max-width: 300px;
          z-index: 10;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.6s ease 0.9s, transform 0.6s ease 0.9s;
        }
        .hp--in .hp-quote { opacity: 0.8; transform: translateY(0); }

        /* ═══ RESPONSIVE ═══ */
        @media (max-width: 1100px) {
          .hp-title { font-size: clamp(80px, 12vw, 160px) !important; }
          .hp-title--aire { right: 54%; top: 26%; }
          .hp-title--libre { left: 50%; top: 25%; }
          .hp-ctas { right: 8%; }
          .hp-desc { left: 6%; }
        }

        @media (max-width: 768px) {
          .hp-nav { padding: 14px 20px; }
          .hp-nav ul { gap: 14px; }
          .hp-nav-btn { font-size: 9px; letter-spacing: 0.8px; }

          .hp-title {
            font-size: clamp(56px, 18vw, 100px) !important;
            letter-spacing: -3px !important;
          }
          .hp-title--aire { right: auto; left: 6%; top: 18%; }
          .hp-title--libre { left: auto; right: 6%; top: 24%; }

          .hp-model {
            width: clamp(180px, 50vw, 280px);
            height: clamp(160px, 45vw, 250px);
            top: 46%;
          }

          .hp-desc {
            left: 6%; top: 56%;
            font-size: 10px;
            max-width: 220px;
          }

          .hp-ctas {
            right: auto;
            left: 50%; top: auto; bottom: 24%;
            transform: translateX(-50%) translateY(0);
          }
          .hp--in .hp-ctas {
            transform: translateX(-50%) translateY(0);
          }

          .hp-tagline { bottom: 16%; font-size: 11px; }

          .hp-quote {
            right: auto; left: 50%; bottom: 4%;
            transform: translateX(-50%);
            text-align: center;
            font-size: 9px;
          }
          .hp--in .hp-quote { transform: translateX(-50%); }
        }

        @media (max-width: 520px) {
          .hp-nav ul { display: none; }
          .hp-nav { justify-content: flex-end; }
          .hp-title {
            font-size: clamp(48px, 20vw, 80px) !important;
          }
        }
      `}</style>

      {/* NAV */}
      <nav className="hp-nav">
        <ul>
          {NAV.map(n => (
            <li key={n.label} style={{ listStyle: 'none' }}>
              <button className="hp-nav-btn" onClick={() => navigate(n.route)}>
                {n.label}
              </button>
            </li>
          ))}
        </ul>
        <div className="hp-logo-area">
          <img src={logoSur} alt="Instituto del Sur Urbano" className="hp-logo" />
        </div>
      </nav>

      {/* HERO — layered composition */}
      <div className="hp-hero">
        <h1 className="hp-title hp-title--aire">AIRE</h1>
        <h1 className="hp-title hp-title--libre">LIBRE</h1>

        {/* Model placeholder — sits on top of both titles */}
        <div className="hp-model">
          <div className="hp-model-inner">
            <div className="hp-model-emoji">🐸🐦</div>
            <div className="hp-model-label">Modelo 3D<br />próximamente</div>
          </div>
        </div>

        <p className="hp-desc">
          Descubre como el aire, la salud y<br />
          el acceso a servicios indican<br />
          dónde el riesgo se acumula.
        </p>

        <div className="hp-ctas">
          <button className="hp-btn" onClick={() => navigate('/map')}>Ir al mapa</button>
          <button className="hp-btn" onClick={() => navigate('/quiz')}>Hacer test</button>
        </div>

        <p className="hp-tagline">conoce tu nivel de exposición</p>

        <p className="hp-quote">
          Porque vivir bajo el mismo<br />
          cielo no significa estar<br />
          igual de protegidos.
        </p>
      </div>
    </div>
  );
}
