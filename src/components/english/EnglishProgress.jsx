import React, { useState } from 'react';
import extracts from '../../data/twelfthNightExtracts.js';
import { formatDuration, MONTHS } from '../../engine/stats.js';
import {
  englishTotals, englishTodaySeconds, englishStreak, englishWeekly, englishCalendar,
  englishExamTotals, examNextStep,
} from '../../engine/english.js';

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const shortMonth = (d) => MONTHS[d.getMonth()].slice(0, 3);

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

// A warm, non-clinical empty state with a single clear action.
function EmptyState({ icon, title, body, cta, onAction }) {
  return (
    <div className="card eng-empty">
      <span className="empty-ico">{icon}</span>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-body">{body}</p>
      {cta && <button className="btn small-cta" onClick={onAction}>{cta}</button>}
    </div>
  );
}

// Friendly, plain-English recommendation for what to try next.
function nextStep(t, total) {
  if (t.paragraphs === 0) return 'Help him write his very first PEEL paragraph — even a short one is a great start.';
  if (t.fullPeels === 0) return 'He’s writing well. Encourage him to aim for a full 4/4 by adding a clear link back to the question.';
  if (t.extractsPractised < total) return `He’s got the basics — try one of the ${total - t.extractsPractised} questions he hasn’t practised yet.`;
  return 'Brilliant — he’s practised every question. Revisit the trickier ones to push for top marks.';
}

