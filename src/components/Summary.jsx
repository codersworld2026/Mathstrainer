import React, { useEffect, useState } from 'react';
import { ROUND_SIZE, roundXp } from '../engine/adaptive.js';
import Confetti from './Confetti.jsx';
import { playWin } from '../engine/sound.js';

export default function Summary({ correct, total = ROUND_SIZE, learner, daily = false, onAgain, onHome }) {
  const frac = total ? correct / total : 0;
  const great = frac >= 0.66;
  const xp = roundXp(correct, total, daily);
  const msg = correct === total ? (daily ? 'Daily Challenge — flawless!' : 'Round won — flawless.')
    : frac >= 0.66 ? 'Solid round.'
    : frac >= 0.33 ? 'Good work — that’s how it sticks.'
    : 'Every round counts. Keep going.';

  const [fire, setFire] = useState(0);
  useEffect(() => {
    if (great) { setFire(1); playWin(); }
  }, []); // celebrate once on a good round

  return (
    <div className="fade-in">
      <div className="card summary">
        <Confetti fire={fire} />
        <div className="big">{correct}<span style={{ color: 'var(--muted)', fontSize: 24 }}>/{total}</span></div>
        <div className="score">{msg}</div>
        <div className="xp-earned">⚡ +{xp} XP{daily ? ' · Daily Challenge complete 🛡️' : ''}</div>
        {learner.streak > 1 && <div className="combo">🔥 {learner.streak} combo</div>}
      </div>
      <div style={{ height: 14 }} />
      <button className="btn accent" onClick={onAgain}>Next round</button>
      <div style={{ height: 8 }} />
      <button className="btn ghost" onClick={onHome}>Back to home</button>
    </div>
  );
}
