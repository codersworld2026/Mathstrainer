import React from 'react';
import themes from '../../data/twelfthNightThemes.js';

// KS3-friendly themes & symbols for Twelfth Night. Each card links into the
// PEEL practice so the student can write about that theme.
export default function Symbolism({ onBack, onPractise }) {
  return (
    <div className="english-wrap fade-in">
      <button className="btn ghost small" onClick={onBack}>← English home</button>
      <div className="card eng-hero">
        <span className="eng-badge">🔑 Symbolism &amp; themes</span>
        <h1>Big ideas in Twelfth Night</h1>
        <p>What each theme means, why Shakespeare uses it, and a quote to get you started.</p>
      </div>

      <div className="detail-grid">
        {themes.map((t) => (
          <div className="card detail-card" key={t.name}>
            <div className="dc-title"><span className="dc-emoji">{t.emoji}</span>{t.name}</div>

            <div className="dc-label">What it means</div>
            <p className="dc-desc">{t.meaning}</p>

            <div className="dc-label">Why Shakespeare uses it</div>
            <p className="dc-role">{t.why}</p>

            <div className="dc-label">Useful quote{t.quotes.length > 1 ? 's' : ''}</div>
            <ul className="dc-quotes">
              {t.quotes.map((q, i) => <li className="ref-quote" key={i}>“{q}”</li>)}
            </ul>

            <div className="dc-label">PEEL starter</div>
            <p className="peel-starter">{t.peelStarter}</p>

            <button className="btn small-cta" onClick={() => onPractise(t.relatedExtractId)}>✍️ Practise in PEEL</button>
          </div>
        ))}
      </div>
    </div>
  );
}
