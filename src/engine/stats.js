// Read-only reporting over learner.activity (the per-day log written by
// adaptive.js). Pure functions — no state, easy to unit-test.

import { dayKey } from './adaptive.js';

const dayOf = (learner, key) => (learner.activity || {})[key] || { seconds: 0, attempts: 0, correct: 0, rounds: 0 };
const isActive = (d) => (d.seconds || 0) > 0 || (d.attempts || 0) > 0;

// "45 min", "1h 20m", "30s"
export function formatDuration(sec) {
  sec = Math.round(sec || 0);
  if (sec <= 0) return '0 min';
  if (sec < 60) return `${sec}s`;
  const m = Math.round(sec / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60), rm = m % 60;
  return rm ? `${h}h ${rm}m` : `${h}h`;
}

// Monday-start week containing date d (local).
function startOfWeek(d) {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const back = (x.getDay() + 6) % 7; // Mon = 0
  x.setDate(x.getDate() - back);
  return x;
}

export function todaySeconds(learner) {
  return dayOf(learner, dayKey()).seconds || 0;
}

export function totals(learner) {
  const a = learner.activity || {};
  const days = Object.values(a);
  return {
    seconds: days.reduce((s, d) => s + (d.seconds || 0), 0),
    attempts: days.reduce((s, d) => s + (d.attempts || 0), 0),
    correct: days.reduce((s, d) => s + (d.correct || 0), 0),
    rounds: days.reduce((s, d) => s + (d.rounds || 0), 0),
    activeDays: days.filter(isActive).length,
  };
}

// Consecutive days up to today with activity (today not-yet-active doesn't break it).
export function currentStreak(learner) {
  const today = new Date();
  let streak = 0;
  for (let i = 0; i < 400; i++) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
    const active = isActive(dayOf(learner, dayKey(d.getTime())));
    if (active) streak += 1;
    else if (i === 0) continue; // today blank yet — look back further
    else break;
  }
  return streak;
}

// Last `weeks` Mon–Sun weeks, newest first.
export function weeklyReport(learner, weeks = 8) {
  const thisWeek = startOfWeek(new Date());
  const out = [];
  for (let i = 0; i < weeks; i++) {
    const ws = new Date(thisWeek);
    ws.setDate(ws.getDate() - i * 7);
    const bucket = { weekStart: ws, seconds: 0, attempts: 0, correct: 0, rounds: 0, days: 0 };
    for (let dOff = 0; dOff < 7; dOff++) {
      const day = new Date(ws);
      day.setDate(day.getDate() + dOff);
      const rec = dayOf(learner, dayKey(day.getTime()));
      bucket.seconds += rec.seconds || 0;
      bucket.attempts += rec.attempts || 0;
      bucket.correct += rec.correct || 0;
      bucket.rounds += rec.rounds || 0;
      if (isActive(rec)) bucket.days += 1;
    }
    out.push(bucket);
  }
  return out;
}

// Weeks (Mon-start) for a month grid; each cell is null (padding) or a day record.
export function calendarMonth(learner, year, month) {
  const first = new Date(year, month, 1);
  const pad = (first.getDay() + 6) % 7; // Mon = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < pad; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const key = dayKey(new Date(year, month, d).getTime());
    const rec = dayOf(learner, key);
    cells.push({ day: d, key, seconds: rec.seconds || 0, attempts: rec.attempts || 0, level: intensity(rec.seconds || 0) });
  }
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

// 0–4 colour band by minutes that day.
export function intensity(seconds) {
  const m = (seconds || 0) / 60;
  if (m <= 0) return 0;
  if (m < 5) return 1;
  if (m < 15) return 2;
  if (m < 30) return 3;
  return 4;
}

export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
