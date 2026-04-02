import { useNavigate } from 'react-router-dom';
import logoSur from '../../assets/Logo_SUR25.svg';
import logoBC from '../../assets/Logo_BreatheCities.svg';

interface NavBarProps {
  /** 'transparent' for pages with blue bg (Home, Quiz, FAQ), 'solid' for pages with white/light bg (Map) */
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

  const isSolid = variant === 'solid';

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
          .nb { justify-content: flex-end; }
        }
      `}</style>

      <nav className={`nb ${isSolid ? 'nb--solid' : 'nb--transparent'}`}>
        <ul className="nb-links">
          {NAV.map(n => (
            <li key={n.label} style={{ listStyle: 'none' }}>
              <button className="nb-btn" onClick={() => navigate(n.route)}>
                {n.label}
              </button>
            </li>
          ))}
        </ul>
        <div className="nb-logos">
          <img src={logoSur} alt="Instituto del Sur Urbano" className="nb-logo-sur" />
          <div className="nb-logo-divider" />
          <img src={logoBC} alt="Breathe Cities" className="nb-logo-bc" />
        </div>
      </nav>
    </>
  );
}