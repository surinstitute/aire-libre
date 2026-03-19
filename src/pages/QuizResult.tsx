import { useState, useEffect, useMemo, useCallback, useRef, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  calculateResult,
  calculateDailyAir,
  quizQuestions,
} from '../data/quizData';
import type { QuizAnswers, BirdProfile } from '../data/quizData';
import type { Colonia } from '../types';

const Bird3DViewer = lazy(() => import('../components/Bird/Bird3DViewer'));

// ============================================================
// Cumplimiento label mapping — DB value → user-facing text
// ============================================================
const CUMPL_USER_LABEL: Record<string, string> = {
  alto: 'Mejor cumplimiento',
  medio: 'Cumplimiento promedio',
  bajo: 'Cumplimiento bajo',
};

const CUMPL_USER_DESC: Record<string, string> = {
  alto: 'Tu colonia forma parte del tercio con mejores condiciones relativas en calidad del aire, salud y acceso a servicios.',
  medio: 'Tu colonia se encuentra en el tercio intermedio. No está entre las peores, pero tampoco entre las mejores.',
  bajo: 'Tu colonia forma parte del tercio con mayores desventajas en calidad del aire, salud y acceso a servicios.',
};

const CUMPL_COLORS: Record<string, string> = {
  alto: '#86efac',
  medio: '#fcd34d',
  bajo: '#fca5a5',
};

// ============================================================
// Slide palettes
// ============================================================
const slidePalettes = [
  { bg: '#1B3A4B', text: '#F5F0E8', accent: '#86efac' },
  { bg: '#A62C2B', text: '#F5F0E8', accent: '#fcd34d' }, // CP slide — accent overridden per cumplimiento
  { bg: '#2D4A3E', text: '#F5F0E8', accent: '#86efac' },
  { bg: '#4A3728', text: '#F5F0E8', accent: '#fca5a5' },
  { bg: '#1A1A2E', text: '#F5F0E8', accent: '#c4b5fd' },
  { bg: '#5B2C3F', text: '#F5F0E8', accent: '#fbbf24' },
  { bg: '#0F4C3A', text: '#F5F0E8', accent: '#86efac' },
  { bg: '#A62C2B', text: '#F5F0E8', accent: '#F5F0E8' },
];

type Palette = (typeof slidePalettes)[0];

// ============================================================
// Fade-in
// ============================================================
const FadeIn: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}>
      {children}
    </div>
  );
};

// ============================================================
// Share helpers
// ============================================================
const SITE_URL = 'https://aire-libre-tawny.vercel.app';

function getShareText(bird: BirdProfile, _total: number): string {
  return `Hice el test de Aire Libre y soy un ${bird.name} 🐦. ¿Cuál eres tú? Descúbrelo en ${SITE_URL}/quiz`;
}

interface ShareCardData {
  birdEmoji: string;
  birdImageUrl?: string | null;
  birdName: string;
  subtitle: string;
  contextoLabel: string;
  individuoLabel: string;
  rows: { label: string; value: string }[];
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
}

function drawPill(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, bgColor: string, textColor: string) {
  ctx.font = 'bold 13px sans-serif';
  const pw = ctx.measureText(text).width + 24; const ph = 28;
  ctx.fillStyle = bgColor; roundRect(ctx, x - pw / 2, y - ph / 2, pw, ph, 14); ctx.fill();
  ctx.fillStyle = textColor; ctx.textAlign = 'center'; ctx.fillText(text, x, y + 5);
}

