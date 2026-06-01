import React, { useState } from 'react';
import { SKILLS } from '../engine/skills.js';
import { overallAccuracy, weakestSkills, tierName, TIERS } from '../engine/adaptive.js';
import Report from './Report.jsx';
import ProgressSidebar from './ProgressSidebar.jsx';

// Small titled section header with a maths/data icon — used across the dashboard.
function SecHead({ icon, title, sub }) {
  return (
    <div className="sec-head">
      <span className="sec-ico">{icon}</span>
      <span className="sec-head-text">
        <span className="sec-title">{title}</span>
        {sub && <span className="sec-sub">{sub}</span>}
      </span>
    </div>
  );
}

export default function Progress({ learner, onReset, onLogout, onSetLevel, onSetAll, onSetExamDate }) {
  const [view, setView] = useState('activity');
  const acc = overallAccuracy(learner);
  const weak = weakestSkills(learner, 3);
  const tried = SKILLS.filter((s) => learner.skills[s.id].attempts > 0).length;

  return (
    <div className="fade-in progress-dash">
      <header className="dash-header">
        <div className="dash-head-text">
          <h1>{learner.name}’s progress</h1>
          <p className="dash-sub">Parent dashboard · Year 7 last-term revision</p>
        </div>
        <span className="dash-emblem" aria-hidden="true">∑</span>
      </header>

      <div className="seg">
        <button className={view === 'activity' ? 'active' : ''} onClick={() => setView('activity')}>📊 Activity</button>
        <button className={view === 'skills' ? 'active' : ''} onClick={() => setView('skills')}>🎯 Skills &amp; tiers</button>
      </div>

      <div className="dash-grid">
        <div className="dash-main">
      {view === 'activity' && <Report learner={learner} />}

      {view === 'skills' && (<>
        <div className="card">
          <SecHead icon="∑" title="Summary" sub="Lifetime totals across every topic" />
          <div className="stat-row" style={{ marginTop: 0 }}>
            <div className="stat"><div className="v">{acc}%</div><div className="l">Accuracy</div></div>
            <div className="stat"><div className="v">{learner.round}</div><div className="l">Rounds</div></div>
            <div className="stat"><div className="v">{learner.totalAttempts}</div><div className="l">Questions</div></div>
          </div>

          {weak.length > 0 && (
            <>
              <div className="sub-title">🎯 Needs the most work</div>
              <div className="chip-wrap">
                {weak.map((s) => <span className="weak-chip" key={s.id}>{s.name}</span>)}
              </div>
            </>
          )}
        </div>

        <div className="card">
          <SecHead icon="🏁" title="Starting tier" sub="Place him where he actually is — set all at once, or nudge each with ◀ ▶" />
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
          <SecHead icon="📚" title="Skill by skill" sub={`${tried} of ${SKILLS.length} topics started`} />
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
        </div>

        <ProgressSidebar learner={learner} onSetExamDate={onSetExamDate} />
      </div>

      <div className="dash-footer">
        <button className="btn ghost small danger" onClick={onReset}>Reset progress</button>
        {onLogout && <button className="btn ghost small" onClick={onLogout}>Log out</button>}
      </div>
    </div>
  );
}
