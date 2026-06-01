import React, { useState } from 'react';
import {
  formatDuration, todaySeconds, totals, currentStreak,
  weeklyReport, calendarMonth, MONTHS,
} from '../engine/stats.js';

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const shortMonth = (d) => MONTHS[d.getMonth()].slice(0, 3);

// Titled section header with a maths/data icon — matches the rest of the dashboard.
function SecHead({ icon, title, sub }) {
  return (
    <div className="sec-head">
      <span className="sec-ico">{icon}</span>
      <span className="sec-head-text">
        <span className="sec-title">{title}</span>
        {sub && <span className="sec-sub">{sub}</span>}
      </span>
    </div>
  );
}

export default function Report({ learner }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const t = totals(learner);
  const weeks = weeklyReport(learner, 8);
  const thisWeek = weeks[0];
  const maxWeekSecs = Math.max(1, ...weeks.map((w) => w.seconds));
  const calWeeks = calendarMonth(learner, year, month);
  const accAll = t.attempts ? Math.round((t.correct / t.attempts) * 100) : null;

  const stepMonth = (delta) => {
    const d = new Date(year, month + delta, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  };
  const isFutureMonth = year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth());

  return (
    <div className="fade-in">
      <div className="card">
        <SecHead icon="⏱" title="Time on task" sub="How long and how often he’s practising" />
        <div className="stat-row" style={{ marginTop: 0 }}>
          <div className="stat"><div className="v">{formatDuration(todaySeconds(learner))}</div><div className="l">Today</div></div>
          <div className="stat"><div className="v">{formatDuration(thisWeek.seconds)}</div><div className="l">This week</div></div>
          <div className="stat"><div className={`v ${currentStreak(learner) > 0 ? 'flame' : ''}`}>{currentStreak(learner)}</div><div className="l">Day streak</div></div>
          <div className="stat"><div className="v">{t.activeDays}</div><div className="l">Active days</div></div>
        </div>
        <div className="report-total">
          Total: <strong>{formatDuration(t.seconds)}</strong> over <strong>{t.activeDays}</strong> day{t.activeDays === 1 ? '' : 's'}
          {' · '}<strong>{t.attempts}</strong> questions{accAll === null ? '' : <> · <strong>{accAll}%</strong> correct</>}
        </div>
      </div>

      <div className="card">
        <SecHead icon="📅" title="Practice calendar" sub="Darker days = more minutes" />
        <div className="cal-head">
          <button className="step-btn" onClick={() => stepMonth(-1)} aria-label="Previous month">◀</button>
          <div className="cal-title">{MONTHS[month]} {year}</div>
          <button className="step-btn" onClick={() => stepMonth(1)} disabled={isFutureMonth} aria-label="Next month">▶</button>
        </div>
        <div className="cal-grid cal-weekdays">
          {WEEKDAYS.map((d, k) => <div key={k} className="cal-wd">{d}</div>)}
        </div>
        {calWeeks.map((wk, wi) => (
          <div className="cal-grid" key={wi}>
            {wk.map((cell, ci) => cell === null
              ? <div key={ci} className="cal-cell empty" />
              : (
                <div key={ci} className={`cal-cell lvl-${cell.level}`}
                  title={`${cell.key}: ${formatDuration(cell.seconds)}${cell.attempts ? `, ${cell.attempts} questions` : ''}`}>
                  {cell.day}
                </div>
              ))}
          </div>
        ))}
        <div className="cal-legend">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((l) => <span key={l} className={`cal-cell lvl-${l} legend`} />)}
          <span>More</span>
        </div>
      </div>

      <div className="card">
        <SecHead icon="📈" title="Weekly progression" sub="Last 8 weeks · minutes per week" />
        {weeks.every((w) => w.seconds === 0 && w.attempts === 0) ? (
          <div className="parent-note">No activity recorded yet — it’ll fill in as he practises.</div>
        ) : weeks.map((w, k) => {
          const end = new Date(w.weekStart); end.setDate(end.getDate() + 6);
          const acc = w.attempts ? Math.round((w.correct / w.attempts) * 100) : null;
          return (
            <div className="week-row" key={k}>
              <div className="week-when">
                <div className="week-label">{w.weekStart.getDate()} {shortMonth(w.weekStart)} – {end.getDate()} {shortMonth(end)}{k === 0 ? ' · this week' : ''}</div>
                <div className="week-sub">{w.days}/7 days · {w.rounds} rounds · {w.attempts} questions{acc === null ? '' : ` · ${acc}%`}</div>
              </div>
              <div className="week-mins">
                <div className="week-bar"><span style={{ width: `${Math.round((w.seconds / maxWeekSecs) * 100)}%` }} /></div>
                <div className="week-time">{formatDuration(w.seconds)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
