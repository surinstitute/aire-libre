import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  calculateResult,
  calculateDailyAir,
  quizQuestions,
} from '../data/quizData';
import type { QuizAnswers } from '../data/quizData';
import type { Colonia } from '../types';

// ============================================================
// Slide color palettes (Wrapped-style)
// ============================================================

const slidePalettes = [
  { bg: '#1B3A4B', text: '#F5F0E8', accent: '#86efac' },
  { bg: '#A62C2B', text: '#F5F0E8', accent: '#fcd34d' },
  { bg: '#2D4A3E', text: '#F5F0E8', accent: '#86efac' },
  { bg: '#4A3728', text: '#F5F0E8', accent: '#fca5a5' },
  { bg: '#1A1A2E', text: '#F5F0E8', accent: '#c4b5fd' },
  { bg: '#5B2C3F', text: '#F5F0E8', accent: '#fbbf24' },
  { bg: '#0F4C3A', text: '#F5F0E8', accent: '#86efac' },
  { bg: '#A62C2B', text: '#F5F0E8', accent: '#F5F0E8' },
];

type Palette = (typeof slidePalettes)[0];

// ============================================================
// Fade-in animation
// ============================================================

const FadeIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
}> = ({ children, delay = 0 }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}
    >
      {children}
    </div>
  );
};

// ============================================================
// Style helpers
// ============================================================

const s = (p: Palette) => ({
  slide: {
    minHeight: '100vh',
    width: '100%',
    backgroundColor: p.bg,
    color: p.text,
    display: 'flex' as const,
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    padding: '60px 24px',
    position: 'relative' as const,
    fontFamily: "'Lora', Georgia, serif",
    overflow: 'hidden',
    transition: 'background-color 0.6s ease',
  },
  topLabel: {
    position: 'absolute' as const,
    top: '24px',
    left: '32px',
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '18px',
    fontWeight: 700,
    letterSpacing: '2px',
    textTransform: 'uppercase' as const,
    opacity: 0.5,
    color: p.text,
  },
  counter: {
    position: 'absolute' as const,
    top: '28px',
    right: '32px',
    fontSize: '13px',
    opacity: 0.4,
    color: p.text,
    fontVariantNumeric: 'tabular-nums' as const,
  },
  bigNum: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '96px',
    fontWeight: 800,
    lineHeight: 1,
    color: p.accent,
    marginBottom: '16px',
  },
  title: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '32px',
    fontWeight: 700,
    lineHeight: 1.25,
    textAlign: 'center' as const,
    marginBottom: '20px',
    maxWidth: '520px',
    color: p.text,
  },
  body: {
    fontSize: '18px',
    lineHeight: 1.7,
    textAlign: 'center' as const,
    maxWidth: '480px',
    opacity: 0.85,
    color: p.text,
  },
  accent: { color: p.accent, fontWeight: 700 },
  small: {
    fontSize: '12px',
    letterSpacing: '2.5px',
    textTransform: 'uppercase' as const,
    opacity: 0.5,
    marginBottom: '12px',
  },
  birdName: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '48px',
    fontWeight: 800,
    color: p.accent,
    marginBottom: '8px',
    textAlign: 'center' as const,
  },
  birdSub: {
    fontSize: '18px',
    opacity: 0.7,
    marginBottom: '28px',
    textAlign: 'center' as const,
  },
  narrative: {
    fontSize: '19px',
    lineHeight: 1.75,
    textAlign: 'center' as const,
    maxWidth: '500px',
    fontStyle: 'italic' as const,
    opacity: 0.9,
  },
  closing: {
    fontSize: '16px',
    marginTop: '24px',
    opacity: 0.6,
    textAlign: 'center' as const,
    maxWidth: '440px',
  },
  bar: {
    width: '100%',
    maxWidth: '360px',
    height: '8px',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: '4px',
    marginTop: '8px',
    marginBottom: '20px',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: '4px',
    backgroundColor: p.accent,
    transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  dots: {
    position: 'fixed' as const,
    bottom: '24px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '8px',
    zIndex: 100,
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    padding: 0,
  },
  arrow: {
    position: 'fixed' as const,
    top: '50%',
    transform: 'translateY(-50%)',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    border: '1.5px solid rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    color: 'rgba(255,255,255,0.7)',
    fontSize: '20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(8px)',
    transition: 'all 0.25s ease',
    zIndex: 100,
  },
  cta: {
    marginTop: '32px',
    padding: '16px 40px',
    fontSize: '16px',
    fontWeight: 600,
    fontFamily: "'Lora', Georgia, serif",
    color: p.bg,
    backgroundColor: p.accent,
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    letterSpacing: '0.5px',
  },
});

