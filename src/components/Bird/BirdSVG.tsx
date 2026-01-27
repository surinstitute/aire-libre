export default function BirdSVG() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Decorative plants */}
      <g transform="translate(20, 150)">
        <ellipse cx="0" cy="10" rx="30" ry="15" fill="#2c5761" opacity="0.7"/>
        <path d="M-15,10 Q-20,0 -25,-10" stroke="#2c5761" strokeWidth="3" fill="none"/>
        <path d="M15,10 Q20,0 25,-10" stroke="#2c5761" strokeWidth="3" fill="none"/>
      </g>

      <g transform="translate(170, 160)">
        <ellipse cx="0" cy="10" rx="25" ry="12" fill="#2c5761" opacity="0.7"/>
        <path d="M-12,10 Q-15,3 -18,-8" stroke="#2c5761" strokeWidth="2" fill="none"/>
        <path d="M12,10 Q15,3 18,-8" stroke="#2c5761" strokeWidth="2" fill="none"/>
      </g>

      {/* Bird */}
      <g transform="translate(100, 80)">
        {/* Body */}
        <ellipse cx="0" cy="0" rx="40" ry="50" fill="#5eb3c7"/>
        <ellipse cx="0" cy="0" rx="35" ry="45" fill="#6dc5d9"/>
        
        {/* Wing */}
        <path d="M-25,-10 Q-50,-20 -40,20 Q-30,30 -20,10 Z" fill="#4a9fb3" opacity="0.8"/>
        <path d="M-25,-5 Q-40,-10 -35,15 L-22,8 Z" fill="#2c5761" opacity="0.3"/>
        
        {/* Head */}
        <circle cx="0" cy="-35" r="25" fill="#5eb3c7"/>
        <circle cx="0" cy="-35" r="22" fill="#6dc5d9"/>
        
        {/* Eyes */}
        <ellipse cx="-8" cy="-38" rx="8" ry="10" fill="white"/>
        <ellipse cx="8" cy="-38" rx="8" ry="10" fill="white"/>
        <circle cx="-8" cy="-36" r="5" fill="#2c5761"/>
        <circle cx="8" cy="-36" r="5" fill="#2c5761"/>
        <circle cx="-6" cy="-37" r="2" fill="white"/>
        <circle cx="10" cy="-37" r="2" fill="white"/>
        
        {/* Eyebrows (cool expression) */}
        <path d="M-15,-43 Q-10,-45 -3,-44" stroke="#2c5761" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M15,-43 Q10,-45 3,-44" stroke="#2c5761" strokeWidth="2" fill="none" strokeLinecap="round"/>
        
        {/* Beak */}
        <path d="M-8,-28 L0,-22 L8,-28 Z" fill="#f59e0b"/>
        <path d="M-5,-28 L0,-24 L5,-28 Z" fill="#fbbf24"/>
        
        {/* Feet */}
        <g transform="translate(-15, 45)">
          <line x1="0" y1="0" x2="0" y2="12" stroke="#f59e0b" strokeWidth="3"/>
          <path d="M-6,12 L0,12 M0,12 L6,12" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"/>
        </g>
        <g transform="translate(15, 45)">
          <line x1="0" y1="0" x2="0" y2="12" stroke="#f59e0b" strokeWidth="3"/>
          <path d="M-6,12 L0,12 M0,12 L6,12" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"/>
        </g>
      </g>
    </svg>
  );
}