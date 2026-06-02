// Achievement badges. Each has a test(learner) run after every answer / round;
// when it first passes, the unlock time is stored in learner.achievements so we
// can show "recently earned". Tests read only persisted learner state.

import { TOPIC_GROUPS } from './topics.js';

const FRACTION_IDS = TOPIC_GROUPS.find((g) => g.key === 'fractions').ids;

// Consecutive active days up to today (mirrors stats.currentStreak, kept local
// here to avoid a circular import with adaptive.js).
export function dayStreak(learner) {
  const a = learner.activity || {};
  const key = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const active = (k) => { const r = a[k]; return r && ((r.seconds || 0) > 0 || (r.attempts || 0) > 0); };
  const today = new Date();
  let streak = 0;
  for (let i = 0; i < 400; i++) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
    if (active(key(d))) streak += 1;
    else if (i === 0) continue;
    else break;
  }
  return streak;
}

function fractionMastery(learner) {
  const sts = FRACTION_IDS.map((id) => learner.skills?.[id]).filter(Boolean);
  if (!sts.length) return 0;
  return sts.reduce((a, s) => a + (s.mastery || 0), 0) / sts.length;
}
function fractionAttempts(learner) {
  return FRACTION_IDS.reduce((a, id) => a + (learner.skills?.[id]?.attempts || 0), 0);
}

export const ACHIEVEMENTS = [
  { id: 'q10',         name: 'First 10 Questions',     icon: '🔟', test: (l) => l.totalAttempts >= 10 },
  { id: 'q50',         name: 'Half-Century',           icon: '🏅', test: (l) => l.totalAttempts >= 50 },
  { id: 'streak3',     name: '3-Day Streak',           icon: '🔥', test: (l) => dayStreak(l) >= 3 },
  { id: 'streak7',     name: '7-Day Streak',           icon: '⚡', test: (l) => dayStreak(l) >= 7 },
  { id: 'combo8',      name: '8 in a Row',             icon: '🎯', test: (l) => (l.bestStreak || 0) >= 8 },
  { id: 'fracStarter', name: 'Fraction Starter',       icon: '🍕', test: (l) => fractionAttempts(l) >= 5 },
  { id: 'fracMaster',  name: 'Fraction Master',        icon: '👑', test: (l) => fractionMastery(l) >= 0.8 },
  { id: 'perfect',     name: 'Perfect Round',          icon: '⭐', test: (l) => (l.perfectRounds || 0) >= 1 },
  { id: 'daily',       name: 'Daily Challenge',        icon: '🛡️', test: (l) => !!(l.dailyChallenge && l.dailyChallenge.lastDate) },
];

export const ACH_BY_ID = Object.fromEntries(ACHIEVEMENTS.map((a) => [a.id, a]));

// Unlock any newly-earned badges in place. Returns the list of new ids.
export function syncAchievements(learner) {
  if (!learner.achievements) learner.achievements = {};
  const newly = [];
  for (const a of ACHIEVEMENTS) {
    if (!learner.achievements[a.id] && a.test(learner)) {
      learner.achievements[a.id] = Date.now();
      newly.push(a.id);
    }
  }
  return newly;
}

// Earned badges, most-recent first, as { id, name, icon, at }.
export function recentAchievements(learner, n = 3) {
  const earned = learner.achievements || {};
  return Object.entries(earned)
    .filter(([id]) => ACH_BY_ID[id])
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([id, at]) => ({ ...ACH_BY_ID[id], at }));
}
