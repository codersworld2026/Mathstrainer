import React from 'react';
import { ROUND_SIZE } from '../engine/adaptive.js';

export default function Summary({ correct, learner, onAgain, onHome }) {
  const perfect = correct === ROUND_SIZE;
  const msg = perfect ? 'Round won — flawless.'
    : correct >= 4 ? 'Solid round.'
    : correct >= 2 ? 'Good work — that’s how it sticks.'
    : 'Every round counts. Keep going.';

  return (
    <div className="fade-in">
      <div className="card summary">
        <div className="big">{correct}<span style={{ color: 'var(--muted)', fontSize: 24 }}>/{ROUND_SIZE}</span></div>
        <div className="score">{msg}</div>
        {learner.streak > 1 && <div className="combo">🔥 {learner.streak} combo</div>}
      </div>
      <div style={{ height: 14 }} />
      <button className="btn accent" onClick={onAgain}>Next round</button>
      <div style={{ height: 8 }} />
      <button className="btn ghost" onClick={onHome}>Back to home</button>
    </div>
  );
}
