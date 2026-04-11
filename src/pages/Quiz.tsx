import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizQuestions } from '../data/quizData';
import { coloniaService } from '../services/coloniaService';
import type { QuizAnswers } from '../data/quizData';
import type { Colonia } from '../types';

// ============================================================
// Styles — Aire Libre blue theme
// ============================================================

const C = {
  bg: '#7CB9E2',
  white: '#fff',
  dark: '#1C2333',
  accent: '#fff',
  dimmed: 'rgba(255,255,255,0.6)',
  cardBg: 'rgba(255,255,255,0.12)',
  cardBgHover: 'rgba(255,255,255,0.2)',
  cardBorder: 'rgba(255,255,255,0.25)',
  cardSelected: 'rgba(255,255,255,0.25)',
  selectedBorder: '#fff',
  inputBg: 'rgba(255,255,255,0.15)',
  inputBorder: 'rgba(255,255,255,0.3)',
  inputFocus: '#fff',
  btnBg: 'rgba(28,35,51,0.65)',
  btnBorder: 'rgba(255,255,255,0.35)',
  progressBg: 'rgba(255,255,255,0.15)',
  progressFill: '#fff',
  success: '#86efac',
  error: '#fca5a5',
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: 'calc(100vh - var(--header-height))',
    background: 'linear-gradient(170deg, #9DD0F3 0%, #7CB9E2 30%, #6AADDA 60%, #5A9FCC 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: "'Space Mono', monospace",
    color: C.white,
    position: 'relative',
    overflow: 'hidden',
  },
  progressBarContainer: {
    position: 'fixed',
    top: 'var(--header-height)', left: 0, right: 0,
    height: '4px',
    backgroundColor: C.progressBg,
    zIndex: 100,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: C.progressFill,
    transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    borderRadius: '0 2px 2px 0',
  },
  header: {
    width: '100%',
    padding: '24px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    zIndex: 10,
  },
  logo: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '24px',
    fontWeight: 400,
    color: C.white,
    letterSpacing: '4px',
    textTransform: 'uppercase' as const,
  },
  stepCounter: {
    fontSize: '13px',
    color: C.dimmed,
    fontVariantNumeric: 'tabular-nums',
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '560px',
    padding: '0 24px 120px',
  },
  blockLabel: {
    display: 'inline-block',
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '2.5px',
    textTransform: 'uppercase' as const,
    color: C.dimmed,
    marginBottom: '12px',
  },
  questionText: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '36px',
    fontWeight: 400,
    lineHeight: 1.15,
    color: C.white,
    marginBottom: '8px',
    textAlign: 'center' as const,
    letterSpacing: '1px',
  },
  helpText: {
    fontSize: '13px',
    color: C.dimmed,
    lineHeight: 1.6,
    textAlign: 'center' as const,
    marginBottom: '32px',
    maxWidth: '480px',
  },
  enterHint: {
    fontSize: '12px',
    color: C.dimmed,
    marginTop: '16px',
    textAlign: 'center' as const,
    opacity: 0.7,
  },
  enterKey: {
    display: 'inline-block',
    padding: '2px 8px',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 700,
    color: C.white,
    marginLeft: '4px',
  },
  optionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    width: '100%',
    maxWidth: '440px',
  },
  option: {
    padding: '14px 18px',
    backgroundColor: C.cardBg,
    border: `1.5px solid transparent`,
    borderRadius: '10px',
    fontSize: '14px',
    lineHeight: 1.4,
    color: C.white,
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    textAlign: 'left' as const,
    fontFamily: "'Space Mono', monospace",
    backdropFilter: 'blur(8px)',
  },
  optionSelected: {
    backgroundColor: C.cardSelected,
    borderColor: C.selectedBorder,
    fontWeight: 700,
  },
  optionHover: {
    backgroundColor: C.cardBgHover,
    borderColor: C.cardBorder,
  },
  inputField: {
    width: '100%',
    maxWidth: '440px',
    padding: '14px 18px',
    fontSize: '16px',
    fontFamily: "'Space Mono', monospace",
    color: C.white,
    backgroundColor: C.inputBg,
    border: `1.5px solid ${C.inputBorder}`,
    borderRadius: '10px',
    outline: 'none',
    transition: 'all 0.25s ease',
    backdropFilter: 'blur(8px)',
    boxSizing: 'border-box' as const,
  },
  inputWrapper: {
    position: 'relative',
    width: '100%',
    maxWidth: '440px',
  },
  inputSuffix: {
    position: 'absolute',
    right: '18px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '14px',
    color: C.dimmed,
    pointerEvents: 'none' as const,
  },
  cpStatus: {
    marginTop: '12px',
    fontSize: '13px',
    textAlign: 'center' as const,
    transition: 'all 0.3s ease',
  },
  footer: {
    position: 'fixed',
    bottom: 0, left: 0, right: 0,
    padding: '20px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(90,159,204,0.85)',
    backdropFilter: 'blur(12px)',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    zIndex: 50,
  },
  btnBack: {
    padding: '11px 22px',
    fontSize: '13px',
    fontFamily: "'Space Mono', monospace",
    color: C.dimmed,
    backgroundColor: 'transparent',
    border: `1.5px solid rgba(255,255,255,0.25)`,
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    fontWeight: 700,
  },
  btnNext: {
    padding: '11px 28px',
    fontSize: '13px',
    fontWeight: 700,
    fontFamily: "'Space Mono', monospace",
    color: C.white,
    backgroundColor: C.btnBg,
    border: `1.5px solid ${C.btnBorder}`,
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    backdropFilter: 'blur(8px)',
  },
  btnDisabled: {
    opacity: 0.35,
    cursor: 'not-allowed',
  },
  welcomeContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center' as const,
    padding: '0 24px',
    maxWidth: '560px',
  },
  welcomeTitle: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '52px',
    fontWeight: 400,
    color: C.white,
    marginBottom: '24px',
    lineHeight: 1.05,
    letterSpacing: '2px',
  },
  welcomeText: {
    fontSize: '14px',
    lineHeight: 1.7,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: '16px',
  },
  welcomeDisclaimer: {
    fontSize: '12px',
    color: C.dimmed,
    fontStyle: 'italic',
    marginBottom: '40px',
  },
  btnStart: {
    padding: '14px 44px',
    fontSize: '14px',
    fontWeight: 700,
    fontFamily: "'Space Mono', monospace",
    color: C.white,
    backgroundColor: C.btnBg,
    border: `1.5px solid ${C.btnBorder}`,
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    letterSpacing: '0.5px',
    backdropFilter: 'blur(8px)',
  },
  blockTransition: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center' as const,
    padding: '0 24px',
  },
  blockNumber: {
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '3px',
    textTransform: 'uppercase' as const,
    color: C.dimmed,
    marginBottom: '16px',
  },
  blockTitle: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '44px',
    fontWeight: 400,
    color: C.white,
    lineHeight: 1.1,
    marginBottom: '12px',
    letterSpacing: '2px',
  },
  blockSubtitle: {
    fontSize: '14px',
    lineHeight: 1.6,
    color: C.dimmed,
    maxWidth: '440px',
  },
};

