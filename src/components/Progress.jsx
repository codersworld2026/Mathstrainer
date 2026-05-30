import React from 'react';
import { SKILLS } from '../engine/skills.js';
import { overallAccuracy, weakestSkills, tierName } from '../engine/adaptive.js';

export default function Progress({ learner, onReset }) {
  const acc = overallAccuracy(learner);
  const weak = weakestSkills(learner, 3);
  const tried = SKILLS.filter((s) => learner.skills[s.id].attempts > 0).length;

  return (
    <div className="fade-in">
      <div className="card">
        <div className="parent-note">
          This is the parent view. In Phase 2 it moves behind your login and syncs across devices.
        </div>

        <div className="stat-row" style={{ marginTop: 0 }}>
          <div className="stat"><div className="v">{acc}%</div><div className="l">Accuracy</div></div>
          <div className="stat"><div className="v">{learner.round}</div><div className="l">Rounds</div></div>
          <div className="stat"><div className="v">{learner.totalAttempts}</div><div className="l">Questions</div></div>
        </div>

        {weak.length > 0 && (
          <>
            <div className="section-title" style={{ marginTop: 22 }}>Needs the most work</div>
            <div>
              {weak.map((s) => <span className="weak-chip" key={s.id}>{s.name}</span>)}
            </div>
          </>
        )}
      </div>

      <div className="card">
        <div className="section-title">Skill by skill ({tried}/{SKILLS.length} started)</div>
        {SKILLS.map((s) => {
          const st = learner.skills[s.id];
          const pct = Math.round(st.mastery * 100);
          const accSkill = st.attempts ? Math.round((st.correct / st.attempts) * 100) : null;
          return (
            <div className="mastery" key={s.id}>
              <div className="row">
                <span>{s.name} <span style={{ color: 'var(--muted)' }}>· {tierName(st.level)}</span></span>
                <span className="pct">{accSkill === null ? '—' : `${accSkill}%`}</span>
              </div>
              <div className={`bar ${st.attempts === 0 ? 'untouched' : ''}`}>
                <span style={{ width: `${st.attempts === 0 ? 100 : Math.max(pct, 4)}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <button className="btn ghost" onClick={onReset}>Reset all progress</button>
    </div>
  );
}
