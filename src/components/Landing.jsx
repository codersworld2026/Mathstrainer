import React from 'react';

// Public first screen. Explains what the app is for and routes the user into
// the trainer (via login when Firebase is configured). The trainer itself is
// unchanged — this just sits in front of it.

// Playful maths symbols that drift around the background — purely decorative.
// Positioned toward the edges so they never sit behind the card's text.
const DECOR = [
  { s: '+', x: 7, y: 16, size: 40, c: 'd-blue', delay: 0 },
  { s: '×', x: 90, y: 12, size: 32, c: 'd-pink', delay: 0.8 },
  { s: '÷', x: 4, y: 52, size: 34, c: 'd-green', delay: 1.6 },
  { s: '√', x: 92, y: 46, size: 36, c: 'd-purple', delay: 0.4 },
  { s: '%', x: 12, y: 84, size: 30, c: 'd-amber', delay: 1.1 },
  { s: 'π', x: 86, y: 82, size: 38, c: 'd-orange', delay: 2.0 },
  { s: '=', x: 50, y: 7, size: 30, c: 'd-green', delay: 1.3 },
  { s: '−', x: 78, y: 90, size: 40, c: 'd-blue', delay: 0.6 },
  { s: '▲', x: 18, y: 36, size: 24, c: 'd-amber', delay: 1.8 },
  { s: '●', x: 82, y: 64, size: 22, c: 'd-pink', delay: 0.2 },
  { s: '7', x: 95, y: 30, size: 30, c: 'd-purple', delay: 2.3 },
  { s: '½', x: 5, y: 70, size: 30, c: 'd-orange', delay: 0.9 },
];

export default function Landing({ firebaseOn, authUser, theme, onToggleTheme, onStart, onLogin, onLogout }) {
  const who = authUser ? (authUser.displayName || authUser.email) : '';

  return (
    <div className="app landing">
      <div className="landing-decor" aria-hidden="true">
        {DECOR.map((d, i) => (
          <span key={i} className={`decor ${d.c}`}
            style={{ left: `${d.x}%`, top: `${d.y}%`, fontSize: d.size, animationDelay: `${d.delay}s` }}>
            {d.s}
          </span>
        ))}
      </div>

      <header className="topbar">
        <div className="brand">
          <span className="mark">M</span>
          <span className="name">Maths Trainer</span>
        </div>
        <div className="topbar-right">
          <button className="theme-btn" onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to day mode' : 'Switch to night mode'}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          {firebaseOn && (authUser ? (
            <div className="landing-user">
              <span className="who" title={who}>{who}</span>
              <button className="btn ghost small" onClick={onLogout}>Log out</button>
            </div>
          ) : (
            <button className="btn ghost small" onClick={onLogin}>Log in</button>
          ))}
        </div>
      </header>

      <main className="center-wrap fade-in">
        <div className="card landing-hero">
          <div className="landing-icons" aria-hidden="true">
            <span className="li li-blue">＋</span>
            <span className="li li-green">×</span>
            <span className="li li-amber">÷</span>
            <span className="li li-purple">√</span>
          </div>

          <div className="landing-badge">Year 7 · Last term revision</div>
          <h1>Year 7 Maths Exam Prep</h1>
          <p className="landing-lead">
            Revise the key maths topics from the last term and get ready for your upcoming exam.
          </p>
          <p className="landing-body">
            Practise questions, build confidence, and track your progress as you prepare.
            This trainer is designed to help Year 7 students strengthen their skills step by step.
          </p>

          <ul className="landing-points">
            <li className="lp-blue"><span className="lp-ico">📚</span>Covers last term’s topics</li>
            <li className="lp-green"><span className="lp-ico">🎯</span>Adapts to your level</li>
            <li className="lp-amber"><span className="lp-ico">📈</span>Tracks your progress</li>
          </ul>

          <button className="btn accent landing-cta" onClick={onStart}>🚀 Start Practising</button>
          <p className="landing-hint">Start practising when you’re ready.</p>
        </div>
      </main>
    </div>
  );
}
