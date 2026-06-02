import React from 'react';
import { ACHIEVEMENTS } from '../engine/achievements.js';

// Badge grid: earned badges are bright, locked ones are dimmed. Shows every
// achievement so the child can see what's still to unlock.
export default function Achievements({ learner }) {
  const earned = learner.achievements || {};
  const got = ACHIEVEMENTS.filter((a) => earned[a.id]).length;

  return (
    <div>
      <div className="ach-count">{got} of {ACHIEVEMENTS.length} badges earned</div>
      <div className="ach-grid">
        {ACHIEVEMENTS.map((a) => {
          const have = !!earned[a.id];
          return (
            <div key={a.id} className={`ach-badge ${have ? 'got' : 'locked'}`} title={a.name}>
              <span className="ach-ico">{have ? a.icon : '🔒'}</span>
              <span className="ach-name">{a.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
