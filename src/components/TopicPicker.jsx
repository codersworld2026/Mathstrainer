import React, { useState } from 'react';
import { SKILLS } from '../engine/skills.js';
import { tierName } from '../engine/adaptive.js';

// Lets you (or him) drill a single objective — a whole round of one topic, at
// that topic's current tier. Handy for homework that's stuck on one thing.

// Playful icon + bright colour per topic, so the list feels like a game menu.
const ICONS = ['🔢', '➗', '✏️', '📐', '📊', '🧮', '➕', '✖️', '📏', '🔺', '💡', '⭐', '🎯', '🍕', '🧩', '🚀'];
const COLORS = ['#2f6bff', '#18c25a', '#f5a524', '#ff7a1a', '#7c3aed', '#ff4d6d', '#06b6d4', '#e8590c'];

export default function TopicPicker({ learner, onPick, onCancel }) {
  const [q, setQ] = useState('');
  const query = q.trim().toLowerCase();
  const list = SKILLS.filter((s) => s.name.toLowerCase().includes(query));

  return (
    <div className="fade-in">
      <div className="card">
        <div className="section-title">🎯 Pick a topic to drill</div>
        <p className="parent-note">A whole round on one objective, at its current tier.</p>

        <input
          className="topic-search"
          type="search"
          placeholder="🔍 Search topics…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search topics"
        />

        <div className="topic-list">
          {list.length === 0 && (
            <div className="topic-empty">No topics match “{q.trim()}”. Try another word!</div>
          )}
          {list.map((s) => {
            const idx = SKILLS.indexOf(s);
            const color = COLORS[idx % COLORS.length];
            const icon = ICONS[idx % ICONS.length];
            const st = learner.skills[s.id];
            return (
              <button key={s.id} className="topic-btn" onClick={() => onPick(s.id)}>
                <span className="topic-ico" style={{ background: `${color}22`, color }}>{icon}</span>
                <span className="topic-name" style={{ color }}>{s.name}</span>
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
