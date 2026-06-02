import React from 'react';

// English landing — every card is now a live, working page.
const CARDS = [
  { key: 'peel', icon: '✍️', title: 'PEEL Paragraph Practice', sub: 'Build Point, Evidence, Explain, Link step by step' },
  { key: 'twelfth', icon: '🎭', title: 'Twelfth Night', sub: 'The play hub — summary, themes and characters' },
  { key: 'characters', icon: '👥', title: 'Characters', sub: 'Viola, Malvolio, Orsino, Olivia and more' },
  { key: 'symbolism', icon: '🔑', title: 'Symbolism', sub: 'Themes and symbols, with useful quotes' },
  { key: 'extracts', icon: '📜', title: 'Extract Questions', sub: 'Pick a question and practise it in PEEL' },
];

export default function EnglishHome({ studentName, onOpen }) {
  return (
    <div className="english-wrap fade-in">
      <div className="card eng-hero">
        <span className="eng-badge">📚 English Trainer</span>
        <h1>Twelfth Night — writing practice</h1>
        <p>Hi {studentName} 👋 Explore the play, then build great PEEL paragraphs about it, one step at a time.</p>
      </div>

      <div className="eng-card-grid">
        {CARDS.map((c) => (
          <button key={c.key} className="eng-card" onClick={() => onOpen(c.key)}>
            <span className="eng-ico">{c.icon}</span>
            <span className="eng-card-text">
              <span className="eng-card-title">{c.title}</span>
              <span className="eng-card-sub">{c.sub}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
