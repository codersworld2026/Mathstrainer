import React from 'react';
import extracts from '../../data/twelfthNightExtracts.js';

// Difficulty is derived from how long the extract is — short lines are gentle
// starters, longer speeches are tougher. Stable and data-driven (no new data).
function difficulty(extract) {
  const words = extract.trim().split(/\s+/).filter(Boolean).length;
  if (words <= 7) return { label: 'Starter', cls: 'starter' };
  if (words <= 16) return { label: 'Growing', cls: 'growing' };
  return { label: 'Challenge', cls: 'challenge' };
}

// Each question is a "writing challenge" card. "Practise this challenge" opens
// the PEEL page with that exact extract pre-loaded.
export default function ExtractQuestions({ onBack, onPractise }) {
  return (
    <div className="english-wrap fade-in">
      <button className="btn ghost small" onClick={onBack}>← English home</button>
      <div className="card eng-hero">
        <span className="eng-badge">📜 Writing challenges</span>
        <h1 className="eng-title">Choose your next writing challenge</h1>
        <p className="eng-hero-sub">Each challenge opens in the PEEL builder with the extract ready to go.</p>
      </div>

      <div className="challenge-grid">
        {extracts.map((e, i) => {
          const d = difficulty(e.extract);
          return (
            <div className="card challenge-card" key={e.id}>
              <div className="ch-top">
                <span className="ch-num">Challenge {i + 1}</span>
                <span className={`ch-diff ${d.cls}`}>{d.label}</span>
              </div>
              <div className="ch-title">{e.title}</div>
              <div className="eq-tags">
                <span className="ex-tag">{e.character}</span>
                <span className="ex-tag theme">{e.theme}</span>
              </div>
              <blockquote className="eq-extract">“{e.extract}”</blockquote>
              <p className="ch-question">{e.question}</p>
              <button className="btn small-cta" onClick={() => onPractise(e.id)}>✍️ Practise this challenge</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