function generateShareImage(data: ShareCardData): Promise<Blob | null> {
  const W = 720; const H = 960;
  const canvas = document.createElement('canvas'); canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return Promise.resolve(null);
  const bg = '#1B3A4B'; const accent = '#fcd34d';
  const dim = 'rgba(245,240,232,0.5)'; const line = 'rgba(245,240,232,0.12)'; const white = '#F5F0E8';
  ctx.fillStyle = bg; roundRect(ctx, 0, 0, W, H, 24); ctx.fill();
  ctx.fillStyle = accent; ctx.fillRect(60, 40, W - 120, 3);
  ctx.font = 'bold 14px sans-serif'; ctx.fillStyle = 'rgba(245,240,232,0.4)'; ctx.textAlign = 'center';
  ctx.fillText('A I R E   L I B R E', W / 2, 72);
  const drawRest = () => {
    ctx.font = 'bold 34px sans-serif'; ctx.fillStyle = accent; ctx.textAlign = 'center'; ctx.fillText(data.birdName, W / 2, 185);
    ctx.font = '15px sans-serif'; ctx.fillStyle = dim; ctx.fillText(data.subtitle, W / 2, 212);
    drawPill(ctx, `Contexto: ${data.contextoLabel}`, W / 2 - 120, 248, 'rgba(139,92,246,0.25)', '#c4b5fd');
    drawPill(ctx, `Individuo: ${data.individuoLabel}`, W / 2 + 120, 248, 'rgba(244,114,182,0.25)', '#f9a8d4');
    ctx.strokeStyle = line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(60, 280); ctx.lineTo(W - 60, 280); ctx.stroke();
    const startY = 316; const rowH = 48;
    data.rows.forEach((row, i) => {
      const y = startY + i * rowH;
      ctx.font = '16px sans-serif'; ctx.fillStyle = dim; ctx.textAlign = 'left'; ctx.fillText(row.label, 72, y);
      ctx.font = 'bold 16px sans-serif'; ctx.fillStyle = white; ctx.textAlign = 'right'; ctx.fillText(row.value, W - 72, y);
      if (i < data.rows.length - 1) { ctx.strokeStyle = line; ctx.beginPath(); ctx.moveTo(72, y + 16); ctx.lineTo(W - 72, y + 16); ctx.stroke(); }
    });
    const footerY = startY + data.rows.length * rowH + 24;
    ctx.strokeStyle = line; ctx.beginPath(); ctx.moveTo(60, footerY); ctx.lineTo(W - 60, footerY); ctx.stroke();
    ctx.font = '12px sans-serif'; ctx.fillStyle = 'rgba(245,240,232,0.3)'; ctx.textAlign = 'center';
    ctx.fillText('aire-libre-tawny.vercel.app/quiz', W / 2, footerY + 28);
    ctx.font = 'bold 16px sans-serif'; ctx.fillStyle = accent; ctx.fillText('¿Cuál eres tú? Haz el test →', W / 2, footerY + 58);
    ctx.fillStyle = accent; ctx.fillRect(60, H - 40, W - 120, 3);
  };
  return new Promise((resolve) => {
    if (data.birdImageUrl) {
      const img = new Image(); img.crossOrigin = 'anonymous';
      img.onload = () => { ctx.drawImage(img, W / 2 - 48, 42, 96, 96); drawRest(); canvas.toBlob(b => resolve(b), 'image/png', 1.0); };
      img.onerror = () => { ctx.font = '64px serif'; ctx.textAlign = 'center'; ctx.fillText(data.birdEmoji, W / 2, 140); drawRest(); canvas.toBlob(b => resolve(b), 'image/png', 1.0); };
      img.src = data.birdImageUrl;
    } else {
      ctx.font = '64px serif'; ctx.textAlign = 'center'; ctx.fillText(data.birdEmoji, W / 2, 140);
      drawRest(); canvas.toBlob(b => resolve(b), 'image/png', 1.0);
    }
  });
}

async function shareAsImage(data: ShareCardData, bird: BirdProfile, total: number): Promise<'shared' | 'downloaded' | 'error'> {
  const blob = await generateShareImage(data);
  if (!blob) return 'error';
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 0 && window.innerWidth < 768);
  if (isMobile && navigator.share) {
    const file = new File([blob], 'aire-libre-resultado.png', { type: 'image/png' });
    if (navigator.canShare?.({ files: [file] })) {
      try { await navigator.share({ text: getShareText(bird, total), files: [file] }); return 'shared'; }
      catch (err) { if ((err as Error).name === 'AbortError') return 'shared'; }
    }
  }
  const url = URL.createObjectURL(blob); const a = document.createElement('a');
  a.href = url; a.download = 'aire-libre-resultado.png';
  document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  return 'downloaded';
}