export default function EnglishProgress({ learner, onReset, onStart, onStartExam }) {
  const [view, setView] = useState('activity');
  const [confirmReset, setConfirmReset] = useState(false);
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const t = englishTotals(learner);
  const weeks = englishWeekly(learner, 8);
  const thisWeek = weeks[0];
  const maxWeekSecs = Math.max(1, ...weeks.map((w) => w.seconds));
  const calWeeks = englishCalendar(learner, year, month);
  const streak = englishStreak(learner);
  const ex = englishExamTotals(learner);
  const hasActivity = t.seconds > 0 || t.paragraphs > 0;
  const recentExams = ((learner.english && learner.english.exams) || []).slice(-4).reverse();

  const stepMonth = (delta) => {
    const d = new Date(year, month + delta, 1);
    setYear(d.getFullYear()); setMonth(d.getMonth());
  };
  const isFutureMonth = year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth());

  return (
    <div className="fade-in progress-dash">
      <header className="dash-header">
        <div className="dash-head-text">
          <h1>How {learner.name} is doing in English</h1>
          <p className="dash-sub">Parent dashboard · Twelfth Night writing</p>
        </div>
        <span className="dash-emblem" aria-hidden="true">📖</span>
      </header>

      <div className="parent-note">
        A friendly look at his English writing — how often he practises and how his PEEL paragraphs are
        coming along. This is completely separate from his maths progress.
      </div>

      <div className="seg">
        <button className={view === 'activity' ? 'active' : ''} onClick={() => setView('activity')}>📊 Activity</button>
        <button className={view === 'writing' ? 'active' : ''} onClick={() => setView('writing')}>✍️ Writing</button>
        <button className={view === 'exams' ? 'active' : ''} onClick={() => setView('exams')}>📝 Exams</button>
      </div>

      {view === 'activity' && (!hasActivity ? (
        <EmptyState
          icon="🌱"
          title="No writing activity yet"
          body="Once he spends time in the English Trainer, his minutes, streak and calendar will appear here."
          cta="Open the English Trainer"
          onAction={onStart}
        />
      ) : (<>
        <div className="card">
          <SecHead icon="⏱" title="Time on task" sub="How long and how often he’s writing" />
          <div className="stat-row" style={{ marginTop: 0 }}>
            <div className="stat"><div className="v">{formatDuration(englishTodaySeconds(learner))}</div><div className="l">Today</div></div>
            <div className="stat"><div className="v">{formatDuration(thisWeek.seconds)}</div><div className="l">This week</div></div>
            <div className="stat"><div className={`v ${streak > 0 ? 'flame' : ''}`}>{streak}</div><div className="l">Day streak</div></div>
            <div className="stat"><div className="v">{t.activeDays}</div><div className="l">Active days</div></div>
          </div>
          <div className="report-total">
            Total: <strong>{formatDuration(t.seconds)}</strong> over <strong>{t.activeDays}</strong> day{t.activeDays === 1 ? '' : 's'}
            {' · '}<strong>{t.paragraphs}</strong> paragraph{t.paragraphs === 1 ? '' : 's'}
            {t.paragraphs ? <> · avg <strong>{t.avg}/4</strong></> : ''}
          </div>
        </div>

        <div className="card">
          <SecHead icon="📅" title="Writing journey" sub="Darker days = more minutes" />
          <div className="cal-head">
            <button className="step-btn" onClick={() => stepMonth(-1)} aria-label="Previous month">◀</button>
            <div className="cal-title">{MONTHS[month]} {year}</div>
            <button className="step-btn" onClick={() => stepMonth(1)} disabled={isFutureMonth} aria-label="Next month">▶</button>
          </div>
          <div className="cal-grid cal-weekdays">{WEEKDAYS.map((d, k) => <div key={k} className="cal-wd">{d}</div>)}</div>
          {calWeeks.map((wk, wi) => (
            <div className="cal-grid" key={wi}>
              {wk.map((cell, ci) => cell === null
                ? <div key={ci} className="cal-cell empty" />
                : <div key={ci} className={`cal-cell lvl-${cell.level}`}
                    title={`${cell.key}: ${formatDuration(cell.seconds)}${cell.peels ? `, ${cell.peels} paragraphs` : ''}`}>{cell.day}</div>)}
            </div>
          ))}
          <div className="cal-legend">
            <span>Less</span>{[0, 1, 2, 3, 4].map((l) => <span key={l} className={`cal-cell lvl-${l} legend`} />)}<span>More</span>
          </div>
        </div>

        <div className="card">
          <SecHead icon="📈" title="Weekly progression" sub="Last 8 weeks · minutes per week" />
          {weeks.every((w) => w.seconds === 0 && w.peels === 0) ? (
            <div className="parent-note">No writing recorded yet — it’ll fill in as he practises.</div>
          ) : weeks.map((w, k) => {
            const end = new Date(w.weekStart); end.setDate(end.getDate() + 6);
            return (
              <div className="week-row" key={k}>
                <div className="week-when">
                  <div className="week-label">{w.weekStart.getDate()} {shortMonth(w.weekStart)} – {end.getDate()} {shortMonth(end)}{k === 0 ? ' · this week' : ''}</div>
                  <div className="week-sub">{w.days}/7 days · {w.peels} paragraph{w.peels === 1 ? '' : 's'}</div>
                </div>
                <div className="week-mins">
                  <div className="week-bar"><span style={{ width: `${Math.round((w.seconds / maxWeekSecs) * 100)}%` }} /></div>
                  <div className="week-time">{formatDuration(w.seconds)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </>))}

      {view === 'writing' && (t.paragraphs === 0 ? (
        <EmptyState
          icon="✍️"
          title="No PEEL paragraphs yet"
          body="Once he completes and checks a paragraph, his PEEL scores and progress will appear here."
          cta="Start first PEEL challenge"
          onAction={onStart}
        />
      ) : (<>
        <div className="card">
          <SecHead icon="⭐" title="PEEL Power" sub="How his paragraphs are scoring" />
          <div className="stat-row" style={{ marginTop: 0 }}>
            <div className="stat"><div className="v">{t.paragraphs}</div><div className="l">Paragraphs</div></div>
            <div className="stat"><div className="v">{t.avg}<span style={{ fontSize: 14, color: 'var(--eng-muted)' }}>/4</span></div><div className="l">Avg score</div></div>
            <div className="stat"><div className="v">{t.fullPeels}</div><div className="l">Full PEEL</div></div>
          </div>
          <div className="report-total">
            Each paragraph scores out of 4 — one mark each for a clear <strong>Point</strong>, a <strong>quote</strong>,
            an <strong>explanation</strong> and a <strong>link</strong>. He’s reached the full 4/4 on
            {' '}<strong>{t.fullPeels}</strong> paragraph{t.fullPeels === 1 ? '' : 's'}.
          </div>
        </div>

        <div className="card next-step">
          <SecHead icon="🎯" title="Next best step" sub="A simple way to help at home" />
          <p className="next-step-text">{nextStep(t, extracts.length)}</p>
        </div>

        <div className="card">
          <SecHead icon="📜" title="Question by question" sub={`${t.extractsPractised} of ${extracts.length} practised`} />
          {extracts.map((e) => {
            const st = (learner.english?.byExtract || {})[String(e.id)];
            const pct = st ? Math.round((st.best / 4) * 100) : 0;
            return (
              <div className="mastery" key={e.id}>
                <div className="row">
                  <span className="skill-name">{e.title}</span>
                  <span className="row-right">
                    <span className="ex-tag theme">{e.theme}</span>
                    <span className="pct">{st ? `${st.best}/4` : '—'}</span>
                  </span>
                </div>
                <div className={`bar ${st ? '' : 'untouched'}`}>
                  <span style={{ width: `${st ? Math.max(pct, 4) : 100}%` }} />
                </div>
                {st && <div className="eq-checks">{st.checks} attempt{st.checks === 1 ? '' : 's'}</div>}
              </div>
            );
          })}
        </div>
      </>))}

      {view === 'exams' && (ex.total === 0 ? (
        <EmptyState
          icon="📝"
          title="No exam practice yet"
          body="Once your child tries a Practice Exam or a Real Exam, their results will appear here."
          cta="Start first practice exam"
          onAction={onStartExam}
        />
      ) : (<>
        <div className="card">
          <SecHead icon="📝" title="Exam Power" sub="Practice and real exam attempts" />
          <div className="stat-row" style={{ marginTop: 0 }}>
            <div className="stat"><div className="v">{ex.practiceCount}</div><div className="l">Practice exams</div></div>
            <div className="stat"><div className="v">{ex.realCount}</div><div className="l">Real exams</div></div>
            <div className="stat"><div className="v">{ex.best}<span style={{ fontSize: 14, color: 'var(--eng-muted)' }}>/20</span></div><div className="l">Best score</div></div>
          </div>
          <div className="report-total">
            Average score <strong>{ex.avg}/20</strong>.{' '}
            <strong>Practice Exams</strong> show how your child writes <strong>with support</strong>;{' '}
            <strong>Real Exam Mode</strong> shows how they write <strong>independently</strong>. The best score is their strongest attempt so far.
          </div>
        </div>

        <div className="card next-step">
          <SecHead icon="🎯" title="Next best step" sub="What to practise next" />
          <p className="next-step-text">{examNextStep(ex)}</p>
        </div>

        <div className="card">
          <SecHead icon="🗒" title="Recent exams" sub="His latest attempts" />
          <ul className="exam-recent">
            {recentExams.map((a, i) => (
              <li key={i} className="exam-recent-row">
                <span className={`er-mode ${a.mode}`}>{a.mode === 'real' ? '⏱ Real' : '📝 Practice'}</span>
                <span className="er-title">{a.title || a.paperId}</span>
                <span className="er-score">{a.score}/20</span>
              </li>
            ))}
          </ul>
        </div>
      </>))}

      <div className="dash-footer">
        <button className="btn ghost small danger" onClick={() => setConfirmReset(true)}>⚠ Reset English progress</button>
      </div>

      {confirmReset && (
        <div className="modal-overlay" onClick={() => setConfirmReset(false)}>
          <div className="modal" onClick={(ev) => ev.stopPropagation()}>
            <div className="modal-ico">⚠️</div>
            <h2>Reset English progress?</h2>
            <p>This will permanently delete his English writing time, paragraphs, exam results and scores. Maths progress is not affected.</p>
            <div className="modal-actions">
              <button className="btn secondary" onClick={() => setConfirmReset(false)}>Cancel</button>
              <button className="btn danger-solid" onClick={() => { setConfirmReset(false); onReset(); }}>Yes, reset English</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
