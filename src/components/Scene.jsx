import React from 'react';

// Backdrop for the Train side. A calm, modern dark gradient with a few faint
// achievement icons drifting in the background (trophies / lightning / shields /
// stars / flames) — aimed at Year 7–11 rather than the old ladybug scene.
// Purely decorative (aria-hidden); sits behind the cards.
const ICONS = [
  { s: '🏆', x: 8, y: 18, size: 30, delay: 0 },
  { s: '⚡', x: 88, y: 14, size: 26, delay: 0.8 },
  { s: '🛡️', x: 6, y: 62, size: 28, delay: 1.6 },
  { s: '⭐', x: 90, y: 56, size: 24, delay: 0.4 },
  { s: '🔥', x: 14, y: 86, size: 24, delay: 1.2 },
  { s: '🎖️', x: 84, y: 84, size: 28, delay: 2.0 },
];

export default function Scene() {
  return (
    <div className="scene arena" aria-hidden="true">
      <div className="arena-glow" />
      <div className="arena-grid" />
      {ICONS.map((d, i) => (
        <span key={i} className="arena-ico"
          style={{ left: `${d.x}%`, top: `${d.y}%`, fontSize: d.size, animationDelay: `${d.delay}s` }}>
          {d.s}
        </span>
      ))}
    </div>
  );
}