// ============================================================
// Fade-in
// ============================================================

const FadeIn: React.FC<{ children: React.ReactNode; delay?: number }> = ({
  children,
  delay = 0,
}) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }}
    >
      {children}
    </div>
  );
};

// ============================================================
// Quiz Component
// ============================================================

type Screen = 'welcome' | 'blockIntro' | 'question' | 'airCalcPrompt' | 'airCalcInput';

const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<Screen>('welcome');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const [animKey, setAnimKey] = useState(0);

  const [cpColonia, setCpColonia] = useState<Colonia | null>(null);
  const [cpLoading, setCpLoading] = useState(false);
  const [cpError, setCpError] = useState(false);

  const isAdvancing = useRef(false);

  const currentQuestion = quizQuestions[currentIndex];
  const totalQuestions = quizQuestions.length;
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  useEffect(() => {
    isAdvancing.current = false;
  }, [currentIndex, screen]);

  useEffect(() => {
    const cp = (answers.codigoPostal as string) || '';
    if (cp.length < 5) {
      setCpColonia(null);
      setCpError(false);
      return;
    }
    const timeout = setTimeout(async () => {
      setCpLoading(true);
      setCpError(false);
      try {
        const colonia = await coloniaService.getColoniaByCP(cp);
        if (colonia) {
          setCpColonia(colonia);
          setCpError(false);
        } else {
          setCpColonia(null);
          setCpError(true);
        }
      } catch {
        setCpColonia(null);
        setCpError(true);
      }
      setCpLoading(false);
    }, 500);
    return () => clearTimeout(timeout);
  }, [answers.codigoPostal]);

  const isCurrentAnswered = useCallback((): boolean => {
    if (!currentQuestion) return false;
    const answer = answers[currentQuestion.id];
    if (currentQuestion.id === 'codigoPostal') return cpColonia !== null;
    if (!answer) return false;
    if (Array.isArray(answer)) return answer.length > 0;
    return String(answer).trim().length > 0;
  }, [answers, currentQuestion, cpColonia]);

  const handleMultiSelect = (questionId: string, value: string) => {
    setAnswers((prev) => {
      const current = (prev[questionId] as string[]) || [];
      if (value === 'ninguna') return { ...prev, [questionId]: ['ninguna'] };
      const withoutNinguna = current.filter((v) => v !== 'ninguna');
      if (withoutNinguna.includes(value)) {
        return { ...prev, [questionId]: withoutNinguna.filter((v) => v !== value) };
      }
      return { ...prev, [questionId]: [...withoutNinguna, value] };
    });
  };

  const handleInputChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const finishQuiz = useCallback(
    (finalAnswers: QuizAnswers) => {
      sessionStorage.setItem('quizAnswers', JSON.stringify(finalAnswers));
      if (cpColonia) {
        sessionStorage.setItem('quizColonia', JSON.stringify(cpColonia));
      }
      navigate('/quiz/resultado');
    },
    [cpColonia, navigate]
  );

  const saveAndFinish = useCallback(
    (finalAnswers: QuizAnswers) => {
      setAnswers(finalAnswers);
      setScreen('airCalcPrompt');
      setAnimKey((k) => k + 1);
    },
    []
  );

  const advanceToNext = useCallback(
    (overrideAnswers?: QuizAnswers) => {
      if (isAdvancing.current) return;
      isAdvancing.current = true;

      const finalAnswers = overrideAnswers || answers;

      if (currentIndex < totalQuestions - 1) {
        const nextIndex = currentIndex + 1;
        const nextQuestion = quizQuestions[nextIndex];
        const enteringNewBlock = nextQuestion.block !== currentQuestion.block;
        setCurrentIndex(nextIndex);
        setAnimKey((k) => k + 1);
        if (enteringNewBlock) setScreen('blockIntro');
      } else {
        saveAndFinish(finalAnswers);
      }
    },
    [currentIndex, totalQuestions, currentQuestion, answers, saveAndFinish]
  );

  const goBack = () => {
    if (screen === 'blockIntro') {
      setScreen('question');
      return;
    }
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setAnimKey((k) => k + 1);
    } else {
      setScreen('welcome');
    }
  };

  const startQuiz = useCallback(() => {
    setScreen('blockIntro');
    setAnimKey((k) => k + 1);
  }, []);

  const continueFromBlockIntro = useCallback(() => {
    setScreen('question');
    setAnimKey((k) => k + 1);
  }, []);

  const handleSingleSelectAndAdvance = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setTimeout(() => {
      const updatedAnswers = { ...answers, [questionId]: value };
      advanceToNext(updatedAnswers);
    }, 350);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Enter') return;

      if (screen === 'welcome') {
        e.preventDefault();
        startQuiz();
      } else if (screen === 'blockIntro') {
        e.preventDefault();
        continueFromBlockIntro();
      } else if (screen === 'question') {
        const type = currentQuestion?.type;
        if ((type === 'text' || type === 'number') && isCurrentAnswered()) {
          e.preventDefault();
          advanceToNext();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screen, currentQuestion, isCurrentAnswered, advanceToNext, startQuiz, continueFromBlockIntro]);

  // ── Google Fonts ──
  const fontLink = (
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap');`}</style>
  );

  // --------------------------------------------------------
  // Welcome
  // --------------------------------------------------------
  if (screen === 'welcome') {
    return (
      <div style={styles.container}>
        {fontLink}
        <div style={styles.header}>
          <div style={styles.logo}>AIRE LIBRE</div>
        </div>
        <div style={{ ...styles.content, justifyContent: 'center' }}>
          <FadeIn>
            <div style={styles.welcomeContainer}>
              <h1 style={styles.welcomeTitle}>Conoce tu nivel de riesgo en diferentes puntos de la ciudad</h1>
              <p style={styles.welcomeText}>
                Te damos la bienvenida a este test. Aquí conocerás, de forma
                personalizada, tu nivel de riesgo según la calidad del aire, así como
                las vulnerabilidades sociales y biológicas que influyen en tu
                exposición.
              </p>
              <p style={styles.welcomeText}>
                Esta es una herramienta para entender cómo el entorno, tus hábitos y tu
                cuerpo interactúan, así como encontrar maneras de mejorar tu calidad de
                vida.
              </p>
              <p style={styles.welcomeDisclaimer}>
                No es un diagnóstico médico. Tus respuestas son anónimas y esta
                información no será almacenada.
              </p>
              <button
                style={styles.btnStart}
                onClick={startQuiz}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Comenzar el test
              </button>
              <p style={styles.enterHint}>
                o presiona <span style={styles.enterKey}>Enter ↵</span>
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------
  // Block intro
  // --------------------------------------------------------
  if (screen === 'blockIntro') {
    const q = quizQuestions[currentIndex];
    return (
      <div style={styles.container}>
        {fontLink}
        <div style={styles.progressBarContainer}>
          <div style={{ ...styles.progressBarFill, width: `${progress}%` }} />
        </div>
        <div style={styles.header}>
          <div style={styles.logo}>AIRE LIBRE</div>
          <div style={styles.stepCounter}>Bloque {q.block} de 4</div>
        </div>
        <div style={{ ...styles.content, justifyContent: 'center' }}>
          <FadeIn key={`block-${q.block}-${animKey}`}>
            <div style={styles.blockTransition}>
              <div style={styles.blockNumber}>Bloque {q.block}</div>
              <h2 style={styles.blockTitle}>{q.blockTitle}</h2>
              {q.blockSubtitle && <p style={styles.blockSubtitle}>{q.blockSubtitle}</p>}
            </div>
          </FadeIn>
        </div>
        <div style={styles.footer}>
          <button style={styles.btnBack} onClick={goBack}>Atrás</button>
          <button
            style={styles.btnNext}
            onClick={continueFromBlockIntro}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Continuar
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------
  // Air Calculator Prompt
  // --------------------------------------------------------
  if (screen === 'airCalcPrompt') {
    return (
      <div style={styles.container}>
        {fontLink}
        <div style={styles.progressBarContainer}>
          <div style={{ ...styles.progressBarFill, width: '100%' }} />
        </div>
        <div style={styles.header}>
          <div style={styles.logo}>AIRE LIBRE</div>
        </div>
        <div style={{ ...styles.content, justifyContent: 'center' }}>
          <FadeIn key={`air-prompt-${animKey}`}>
            <div style={{ textAlign: 'center', maxWidth: '520px', padding: '0 24px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌬️</div>
              <h2 style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '36px',
                fontWeight: 400,
                color: C.white,
                marginBottom: '16px',
                lineHeight: 1.1,
                letterSpacing: '1px',
              }}>
                ¿Quieres saber cuánto aire respiras al día?
              </h2>
              <p style={{
                fontSize: '14px',
                color: C.dimmed,
                lineHeight: 1.7,
                marginBottom: '8px',
              }}>
                Con tu peso y estatura podemos calcular cuántos litros de aire inhala tu cuerpo cada día.
              </p>
              <p style={{
                fontSize: '12px',
                color: 'rgba(255,255,255,0.45)',
                fontStyle: 'italic',
                marginBottom: '32px',
              }}>
                Estos datos no se almacenan y solo se usan para el cálculo.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                <button
                  style={styles.btnStart}
                  onClick={() => { setScreen('airCalcInput'); setAnimKey((k) => k + 1); }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Sí, quiero saber
                </button>
                <button
                  style={{
                    ...styles.btnBack,
                    fontSize: '13px',
                    padding: '11px 28px',
                  }}
                  onClick={() => finishQuiz(answers)}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.white; e.currentTarget.style.color = C.white; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = C.dimmed; }}
                >
                  No, ver mis resultados
                </button>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------
  // Air Calculator Input
  // --------------------------------------------------------
  if (screen === 'airCalcInput') {
    const pesoVal = (answers.peso as string) || '';
    const estaturaVal = (answers.estatura as string) || '';
    const bothFilled = pesoVal.length > 0 && estaturaVal.length > 0;

    return (
      <div style={styles.container}>
        {fontLink}
        <div style={styles.progressBarContainer}>
          <div style={{ ...styles.progressBarFill, width: '100%' }} />
        </div>
        <div style={styles.header}>
          <div style={styles.logo}>AIRE LIBRE</div>
        </div>
        <div style={{ ...styles.content, justifyContent: 'center' }}>
          <FadeIn key={`air-input-${animKey}`}>
            <div style={{ textAlign: 'center', maxWidth: '420px', padding: '0 24px' }}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>🌬️</div>
              <h2 style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '32px',
                fontWeight: 400,
                color: C.white,
                marginBottom: '24px',
                letterSpacing: '1px',
              }}>
                Calculadora de aire
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                <div style={styles.inputWrapper}>
                  <label style={{ fontSize: '12px', color: C.dimmed, marginBottom: '6px', display: 'block', textAlign: 'left' }}>¿Cuánto pesas?</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="number"
                      style={styles.inputField}
                      placeholder="Ej: 70"
                      value={pesoVal}
                      onChange={(e) => handleInputChange('peso', e.target.value)}
                      onFocus={(e) => { e.currentTarget.style.borderColor = C.white; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = C.inputBorder; }}
                      autoFocus
                    />
                    <span style={styles.inputSuffix}>kg</span>
                  </div>
                </div>

                <div style={styles.inputWrapper}>
                  <label style={{ fontSize: '12px', color: C.dimmed, marginBottom: '6px', display: 'block', textAlign: 'left' }}>¿Cuántos centímetros mides?</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="number"
                      style={styles.inputField}
                      placeholder="Ej: 170"
                      value={estaturaVal}
                      onChange={(e) => handleInputChange('estatura', e.target.value)}
                      onFocus={(e) => { e.currentTarget.style.borderColor = C.white; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = C.inputBorder; }}
                    />
                    <span style={styles.inputSuffix}>cm</span>
                  </div>
                </div>
              </div>

              <button
                style={{ ...styles.btnStart, ...(!bothFilled ? styles.btnDisabled : {}) }}
                onClick={bothFilled ? () => finishQuiz(answers) : undefined}
                onMouseEnter={(e) => {
                  if (bothFilled) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Ver mis resultados
              </button>
              <button
                style={{
                  ...styles.btnBack,
                  fontSize: '12px',
                  padding: '10px 24px',
                  marginTop: '12px',
                }}
                onClick={() => { setScreen('airCalcPrompt'); setAnimKey((k) => k + 1); }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.white; e.currentTarget.style.color = C.white; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = C.dimmed; }}
              >
                Atrás
              </button>
            </div>
          </FadeIn>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------
  // Question
  // --------------------------------------------------------
  const answered = isCurrentAnswered();
  const isLastQuestion = currentIndex === totalQuestions - 1;

  return (
    <div style={styles.container}>
      {fontLink}
      <div style={styles.progressBarContainer}>
        <div style={{ ...styles.progressBarFill, width: `${progress}%` }} />
      </div>
      <div style={styles.header}>
        <div style={styles.logo}>AIRE LIBRE</div>
        <div style={styles.stepCounter}>{currentIndex + 1} / {totalQuestions}</div>
      </div>
      <div style={styles.content}>
        <FadeIn key={`q-${currentIndex}-${animKey}`}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={styles.blockLabel}>{currentQuestion.blockTitle}</div>
            <h2 style={styles.questionText}>{currentQuestion.question}</h2>
            {currentQuestion.helpText && <p style={styles.helpText}>{currentQuestion.helpText}</p>}
            {!currentQuestion.helpText && <div style={{ height: '24px' }} />}

            {/* Text / Number input */}
            {(currentQuestion.type === 'text' || currentQuestion.type === 'number') && (
              <div style={styles.inputWrapper}>
                <input
                  type={currentQuestion.type === 'number' ? 'number' : 'text'}
                  style={styles.inputField}
                  placeholder={currentQuestion.placeholder}
                  value={(answers[currentQuestion.id] as string) || ''}
                  onChange={(e) => handleInputChange(currentQuestion.id, e.target.value)}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = C.white;
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = C.inputBorder;
                    e.currentTarget.style.backgroundColor = C.inputBg;
                  }}
                  autoFocus
                />
                {currentQuestion.suffix && (
                  <span style={styles.inputSuffix}>{currentQuestion.suffix}</span>
                )}
                {currentQuestion.id === 'codigoPostal' && (
                  <div style={styles.cpStatus}>
                    {cpLoading && <span style={{ color: C.dimmed }}>Buscando tu zona...</span>}
                    {cpColonia && !cpLoading && (
                      <span style={{ color: C.success }}>✓ {cpColonia.colonias}, {cpColonia.municipio}</span>
                    )}
                    {cpError && !cpLoading && (
                      <span style={{ color: C.error }}>
                        No encontramos ese código postal. Intenta con otro.
                      </span>
                    )}
                  </div>
                )}
                {answered && (
                  <p style={styles.enterHint}>
                    Presiona <span style={styles.enterKey}>Enter ↵</span> para continuar
                  </p>
                )}
              </div>
            )}

            {/* Single select */}
            {currentQuestion.type === 'single' && (
              <div style={styles.optionsContainer}>
                {currentQuestion.options?.map((opt) => {
                  const isSelected = answers[currentQuestion.id] === opt.value;
                  const isHovered = hoveredOption === opt.value;
                  return (
                    <button
                      key={opt.value}
                      style={{
                        ...styles.option,
                        ...(isSelected ? styles.optionSelected : {}),
                        ...(isHovered && !isSelected ? styles.optionHover : {}),
                      }}
                      onClick={() => handleSingleSelectAndAdvance(currentQuestion.id, opt.value)}
                      onMouseEnter={() => setHoveredOption(opt.value)}
                      onMouseLeave={() => setHoveredOption(null)}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Multi select */}
            {currentQuestion.type === 'multi' && (
              <>
                <div style={styles.optionsContainer}>
                  {currentQuestion.options?.map((opt) => {
                    const selected = (answers[currentQuestion.id] as string[]) || [];
                    const isSelected = selected.includes(opt.value);
                    const isHovered = hoveredOption === opt.value;
                    return (
                      <button
                        key={opt.value}
                        style={{
                          ...styles.option,
                          ...(isSelected ? styles.optionSelected : {}),
                          ...(isHovered && !isSelected ? styles.optionHover : {}),
                        }}
                        onClick={() => handleMultiSelect(currentQuestion.id, opt.value)}
                        onMouseEnter={() => setHoveredOption(opt.value)}
                        onMouseLeave={() => setHoveredOption(null)}
                      >
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                          <span
                            style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '4px',
                              border: isSelected ? '2px solid #fff' : '2px solid rgba(255,255,255,0.3)',
                              backgroundColor: isSelected ? '#fff' : 'transparent',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              transition: 'all 0.2s ease',
                              fontSize: '11px',
                              color: '#1C2333',
                            }}
                          >
                            {isSelected && '✓'}
                          </span>
                          {opt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {answered && (
                  <p style={styles.enterHint}>
                    Selecciona todas las que apliquen, luego presiona{' '}
                    <span style={styles.enterKey}>Siguiente</span>
                  </p>
                )}
              </>
            )}
          </div>
        </FadeIn>
      </div>

      <div style={styles.footer}>
        <button
          style={styles.btnBack}
          onClick={goBack}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.white; e.currentTarget.style.color = C.white; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = C.dimmed; }}
        >
          Atrás
        </button>
        <button
          style={{ ...styles.btnNext, ...(!answered ? styles.btnDisabled : {}) }}
          onClick={answered ? () => advanceToNext() : undefined}
          onMouseEnter={(e) => {
            if (answered) {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {isLastQuestion ? 'Ver resultados' : 'Siguiente'}
        </button>
      </div>
    </div>
  );
};

export default Quiz;