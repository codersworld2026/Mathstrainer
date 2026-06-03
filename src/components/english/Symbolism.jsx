import React from 'react';
import themes from '../../data/twelfthNightThemes.js';

// KS3-friendly themes & symbols for Twelfth Night. Each card links into the
// PEEL practice so the student can write about that theme. Cards cycle through
// four accent colours for variety.
export default function Symbolism({ onBack, onPractise }) {
  return (
    <div className="english-wrap fade-in">
      <button className="btn ghost small" onClick={onBack}>← English home</button>
      <div className="card eng-hero">
        <span className="eng-badge">🔑 Symbols &amp; themes</span>
        <h1 className="eng-title">Big ideas in Twelfth Night</h1>
        <p className="eng-hero-sub">What each theme means, why Shakespeare uses it, and a quote to get you started.</p>
      </div>

      <div className="detail-grid">
        {themes.map((t, i) => (
          <div className={`card theme-card accent-${i % 4}`} key={t.name}>
            <div className="theme-head">
              <span className="theme-badge">{t.emoji}</span>
              <div className="dc-title">{t.name}</div>
            </div>

            <div className="dc-label">What it means</div>
            <p className="dc-desc">{t.meaning}</p>

            <div className="dc-label">Why it matters</div>
            <p className="dc-role">{t.why}</p>

            <div className="dc-label">Useful quote{t.quotes.length > 1 ? 's' : ''}</div>
            <ul className="dc-quotes">
              {t.quotes.map((q, k) => <li className="ref-quote" key={k}>“{q}”</li>)}
            </ul>

            <div className="dc-label">PEEL starter</div>
            <p className="peel-starter">{t.peelStarter}</p>

            <button className="btn small-cta" onClick={() => onPractise(t.relatedExtractId)}>✍️ Practise a PEEL paragraph</button>
          </div>
        ))}
      </div>
    </div>
  );
}