function shareToTwitter(bird: BirdProfile, total: number) {
  const text = encodeURIComponent(`Hice el test de Aire Libre y soy un ${bird.name} 🐦 (${total}/20). ¿Cuál eres tú? Descúbrelo en`);
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(`${SITE_URL}/quiz`)}`, '_blank', 'width=600,height=400');
}

function shareToFacebook() {
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${SITE_URL}/quiz`)}`, '_blank', 'width=600,height=400');
}

// ============================================================
// Style helper
// ============================================================
const s = (p: Palette) => ({
  slide: {
    minHeight: '100vh', width: '100%', backgroundColor: p.bg, color: p.text,
    display: 'flex' as const, flexDirection: 'column' as const, alignItems: 'center' as const, justifyContent: 'center' as const,
    padding: '60px 24px', position: 'relative' as const, fontFamily: "'Space Mono', monospace", overflow: 'hidden', transition: 'background-color 0.6s ease',
  },
  topLabel: {
    position: 'absolute' as const, top: '24px', left: '32px',
    fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', fontWeight: 400,
    letterSpacing: '4px', textTransform: 'uppercase' as const, opacity: 0.5, color: p.text,
  },
  counter: { position: 'absolute' as const, top: '28px', right: '32px', fontSize: '12px', opacity: 0.4, color: p.text, fontVariantNumeric: 'tabular-nums' as const },
  bigNum: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '96px', fontWeight: 400, lineHeight: 1, color: p.accent, marginBottom: '16px', letterSpacing: '2px' },
  title: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '40px', fontWeight: 400, lineHeight: 1.1, textAlign: 'center' as const, marginBottom: '20px', maxWidth: '520px', color: p.text, letterSpacing: '1px' },
  body: { fontSize: '15px', lineHeight: 1.7, textAlign: 'center' as const, maxWidth: '480px', opacity: 0.85, color: p.text },
  accent: { color: p.accent, fontWeight: 700 },
  small: { fontSize: '10px', letterSpacing: '2.5px', textTransform: 'uppercase' as const, opacity: 0.5, marginBottom: '12px' },
  birdName: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '56px', fontWeight: 400, color: p.accent, marginBottom: '8px', textAlign: 'center' as const, letterSpacing: '2px' },
  birdSub: { fontSize: '14px', opacity: 0.7, marginBottom: '28px', textAlign: 'center' as const },
  narrative: { fontSize: '15px', lineHeight: 1.75, textAlign: 'center' as const, maxWidth: '500px', fontStyle: 'italic' as const, opacity: 0.9 },
  closing: { fontSize: '13px', marginTop: '24px', opacity: 0.6, textAlign: 'center' as const, maxWidth: '440px' },
  bar: { width: '100%', maxWidth: '360px', height: '8px', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '4px', marginTop: '8px', marginBottom: '20px', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: '4px', backgroundColor: p.accent, transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)' },
  dots: { position: 'fixed' as const, bottom: '24px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 100 },
  dot: { width: '8px', height: '8px', borderRadius: '50%', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', padding: 0 },
  arrow: {
    position: 'fixed' as const, top: '50%', transform: 'translateY(-50%)', width: '48px', height: '48px', borderRadius: '50%',
    border: '1.5px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)',
    fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    backdropFilter: 'blur(8px)', transition: 'all 0.25s ease', zIndex: 100,
  },
  cta: { padding: '14px 36px', fontSize: '13px', fontWeight: 700, fontFamily: "'Space Mono', monospace", color: p.bg, backgroundColor: p.accent, border: 'none', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.3s ease', letterSpacing: '0.5px' },
  shareBtn: { padding: '10px 18px', fontSize: '12px', fontWeight: 700, fontFamily: "'Space Mono', monospace", color: p.text, backgroundColor: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.2)', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.25s ease', backdropFilter: 'blur(8px)' },
  shareBtnPrimary: { padding: '12px 24px', fontSize: '13px', fontWeight: 700, fontFamily: "'Space Mono', monospace", color: p.bg, backgroundColor: p.accent, border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.25s ease' },
});

// ============================================================
// Component
// ============================================================
interface SlideData { palette: Palette; content: React.ReactNode; }

const QuizResult: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const birdSnapshotFn = useRef<(() => string | null) | null>(null);

  const answers: QuizAnswers = useMemo(() => { try { return JSON.parse(sessionStorage.getItem('quizAnswers') || '{}'); } catch { return {}; } }, []);
  const colonia: Colonia | null = useMemo(() => { try { return JSON.parse(sessionStorage.getItem('quizColonia') || 'null'); } catch { return null; } }, []);

  useEffect(() => { if (Object.keys(answers).length === 0) navigate('/quiz'); }, [answers, navigate]);

  const cpRiskLevel = colonia?.categoria_riesgo ?? 'medio';
  const result = useMemo(() => calculateResult(cpRiskLevel, answers), [cpRiskLevel, answers]);
  const hasPesoEstatura = !!(answers.peso && answers.estatura);
  const dailyAir = useMemo(() => {
    if (!hasPesoEstatura) return null;
    return calculateDailyAir(parseFloat(answers.peso as string) || 70, parseFloat(answers.estatura as string) || 170, answers.edad as string, answers.ejercicio as string);
  }, [answers, hasPesoEstatura]);

  const getLabel = (qId: string, val: string): string => {
    const q = quizQuestions.find((q) => q.id === qId);
    return q?.options?.find((o) => o.value === val)?.label || val;
  };

  const goToMap = useCallback(() => {
    const cp = answers.codigoPostal as string;
    navigate(cp ? `/map?cp=${encodeURIComponent(cp)}` : '/map');
  }, [answers, navigate]);

  const handleShareImage = useCallback(async () => {
    setShareStatus('Generando imagen...');
    const fumaVal = answers.fuma as string;
    const ejVal = answers.ejercicio as string;
    const conds = (answers.condicionesSalud as string[]) || [];
    const hasConds = conds.length > 0 && !conds.includes('ninguna');
    const ctxLabels = ['Favorable', 'Moderado', 'Perjudicial'];
    const indLabels = ['Resistente', 'Medianamente resistente', 'Altamente sensible'];
    const rows = [
      { label: 'Código postal', value: String(answers.codigoPostal) },
      { label: 'Zona', value: CUMPL_USER_LABEL[cpRiskLevel] || cpRiskLevel },
    ];
    if (dailyAir) rows.push({ label: 'Aire diario', value: `${dailyAir.toLocaleString()} L` });
    rows.push(
      { label: 'Edad', value: getLabel('edad', answers.edad as string) },
      { label: 'Tabaco', value: fumaVal === 'fuma' ? 'Sí' : fumaVal === 'exfumador' ? 'Ex' : 'No' },
      { label: 'Ejercicio', value: getLabel('ejercicio', ejVal) },
      { label: 'Condiciones', value: hasConds ? conds.map((c) => getLabel('condicionesSalud', c)).join(', ') : 'Ninguna' },
    );
    const cardData: ShareCardData = {
      birdEmoji: result.bird.emoji,
      birdImageUrl: birdSnapshotFn.current ? birdSnapshotFn.current() : null,
      birdName: result.bird.name, subtitle: result.bird.subtitle,
      contextoLabel: ctxLabels[result.contexto.category], individuoLabel: indLabels[result.individuo.category], rows,
    };
    const status = await shareAsImage(cardData, result.bird, result.total);
    if (status === 'shared') setShareStatus('¡Compartido!');
    else if (status === 'downloaded') setShareStatus('¡Imagen descargada!');
    else setShareStatus('Error al generar imagen');
    setTimeout(() => setShareStatus(null), 3000);
  }, [result, answers, colonia, dailyAir, cpRiskLevel]);

  const fontLink = <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap');`}</style>;

  // ── Build slides ──
  const slides: SlideData[] = useMemo(() => {
    const out: SlideData[] = [];

    // 1 — Bird reveal
    const p0 = slidePalettes[0];
    out.push({ palette: p0, content: (
      <div style={{ textAlign: 'center' }}>
        <FadeIn delay={200}>
          <div style={{ width: '220px', height: '220px', margin: '0 auto 16px' }}>
            <Suspense fallback={<div style={{ fontSize: '80px', textAlign: 'center' }}>{result.bird.emoji}</div>}>
              <Bird3DViewer variant={1} width="220px" height="220px" autoRotateSpeed={0.3} showControls={false} backgroundColor={null} cameraDistance={3.5} onReady={(fn) => { birdSnapshotFn.current = fn; }} />
            </Suspense>
          </div>
        </FadeIn>
        <FadeIn delay={500}><div style={s(p0).birdName}>{result.bird.name}</div></FadeIn>
        <FadeIn delay={700}><div style={s(p0).birdSub}>{result.bird.subtitle}</div></FadeIn>
        <FadeIn delay={900}><div style={s(p0).narrative}>{result.bird.narrative}</div></FadeIn>
        {result.bird.closingLine && <FadeIn delay={1100}><div style={s(p0).closing}>{result.bird.closingLine}</div></FadeIn>}
      </div>
    )});

    // 2 — Código postal + CUMPLIMIENTO (FIXED!)
    const p1 = slidePalettes[1];
    const cumplColor = CUMPL_COLORS[cpRiskLevel] || '#fcd34d';
    const cumplLabel = CUMPL_USER_LABEL[cpRiskLevel] || cpRiskLevel;
    const cumplDesc = CUMPL_USER_DESC[cpRiskLevel] || '';
    out.push({ palette: p1, content: (
      <div style={{ textAlign: 'center' }}>
        <FadeIn delay={200}>
          <div style={s(p1).small}>Tu código postal</div>
          <div style={s(p1).bigNum}>{answers.codigoPostal || '—'}</div>
        </FadeIn>
        <FadeIn delay={500}>
          {colonia ? (
            <div>
              <p style={s(p1).body}>
                Vives en <span style={{ color: cumplColor, fontWeight: 700 }}>{colonia.colonias}, {colonia.municipio}</span>.
              </p>
              <div style={{
                display: 'inline-block', marginTop: '16px', padding: '8px 20px',
                borderRadius: '6px', backgroundColor: cumplColor,
                color: '#1C2333', fontWeight: 700, fontSize: '14px', letterSpacing: '0.5px',
              }}>
                {cumplLabel}
              </div>
              <p style={{ ...s(p1).body, marginTop: '16px', fontSize: '13px', opacity: 0.7 }}>
                {cumplDesc}
              </p>
            </div>
          ) : (
            <div>
              <div style={{
                display: 'inline-block', marginTop: '8px', padding: '8px 20px',
                borderRadius: '6px', backgroundColor: cumplColor,
                color: '#1C2333', fontWeight: 700, fontSize: '14px',
              }}>
                {cumplLabel}
              </div>
            </div>
          )}
        </FadeIn>
      </div>
    )});

    // 3 — Litros de aire
    if (dailyAir) {
      const p2 = slidePalettes[2];
      out.push({ palette: p2, content: (
        <div style={{ textAlign: 'center' }}>
          <FadeIn delay={200}>
            <div style={s(p2).small}>Cada día respiras aproximadamente</div>
            <div style={s(p2).bigNum}>{dailyAir.toLocaleString()}</div>
            <div style={{ fontSize: '18px', opacity: 0.6, marginTop: '-8px', marginBottom: '24px' }}>litros de aire</div>
          </FadeIn>
          <FadeIn delay={600}>
            <p style={s(p2).body}>Eso equivale a aproximadamente <span style={s(p2).accent}>{Math.round(dailyAir / 1000)} mil</span> litros. La calidad de ese aire importa más de lo que crees.</p>
          </FadeIn>
        </div>
      )});
    }

    // 4 — Edad
    const p3 = slidePalettes[3];
    const edadLabel = getLabel('edad', answers.edad as string);
    const isSensitive = answers.edad === 'menor12' || answers.edad === 'mayor65';
    out.push({ palette: p3, content: (
      <div style={{ textAlign: 'center' }}>
        <FadeIn delay={200}><div style={s(p3).title}>{edadLabel}</div></FadeIn>
        <FadeIn delay={500}>
          <p style={s(p3).body}>{isSensitive ? (answers.edad === 'menor12' ? 'Las personas menores de 12 años están en desarrollo y necesitan más aire limpio. Sus pulmones son más vulnerables a los contaminantes.' : 'Las personas mayores de 65 años tienen más afectaciones por la contaminación del aire. El cuidado preventivo es especialmente importante.') : 'Tu rango de edad no presenta una vulnerabilidad biológica elevada, pero el cuidado del aire te beneficia igual.'}</p>
        </FadeIn>
      </div>
    )});

    // 5 — Tabaco
    const p4 = slidePalettes[4];
    const fumaVal = answers.fuma as string;
    out.push({ palette: p4, content: (
      <div style={{ textAlign: 'center' }}>
        <FadeIn delay={200}><div style={s(p4).title}>{fumaVal === 'fuma' ? 'Fumas' : fumaVal === 'exfumador' ? 'Dejaste de fumar' : 'No fumas'}</div></FadeIn>
        <FadeIn delay={500}>
          <p style={s(p4).body}>{fumaVal === 'fuma' ? 'Las personas que fuman tienen hasta 3 veces más riesgo de afectaciones por la calidad del aire.' : fumaVal === 'exfumador' ? 'Haber dejado de fumar es un gran paso. Tu cuerpo se está recuperando.' : 'No fumar reduce significativamente tu riesgo. Tienes hasta 3 veces menos riesgo.'}</p>
        </FadeIn>
      </div>
    )});

    // 6 — Ejercicio
    const p5 = slidePalettes[5];
    const ejVal = answers.ejercicio as string;
    out.push({ palette: p5, content: (
      <div style={{ textAlign: 'center' }}>
        <FadeIn delay={200}><div style={s(p5).title}>{ejVal === '2omas' ? '¡Activo/a!' : ejVal === 'aveces' ? 'Algo de movimiento' : 'Sin ejercicio regular'}</div></FadeIn>
        <FadeIn delay={500}>
          <p style={s(p5).body}>{ejVal === '2omas' ? '¡Tu capacidad pulmonar y salud general son mejores! Intenta hacerlo en horarios con mejor calidad del aire.' : ejVal === 'aveces' ? 'Algo de ejercicio es mejor que nada. Mover el cuerpo fortalece tus pulmones.' : 'El ejercicio regular mejora tu capacidad pulmonar. Incluso caminatas cortas cuentan.'}</p>
        </FadeIn>
      </div>
    )});

    // 7 — Condiciones
    const p6 = slidePalettes[6];
    const conds = (answers.condicionesSalud as string[]) || [];
    const hasConds = conds.length > 0 && !conds.includes('ninguna');
    out.push({ palette: p6, content: (
      <div style={{ textAlign: 'center' }}>
        <FadeIn delay={200}><div style={s(p6).title}>{hasConds ? 'Tu cuerpo necesita atención extra' : '¡Sin condiciones preexistentes!'}</div></FadeIn>
        <FadeIn delay={500}>
          {hasConds ? (
            <div>
              <p style={s(p6).body}>Reportaste: <span style={s(p6).accent}>{conds.map((c) => getLabel('condicionesSalud', c)).join(', ')}</span></p>
              <p style={{ ...s(p6).body, marginTop: '16px' }}>Estas condiciones pueden hacer que tu cuerpo sea más sensible a la contaminación.</p>
            </div>
          ) : (
            <p style={s(p6).body}>No reportas condiciones preexistentes. Mantener hábitos saludables es la mejor forma de protegerte.</p>
          )}
        </FadeIn>
      </div>
    )});

    // 8 — FINAL: Score + Share + CTA
    const pF = slidePalettes[7];
    const contextoLabel = ['Favorable', 'Moderado', 'Perjudicial'][result.contexto.category];
    const individuoLabel = ['Resistente', 'Medianamente resistente', 'Altamente sensible'][result.individuo.category];
    out.push({ palette: pF, content: (
      <div style={{ textAlign: 'center', width: '100%', maxWidth: '500px' }}>
        <FadeIn delay={200}>
          <div style={s(pF).small}>Tu resultado</div>
          <div style={{ width: '100px', height: '100px', margin: '0 auto 8px' }}>
            <Suspense fallback={<div style={s(pF).bigNum}>{result.bird.emoji}</div>}>
              <Bird3DViewer variant={1} width="100px" height="100px" autoRotateSpeed={0.3} showControls={false} backgroundColor={null} cameraDistance={3.5} />
            </Suspense>
          </div>
          <div style={{ ...s(pF).birdName, fontSize: '40px', marginBottom: '4px' }}>{result.bird.name}</div>
          <div style={{ fontSize: '13px', opacity: 0.55, marginBottom: '20px', color: pF.text }}>{result.bird.subtitle}</div>
        </FadeIn>
        <FadeIn delay={400}>
          <div style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', opacity: 0.6, marginBottom: '4px' }}><span>Contexto</span><span>{contextoLabel} ({result.contexto.raw}/6)</span></div>
            <div style={s(pF).bar}><div style={{ ...s(pF).barFill, width: `${(result.contexto.raw / 6) * 100}%` }} /></div>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', opacity: 0.6, marginBottom: '4px' }}><span>Individuo</span><span>{individuoLabel} ({result.individuo.raw}/7)</span></div>
            <div style={s(pF).bar}><div style={{ ...s(pF).barFill, width: `${(result.individuo.raw / 7) * 100}%` }} /></div>
          </div>
        </FadeIn>
        <FadeIn delay={600}>
          <p style={{ fontSize: '14px', lineHeight: 1.7, opacity: 0.75, marginBottom: '28px' }}>
            Ante la crisis de aire, <span style={{ fontWeight: 700, color: pF.accent }}>NO TE QUEDES EN CASA</span>. Sal y pide un cambio.
          </p>
        </FadeIn>
        <FadeIn delay={700}><div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.12)', marginBottom: '24px' }} /></FadeIn>
        <FadeIn delay={800}>
          <div style={{ marginBottom: '20px' }}>
            <div style={s(pF).small}>Comparte tu resultado</div>
            <button style={s(pF).shareBtnPrimary} onClick={handleShareImage}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}>
              📸 Compartir como imagen
            </button>
            {shareStatus && <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '8px', color: pF.accent }}>{shareStatus}</div>}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '12px', flexWrap: 'wrap' as const }}>
              <button style={s(pF).shareBtn} onClick={() => shareToTwitter(result.bird, result.total)}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)'; }}>𝕏 Twitter</button>
              <button style={s(pF).shareBtn} onClick={() => shareToFacebook()}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)'; }}>Facebook</button>
            </div>
          </div>
        </FadeIn>
        <FadeIn delay={1000}>
          <button style={s(pF).cta} onClick={goToMap}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
            Explorar el mapa
          </button>
        </FadeIn>
      </div>
    )});

    return out;
  }, [answers, result, dailyAir, cpRiskLevel, colonia, goToMap, handleShareImage, shareStatus]);

  const total = slides.length;
  const goTo = useCallback((i: number) => { if (i >= 0 && i < total) { setCurrentSlide(i); setAnimKey((k) => k + 1); } }, [total]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') { e.preventDefault(); goTo(Math.min(currentSlide + 1, total - 1)); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(Math.max(currentSlide - 1, 0)); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [currentSlide, goTo, total]);

  const [touchX, setTouchX] = useState<number | null>(null);
  const slide = slides[currentSlide];
  if (!slide) return null;
  const palette = slide.palette;
  const st = s(palette);

  return (
    <div style={st.slide}
      onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
      onTouchEnd={(e) => { if (touchX === null) return; const diff = touchX - e.changedTouches[0].clientX; if (Math.abs(diff) > 60) goTo(diff > 0 ? Math.min(currentSlide + 1, total - 1) : Math.max(currentSlide - 1, 0)); setTouchX(null); }}>
      {fontLink}
      <div style={st.topLabel}>AIRE LIBRE</div>
      <div style={st.counter}>{currentSlide + 1} / {total}</div>
      <div key={`s-${currentSlide}-${animKey}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: '600px' }}>
        {slide.content}
      </div>
      {currentSlide > 0 && (
        <button style={{ ...st.arrow, left: '16px' }} onClick={() => goTo(currentSlide - 1)}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; }}>‹</button>
      )}
      {currentSlide < total - 1 && (
        <button style={{ ...st.arrow, right: '16px' }} onClick={() => goTo(currentSlide + 1)}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; }}>›</button>
      )}
      <div style={st.dots}>
        {slides.map((_, i) => (
          <button key={i} style={{ ...st.dot, backgroundColor: i === currentSlide ? palette.accent : 'rgba(255,255,255,0.25)', transform: i === currentSlide ? 'scale(1.3)' : 'scale(1)' }} onClick={() => goTo(i)} />
        ))}
      </div>
    </div>
  );
};

export default QuizResult;
