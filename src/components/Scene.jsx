import React from 'react';

// Playful backdrop for the Train side only: sky + grass + a little ladybug
// mascot that reacts (idle / happy / sad). Sits behind the cards; theme-aware
// (bright day sky vs deep night sky) via CSS. Purely decorative (aria-hidden).
export default function Scene({ mood = 'idle' }) {
  // mouth changes with mood; the hop/droop is a CSS animation on .mascot
  const mouth = mood === 'happy'
    ? 'M49 64 Q60 76 71 64'          // big smile
    : mood === 'sad'
      ? 'M50 70 Q60 62 70 70'        // frown
      : 'M51 65 Q60 71 69 65';       // gentle smile

  return (
    <div className="scene" aria-hidden="true">
      <div className="sky" />
      <div className="celestial" />
      <div className="clouds"><span /><span /><span /></div>
      <div className="ground" />
      <div className={`mascot mood-${mood}`}>
        <svg viewBox="0 0 120 210" width="100%" height="100%">
          {/* stalk */}
          <path d="M60 210 C44 168 78 132 60 100" fill="none" stroke="#3d9b54" strokeWidth="6" strokeLinecap="round" />
          <path d="M56 150 q-26 -6 -34 -22 q22 -2 34 14 Z" fill="#48b061" />
          <path d="M64 134 q26 -8 34 -24 q-22 0 -34 16 Z" fill="#3d9b54" />
          {/* ladybug, facing up */}
          <g className="bug">
            {/* antennae */}
            <path d="M52 44 q-6 -10 -12 -12" fill="none" stroke="#1c1c1c" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M68 44 q6 -10 12 -12" fill="none" stroke="#1c1c1c" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="39" cy="31" r="3" fill="#1c1c1c" />
            <circle cx="81" cy="31" r="3" fill="#1c1c1c" />
            {/* body */}
            <ellipse cx="60" cy="62" rx="36" ry="32" fill="#e8443b" />
            {/* head */}
            <path d="M30 50 a30 30 0 0 1 60 0 Z" fill="#1f1f1f" />
            {/* wing seam */}
            <line x1="60" y1="50" x2="60" y2="92" stroke="#1f1f1f" strokeWidth="3" />
            {/* spots */}
            <circle cx="44" cy="66" r="6" fill="#1f1f1f" />
            <circle cx="76" cy="66" r="6" fill="#1f1f1f" />
            <circle cx="48" cy="82" r="4.5" fill="#1f1f1f" />
            <circle cx="72" cy="82" r="4.5" fill="#1f1f1f" />
            {/* face on the black head */}
            <circle cx="51" cy="42" r="6" fill="#fff" />
            <circle cx="69" cy="42" r="6" fill="#fff" />
            <circle cx="52" cy="43" r="2.6" fill="#1f1f1f" />
            <circle cx="68" cy="43" r="2.6" fill="#1f1f1f" />
            <path d={mouth} fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
          </g>
        </svg>
      </div>
    </div>
  );
}
