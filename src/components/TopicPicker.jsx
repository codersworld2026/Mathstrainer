import React from 'react';
import { SKILLS } from '../engine/skills.js';
import { tierName } from '../engine/adaptive.js';

// Lets you (or him) drill a single objective — a whole round of one topic, at
// that topic's current tier. Handy for homework that's stuck on one thing.
export default function TopicPicker({ learner, onPick, onCancel }) {
  return (
    <div className="fade-in">
      <div className="card">
        <div className="section-title">Pick a topic to drill</div>
        <p className="parent-note">A whole round on one objective, at its current tier.</p>
        <div className="topic-list">
          {SKILLS.map((s) => {
            const st = learner.skills[s.id];
            return (
              <button key={s.id} className="topic-btn" onClick={() => onPick(s.id)}>
                <span className="topic-name">{s.name}</span>
                <span className={`tier tier-${st.level}`}>{tierName(st.level)}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ height: 10 }} />
      <button className="btn ghost" onClick={onCancel}>Back</button>
    </div>
  );
}
