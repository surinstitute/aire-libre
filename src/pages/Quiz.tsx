import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizQuestions } from '../data/quizData';
import { coloniaService } from '../services/coloniaService';
import type { QuizAnswers } from '../data/quizData';
import type { Colonia } from '../types';

// ============================================================
// Styles (matches project palette: beige #F5F0E8, wine #A62C2B)
// ============================================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#F5F0E8',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: "'Lora', Georgia, serif",
    color: '#2D2D2D',
    position: 'relative',
    overflow: 'hidden',
  },
  progressBarContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    backgroundColor: 'rgba(166, 44, 43, 0.15)',
    zIndex: 100,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#A62C2B',
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
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '20px',
    fontWeight: 700,
    color: '#A62C2B',
    letterSpacing: '2px',
    textTransform: 'uppercase' as const,
  },
  stepCounter: {
    fontSize: '14px',
    color: '#8B7E74',
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
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '2.5px',
    textTransform: 'uppercase' as const,
    color: '#A62C2B',
    marginBottom: '12px',
    opacity: 0.8,
  },
  questionText: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '28px',
    fontWeight: 600,
    lineHeight: 1.35,
    color: '#2D2D2D',
    marginBottom: '8px',
    textAlign: 'center' as const,
  },
  helpText: {
    fontSize: '15px',
    color: '#8B7E74',
    lineHeight: 1.5,
    textAlign: 'center' as const,
    marginBottom: '32px',
    maxWidth: '480px',
  },
  enterHint: {
    fontSize: '13px',
    color: '#8B7E74',
    marginTop: '16px',
    textAlign: 'center' as const,
    opacity: 0.6,
  },
  enterKey: {
    display: 'inline-block',
    padding: '2px 8px',
    backgroundColor: 'rgba(166, 44, 43, 0.08)',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 600,
    color: '#A62C2B',
    marginLeft: '4px',
  },
  optionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    width: '100%',
    maxWidth: '440px',
  },
  option: {
    padding: '16px 20px',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    border: '2px solid transparent',
    borderRadius: '12px',
    fontSize: '16px',
    lineHeight: 1.4,
    color: '#2D2D2D',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    textAlign: 'left' as const,
    fontFamily: "'Lora', Georgia, serif",
    backdropFilter: 'blur(8px)',
  },
  optionSelected: {
    backgroundColor: 'rgba(166, 44, 43, 0.08)',
    borderColor: '#A62C2B',
    color: '#A62C2B',
    fontWeight: 600,
  },
  optionHover: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderColor: 'rgba(166, 44, 43, 0.3)',
  },
  inputField: {
    width: '100%',
    maxWidth: '440px',
    padding: '16px 20px',
    fontSize: '18px',
    fontFamily: "'Lora', Georgia, serif",
    color: '#2D2D2D',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    border: '2px solid rgba(166, 44, 43, 0.2)',
    borderRadius: '12px',
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
    right: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '16px',
    color: '#8B7E74',
    pointerEvents: 'none' as const,
  },
  cpStatus: {
    marginTop: '12px',
    fontSize: '14px',
    textAlign: 'center' as const,
    transition: 'all 0.3s ease',
  },
  footer: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '20px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 240, 232, 0.9)',
    backdropFilter: 'blur(12px)',
    borderTop: '1px solid rgba(166, 44, 43, 0.1)',
    zIndex: 50,
  },
  btnBack: {
    padding: '12px 24px',
    fontSize: '15px',
    fontFamily: "'Lora', Georgia, serif",
    color: '#8B7E74',
    backgroundColor: 'transparent',
    border: '1.5px solid #D4CBC0',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
  },
  btnNext: {
    padding: '12px 32px',
    fontSize: '15px',
    fontWeight: 600,
    fontFamily: "'Lora', Georgia, serif",
    color: '#F5F0E8',
    backgroundColor: '#A62C2B',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
  },
  btnDisabled: {
    opacity: 0.4,
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
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '42px',
    fontWeight: 700,
    color: '#A62C2B',
    marginBottom: '24px',
    lineHeight: 1.15,
  },
  welcomeText: {
    fontSize: '17px',
    lineHeight: 1.7,
    color: '#5A5149',
    marginBottom: '16px',
  },
  welcomeDisclaimer: {
    fontSize: '14px',
    color: '#8B7E74',
    fontStyle: 'italic',
    marginBottom: '40px',
  },
  btnStart: {
    padding: '16px 48px',
    fontSize: '17px',
    fontWeight: 600,
    fontFamily: "'Lora', Georgia, serif",
    color: '#F5F0E8',
    backgroundColor: '#A62C2B',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    letterSpacing: '0.5px',
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
    fontSize: '13px',
    fontWeight: 600,
    letterSpacing: '3px',
    textTransform: 'uppercase' as const,
    color: '#A62C2B',
    opacity: 0.6,
    marginBottom: '16px',
  },
  blockTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '36px',
    fontWeight: 700,
    color: '#2D2D2D',
    lineHeight: 1.25,
    marginBottom: '12px',
  },
  blockSubtitle: {
    fontSize: '16px',
    lineHeight: 1.6,
    color: '#8B7E74',
    maxWidth: '440px',
  },
};

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

