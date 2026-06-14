import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AnimatedBirdViewer from '../components/Bird/AnimatedBirdViewer';
import { BIRD_MODELS } from '../data/birdModels';
import { birdProfiles } from '../data/quizData';

type CharacterSlide = (typeof birdProfiles)[number] & {
  model: {
    glbUrl: string;
    animationIndex: number;
    cameraDistance: number;
    autoRotateSpeed: number;
    startFrame?: number;
    endFrame?: number;
  };
};

const CHARACTER_SLIDES = birdProfiles
  .map((bird) => {
    const model = BIRD_MODELS[bird.id];
    if (!model?.glbUrl) return null;

    return {
      ...bird,
      model: {
        ...model,
        glbUrl: model.glbUrl,
      },
    };
  })
  .filter((bird): bird is CharacterSlide => bird !== null);

export default function Characters() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev - 1 + CHARACTER_SLIDES.length) % CHARACTER_SLIDES.length);
      }

      if (event.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev + 1) % CHARACTER_SLIDES.length);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const activeCharacter = CHARACTER_SLIDES[currentIndex];

  if (!activeCharacter) {
    return null;
  }

  const showPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + CHARACTER_SLIDES.length) % CHARACTER_SLIDES.length);
  };

  const showNext = () => {
    setCurrentIndex((prev) => (prev + 1) % CHARACTER_SLIDES.length);
  };

  return (
    <section className="characters-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');

        .characters-page {
          min-height: calc(100vh - var(--header-height));
          padding: 42px 24px 72px;
          background:
            radial-gradient(circle at top left, rgba(255,255,255,0.22) 0%, transparent 28%),
            radial-gradient(circle at 80% 20%, rgba(255,214,102,0.16) 0%, transparent 24%),
            linear-gradient(180deg, #8cc7ec 0%, #6aadcf 48%, #4f91b4 100%);
          color: #f7fbff;
          font-family: 'Space Mono', monospace;
        }

        .characters-shell {
          max-width: 1180px;
          margin: 0 auto;
          display: grid;
          gap: 28px;
        }

        .characters-header {
          display: grid;
          gap: 12px;
          max-width: 720px;
        }

        .characters-kicker {
          display: inline-flex;
          width: fit-content;
          padding: 6px 12px;
          border-radius: 999px;
          background: rgba(28, 35, 51, 0.24);
          border: 1px solid rgba(255,255,255,0.22);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .characters-title {
          margin: 0;
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(54px, 9vw, 108px);
          line-height: 0.92;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .characters-intro {
          margin: 0;
          max-width: 62ch;
          font-size: 14px;
          line-height: 1.8;
          color: rgba(247,251,255,0.82);
        }

        .characters-carousel {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(320px, 0.9fr);
          gap: 28px;
          align-items: stretch;
        }

        .characters-stage,
        .characters-panel {
          position: relative;
          overflow: hidden;
          border-radius: 28px;
          border: 1px solid rgba(255,255,255,0.18);
          background: rgba(28, 35, 51, 0.2);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 20px 60px rgba(18, 44, 62, 0.2);
        }

        .characters-stage {
          min-height: 580px;
          padding: 24px;
        }

        .characters-stage::before {
          content: '';
          position: absolute;
          inset: 18px;
          border-radius: 22px;
          border: 1px solid rgba(255,255,255,0.08);
          pointer-events: none;
        }

        .characters-stage-label {
          position: absolute;
          top: 24px;
          left: 24px;
          z-index: 2;
          font-size: 11px;
          letter-spacing: 1.4px;
          text-transform: uppercase;
          color: rgba(247,251,255,0.7);
        }

        .characters-stage-viewer {
          position: relative;
          z-index: 1;
          height: 100%;
        }

        .characters-panel {
          display: grid;
          grid-template-rows: auto auto 1fr auto;
          gap: 20px;
          padding: 28px;
        }

        .characters-count {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: rgba(247,251,255,0.66);
        }

        .characters-name {
          margin: 0;
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(42px, 5vw, 72px);
          line-height: 0.95;
          text-transform: uppercase;
          letter-spacing: 1.2px;
        }

        .characters-subtitle {
          margin: 0;
          font-size: 14px;
          font-weight: 700;
          line-height: 1.7;
          color: #ffe08a;
          text-transform: uppercase;
        }

        .characters-body {
          display: grid;
          gap: 18px;
          align-content: start;
        }

        .characters-description,
        .characters-closing {
          margin: 0;
          font-size: 14px;
          line-height: 1.9;
          color: rgba(247,251,255,0.84);
        }

        .characters-closing {
          padding-top: 18px;
          border-top: 1px solid rgba(255,255,255,0.14);
          font-weight: 700;
          color: #ffffff;
        }

        .characters-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding-top: 8px;
        }

        .characters-dots {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .characters-dot {
          width: 10px;
          height: 10px;
          border: 0;
          border-radius: 999px;
          background: rgba(255,255,255,0.24);
          cursor: pointer;
          transition: transform 0.2s ease, background 0.2s ease;
        }

        .characters-dot:hover,
        .characters-dot.is-active {
          transform: scale(1.18);
          background: #ffe08a;
        }

        .characters-nav {
          display: flex;
          gap: 10px;
        }

        .characters-nav-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.22);
          background: rgba(255,255,255,0.08);
          color: #fff;
          cursor: pointer;
          transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
        }

        .characters-nav-btn:hover {
          transform: translateY(-2px);
          background: rgba(255,255,255,0.16);
          border-color: rgba(255,255,255,0.4);
        }

        .characters-help {
          margin: 0;
          font-size: 11px;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          color: rgba(247,251,255,0.56);
        }

        @media (max-width: 980px) {
          .characters-carousel {
            grid-template-columns: 1fr;
          }

          .characters-stage {
            min-height: 460px;
          }
        }

        @media (max-width: 640px) {
          .characters-page {
            padding: 28px 16px 56px;
          }

          .characters-stage,
          .characters-panel {
            border-radius: 22px;
          }

          .characters-stage {
            min-height: 360px;
            padding: 18px;
          }

          .characters-panel {
            padding: 22px 18px;
          }

          .characters-controls {
            flex-direction: column;
            align-items: stretch;
          }

          .characters-dots,
          .characters-nav {
            justify-content: center;
          }

          .characters-help {
            text-align: center;
          }
        }
      `}</style>

      <div className="characters-shell">
        <header className="characters-header">
          <span className="characters-kicker">Modelos 3D</span>
          <h1 className="characters-title">Personajes de Aire Libre</h1>
          <p className="characters-intro">
            Cada personaje traduce una combinación distinta de exposición, sensibilidad y contexto urbano.
            Recorre el carrusel para ver los modelos en 3D y entender qué representa cada ave dentro de la experiencia.
          </p>
        </header>

        <div className="characters-carousel">
          <div className="characters-stage">
            <div className="characters-stage-viewer">
              <AnimatedBirdViewer
                glbUrl={activeCharacter.model.glbUrl}
                autoRotateSpeed={activeCharacter.model.autoRotateSpeed}
                cameraDistance={activeCharacter.model.cameraDistance}
                animationIndex={activeCharacter.model.animationIndex}
                startFrame={activeCharacter.model.startFrame}
                endFrame={activeCharacter.model.endFrame}
                backgroundColor={null}
                height="100%"
              />
            </div>
          </div>

          <article className="characters-panel">
            <div className="characters-count">
              {String(currentIndex + 1).padStart(2, '0')} / {String(CHARACTER_SLIDES.length).padStart(2, '0')}
            </div>

            <div>
              <h2 className="characters-name">{activeCharacter.name}</h2>
              <p className="characters-subtitle">{activeCharacter.subtitle}</p>
            </div>

            <div className="characters-body">
              <p className="characters-description">{activeCharacter.narrative}</p>
              {activeCharacter.closingLine && (
                <p className="characters-closing">{activeCharacter.closingLine}</p>
              )}
            </div>

            <div className="characters-controls">
              <div className="characters-dots" aria-label="Seleccionar personaje">
                {CHARACTER_SLIDES.map((character, index) => (
                  <button
                    key={character.id}
                    type="button"
                    className={`characters-dot ${index === currentIndex ? 'is-active' : ''}`}
                    aria-label={`Ver ${character.name}`}
                    aria-pressed={index === currentIndex}
                    onClick={() => setCurrentIndex(index)}
                  />
                ))}
              </div>

              <div className="characters-nav">
                <button type="button" className="characters-nav-btn" onClick={showPrevious} aria-label="Personaje anterior">
                  <ChevronLeft size={22} />
                </button>
                <button type="button" className="characters-nav-btn" onClick={showNext} aria-label="Siguiente personaje">
                  <ChevronRight size={22} />
                </button>
              </div>
            </div>

            <p className="characters-help">Usa las flechas del teclado o los controles para cambiar de personaje.</p>
          </article>
        </div>
      </div>
    </section>
  );
}