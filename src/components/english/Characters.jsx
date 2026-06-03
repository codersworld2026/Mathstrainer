import React from 'react';
import characters from '../../data/twelfthNightCharacters.js';

// KS3-friendly character profiles for Twelfth Night. Each card links into the
// PEEL practice so the student can write about that character. Cards cycle
// through four accent colours for variety (navy / purple / burgundy / gold).
export default function Characters({ onBack, onPractise }) {
  return (
    <div className="english-wrap fade-in">
      <button className="btn ghost small" onClick={onBack}>← English home</button>
      <div className="card eng-hero">
        <span className="eng-badge">👥 Character profiles</span>
        <h1 className="eng-title">Who’s who in Twelfth Night</h1>
        <p className="eng-hero-sub">Tap a character to read about them, then practise a paragraph using their quotes.</p>
      </div>

      <div className="detail-grid">
        {characters.map((c, i) => (
          <div className={`card profile-card accent-${i % 4}`} key={c.name}>
            <div className="profile-head">
              <span className="profile-avatar">{c.emoji}</span>
              <div className="profile-id">
                <div className="dc-title">{c.name}</div>
                <div className="profile-tag">{c.traits[0]}</div>
              </div>
            </div>

            <p className="dc-desc">{c.description}</p>

            <div className="dc-label">Personality</div>
            <div className="trait-row">
              {c.traits.map((t) => <span className="trait-chip" key={t}>{t}</span>)}
            </div>

            <div className="dc-label">Role in the play</div>
            <p className="dc-role">{c.role}</p>

            <div className="dc-label">Useful quotes</div>
            <ul className="dc-quotes">
              {c.quotes.map((q, k) => <li className="ref-quote" key={k}>“{q}”</li>)}
            </ul>

            <div className="dc-label">PEEL starter</div>
            <p className="peel-starter">{c.peelStarter}</p>

            <button className="btn small-cta" onClick={() => onPractise(c.relatedExtractId)}>✍️ Practise a PEEL paragraph</button>
          </div>
        ))}
      </div>
    </div>
  );
}
