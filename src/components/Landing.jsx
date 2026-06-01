import React from 'react';

// Public first screen. Explains what the app is for and routes the user into
// the trainer (via login when Firebase is configured). The trainer itself is
// unchanged — this just sits in front of it.
export default function Landing({ firebaseOn, authUser, theme, onToggleTheme, onStart, onLogin, onLogout }) {
  const who = authUser ? (authUser.displayName || authUser.email) : '';

  return (
    <div className="app landing">
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
            <li><span className="lp-ico">📚</span>Covers last term’s topics</li>
            <li><span className="lp-ico">🎯</span>Adapts to your level</li>
            <li><span className="lp-ico">📈</span>Tracks your progress</li>
          </ul>

          <button className="btn accent landing-cta" onClick={onStart}>Start Practising</button>
          <p className="landing-hint">Start practising when you’re ready.</p>
        </div>
      </main>
    </div>
  );
}