// ============================================================
// Component
// ============================================================

interface SlideData {
  palette: Palette;
  content: React.ReactNode;
}

const QuizResult: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  // Load data from sessionStorage
  const answers: QuizAnswers = useMemo(() => {
    try {
      const stored = sessionStorage.getItem('quizAnswers');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }, []);

  const colonia: Colonia | null = useMemo(() => {
    try {
      const stored = sessionStorage.getItem('quizColonia');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }, []);

  // Redirect if no answers
  useEffect(() => {
    if (Object.keys(answers).length === 0) {
      navigate('/quiz');
    }
  }, [answers, navigate]);

  // Real risk level from Supabase data
  const cpRiskLevel = colonia?.categoria_riesgo ?? 'medio';

  const result = useMemo(
    () => calculateResult(cpRiskLevel, answers),
    [cpRiskLevel, answers]
  );

  const dailyAir = useMemo(() => {
    const peso = parseFloat(answers.peso as string) || 70;
    const estatura = parseFloat(answers.estatura as string) || 170;
    return calculateDailyAir(
      peso,
      estatura,
      answers.edad as string,
      answers.ejercicio as string
    );
  }, [answers]);

  // Helper to get option label
  const getLabel = (qId: string, val: string): string => {
    const q = quizQuestions.find((q) => q.id === qId);
    return q?.options?.find((o) => o.value === val)?.label || val;
  };

  // --------------------------------------------------------
  // Build slides
  // --------------------------------------------------------
  const slides: SlideData[] = useMemo(() => {
    const out: SlideData[] = [];

    // 1 — Bird reveal
    const p0 = slidePalettes[0];
    out.push({
      palette: p0,
      content: (
        <div style={{ textAlign: 'center' }}>
          <FadeIn delay={200}>
            <div style={{ fontSize: '80px', marginBottom: '16px' }}>
              {result.bird.emoji}
            </div>
          </FadeIn>
          <FadeIn delay={500}>
            <div style={s(p0).birdName}>{result.bird.name}</div>
          </FadeIn>
          <FadeIn delay={700}>
            <div style={s(p0).birdSub}>{result.bird.subtitle}</div>
          </FadeIn>
          <FadeIn delay={900}>
            <div style={s(p0).narrative}>{result.bird.narrative}</div>
          </FadeIn>
          {result.bird.closingLine && (
            <FadeIn delay={1100}>
              <div style={s(p0).closing}>{result.bird.closingLine}</div>
            </FadeIn>
          )}
        </div>
      ),
    });

    // 2 — Código postal
    const p1 = slidePalettes[1];
    const riskLabels: Record<string, string> = {
      bajo: 'bajo',
      medio: 'medio',
      alto: 'alto',
    };
    out.push({
      palette: p1,
      content: (
        <div style={{ textAlign: 'center' }}>
          <FadeIn delay={200}>
            <div style={s(p1).small}>Tu código postal</div>
            <div style={s(p1).bigNum}>{answers.codigoPostal || '—'}</div>
          </FadeIn>
          <FadeIn delay={500}>
            {colonia ? (
              <p style={s(p1).body}>
                Vives en{' '}
                <span style={s(p1).accent}>
                  {colonia.colonias}, {colonia.municipio}
                </span>
                . Tu zona tiene un nivel de exposición ambiental{' '}
                <span style={s(p1).accent}>{riskLabels[cpRiskLevel]}</span>.
              </p>
            ) : (
              <p style={s(p1).body}>
                Tu zona tiene un nivel de exposición ambiental{' '}
                <span style={s(p1).accent}>{riskLabels[cpRiskLevel]}</span>.
              </p>
            )}
          </FadeIn>
        </div>
      ),
    });

    // 3 — Litros de aire
    const p2 = slidePalettes[2];
    out.push({
      palette: p2,
      content: (
        <div style={{ textAlign: 'center' }}>
          <FadeIn delay={200}>
            <div style={s(p2).small}>Cada día respiras aproximadamente</div>
            <div style={s(p2).bigNum}>{dailyAir.toLocaleString()}</div>
            <div
              style={{
                fontSize: '22px',
                opacity: 0.6,
                marginTop: '-8px',
                marginBottom: '24px',
              }}
            >
              litros de aire
            </div>
          </FadeIn>
          <FadeIn delay={600}>
            <p style={s(p2).body}>
              Eso equivale a aproximadamente{' '}
              <span style={s(p2).accent}>{Math.round(dailyAir / 1000)} mil</span>{' '}
              litros. La calidad de ese aire importa más de lo que crees.
            </p>
          </FadeIn>
        </div>
      ),
    });

    // 4 — Edad
    const p3 = slidePalettes[3];
    const edadLabel = getLabel('edad', answers.edad as string);
    const isSensitive = answers.edad === 'menor12' || answers.edad === 'mayor65';
    out.push({
      palette: p3,
      content: (
        <div style={{ textAlign: 'center' }}>
          <FadeIn delay={200}>
            <div style={s(p3).title}>{edadLabel}</div>
          </FadeIn>
          <FadeIn delay={500}>
            <p style={s(p3).body}>
              {isSensitive
                ? answers.edad === 'menor12'
                  ? 'Las personas menores de 12 años están en desarrollo y necesitan más aire limpio. Sus pulmones son más vulnerables a los contaminantes.'
                  : 'Las personas mayores de 65 años tienen más afectaciones por la contaminación del aire. El cuidado preventivo es especialmente importante.'
                : 'Tu rango de edad no presenta una vulnerabilidad biológica elevada, pero el cuidado del aire te beneficia igual.'}
            </p>
          </FadeIn>
        </div>
      ),
    });

    // 5 — Tabaco
    const p4 = slidePalettes[4];
    const fumaVal = answers.fuma as string;
    out.push({
      palette: p4,
      content: (
        <div style={{ textAlign: 'center' }}>
          <FadeIn delay={200}>
            <div style={s(p4).title}>
              {fumaVal === 'fuma'
                ? 'Fumas'
                : fumaVal === 'exfumador'
                ? 'Dejaste de fumar'
                : 'No fumas'}
            </div>
          </FadeIn>
          <FadeIn delay={500}>
            <p style={s(p4).body}>
              {fumaVal === 'fuma'
                ? 'Las personas que fuman tienen hasta 3 veces más riesgo de afectaciones por la calidad del aire. Cada cigarrillo amplifica el daño de los contaminantes ambientales.'
                : fumaVal === 'exfumador'
                ? 'Haber dejado de fumar es un gran paso. Tu cuerpo se está recuperando, aunque puede haber vulnerabilidad residual.'
                : 'No fumar reduce significativamente tu riesgo. Tienes hasta 3 veces menos riesgo que las personas que fuman.'}
            </p>
          </FadeIn>
        </div>
      ),
    });

    // 6 — Ejercicio
    const p5 = slidePalettes[5];
    const ejVal = answers.ejercicio as string;
    out.push({
      palette: p5,
      content: (
        <div style={{ textAlign: 'center' }}>
          <FadeIn delay={200}>
            <div style={s(p5).title}>
              {ejVal === '3omas'
                ? '¡Activo/a!'
                : ejVal === '1a2'
                ? 'Algo de movimiento'
                : 'Sin ejercicio regular'}
            </div>
          </FadeIn>
          <FadeIn delay={500}>
            <p style={s(p5).body}>
              {ejVal === '3omas'
                ? '¡Tu capacidad pulmonar y salud general son mejores gracias al ejercicio! Eso sí, intenta hacerlo en horarios y zonas con mejor calidad del aire.'
                : ejVal === '1a2'
                ? 'Algo de ejercicio es mejor que nada. Mover el cuerpo fortalece tus pulmones y tu salud general.'
                : 'El ejercicio regular mejora tu capacidad pulmonar y tu resistencia a los contaminantes. Incluso caminatas cortas cuentan.'}
            </p>
          </FadeIn>
        </div>
      ),
    });

    // 7 — Condiciones de salud
    const p6 = slidePalettes[6];
    const conds = (answers.condicionesSalud as string[]) || [];
    const hasConds = conds.length > 0 && !conds.includes('ninguna');
    out.push({
      palette: p6,
      content: (
        <div style={{ textAlign: 'center' }}>
          <FadeIn delay={200}>
            <div style={s(p6).title}>
              {hasConds
                ? 'Tu cuerpo necesita atención extra'
                : '¡Estás súper sano/a!'}
            </div>
          </FadeIn>
          <FadeIn delay={500}>
            {hasConds ? (
              <div>
                <p style={s(p6).body}>
                  Reportaste:{' '}
                  <span style={s(p6).accent}>
                    {conds.map((c) => getLabel('condicionesSalud', c)).join(', ')}
                  </span>
                </p>
                <p style={{ ...s(p6).body, marginTop: '16px' }}>
                  Estas condiciones pueden hacer que tu cuerpo sea más sensible a
                  la contaminación. El monitoreo y cuidado preventivo son tus
                  mejores aliados.
                </p>
              </div>
            ) : (
              <p style={s(p6).body}>
                ¡Felicidades! No reportas condiciones de salud preexistentes.
                Mantener hábitos saludables es la mejor forma de protegerte.
              </p>
            )}
          </FadeIn>
        </div>
      ),
    });

    // 8 — Score + CTA
    const p7 = slidePalettes[7];
    out.push({
      palette: p7,
      content: (
        <div
          style={{
            textAlign: 'center',
            width: '100%',
            maxWidth: '480px',
          }}
        >
          <FadeIn delay={200}>
            <div style={s(p7).small}>Tu puntaje total</div>
            <div style={s(p7).bigNum}>
              {result.total}
              <span style={{ fontSize: '32px', opacity: 0.4 }}>/20</span>
            </div>
          </FadeIn>

          <FadeIn delay={400}>
            <div style={{ marginBottom: '12px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '14px',
                  opacity: 0.6,
                  marginBottom: '4px',
                }}
              >
                <span>Exposición</span>
                <span>{result.exposure}/10</span>
              </div>
              <div style={s(p7).bar}>
                <div
                  style={{
                    ...s(p7).barFill,
                    width: `${(result.exposure / 10) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '14px',
                  opacity: 0.6,
                  marginBottom: '4px',
                }}
              >
                <span>Vulnerabilidad</span>
                <span>{result.vulnerability}/10</span>
              </div>
              <div style={s(p7).bar}>
                <div
                  style={{
                    ...s(p7).barFill,
                    width: `${(result.vulnerability / 10) * 100}%`,
                  }}
                />
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={700}>
            <p style={{ fontSize: '16px', lineHeight: 1.7, opacity: 0.75, marginBottom: '8px' }}>
              Ante la crisis de aire,{' '}
              <span style={{ fontWeight: 700, color: p7.accent }}>
                NO TE QUEDES EN CASA
              </span>
              . Sal y pide un cambio.
            </p>
          </FadeIn>

          <FadeIn delay={900}>
            <button
              style={s(p7).cta}
              onClick={() => navigate('/map')}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Explorar el mapa
            </button>
          </FadeIn>
        </div>
      ),
    });

    return out;
  }, [answers, result, dailyAir, cpRiskLevel, colonia, navigate]);

  // Navigation
  const total = slides.length;

  const goTo = useCallback(
    (i: number) => {
      if (i >= 0 && i < total) {
        setCurrentSlide(i);
        setAnimKey((k) => k + 1);
      }
    },
    [total]
  );

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goTo(Math.min(currentSlide + 1, total - 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goTo(Math.max(currentSlide - 1, 0));
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [currentSlide, goTo, total]);

  // Touch swipe
  const [touchX, setTouchX] = useState<number | null>(null);

  const slide = slides[currentSlide];
  if (!slide) return null;
  const palette = slide.palette;
  const st = s(palette);

  return (
    <div
      style={st.slide}
      onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX === null) return;
        const diff = touchX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 60) {
          goTo(diff > 0 ? Math.min(currentSlide + 1, total - 1) : Math.max(currentSlide - 1, 0));
        }
        setTouchX(null);
      }}
    >
      <div style={st.topLabel}>AIRE LIBRE</div>
      <div style={st.counter}>
        {currentSlide + 1} / {total}
      </div>

      <div
        key={`s-${currentSlide}-${animKey}`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          maxWidth: '600px',
        }}
      >
        {slide.content}
      </div>

      {/* Arrows */}
      {currentSlide > 0 && (
        <button
          style={{ ...st.arrow, left: '16px' }}
          onClick={() => goTo(currentSlide - 1)}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
          }}
        >
          ‹
        </button>
      )}
      {currentSlide < total - 1 && (
        <button
          style={{ ...st.arrow, right: '16px' }}
          onClick={() => goTo(currentSlide + 1)}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
          }}
        >
          ›
        </button>
      )}

      {/* Dots */}
      <div style={st.dots}>
        {slides.map((_, i) => (
          <button
            key={i}
            style={{
              ...st.dot,
              backgroundColor:
                i === currentSlide ? palette.accent : 'rgba(255,255,255,0.25)',
              transform: i === currentSlide ? 'scale(1.3)' : 'scale(1)',
            }}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default QuizResult;