type Screen = 'welcome' | 'blockIntro' | 'question';

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

  const answeredRef = useRef(false);

  const currentQuestion = quizQuestions[currentIndex];
  const totalQuestions = quizQuestions.length;
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  // Validate CP against Supabase
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

  // Check if answered
  const isCurrentAnswered = useCallback((): boolean => {
    if (!currentQuestion) return false;
    const answer = answers[currentQuestion.id];
    if (currentQuestion.id === 'codigoPostal') return cpColonia !== null;
    if (!answer) return false;
    if (Array.isArray(answer)) return answer.length > 0;
    return String(answer).trim().length > 0;
  }, [answers, currentQuestion, cpColonia]);

  useEffect(() => {
    answeredRef.current = isCurrentAnswered();
  }, [isCurrentAnswered]);

  // Handlers
  const handleSingleSelect = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

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

  const saveAndFinish = useCallback(
    (finalAnswers: QuizAnswers) => {
      sessionStorage.setItem('quizAnswers', JSON.stringify(finalAnswers));
      if (cpColonia) {
        sessionStorage.setItem('quizColonia', JSON.stringify(cpColonia));
      }
      navigate('/quiz/resultado');
    },
    [cpColonia, navigate]
  );

  const goNext = useCallback(() => {
    if (currentIndex < totalQuestions - 1) {
      const nextIndex = currentIndex + 1;
      const nextQuestion = quizQuestions[nextIndex];
      const enteringNewBlock = nextQuestion.block !== currentQuestion.block;
      setCurrentIndex(nextIndex);
      setAnimKey((k) => k + 1);
      if (enteringNewBlock) setScreen('blockIntro');
    } else {
      saveAndFinish(answers);
    }
  }, [currentIndex, totalQuestions, currentQuestion, answers, saveAndFinish]);

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

  // Enter key to advance on any screen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Enter') return;
      if (screen === 'question' && currentQuestion?.type === 'multi') return;

      if (screen === 'welcome') {
        e.preventDefault();
        startQuiz();
      } else if (screen === 'blockIntro') {
        e.preventDefault();
        continueFromBlockIntro();
      } else if (screen === 'question' && answeredRef.current) {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screen, currentQuestion, goNext, startQuiz, continueFromBlockIntro]);

  // Single-select auto-advance on click
  const handleSingleSelectAndAdvance = (questionId: string, value: string) => {
    handleSingleSelect(questionId, value);
    setTimeout(() => {
      if (currentIndex < totalQuestions - 1) {
        const nextIndex = currentIndex + 1;
        const nextQuestion = quizQuestions[nextIndex];
        const enteringNewBlock = nextQuestion.block !== currentQuestion.block;
        setCurrentIndex(nextIndex);
        setAnimKey((k) => k + 1);
        if (enteringNewBlock) setScreen('blockIntro');
      } else {
        saveAndFinish({ ...answers, [questionId]: value });
      }
    }, 300);
  };

  // --------------------------------------------------------
  // Welcome
  // --------------------------------------------------------
  if (screen === 'welcome') {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.logo}>AIRE LIBRE</div>
        </div>
        <div style={{ ...styles.content, justifyContent: 'center' }}>
          <FadeIn>
            <div style={styles.welcomeContainer}>
              <h1 style={styles.welcomeTitle}>Conoce tu nivel de exposición</h1>
              <p style={styles.welcomeText}>
                Te damos la bienvenida a este test. Aquí conocerás, de forma
                personalizada, tu nivel de exposición a la calidad del aire, así
                como las vulnerabilidades sociales y biológicas que influyen en tu
                nivel de riesgo.
              </p>
              <p style={styles.welcomeText}>
                Esta es una herramienta para entender cómo el entorno, tus hábitos
                y tu cuerpo interactúan, así como encontrar maneras de mejorar tu
                calidad de vida.
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
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(166, 44, 43, 0.3)';
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
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(166, 44, 43, 0.25)';
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
  // Question
  // --------------------------------------------------------
  const answered = isCurrentAnswered();
  const isLastQuestion = currentIndex === totalQuestions - 1;

  return (
    <div style={styles.container}>
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
                    e.currentTarget.style.borderColor = '#A62C2B';
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.85)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(166, 44, 43, 0.2)';
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.6)';
                  }}
                  autoFocus
                />
                {currentQuestion.suffix && (
                  <span style={styles.inputSuffix}>{currentQuestion.suffix}</span>
                )}
                {currentQuestion.id === 'codigoPostal' && (
                  <div style={styles.cpStatus}>
                    {cpLoading && <span style={{ color: '#8B7E74' }}>Buscando tu zona...</span>}
                    {cpColonia && !cpLoading && (
                      <span style={{ color: '#2D7A4B' }}>✓ {cpColonia.colonias}, {cpColonia.municipio}</span>
                    )}
                    {cpError && !cpLoading && (
                      <span style={{ color: '#A62C2B' }}>
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

            {/* Single select — auto-advances */}
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
                              width: '20px',
                              height: '20px',
                              borderRadius: '4px',
                              border: isSelected ? '2px solid #A62C2B' : '2px solid #D4CBC0',
                              backgroundColor: isSelected ? '#A62C2B' : 'transparent',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              transition: 'all 0.2s ease',
                              fontSize: '12px',
                              color: '#fff',
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
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#A62C2B'; e.currentTarget.style.color = '#A62C2B'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#D4CBC0'; e.currentTarget.style.color = '#8B7E74'; }}
        >
          Atrás
        </button>
        <button
          style={{ ...styles.btnNext, ...(!answered ? styles.btnDisabled : {}) }}
          onClick={answered ? goNext : undefined}
          onMouseEnter={(e) => {
            if (answered) {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(166, 44, 43, 0.25)';
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
