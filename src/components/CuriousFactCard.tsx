import type { CSSProperties } from 'react';
import type { CuriousFact } from '../data/curiousFacts';

interface CuriousFactCardProps {
  fact: CuriousFact;
  textColor: string;
  accentColor: string;
  className?: string;
  style?: CSSProperties;
}

export default function CuriousFactCard({ fact, textColor, accentColor, className, style }: CuriousFactCardProps) {
  return (
    <aside
      className={className}
      data-category={fact.category}
      style={{ width: '100%', maxWidth: '480px', marginTop: '24px', padding: '16px 20px', borderRadius: '8px', backgroundColor: `${textColor}0C`, border: `1px solid ${textColor}25`, color: textColor, ...style }}
    >
      <h2 style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 700, color: accentColor }}>¿Sabías que?</h2>
      <p style={{ margin: 0, fontSize: '12px', lineHeight: 1.7 }}>{fact.fact}</p>
      <a href={fact.source.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: '10px', fontSize: '10px', lineHeight: 1.6, color: accentColor, textDecoration: 'underline', textUnderlineOffset: '3px' }}>
        Fuente: {fact.source.label}
      </a>
    </aside>
  );
}
