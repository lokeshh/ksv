export default function PeacockLogo({ size = 36, className = "brand-peacock-logo" }) {
  return (
    <svg 
      viewBox="0 0 48 48" 
      width={size} 
      height={size} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      aria-label="Kātantra Peacock Symbol"
    >
      <defs>
        {/* Tail plume emerald gradient */}
        <linearGradient id="pkPlumeEmerald" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#047857" />
          <stop offset="60%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>

        {/* Tail plume cyan/sapphire gradient */}
        <linearGradient id="pkPlumeCyan" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#065f46" />
          <stop offset="40%" stopColor="#0891b2" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>

        {/* Peacock body royal gradient */}
        <linearGradient id="pkBodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="30%" stopColor="#2563eb" />
          <stop offset="70%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#312e81" />
        </linearGradient>

        {/* Gold / Amber gradient for crest, beak & eye centers */}
        <linearGradient id="pkGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>

      {/* Tail Plumage Fan (Kalāpa) */}
      <g className="peacock-tail">
        {/* Plume 1 (Left 140deg) */}
        <path d="M22 36 Q11 32 6 22 Q12 18 22 36" fill="url(#pkPlumeEmerald)" opacity="0.9" />
        <g transform="translate(8.5, 20.5) rotate(-50)">
          <ellipse cx="0" cy="0" rx="3.8" ry="5.5" fill="#065f46" />
          <ellipse cx="0" cy="0" rx="2.6" ry="3.8" fill="#0284c7" />
          <ellipse cx="0" cy="0" rx="1.3" ry="2.1" fill="url(#pkGoldGradient)" />
          <circle cx="0" cy="0.5" r="0.7" fill="#0f172a" />
        </g>

        {/* Plume 2 (Left-Mid 115deg) */}
        <path d="M22 36 Q14 24 13 14 Q19 12 22 36" fill="url(#pkPlumeCyan)" opacity="0.95" />
        <g transform="translate(13.5, 13.5) rotate(-25)">
          <ellipse cx="0" cy="0" rx="3.8" ry="5.5" fill="#047857" />
          <ellipse cx="0" cy="0" rx="2.6" ry="3.8" fill="#2563eb" />
          <ellipse cx="0" cy="0" rx="1.3" ry="2.1" fill="url(#pkGoldGradient)" />
          <circle cx="0" cy="0.5" r="0.7" fill="#0f172a" />
        </g>

        {/* Plume 3 (Center 90deg) */}
        <path d="M22 36 Q20 20 22 9 Q25 20 22 36" fill="url(#pkPlumeEmerald)" />
        <g transform="translate(22, 9) rotate(0)">
          <ellipse cx="0" cy="0" rx="4" ry="5.8" fill="#065f46" />
          <ellipse cx="0" cy="0" rx="2.8" ry="4" fill="#0891b2" />
          <ellipse cx="0" cy="0" rx="1.4" ry="2.2" fill="url(#pkGoldGradient)" />
          <circle cx="0" cy="0.5" r="0.7" fill="#0f172a" />
        </g>

        {/* Plume 4 (Right-Mid 65deg) */}
        <path d="M22 36 Q26 22 32 13 Q35 19 22 36" fill="url(#pkPlumeCyan)" opacity="0.95" />
        <g transform="translate(31.5, 14.5) rotate(25)">
          <ellipse cx="0" cy="0" rx="3.8" ry="5.5" fill="#047857" />
          <ellipse cx="0" cy="0" rx="2.6" ry="3.8" fill="#2563eb" />
          <ellipse cx="0" cy="0" rx="1.3" ry="2.1" fill="url(#pkGoldGradient)" />
          <circle cx="0" cy="0.5" r="0.7" fill="#0f172a" />
        </g>

        {/* Plume 5 (Right 40deg) */}
        <path d="M22 36 Q32 28 39 21 Q39 28 22 36" fill="url(#pkPlumeEmerald)" opacity="0.9" />
        <g transform="translate(38, 22.5) rotate(50)">
          <ellipse cx="0" cy="0" rx="3.8" ry="5.5" fill="#065f46" />
          <ellipse cx="0" cy="0" rx="2.6" ry="3.8" fill="#0284c7" />
          <ellipse cx="0" cy="0" rx="1.3" ry="2.1" fill="url(#pkGoldGradient)" />
          <circle cx="0" cy="0.5" r="0.7" fill="#0f172a" />
        </g>
      </g>

      {/* Peacock Body, Majestic S-Neck and Head */}
      <g className="peacock-foreground">
        {/* Crest feathers on head */}
        <path d="M20 15 Q17 11 15 9" stroke="url(#pkGoldGradient)" strokeWidth="1" strokeLinecap="round" />
        <circle cx="14.5" cy="8.5" r="1.2" fill="url(#pkGoldGradient)" />

        <path d="M21 14 Q20 10 19 7" stroke="url(#pkGoldGradient)" strokeWidth="1" strokeLinecap="round" />
        <circle cx="18.8" cy="6.5" r="1.2" fill="url(#pkGoldGradient)" />

        <path d="M22 14 Q23 10 23.5 7.5" stroke="url(#pkGoldGradient)" strokeWidth="1" strokeLinecap="round" />
        <circle cx="23.5" cy="7" r="1.2" fill="url(#pkGoldGradient)" />

        {/* Sharp Beak */}
        <polygon points="25.5,15.5 28.5,16.5 25.2,17.5" fill="url(#pkGoldGradient)" />

        {/* S-Curved Neck & Body */}
        <path 
          d="M22 14.5 C24.5 14.5 26 15.5 25.5 17.5 C25 19.5 23 20 23 22 C23 24.5 27 26 27.5 30 C28 34 26 38.5 21 39 C17 39 15 36.5 16 33 C17 29.5 19.5 28 20.5 26 C21.5 24 20.5 22.5 19.8 21 C19 19 19.5 16.5 21.5 14.8 Z" 
          fill="url(#pkBodyGradient)" 
        />

        {/* Eye */}
        <circle cx="24" cy="16.2" r="0.7" fill="#ffffff" />
        <circle cx="24.1" cy="16.2" r="0.4" fill="#0f172a" />

        {/* Wing Highlight Lines */}
        <path d="M19 32 Q22 30 25 33" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.9" />
        <path d="M19.5 34.5 Q22 33 24 35.5" stroke="#a5f3fc" strokeWidth="0.9" strokeLinecap="round" fill="none" opacity="0.75" />
      </g>
    </svg>
  );
}

