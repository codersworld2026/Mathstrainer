import React from 'react';

// Platform-level subject navbar shown after login. Lets the user move between
// the subject trainers. Maths and English are live; Science is "Coming soon".
export default function SubjectNav({ subject, onSubject, theme, onToggleTheme, onLogout, firebaseOn }) {
  return (
    <div className="subject-nav">
      <div className="sn-brand">
        <span className="mark">S</span>
        <span className="sn-name">Study Trainer</span>
        <span className="sn-tag">Maths • English • Science</span>
      </div>

      <nav className="sn-links" aria-label="Subjects">
        <button className={`sn-link ${subject === 'maths' ? 'active' : ''}`} onClick={() => onSubject('maths')}>
          <span className="sn-ico">➗</span>Maths
        </button>
        <button className={`sn-link ${subject === 'english' ? 'active' : ''}`} onClick={() => onSubject('english')}>
          <span className="sn-ico">📖</span>English
        </button>
        <button className="sn-link disabled" disabled title="Coming soon">
          <span className="sn-ico">🔬</span>Science<span className="sn-soon">Soon</span>
        </button>
      </nav>

      <div className="sn-controls">
        <button className="theme-btn" onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Switch to day mode' : 'Switch to night mode'}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        {firebaseOn && (
          <button className="theme-btn" onClick={onLogout} aria-label="Log out" title="Log out">🚪</button>
        )}
      </div>
    </div>
  );
}
