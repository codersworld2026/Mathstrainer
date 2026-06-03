import React from 'react';
import characters from '../../data/twelfthNightCharacters.js';
import themes from '../../data/twelfthNightThemes.js';

// The story told in a few short beats, so it reads like a play guide.
const STORY = [
  { icon: '🌊', text: 'Viola is shipwrecked in Illyria and disguises herself as a boy called Cesario.' },
  { icon: '🎶', text: 'She works for Duke Orsino, who is in love with the countess Olivia.' },
  { icon: '💘', text: 'Olivia falls for Cesario, while Viola secretly loves Orsino — a tangle of mistaken love.' },
  { icon: '🃏', text: 'Meanwhile, the proud servant Malvolio is tricked by a forged letter for a laugh.' },
  { icon: '🎉', text: 'Twins reunite, disguises drop, and the couples are happily matched in the end.' },
];

// A few famous lines for the hub.
const QUOTES = [
  { text: 'If music be the food of love, play on.', by: 'Orsino' },
  { text: 'I am not what I am.', by: 'Viola' },
  { text: 'Better a witty fool than a foolish wit.', by: 'Feste' },
];

export default function TwelfthNight({ onBack, onOpen }) {
  return (
    <div className="english-wrap fade-in">
      <button className="btn ghost small" onClick={onBack}>← English home</button>

      <div className="card eng-hero">
        <span className="eng-badge">🎭 The play guide</span>
        <h1 className="eng-title">Twelfth Night</h1>
        <p className="eng-hero-sub">A comedy of love, disguise and mistaken identity by William Shakespeare.</p>
      </div>

      <div className="card play-card">
        <div className="eng-kicker">⏱ Story in 60 seconds</div>
        <ol className="story-list">
          {STORY.map((s, i) => (
            <li className="story-beat" key={i}>
              <span className="beat-ico">{s.icon}</span>
              <span className="beat-text">{s.text}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="eng-duo">
        <div className="card play-card">
          <div className="eng-kicker">👥 Main characters</div>
          <div className="trait-row">
            {characters.map((c) => (
              <button className="trait-chip clickable" key={c.name} onClick={() => onOpen('characters')}>
                {c.emoji} {c.name}
              </button>
            ))}
          </div>
        </div>
        <div className="card play-card">
          <div className="eng-kicker">🔑 Big themes</div>
          <div className="trait-row">
            {themes.map((t) => (
              <button className="trait-chip clickable" key={t.name} onClick={() => onOpen('symbolism')}>
                {t.emoji} {t.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card play-card">
        <div className="eng-kicker">📜 Famous quotes</div>
        <ul className="quote-list">
          {QUOTES.map((q, i) => (
            <li key={i} className="famous-quote">
              <span className="fq-text">“{q.text}”</span>
              <span className="fq-by">— {q.by}</span>
            </li>
          ))}
        </ul>
      </div>

      <h2 className="eng-sec-title"><span className="eng-orn">✦</span>Start practising<span className="eng-orn">✦</span></h2>
      <div className="hub-actions">
        <button className="hub-btn" onClick={() => onOpen('peel')}><span>✍️</span>PEEL Practice</button>
        <button className="hub-btn" onClick={() => onOpen('characters')}><span>👥</span>Characters</button>
        <button className="hub-btn" onClick={() => onOpen('symbolism')}><span>🔑</span>Symbolism</button>
        <button className="hub-btn" onClick={() => onOpen('extracts')}><span>📜</span>Extract Questions</button>
      </div>

      <h2 className="eng-sec-title"><span className="eng-orn">✦</span>Exam zone<span className="eng-orn">✦</span></h2>
      <div className="exam-zone">
        <button className="exam-feature practice" onClick={() => onOpen('practice-exams')}>
          <span className="ef-ico">📝</span>
          <span className="ef-title">Practice Exams</span>
          <span className="ef-sub">Practise Shakespeare questions with help.</span>
          <span className="ef-btn">Start practice</span>
        </button>
        <button className="exam-feature real" onClick={() => onOpen('real-exam')}>
          <span className="ef-ico">⏱️</span>
          <span className="ef-title">Real Exam Mode</span>
          <span className="ef-sub">Try a timed exam with no hints.</span>
          <span className="ef-btn">Start exam</span>
        </button>
      </div>
    </div>
  );
}
