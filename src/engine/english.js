// English Trainer progress — stored on the same learner doc under `english`,
// kept completely separate from maths state. Maths functions never read or
// write this; cloudSave persists the whole doc so it syncs for free.

import { dayKey } from './adaptive.js';
import { intensity } from './stats.js';

export function freshEnglish() {
  return { activity: {}, checks: 0, scoreSum: 0, best: 0, fullPeels: 0, byExtract: {} };
}

// Back-fill for accounts created before English existed. Safe to call on load.
export function ensureEnglish(learner) {
  if (!learner) return learner;
  if (!learner.english) learner.english = freshEnglish();
  const e = learner.english;
  if (!e.activity) e.activity = {};
  if (!e.byExtract) e.byExtract = {};
  for (const k of ['checks', 'scoreSum', 'best', 'fullPeels']) if (typeof e[k] !== 'number') e[k] = 0;
  return learner;
}

function bumpEngDay(e, patch, ts = Date.now()) {
  const key = dayKey(ts);
  const cur = e.activity[key] || { seconds: 0, peels: 0, points: 0 };
  const next = { ...cur };
  for (const [k, v] of Object.entries(patch)) next[k] = (cur[k] || 0) + v;
  e.activity[key] = next;
}

// Accrue active writing time (called on a tick by App). Returns a new learner.
export function addEnglishTime(learner, seconds) {
  const next = structuredClone(learner);
  ensureEnglish(next);
  bumpEngDay(next.english, { seconds });
  return next;
}

// Record a "Check my PEEL" result (score 0–4) for an extract. New learner.
export function recordPeel(learner, extractId, score) {
  const next = structuredClone(learner);
  ensureEnglish(next);
  const e = next.english;
  e.checks += 1;
  e.scoreSum += score;
  e.best = Math.max(e.best, score);
  if (score >= 4) e.fullPeels += 1;
  const k = String(extractId);
  const cur = e.byExtract[k] || { checks: 0, best: 0 };
  e.byExtract[k] = { checks: cur.checks + 1, best: Math.max(cur.best, score) };
  bumpEngDay(e, { peels: 1, points: score });
  return next;
}

// --- reporting (mirrors stats.js but for English fields) ---
const engDay = (e, key) => (e.activity || {})[key] || { seconds: 0, peels: 0, points: 0 };
const engActive = (d) => (d.seconds || 0) > 0 || (d.peels || 0) > 0;

function startOfWeek(d) {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); // Monday start
  return x;
}

export function englishTotals(learner) {
  const e = learner.english || freshEnglish();
  const days = Object.values(e.activity || {});
  return {
    seconds: days.reduce((s, d) => s + (d.seconds || 0), 0),
    paragraphs: e.checks || 0,
    avg: e.checks ? Math.round((e.scoreSum / e.checks) * 10) / 10 : 0,
    best: e.best || 0,
    fullPeels: e.fullPeels || 0,
    activeDays: days.filter(engActive).length,
    extractsPractised: Object.keys(e.byExtract || {}).length,
  };
}

export function englishTodaySeconds(learner) {
  return engDay(learner.english || {}, dayKey()).seconds || 0;
}

export function englishStreak(learner) {
  const e = learner.english || {};
  const today = new Date();
  let streak = 0;
  for (let i = 0; i < 400; i++) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
    if (engActive(engDay(e, dayKey(d.getTime())))) streak += 1;
    else if (i === 0) continue;
    else break;
  }
  return streak;
}

export function englishWeekly(learner, weeks = 8) {
  const e = learner.english || {};
  const thisWeek = startOfWeek(new Date());
  const out = [];
  for (let i = 0; i < weeks; i++) {
    const ws = new Date(thisWeek);
    ws.setDate(ws.getDate() - i * 7);
    const b = { weekStart: ws, seconds: 0, peels: 0, points: 0, days: 0 };
    for (let o = 0; o < 7; o++) {
      const dd = new Date(ws); dd.setDate(dd.getDate() + o);
      const rec = engDay(e, dayKey(dd.getTime()));
      b.seconds += rec.seconds || 0; b.peels += rec.peels || 0; b.points += rec.points || 0;
      if (engActive(rec)) b.days += 1;
    }
    out.push(b);
  }
  return out;
}

export function englishCalendar(learner, year, month) {
  const e = learner.english || {};
  const first = new Date(year, month, 1);
  const pad = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < pad; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const key = dayKey(new Date(year, month, d).getTime());
    const rec = engDay(e, key);
    cells.push({ day: d, key, seconds: rec.seconds || 0, peels: rec.peels || 0, level: intensity(rec.seconds || 0) });
  }
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}
