import React, { useState } from 'react';
import { SKILLS } from '../engine/skills.js';
import { overallAccuracy, weakestSkills, tierName, TIERS } from '../engine/adaptive.js';
import Report from './Report.jsx';

export default function Progress({ learner, onReset, onSetLevel, onSetAll }) {
  const [view, setView] = useState('activity');
  const acc = overallAccuracy(learner);
  const weak = weakestSkills(learner, 3);
  const tried = SKILLS.filter((s) => learner.skills[s.id].attempts > 0).length;

  return (
    <div className="fade-in">
      <div className="seg">
        <button className={view === 'activity' ? 'active' : ''} onClick={() => setView('activity')}>Activity</button>
        <button className={view === 'skills' ? 'active' : ''} onClick={() => setView('skills')}>Skills &amp; tiers</button>
      </div>

      {view === 'activity' && <Report learner={learner} />}

      {view === 'skills' && (<>
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
        <div className="section-title">Starting tier</div>
        <div className="parent-note">
          Place him where he actually is. Set every topic at once, or nudge each one below with ◀ ▶.
        </div>
        <div className="tier-set-row">
          {TIERS.map((t, idx) => (
            <button key={t} className={`tier-set-btn tier-${idx + 1}`}
              onClick={() => { if (window.confirm(`Set every topic to ${t}?`)) onSetAll(idx + 1); }}>
              {t}
            </button>
          ))}
        </div>
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
                <span className="skill-name">{s.name}</span>
                <span className="row-right">
                  <span className="tier-step">
                    <button className="step-btn" disabled={st.level <= 1} aria-label="Lower tier"
                      onClick={() => onSetLevel(s.id, st.level - 1)}>◀</button>
                    <span className={`tier tier-${st.level}`}>{tierName(st.level)}</span>
                    <button className="step-btn" disabled={st.level >= TIERS.length} aria-label="Raise tier"
                      onClick={() => onSetLevel(s.id, st.level + 1)}>▶</button>
                  </span>
                  <span className="pct">{accSkill === null ? '—' : `${accSkill}%`}</span>
                </span>
              </div>
              <div className={`bar ${st.attempts === 0 ? 'untouched' : ''}`}>
                <span style={{ width: `${st.attempts === 0 ? 100 : Math.max(pct, 4)}%` }} />
              </div>
            </div>
          );
        })}
      </div>
      </>)}

      <button className="btn ghost" onClick={onReset}>Reset all progress</button>
    </div>
  );
}
