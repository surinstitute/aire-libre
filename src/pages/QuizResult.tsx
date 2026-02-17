import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  calculateResult,
  calculateDailyAir,
  quizQuestions,
} from '../data/quizData';
import type { QuizAnswers, BirdProfile } from '../data/quizData';
import type { Colonia } from '../types';

// ============================================================
// Slide palettes
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
  { bg: '#1B3A4B', text: '#F5F0E8', accent: '#fcd34d' }, // summary
];

type Palette = (typeof slidePalettes)[0];

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
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}
    >
      {children}
    </div>
  );
};

// ============================================================
// Share helpers — Canvas API (no html2canvas dependency)
// ============================================================

const SITE_URL = 'https://aire-libre-tawny.vercel.app';

function getShareText(bird: BirdProfile, _total: number): string {
  return `Hice el test de Aire Libre y soy un ${bird.name} 🐦. ¿Cuál eres tú? Descúbrelo en ${SITE_URL}/quiz`;
}

interface ShareCardData {
  birdEmoji: string;
  birdName: string;
  subtitle: string;
  contextoLabel: string;
  individuoLabel: string;
  rows: { label: string; value: string }[];
}

/**
 * Helper: draw a rounded rectangle (compatible with all browsers)
 */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/**
 * Helper: draw a pill/badge shape
 */
function drawPill(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number, y: number,
  bgColor: string, textColor: string
) {
  ctx.font = 'bold 13px Georgia, serif';
  const metrics = ctx.measureText(text);
  const pw = metrics.width + 24;
  const ph = 28;
  const px = x - pw / 2;
  const py = y - ph / 2;

  ctx.fillStyle = bgColor;
  roundRect(ctx, px, py, pw, ph, 14);
  ctx.fill();

  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.fillText(text, x, y + 5);
}

/**
 * Draw the share card directly on a Canvas — 100% reliable, no html2canvas
 */
function generateShareImage(data: ShareCardData): Promise<Blob | null> {
  const W = 720;
  const H = 960;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return Promise.resolve(null);

  const bg = '#1B3A4B';
  const accent = '#fcd34d';
  const dim = 'rgba(245, 240, 232, 0.5)';
  const line = 'rgba(245, 240, 232, 0.12)';
  const white = '#F5F0E8';

  // ── Background ──
  ctx.fillStyle = bg;
  roundRect(ctx, 0, 0, W, H, 24);
  ctx.fill();

  // ── Decorative top line ──
  ctx.fillStyle = accent;
  ctx.fillRect(60, 40, W - 120, 3);

  // ── "AIRE LIBRE" header ──
  ctx.font = 'bold 14px Georgia, serif';
  ctx.fillStyle = 'rgba(245, 240, 232, 0.4)';
  ctx.textAlign = 'center';
  ctx.fillText('A I R E   L I B R E', W / 2, 72);

  // ── Emoji ──
  ctx.font = '64px serif';
  ctx.fillText(data.birdEmoji, W / 2, 140);

  // ── Bird name ──
  ctx.font = 'bold 34px Georgia, serif';
  ctx.fillStyle = accent;
  ctx.fillText(data.birdName, W / 2, 185);

  // ── Subtitle ──
  ctx.font = '15px Georgia, serif';
  ctx.fillStyle = dim;
  ctx.fillText(data.subtitle, W / 2, 212);

  // ── Axis pills ──
  drawPill(ctx, `Contexto: ${data.contextoLabel}`, W / 2 - 120, 248, 'rgba(139, 92, 246, 0.25)', '#c4b5fd');
  drawPill(ctx, `Individuo: ${data.individuoLabel}`, W / 2 + 120, 248, 'rgba(244, 114, 182, 0.25)', '#f9a8d4');

  // ── Divider ──
  ctx.strokeStyle = line;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(60, 280);
  ctx.lineTo(W - 60, 280);
  ctx.stroke();

  // ── Summary rows ──
  const startY = 316;
  const rowH = 48;

  data.rows.forEach((row, i) => {
    const y = startY + i * rowH;

    // Label
    ctx.font = '16px Georgia, serif';
    ctx.fillStyle = dim;
    ctx.textAlign = 'left';
    ctx.fillText(row.label, 72, y);

    // Value
    ctx.font = 'bold 16px Georgia, serif';
    ctx.fillStyle = white;
    ctx.textAlign = 'right';
    ctx.fillText(row.value, W - 72, y);

    // Row separator
    if (i < data.rows.length - 1) {
      ctx.strokeStyle = line;
      ctx.beginPath();
      ctx.moveTo(72, y + 16);
      ctx.lineTo(W - 72, y + 16);
      ctx.stroke();
    }
  });

  // ── Footer area ──
  const footerY = startY + data.rows.length * rowH + 24;

  ctx.strokeStyle = line;
  ctx.beginPath();
  ctx.moveTo(60, footerY);
  ctx.lineTo(W - 60, footerY);
  ctx.stroke();

  // Branding
  ctx.font = '12px Georgia, serif';
  ctx.fillStyle = 'rgba(245, 240, 232, 0.3)';
  ctx.textAlign = 'center';
  ctx.fillText('aire-libre-tawny.vercel.app/quiz', W / 2, footerY + 28);

  // CTA
  ctx.font = 'bold 16px Georgia, serif';
  ctx.fillStyle = accent;
  ctx.fillText('¿Cuál eres tú? Haz el test →', W / 2, footerY + 58);

  // ── Bottom decorative line ──
  ctx.fillStyle = accent;
  ctx.fillRect(60, H - 40, W - 120, 3);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png', 1.0);
  });
}

