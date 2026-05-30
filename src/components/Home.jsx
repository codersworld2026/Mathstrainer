import React from 'react';
import { learnerLevel } from '../engine/adaptive.js';

export default function Home({ learner, onStart, onWeak, onQuickfire, onTopics }) {
  const level = learnerLevel(learner.xp);
  const roundsToday = learner.history.filter(
    (h) => Date.now() - h.at < 24 * 60 * 60 * 1000
  ).length;

  return (
    <div className="fade-in">
      <div className="card hero">
        <h1>Ready, {learner.name}?</h1>
        <p>{learner.round === 0 ? 'First round — let’s find your level.' : 'One short round. Six questions.'}</p>
        <div className="stat-row">
          <div className="stat">
            <div className={`v ${learner.streak > 0 ? 'flame' : ''}`}>{learner.streak}</div>
            <div className="l">Combo</div>
          </div>
          <div className="stat">
            <div className="v">{roundsToday}</div>
            <div className="l">Today</div>
          </div>
          <div className="stat">
            <div className="v">{level}</div>
            <div className="l">Level</div>
          </div>
        </div>
      </div>
      <div style={{ height: 14 }} />
      <button className="btn accent" onClick={onStart}>
        {learner.round === 0 ? 'Start round 1' : `Start round ${learner.round + 1}`}
      </button>

      <div className="mode-row">
        <button className="mode-btn" onClick={onWeak} disabled={learner.totalAttempts === 0}>
          <span className="mode-ico">🎯</span>Weak spots
        </button>
        <button className="mode-btn" onClick={onQuickfire}>
          <span className="mode-ico">⏱</span>Quickfire
        </button>
        <button className="mode-btn" onClick={onTopics}>
          <span className="mode-ico">📚</span>Pick a topic
        </button>
      </div>

      {learner.bestStreak > 2 && (
        <p className="footer-note">Best combo so far: {learner.bestStreak} in a row</p>
      )}
    </div>
  );
}
