import React from 'react';
import characters from '../../data/twelfthNightCharacters.js';
import themes from '../../data/twelfthNightThemes.js';

// The main hub for the play: a short summary, themes, characters, and links to
// every English activity.
export default function TwelfthNight({ onBack, onOpen }) {
  return (
    <div className="english-wrap fade-in">
      <button className="btn ghost small" onClick={onBack}>← English home</button>

      <div className="card eng-hero">
        <span className="eng-badge">🎭 Twelfth Night</span>
        <h1>Shakespeare’s Twelfth Night</h1>
        <p>
          After a shipwreck, Viola disguises herself as a boy called Cesario and works for Duke Orsino.
          Orsino loves Olivia, Olivia falls for Cesario, and Viola secretly loves Orsino — a funny tangle
          of love, disguise and mistaken identity, with pranks on the proud servant Malvolio along the way.
        </p>
      </div>

      <div className="card">
        <div className="dc-label">Main themes</div>
        <div className="trait-row">
          {themes.map((t) => <span className="trait-chip" key={t.name}>{t.emoji} {t.name}</span>)}
        </div>
        <div className="dc-label" style={{ marginTop: 14 }}>Main characters</div>
        <div className="trait-row">
          {characters.map((c) => <span className="trait-chip" key={c.name}>{c.emoji} {c.name}</span>)}
        </div>
      </div>

      <div className="hub-actions">
        <button className="hub-btn" onClick={() => onOpen('peel')}><span>✍️</span>PEEL Practice</button>
        <button className="hub-btn" onClick={() => onOpen('characters')}><span>👥</span>Characters</button>
        <button className="hub-btn" onClick={() => onOpen('symbolism')}><span>🔑</span>Symbolism</button>
        <button className="hub-btn" onClick={() => onOpen('extracts')}><span>📜</span>Extract Questions</button>
      </div>
    </div>
  );
}
