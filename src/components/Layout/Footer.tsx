import logoBC from '../../assets/Logo_BreatheCities.svg';

// Replace these with the real profile URLs
const SOCIALS = {
  web: 'https://www.sur.institute/',
  instagram: 'https://www.instagram.com/surinstitute/',
  facebook: 'https://www.facebook.com/surinstitute/',
  linkedin: 'https://www.linkedin.com/company/surinstitute/',
  breatheCities: 'https://www.breathecities.org/',
};

export default function Footer() {
  return (
    <>
      <style>{`
        .footer {
          background: rgba(28, 35, 51, 0.9);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          padding: 28px 36px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          font-family: 'Space Mono', monospace;
        }
        .footer-socials {
          display: flex;
          gap: 20px;
          align-items: center;
        }
        .footer-socials a {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1.5px solid rgba(255, 255, 255, 0.25);
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
          transition: all 0.25s ease;
        }
        .footer-socials a:hover {
          background: rgba(255, 255, 255, 0.18);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-2px);
        }
        .footer-socials svg {
          width: 18px;
          height: 18px;
          fill: currentColor;
        }
        .footer-credit {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 18px;
          color: rgba(255, 255, 255, 0.55);
          letter-spacing: 0.5px;
        }
        .footer-credit img {
          height: 64px;
          opacity: 0.7;
        }
        .footer-credit-logo {
          height: 64px;
        }
        .footer-credit-link {
          display: inline-flex;
          align-items: center;
        }
        .footer-disclaimer {
          max-width: 720px;
          margin: 4px 0 0;
          text-align: center;
          font-size: 13px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.62);
          font-family: 'Space Mono', monospace;
        }
      `}</style>

      <footer className="footer">
        <div className="footer-socials">
          <a href={SOCIALS.web} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#607d8b"
              stroke-width="1"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
              <path d="M3.6 9h16.8" />
              <path d="M3.6 15h16.8" />
              <path d="M11.5 3a17 17 0 0 0 0 18" />
              <path d="M12.5 3a17 17 0 0 1 0 18" />
            </svg>
          </a>
          <a href={SOCIALS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5Zm4.25 3.25a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5Zm0 1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5Zm5.5-1.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" />
            </svg>
          </a>
          <a href={SOCIALS.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12Z" />
            </svg>
          </a>
          <a href={SOCIALS.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125ZM6.84 20.452H3.834V9H6.84v11.452ZM22 2H2v20h20V2Z" />
            </svg>
          </a>
        </div>
        <div className="footer-credit">
          <span>Proyecto apoyado por</span>
        </div>
        <a
          href={SOCIALS.breatheCities}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Breathe Cities"
          className="footer-credit-link"
        >
          <img src={logoBC} alt="Breathe Cities" className="footer-credit-logo" />
        </a>
        <p className="footer-disclaimer">
          Esta herramienta es de divulgación. No está diseñada para ofrecer
          orientación médica y puede contener errores u omisiones. Si tienes síntomas relacionados con la calidad del aire, consulta a un profesional de la salud.
        </p>
      </footer>
    </>
  );
}
