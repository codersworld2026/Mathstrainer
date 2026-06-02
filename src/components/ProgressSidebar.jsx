import React, { useState } from 'react';
import { SKILLS } from '../engine/skills.js';
import { weakestSkills } from '../engine/adaptive.js';
import { totals, currentStreak, weeklyReport, formatDuration } from '../engine/stats.js';
import { nextBest } from '../engine/topics.js';
import { recentAchievements } from '../engine/achievements.js';

function Card({ icon, title, children }) {
  return (
    <div className="side-card">
      <div className="sc-head"><span className="sc-ico">{icon}</span>{title}</div>
      {children}
    </div>
  );
}

const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export default function ProgressSidebar({ learner, onSetExamDate, onPractise }) {
  const [showPicker, setShowPicker] = useState(false);
  const t = totals(learner);
  const dayStreak = currentStreak(learner);
  const week = weeklyReport(learner, 1)[0];
  const weak = weakestSkills(learner, 3);
  const nb = nextBest(learner);
  const recent = recentAchievements(learner, 1)[0];

  // exam countdown
  const exam = learner.examDate || '';
  let examDays = null;
  if (exam) {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const ed = new Date(exam + 'T00:00:00');
    if (!Number.isNaN(ed.getTime())) examDays = Math.round((ed - today) / 86400000);
  }
  const examLabel = exam
    ? new Date(exam + 'T00:00:00').toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
    : '';
  const examValid = examDays !== null && examDays >= 0; // today or future

  return (
    <aside className="dash-side">
      <Card icon="📋" title="This week">
        <ul className="week-summary">
          <li><span>⏱</span> <b>{formatDuration(week.seconds)}</b> practised</li>
          <li><span>📝</span> <b>{week.attempts}</b> questions answered</li>
          <li><span>🔥</span> <b>{dayStreak}</b> day streak</li>
          <li><span>🎯</span> Needs work: <b>{weak[0] ? weak[0].name : '—'}</b></li>
          <li><span>⭐</span> Recommended next: <b>{nb.name}</b></li>
        </ul>
        <button className="btn small-cta" onClick={() => onPractise(nb.id)}>Practise now</button>
      </Card>

      <Card icon="📆" title="Exam countdown">
        {examValid ? (
          <>
            {examDays > 0
              ? <><div className="sc-big">{examDays}</div><div className="sc-sub">day{examDays === 1 ? '' : 's'} to go · {examLabel}</div></>
              : <><div className="sc-big">Today</div><div className="sc-sub">Exam day — good luck!</div></>}
            <button className="btn small-cta ghost-cta" onClick={() => setShowPicker((v) => !v)}>Change date</button>
          </>
        ) : (
          <>
            <div className="sc-sub">No upcoming exam date set.</div>
            {!showPicker && <button className="btn small-cta" onClick={() => setShowPicker(true)}>Set exam date</button>}
          </>
        )}
        {(showPicker || (examValid && false)) && (
          <input type="date" className="text-input date-input" value={exam} min={todayStr()}
            onChange={(e) => { onSetExamDate(e.target.value); setShowPicker(false); }} />
        )}
      </Card>

      <Card icon="🏆" title="Recent achievement">
        {recent
          ? <div className="recent-ach"><span className="ra-ico">{recent.icon}</span><span className="ra-name">{recent.name}</span></div>
          : <div className="sc-sub">No badges yet — keep practising!</div>}
      </Card>

      <Card icon="📌" title="Weak areas to practise">
        {weak.length > 0
          ? <div className="chip-wrap">{weak.map((s) => (
              <button className="weak-chip clickable" key={s.id} onClick={() => onPractise(s.id)}>{s.name}</button>
            ))}</div>
          : <div className="sc-sub">Not enough data yet — practise a few rounds.</div>}
      </Card>
    </aside>
  );
}
