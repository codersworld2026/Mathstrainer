import React, { useEffect, useState } from 'react';

// Lightweight confetti — no library. Each time `fire` (a counter) increases, it
// drops one short burst of coloured bits, then clears itself.
const COLORS = ['#2f6bff', '#18c25a', '#f5a524', '#ff7a1a', '#7c3aed', '#ff4d6d'];

export default function Confetti({ fire }) {
  const [bits, setBits] = useState([]);

  useEffect(() => {
    if (!fire) return;
    const batch = Array.from({ length: 26 }, (_, i) => ({
      id: `${fire}-${i}`,
      left: Math.random() * 100,
      color: COLORS[i % COLORS.length],
      delay: Math.random() * 0.12,
      dur: 0.9 + Math.random() * 0.7,
      drift: (Math.random() * 2 - 1) * 40,
      rot: Math.random() * 540 - 270,
    }));
    setBits(batch);
    const t = setTimeout(() => setBits([]), 1700);
    return () => clearTimeout(t);
  }, [fire]);

  if (!bits.length) return null;
  return (
    <div className="confetti" aria-hidden="true">
      {bits.map((b) => (
        <span key={b.id} className="confetti-bit" style={{
          left: `${b.left}%`,
          background: b.color,
          animationDelay: `${b.delay}s`,
          animationDuration: `${b.dur}s`,
          '--drift': `${b.drift}px`,
          '--rot': `${b.rot}deg`,
        }} />
      ))}
    </div>
  );
}
