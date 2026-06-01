import React from 'react';

// A small "welcome back" banner on the Home screen for a returning learner.
// `totalQuestions` and `accuracy` are passed in from Home (computed from the
// real activity log) — no hardcoded numbers.
export default function WelcomeBack({ name, totalQuestions, accuracy }) {
  return (
    <div className="card welcome-card fade-in">
      <span className="welcome-wave" aria-hidden="true">👋</span>
      <div>
        <h2>Welcome back{name ? `, ${name}` : ''}!</h2>
        <p>
          You’ve answered <strong>{totalQuestions}</strong> question{totalQuestions === 1 ? '' : 's'}
          {' '}with <strong>{accuracy}%</strong> accuracy.
        </p>
      </div>
    </div>
  );
}
