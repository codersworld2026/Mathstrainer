import React from 'react';
import { SKILLS } from '../engine/skills.js';
import { weakestSkills, tierName, learnerLevel } from '../engine/adaptive.js';
import { totals, currentStreak, weeklyReport, formatDuration } from '../engine/stats.js';

const GOAL_DAYS = 5; // sensible default weekly target (real progress, no fake numbers)

function Card({ icon, title, children }) {
  return (
    <div className="side-card">
      <div className="sc-head"><span className="sc-ico">{icon}</span>{title}</div>
      {children}
    </div>
  );
}

export default function ProgressSidebar({ learner, onSetExamDate }) {
  const t = totals(learner);
  const acc = t.attempts ? Math.round((t.correct / t.attempts) * 100) : null;
  const dayStreak = currentStreak(learner);
  const week = weeklyReport(learner, 1)[0];
  const goalPct = Math.min(100, Math.round((week.days / GOAL_DAYS) * 100));
  const weak = weakestSkills(learner, 3);

  // next suggested topic: weakest attempted skill, else first untried topic
  const untried = SKILLS.find((s) => learner.skills[s.id].attempts === 0);
  const next = weak[0] ? { name: weak[0].name, why: 'Lowest mastery right now' }
    : untried ? { name: untried.name, why: 'Not tried yet' }
    : null;

  // recent achievement, derived from real data
  const started = SKILLS.map((s) => ({ s, st: learner.skills[s.id] })).filter((x) => x.st.attempts > 0);
  const topTier = started.reduce((m, x) => Math.max(m, x.st.level), 0);
  const topSkill = started.filter((x) => x.st.level === topTier).sort((a, b) => b.st.mastery - a.st.mastery)[0];
  let achievement = null;
  if (learner.bestStreak >= 3) achievement = `🔥 ${learner.bestStreak} correct in a row (best combo)`;
  else if (topTier >= 3 && topSkill) achievement = `🏅 Reached ${tierName(topTier)} on ${topSkill.s.name}`;
  else if (t.attempts > 0) achievement = '🌟 Answered your first questions — great start!';

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

  return (
    <aside className="dash-side">
      <Card icon="👋" title="Student summary">
        <div className="sc-big">{learner.name}</div>
        <div className="sc-sub">
          {t.attempts > 0
            ? `Level ${learnerLevel(learner.xp)} · ${t.attempts} questions${acc !== null ? ` · ${acc}% correct` : ''}`
            : 'Just getting started — first round awaits!'}
        </div>
      </Card>

      <Card icon="🔥" title="Current streak">
        <div className={`sc-big ${dayStreak > 0 ? 'flame' : ''}`}>{dayStreak} day{dayStreak === 1 ? '' : 's'}</div>
        <div className="sc-sub">{dayStreak > 0 ? 'Keep it going — practise today!' : 'Practise today to start a streak.'}</div>
      </Card>

      <Card icon="🎯" title="Weekly goal">
        <div className="sc-row"><span>{week.days} / {GOAL_DAYS} days</span><span className="sc-pct">{goalPct}%</span></div>
        <div className="bar"><span style={{ width: `${Math.max(goalPct, 3)}%` }} /></div>
        <div className="sc-sub">
          {week.days >= GOAL_DAYS ? 'Goal reached this week 🎉'
            : `${GOAL_DAYS - week.days} more day${GOAL_DAYS - week.days === 1 ? '' : 's'} to hit your goal`}
        </div>
      </Card>

      <Card icon="📆" title="Exam countdown">
        {examDays !== null && examDays > 0 && (
          <><div className="sc-big">{examDays}</div><div className="sc-sub">day{examDays === 1 ? '' : 's'} to go · {examLabel}</div></>
        )}
        {examDays === 0 && <><div className="sc-big">Today</div><div className="sc-sub">Exam day — good luck!</div></>}
        {examDays !== null && examDays < 0 && <div className="sc-sub">Exam date ({examLabel}) has passed.</div>}
        {examDays === null && <div className="sc-sub">No exam date set yet.</div>}
        <label className="sc-mini-lbl" htmlFor="exam-date">{exam ? 'Change date' : 'Set exam date'}</label>
        <input id="exam-date" type="date" className="text-input date-input" value={exam}
          onChange={(e) => onSetExamDate(e.target.value)} />
      </Card>

      <Card icon="📌" title="Weak areas to practise">
        {weak.length > 0
          ? <div className="chip-wrap">{weak.map((s) => <span className="weak-chip" key={s.id}>{s.name}</span>)}</div>
          : <div className="sc-sub">Not enough data yet — practise a few rounds.</div>}
      </Card>

      <Card icon="🏆" title="Recent achievement">
        <div className="sc-sub">{achievement || 'No achievements yet — keep practising!'}</div>
      </Card>

      <Card icon="👉" title="Next suggested topic">
        {next
          ? <><div className="sc-mid">{next.name}</div><div className="sc-sub">{next.why}</div></>
          : <div className="sc-sub">Not enough data yet.</div>}
      </Card>
    </aside>
  );
}
