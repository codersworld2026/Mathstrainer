import React from 'react';
import characters from '../../data/twelfthNightCharacters.js';

// KS3-friendly character reference for Twelfth Night. Each card links into the
// PEEL practice so the student can write about that character.
export default function Characters({ onBack, onPractise }) {
  return (
    <div className="english-wrap fade-in">
      <button className="btn ghost small" onClick={onBack}>← English home</button>
      <div className="card eng-hero">
        <span className="eng-badge">👥 Characters</span>
        <h1>Who’s who in Twelfth Night</h1>
        <p>Use these notes and quotes to help you write about each character.</p>
      </div>

      <div className="detail-grid">
        {characters.map((c) => (
          <div className="card detail-card" key={c.name}>
            <div className="dc-title"><span className="dc-emoji">{c.emoji}</span>{c.name}</div>
            <p className="dc-desc">{c.description}</p>

            <div className="dc-label">Personality</div>
            <div className="trait-row">
              {c.traits.map((t) => <span className="trait-chip" key={t}>{t}</span>)}
            </div>

            <div className="dc-label">Role in the play</div>
            <p className="dc-role">{c.role}</p>

            <div className="dc-label">Useful quotes</div>
            <ul className="dc-quotes">
              {c.quotes.map((q, i) => <li className="ref-quote" key={i}>“{q}”</li>)}
            </ul>

            <div className="dc-label">PEEL starter</div>
            <p className="peel-starter">{c.peelStarter}</p>

            <button className="btn small-cta" onClick={() => onPractise(c.relatedExtractId)}>✍️ Practise in PEEL</button>
          </div>
        ))}
      </div>
    </div>
  );
}