/**
 * Generate image and share/download
 * Mobile: uses Web Share API (native share sheet with image)
 * Desktop: always downloads the PNG directly
 */
async function shareAsImage(
  data: ShareCardData,
  bird: BirdProfile,
  total: number
): Promise<'shared' | 'downloaded' | 'error'> {
  const blob = await generateShareImage(data);
  if (!blob) return 'error';

  // Detect mobile (touch device + small screen)
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.maxTouchPoints > 0 && window.innerWidth < 768);

  // Mobile: use Web Share API for native share sheet
  if (isMobile && navigator.share) {
    const file = new File([blob], 'aire-libre-resultado.png', { type: 'image/png' });
    const shareText = getShareText(bird, total);
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ text: shareText, files: [file] });
        return 'shared';
      } catch (err) {
        if ((err as Error).name === 'AbortError') return 'shared';
      }
    }
  }

  // Desktop: always download directly
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'aire-libre-resultado.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return 'downloaded';
}

/**
 * Share to Twitter
 */
function shareToTwitter(bird: BirdProfile, total: number) {
  const text = encodeURIComponent(
    `Hice el test de Aire Libre y soy un ${bird.name} 🐦 (${total}/20). ¿Cuál eres tú? Descúbrelo en`
  );
  const url = encodeURIComponent(`${SITE_URL}/quiz`);
  window.open(
    `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
    '_blank',
    'width=600,height=400'
  );
}

/**
 * Share to Facebook
 */
function shareToFacebook() {
  const url = encodeURIComponent(`${SITE_URL}/quiz`);
  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    '_blank',
    'width=600,height=400'
  );
}

// ============================================================
// Style helper
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
  shareBtn: {
    padding: '12px 20px',
    fontSize: '14px',
    fontWeight: 600,
    fontFamily: "'Lora', Georgia, serif",
    color: p.text,
    backgroundColor: 'rgba(255,255,255,0.12)',
    border: '1.5px solid rgba(255,255,255,0.2)',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    backdropFilter: 'blur(8px)',
  },
  shareBtnPrimary: {
    padding: '14px 28px',
    fontSize: '15px',
    fontWeight: 700,
    fontFamily: "'Lora', Georgia, serif",
    color: p.bg,
    backgroundColor: p.accent,
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
  },
  summaryRow: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    padding: '12px 0',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  summaryLabel: {
    fontSize: '15px',
    opacity: 0.7,
  },
  summaryValue: {
    fontSize: '15px',
    fontWeight: 700,
    color: p.accent,
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
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  // Load data
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

  useEffect(() => {
    if (Object.keys(answers).length === 0) navigate('/quiz');
  }, [answers, navigate]);

  const cpRiskLevel = colonia?.categoria_riesgo ?? 'medio';

  const result = useMemo(
    () => calculateResult(cpRiskLevel, answers),
    [cpRiskLevel, answers]
  );

  const dailyAir = useMemo(() => {
    const peso = parseFloat(answers.peso as string) || 70;
    const estatura = parseFloat(answers.estatura as string) || 170;
    return calculateDailyAir(peso, estatura, answers.edad as string, answers.ejercicio as string);
  }, [answers]);

  const getLabel = (qId: string, val: string): string => {
    const q = quizQuestions.find((q) => q.id === qId);
    return q?.options?.find((o) => o.value === val)?.label || val;
  };

  const goToMap = useCallback(() => {
    const cp = answers.codigoPostal as string;
    navigate(cp ? `/map?cp=${encodeURIComponent(cp)}` : '/map');
  }, [answers, navigate]);

  // Share as image handler — uses Canvas API directly
  const handleShareImage = useCallback(async () => {
    setShareStatus('Generando imagen...');

    const fumaVal = answers.fuma as string;
    const ejVal = answers.ejercicio as string;
    const conds = (answers.condicionesSalud as string[]) || [];
    const hasConds = conds.length > 0 && !conds.includes('ninguna');
    const condLabel = hasConds
      ? conds.map((c) => getLabel('condicionesSalud', c)).join(', ')
      : 'Ninguna';
    const edadLabel = getLabel('edad', answers.edad as string);
    const ctxLabels = ['Favorable', 'Moderado', 'Perjudicial'];
    const indLabels = ['Resistente', 'Medianamente resistente', 'Altamente sensible'];

    const cardData: ShareCardData = {
      birdEmoji: result.bird.emoji,
      birdName: result.bird.name,
      subtitle: result.bird.subtitle,
      contextoLabel: ctxLabels[result.contexto.category],
      individuoLabel: indLabels[result.individuo.category],
      rows: [
        { label: 'Código postal', value: String(answers.codigoPostal) },
        { label: 'Zona', value: `Riesgo ${colonia?.categoria_riesgo ?? 'medio'}` },
        { label: 'Aire diario', value: `${dailyAir.toLocaleString()} L` },
        { label: 'Edad', value: edadLabel },
        { label: 'Tabaco', value: fumaVal === 'fuma' ? 'Sí' : fumaVal === 'exfumador' ? 'Ex' : 'No' },
        { label: 'Ejercicio', value: getLabel('ejercicio', ejVal) },
        { label: 'Condiciones', value: condLabel },
      ],
    };

    const status = await shareAsImage(cardData, result.bird, result.total);
    if (status === 'shared') {
      setShareStatus('¡Compartido!');
    } else if (status === 'downloaded') {
      setShareStatus('¡Imagen descargada! Compártela en tus redes.');
    } else {
      setShareStatus('Error al generar imagen');
    }
    setTimeout(() => setShareStatus(null), 3000);
  }, [result, answers, colonia, dailyAir]);

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
            <div style={{ fontSize: '80px', marginBottom: '16px' }}>{result.bird.emoji}</div>
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
                Vives en <span style={s(p1).accent}>{colonia.colonias}, {colonia.municipio}</span>.
                Tu zona tiene un nivel de exposición ambiental{' '}
                <span style={s(p1).accent}>{cpRiskLevel}</span>.
              </p>
            ) : (
              <p style={s(p1).body}>
                Tu zona tiene un nivel de exposición ambiental <span style={s(p1).accent}>{cpRiskLevel}</span>.
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
            <div style={{ fontSize: '22px', opacity: 0.6, marginTop: '-8px', marginBottom: '24px' }}>litros de aire</div>
          </FadeIn>
          <FadeIn delay={600}>
            <p style={s(p2).body}>
              Eso equivale a aproximadamente <span style={s(p2).accent}>{Math.round(dailyAir / 1000)} mil</span> litros.
              La calidad de ese aire importa más de lo que crees.
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
          <FadeIn delay={200}><div style={s(p3).title}>{edadLabel}</div></FadeIn>
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
              {fumaVal === 'fuma' ? 'Fumas' : fumaVal === 'exfumador' ? 'Dejaste de fumar' : 'No fumas'}
            </div>
          </FadeIn>
          <FadeIn delay={500}>
            <p style={s(p4).body}>
              {fumaVal === 'fuma'
                ? 'Las personas que fuman tienen hasta 3 veces más riesgo de afectaciones por la calidad del aire.'
                : fumaVal === 'exfumador'
                ? 'Haber dejado de fumar es un gran paso. Tu cuerpo se está recuperando.'
                : 'No fumar reduce significativamente tu riesgo. Tienes hasta 3 veces menos riesgo.'}
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
              {ejVal === '2omas' ? '¡Activo/a!' : ejVal === 'aveces' ? 'Algo de movimiento' : 'Sin ejercicio regular'}
            </div>
          </FadeIn>
          <FadeIn delay={500}>
            <p style={s(p5).body}>
              {ejVal === '2omas'
                ? '¡Tu capacidad pulmonar y salud general son mejores! Intenta hacerlo en horarios con mejor calidad del aire.'
                : ejVal === 'aveces'
                ? 'Algo de ejercicio es mejor que nada. Mover el cuerpo fortalece tus pulmones.'
                : 'El ejercicio regular mejora tu capacidad pulmonar. Incluso caminatas cortas cuentan.'}
            </p>
          </FadeIn>
        </div>
      ),
    });

    // 7 — Condiciones
    const p6 = slidePalettes[6];
    const conds = (answers.condicionesSalud as string[]) || [];
    const hasConds = conds.length > 0 && !conds.includes('ninguna');
    out.push({
      palette: p6,
      content: (
        <div style={{ textAlign: 'center' }}>
          <FadeIn delay={200}>
            <div style={s(p6).title}>
              {hasConds ? 'Tu cuerpo necesita atención extra' : '¡Sin condiciones preexistentes!'}
            </div>
          </FadeIn>
          <FadeIn delay={500}>
            {hasConds ? (
              <div>
                <p style={s(p6).body}>
                  Reportaste: <span style={s(p6).accent}>{conds.map((c) => getLabel('condicionesSalud', c)).join(', ')}</span>
                </p>
                <p style={{ ...s(p6).body, marginTop: '16px' }}>
                  Estas condiciones pueden hacer que tu cuerpo sea más sensible a la contaminación.
                </p>
              </div>
            ) : (
              <p style={s(p6).body}>
                No reportas condiciones preexistentes. Mantener hábitos saludables es la mejor forma de protegerte.
              </p>
            )}
          </FadeIn>
        </div>
      ),
    });

    // 8 — Score breakdown
    const p7 = slidePalettes[7];
    const contextoLabel = ['Favorable', 'Moderado', 'Perjudicial'][result.contexto.category];
    const individuoLabel = ['Resistente', 'Medianamente resistente', 'Altamente sensible'][result.individuo.category];
    out.push({
      palette: p7,
      content: (
        <div style={{ textAlign: 'center', width: '100%', maxWidth: '480px' }}>
          <FadeIn delay={200}>
            <div style={s(p7).small}>Tu resultado</div>
            <div style={s(p7).bigNum}>
              {result.bird.emoji}
            </div>
            <div style={{ ...s(p7).birdName, marginBottom: '20px' }}>{result.bird.name}</div>
          </FadeIn>
          <FadeIn delay={400}>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', opacity: 0.6, marginBottom: '4px' }}>
                <span>Contexto</span><span>{contextoLabel} ({result.contexto.raw}/6)</span>
              </div>
              <div style={s(p7).bar}>
                <div style={{ ...s(p7).barFill, width: `${(result.contexto.raw / 6) * 100}%` }} />
              </div>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', opacity: 0.6, marginBottom: '4px' }}>
                <span>Individuo</span><span>{individuoLabel} ({result.individuo.raw}/7)</span>
              </div>
              <div style={s(p7).bar}>
                <div style={{ ...s(p7).barFill, width: `${(result.individuo.raw / 7) * 100}%` }} />
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={700}>
            <p style={{ fontSize: '16px', lineHeight: 1.7, opacity: 0.75 }}>
              Ante la crisis de aire, <span style={{ fontWeight: 700, color: p7.accent }}>NO TE QUEDES EN CASA</span>. Sal y pide un cambio.
            </p>
          </FadeIn>
        </div>
      ),
    });

    // 9 — SUMMARY + Share + CTA
    const p8 = slidePalettes[8];
    const condLabel = hasConds
      ? conds.map((c) => getLabel('condicionesSalud', c)).join(', ')
      : 'Ninguna';
    out.push({
      palette: p8,
      content: (
        <div style={{ textAlign: 'center', width: '100%', maxWidth: '480px' }}>
          {/* ====== CAPTURABLE CARD — this div gets screenshot'd ====== */}
          <div
            style={{
              backgroundColor: p8.bg,
              padding: '40px 32px 32px',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '440px',
              margin: '0 auto',
            }}
          >
            <div style={{ fontSize: '56px', marginBottom: '4px' }}>{result.bird.emoji}</div>
            <div style={{ ...s(p8).birdName, fontSize: '32px', marginBottom: '4px' }}>{result.bird.name}</div>
            <div style={{ fontSize: '13px', opacity: 0.5, marginBottom: '20px', color: p8.text }}>
              {result.bird.subtitle}
            </div>

            <div style={{ width: '100%' }}>
              <div style={s(p8).summaryRow}>
                <span style={s(p8).summaryLabel}>Código postal</span>
                <span style={s(p8).summaryValue}>{answers.codigoPostal}</span>
              </div>
              <div style={s(p8).summaryRow}>
                <span style={s(p8).summaryLabel}>Zona</span>
                <span style={s(p8).summaryValue}>Riesgo {cpRiskLevel}</span>
              </div>
              <div style={s(p8).summaryRow}>
                <span style={s(p8).summaryLabel}>Aire diario</span>
                <span style={s(p8).summaryValue}>{dailyAir.toLocaleString()} L</span>
              </div>
              <div style={s(p8).summaryRow}>
                <span style={s(p8).summaryLabel}>Edad</span>
                <span style={s(p8).summaryValue}>{edadLabel}</span>
              </div>
              <div style={s(p8).summaryRow}>
                <span style={s(p8).summaryLabel}>Tabaco</span>
                <span style={s(p8).summaryValue}>
                  {fumaVal === 'fuma' ? 'Sí' : fumaVal === 'exfumador' ? 'Ex' : 'No'}
                </span>
              </div>
              <div style={s(p8).summaryRow}>
                <span style={s(p8).summaryLabel}>Ejercicio</span>
                <span style={s(p8).summaryValue}>{getLabel('ejercicio', ejVal)}</span>
              </div>
              <div style={{ ...s(p8).summaryRow, borderBottom: 'none' }}>
                <span style={s(p8).summaryLabel}>Condiciones</span>
                <span style={{ ...s(p8).summaryValue, fontSize: '13px', maxWidth: '200px', textAlign: 'right' as const }}>
                  {condLabel}
                </span>
              </div>
            </div>

            {/* Branding footer inside card */}
            <div style={{
              marginTop: '20px',
              paddingTop: '16px',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              fontSize: '12px',
              opacity: 0.4,
              color: p8.text,
              letterSpacing: '1.5px',
              textTransform: 'uppercase' as const,
            }}>
              AIRE LIBRE — aire-libre-tawny.vercel.app/quiz
            </div>
          </div>
          {/* ====== END CAPTURABLE CARD ====== */}

          {/* Share buttons — outside the card so they don't appear in screenshot */}
          <FadeIn delay={600}>
            <div style={{ marginTop: '24px', marginBottom: '8px' }}>
              <div style={s(p8).small}>Comparte tu resultado</div>

              {/* Primary: share as image (mobile) or download */}
              <button
                style={s(p8).shareBtnPrimary}
                onClick={handleShareImage}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                📸 Compartir como imagen
              </button>

              {shareStatus && (
                <div style={{ fontSize: '13px', opacity: 0.7, marginTop: '8px', color: p8.accent }}>
                  {shareStatus}
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '12px', flexWrap: 'wrap' as const }}>
                <button
                  style={s(p8).shareBtn}
                  onClick={() => shareToTwitter(result.bird, result.total)}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)'; }}
                >
                  𝕏 Twitter
                </button>
                <button
                  style={s(p8).shareBtn}
                  onClick={() => shareToFacebook()}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)'; }}
                >
                  Facebook
                </button>
              </div>
            </div>
          </FadeIn>

          {/* CTA */}
          <FadeIn delay={800}>
            <button
              style={{ ...s(p8).cta, marginTop: '16px' }}
              onClick={goToMap}
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
  }, [answers, result, dailyAir, cpRiskLevel, colonia, goToMap, handleShareImage, shareStatus]);

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

  // Keyboard — arrows + Enter + Space
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
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
      <div style={st.counter}>{currentSlide + 1} / {total}</div>

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

      {currentSlide > 0 && (
        <button
          style={{ ...st.arrow, left: '16px' }}
          onClick={() => goTo(currentSlide - 1)}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; }}
        >‹</button>
      )}
      {currentSlide < total - 1 && (
        <button
          style={{ ...st.arrow, right: '16px' }}
          onClick={() => goTo(currentSlide + 1)}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; }}
        >›</button>
      )}

      <div style={st.dots}>
        {slides.map((_, i) => (
          <button
            key={i}
            style={{
              ...st.dot,
              backgroundColor: i === currentSlide ? palette.accent : 'rgba(255,255,255,0.25)',
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
