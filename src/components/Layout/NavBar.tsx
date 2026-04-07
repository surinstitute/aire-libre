import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logoSur from '../../assets/Logo_SUR25.svg';
import logoBC from '../../assets/Logo_BreatheCities.svg';

interface NavBarProps {
  variant?: 'transparent' | 'solid';
}

const NAV = [
  { label: 'MAPA', route: '/map' },
  { label: 'TEST', route: '/quiz' },
  { label: 'PREGUNTAS POSIBLES', route: '/faq' },
  { label: 'RECURSOS', route: '/resources' },
];

export default function NavBar({ variant = 'transparent' }: NavBarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const isSolid = variant === 'solid';

  const handleNav = (route: string) => {
    setMenuOpen(false);
    navigate(route);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');

        .nb {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 36px;
          z-index: 50;
          width: 100%;
        }
        .nb--transparent {
          background: rgba(100,170,218,0.85);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .nb--solid {
          background: linear-gradient(90deg, #6AADDA 0%, #7CB9E2 100%);
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
        }
        .nb-links {
          display: flex;
          gap: 28px;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .nb-btn {
          background: none;
          border: none;
          color: #fff;
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 1.6px;
          text-transform: uppercase;
          cursor: pointer;
          padding: 4px 0;
          position: relative;
          opacity: 0.85;
          transition: opacity 0.25s;
        }
        .nb-btn:hover { opacity: 1; }
        .nb-btn::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 1.5px;
          background: #fff;
          transition: width 0.25s ease;
        }
        .nb-btn:hover::after { width: 100%; }

        .nb-logos {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .nb-logo-sur { height: 62px; }
        .nb-logo-divider {
          width: 1px;
          height: 32px;
          background: rgba(255,255,255,0.35);
        }
        .nb-logo-bc { height: 38px; opacity: 0.92; }

        /* ── Hamburger button ── */
        .nb-hamburger {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          z-index: 60;
          -webkit-tap-highlight-color: transparent;
        }
        .nb-hamburger-line {
          display: block;
          width: 24px;
          height: 2px;
          background: #fff;
          border-radius: 2px;
          transition: transform 0.3s ease, opacity 0.3s ease;
          margin: 5px 0;
        }
        .nb-hamburger--open .nb-hamburger-line:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }
        .nb-hamburger--open .nb-hamburger-line:nth-child(2) {
          opacity: 0;
        }
        .nb-hamburger--open .nb-hamburger-line:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }

        /* ── Mobile overlay menu ── */
        .nb-overlay {
          display: none;
        }

        @media (max-width: 900px) {
          .nb { padding: 12px 20px; }
          .nb-links { gap: 14px; }
          .nb-btn { font-size: 9px; letter-spacing: 0.8px; }
          .nb-logo-sur { height: 36px; }
          .nb-logo-bc { height: 26px; }
          .nb-logos { gap: 10px; }
          .nb-logo-divider { height: 24px; }
        }

        @media (max-width: 600px) {
          .nb-links { display: none; }
          .nb { justify-content: space-between; }
          .nb-hamburger { display: block; }

          .nb-overlay {
            display: flex;
            position: fixed;
            inset: 0;
            background: linear-gradient(170deg, #5A9FCC 0%, #4A8AB8 40%, #3A75A4 100%);
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 55;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.35s ease;
          }
          .nb-overlay--open {
            opacity: 1;
            pointer-events: auto;
          }
          .nb-overlay-links {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
          }
          .nb-overlay-btn {
            background: none;
            border: none;
            color: #fff;
            font-family: 'Bebas Neue', sans-serif;
            font-size: 36px;
            font-weight: 400;
            letter-spacing: 3px;
            cursor: pointer;
            padding: 12px 24px;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.4s ease, transform 0.4s ease;
          }
          .nb-overlay--open .nb-overlay-btn {
            opacity: 0.9;
            transform: translateY(0);
          }
          .nb-overlay--open .nb-overlay-btn:nth-child(1) { transition-delay: 0.08s; }
          .nb-overlay--open .nb-overlay-btn:nth-child(2) { transition-delay: 0.14s; }
          .nb-overlay--open .nb-overlay-btn:nth-child(3) { transition-delay: 0.20s; }
          .nb-overlay--open .nb-overlay-btn:nth-child(4) { transition-delay: 0.26s; }
          .nb-overlay-btn:active { opacity: 1; }

          .nb-overlay-logos {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-top: 48px;
            opacity: 0;
            transition: opacity 0.4s ease 0.35s;
          }
          .nb-overlay--open .nb-overlay-logos {
            opacity: 0.7;
          }
          .nb-overlay-logos img:first-child { height: 40px; }
          .nb-overlay-logos img:last-child { height: 28px; }
        }
      `}</style>

      <nav className={`nb ${isSolid ? 'nb--solid' : 'nb--transparent'}`}>
        {/* Hamburger — mobile only */}
        <button
          className={`nb-hamburger ${menuOpen ? 'nb-hamburger--open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          <span className="nb-hamburger-line" />
          <span className="nb-hamburger-line" />
          <span className="nb-hamburger-line" />
        </button>

        {/* Desktop links */}
        <ul className="nb-links">
          {NAV.map(n => (
            <li key={n.label} style={{ listStyle: 'none' }}>
              <button className="nb-btn" onClick={() => navigate(n.route)}>
                {n.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Logos */}
        <div className="nb-logos">
          <img src={logoSur} alt="Instituto del Sur Urbano" className="nb-logo-sur" />
          <div className="nb-logo-divider" />
          <img src={logoBC} alt="Breathe Cities" className="nb-logo-bc" />
        </div>
      </nav>

      {/* Mobile overlay menu */}
      <div className={`nb-overlay ${menuOpen ? 'nb-overlay--open' : ''}`}>
        <ul className="nb-overlay-links">
          {NAV.map(n => (
            <li key={n.label} style={{ listStyle: 'none' }}>
              <button className="nb-overlay-btn" onClick={() => handleNav(n.route)}>
                {n.label}
              </button>
            </li>
          ))}
        </ul>
        <div className="nb-overlay-logos">
          <img src={logoSur} alt="Instituto del Sur Urbano" />
          <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.35)' }} />
          <img src={logoBC} alt="Breathe Cities" />
        </div>
      </div>
    </>
  );
}
