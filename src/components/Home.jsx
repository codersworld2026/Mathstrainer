import React from 'react';
import { tierName, xpInfo } from '../engine/adaptive.js';
import { currentStreak } from '../engine/stats.js';
import { nextBest } from '../engine/topics.js';
import { SKILLS } from '../engine/skills.js';

export default function Home({ learner, onStart, onWeak, onQuickfire, onTopics, onDaily, onTopic, dailyAvailable }) {
  const ids = Object.keys(learner.skills);
  const avgLevel = Math.max(1, Math.round(ids.reduce((a, id) => a + learner.skills[id].level, 0) / (ids.length || 1)));
  const rank = `${tierName(avgLevel)} Mathematician`;
  const unlocked = SKILLS.filter((s) => learner.skills[s.id].attempts > 0).length;
  const streak = currentStreak(learner);
  const xp = xpInfo(learner.xp);
  const nb = nextBest(learner);

  return (
    <div className="fade-in">
      <div className="card rank-hero">
        <div className="rank-greet">Hi {learner.name} 👋</div>
        <div className="rank-badge">🏆</div>
        <h1 className="rank-title">{rank}</h1>
        <div className="rank-stats">
          <div className="rs"><b>{learner.totalAttempts}</b><span>questions</span></div>
          <div className="rs"><b className={streak > 0 ? 'flame' : ''}>{streak}</b><span>day streak</span></div>
          <div className="rs"><b>{unlocked}</b><span>skills unlocked</span></div>
        </div>
        <div className="xp-wrap">
          <div className="xp-row"><span>⚡ Level {xp.level}</span><span>{xp.into} / {xp.span} XP</span></div>
          <div className="xp-bar"><span style={{ width: `${Math.max(xp.pct, 3)}%` }} /></div>
          <div className="xp-foot">{xp.toNext} XP to level {xp.level + 1}</div>
        </div>
      </div>

      <div className={`card daily-card ${dailyAvailable ? '' : 'done'}`}>
        <div className="daily-left">
          <span className="daily-ico">{dailyAvailable ? '🛡️' : '✅'}</span>
          <div>
            <div className="daily-title">Daily Challenge</div>
            <div className="daily-sub">
              {dailyAvailable ? '5 questions · +50 XP · keeps your streak' : 'Done today — back tomorrow!'}
            </div>
          </div>
        </div>
        {dailyAvailable && <button className="btn small-cta" onClick={onDaily}>Start</button>}
      </div>

      <div className="card next-best">
        <div className="nb-text">
          <div className="nb-label">⭐ Recommended next</div>
          <div className="nb-topic">{nb.name}</div>
        </div>
        <button className="btn small-cta" onClick={() => onTopic(nb.id)}>Practise now</button>
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
    </div>
  );
}
