// The adaptive layer — the "Sparx / Numbrise" part.
// Picks which skills to serve, nudges difficulty across the four pack tiers
// (Bronze→Silver→Gold→Challenge), and resurfaces weak skills via spacing.

import { SKILLS } from './skills.js';
import { generate } from './generators.js';
import { simplify, clean, isPrime, simplifyRatio } from './math.js';

export const ROUND_SIZE = 6;
const RECENT_WINDOW = 5;
const MAX_LEVEL = 5; // Bronze=1, Silver=2, Gold=3, Challenge=4, Challenge+=5
export const TIERS = ['Bronze', 'Silver', 'Gold', 'Challenge', 'Challenge+'];
export const tierName = (lvl) => TIERS[Math.max(0, Math.min(TIERS.length - 1, lvl - 1))];

export function freshSkill() {
  return { level: 1, attempts: 0, correct: 0, recent: [], lastSeenRound: -99, mastery: 0 };
}

export function freshLearner(name) {
  const skills = {};
  for (const s of SKILLS) skills[s.id] = freshSkill();
  return {
    name: name || 'Learner', round: 0, xp: 0, streak: 0, bestStreak: 0,
    totalAttempts: 0, totalCorrect: 0, skills, history: [], activity: {},
  };
}

// --- per-day activity log: { 'YYYY-MM-DD': { seconds, attempts, correct, rounds } } ---
// Local-date keyed (the child's device clock) so calendar/weekly views line up.
export const dayKey = (ts = Date.now()) => {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
function bumpDay(learner, patch, ts = Date.now()) {
  if (!learner.activity) learner.activity = {};
  const key = dayKey(ts);
  const cur = learner.activity[key] || { seconds: 0, attempts: 0, correct: 0, rounds: 0 };
  const next = { ...cur };
  for (const [k, v] of Object.entries(patch)) next[k] = (cur[k] || 0) + v;
  learner.activity[key] = next;
}

// Accrue active screen-time (called on a tick by App). Returns a new learner.
export function addActiveTime(learner, seconds) {
  const next = structuredClone(learner);
  bumpDay(next, { seconds });
  return next;
}

// Back-fill skills added after a learner was first created (e.g. the diagram
// pass added lo21/25/28/30). Returns the same object, mutated in place — safe to
// call on every load. Without this, chooseRound/Progress would hit undefined
// entries for the new objectives.
export function ensureAllSkills(learner) {
  if (!learner?.skills) return learner;
  for (const s of SKILLS) {
    if (!learner.skills[s.id]) learner.skills[s.id] = freshSkill();
  }
  if (!learner.activity) learner.activity = {}; // back-fill for pre-activity saves
  return learner;
}

// --- parent placement: set the tier a topic plays at ---
// Clears the recent streak so the new tier sticks (no instant demotion from
// stale misses) and recomputes mastery. Returns a new learner.
function placeSkill(st, level) {
  st.level = Math.max(1, Math.min(MAX_LEVEL, level));
  st.recent = [];
  st.mastery = computeMastery(st);
}
export function setSkillLevel(learner, skillId, level) {
  const next = structuredClone(learner);
  if (next.skills[skillId]) placeSkill(next.skills[skillId], level);
  return next;
}
export function setAllLevels(learner, level) {
  const next = structuredClone(learner);
  for (const id of Object.keys(next.skills)) placeSkill(next.skills[id], level);
  return next;
}

function computeMastery(s) {
  const acc = s.attempts ? s.correct / s.attempts : 0;
  const levelPart = (s.level - 1) / (MAX_LEVEL - 1); // 0..1 across the four tiers
  return clean(0.6 * acc + 0.4 * levelPart, 3);
}

// Build a round. Modes:
//   'adaptive'  (default) — the usual weak/untried/spaced mix
//   'weak'      — drill his lowest-mastery tried skills first
//   'quickfire' — same selection as adaptive; the Round adds a timer
//   'topic'     — every question from one objective (opts.topicId)
export function chooseRound(learner, opts = {}) {
  const { mode = 'adaptive', size = ROUND_SIZE, topicId = null } = opts;
  const round = learner.round + 1;

  if (mode === 'topic' && topicId) {
    const lvl = learner.skills[topicId].level;
    return Array.from({ length: size }, () => generate(topicId, lvl));
  }

  const scored = SKILLS.map((s) => {
    const st = learner.skills[s.id];
    const untried = st.attempts === 0;
    const acc = st.attempts ? st.correct / st.attempts : 0;
    const sinceSeen = round - st.lastSeenRound;
    let score;
    if (mode === 'weak') {
      // tried + low mastery floats to the top; untried sink below them
      score = untried ? -100 + Math.random() : (1 - st.mastery) * 100 + (1 - acc) * 20 + Math.random() * 4;
    } else {
      score = 0;
      if (untried) score += 100;
      score += (1 - acc) * 40;
      score += Math.min(sinceSeen, 8) * 4;
      score += Math.random() * 6;
    }
    return { id: s.id, score };
  }).sort((a, b) => b.score - a.score);

  return scored.slice(0, size).map((x) => generate(x.id, learner.skills[x.id].level));
}

// --- prime-factorisation answer parser ---
function checkPrimeFac(input, N) {
  if (!input) return false;
  const tokens = String(input).trim().split(/[x×·*\s]+/i).filter(Boolean);
  if (tokens.length === 0) return false;
  const factors = [];
  for (const t of tokens) {
    const [baseStr, expStr] = t.split(/[\^]/);
    const base = parseInt(baseStr, 10);
    const exp = expStr === undefined ? 1 : parseInt(expStr, 10);
    if (!Number.isFinite(base) || !Number.isFinite(exp) || exp < 1) return false;
    for (let i = 0; i < exp; i++) factors.push(base);
  }
  if (!factors.every((f) => isPrime(f))) return false;
  return factors.reduce((a, b) => a * b, 1) === N;
}

export function checkAnswer(question, input) {
  const q = question;
  switch (q.answerType) {
    case 'fraction': {
      const n = parseInt(input.n, 10), d = parseInt(input.d, 10);
      if (!Number.isFinite(n) || !Number.isFinite(d) || d === 0) return false;
      const a = simplify(n, d);
      return a.n === q.answer.n && a.d === q.answer.d;
    }
    case 'mixed': {
      const w = input.w === '' || input.w === undefined ? 0 : parseInt(input.w, 10);
      const n = input.n === '' || input.n === undefined ? 0 : parseInt(input.n, 10);
      const d = input.d === '' || input.d === undefined ? 1 : parseInt(input.d, 10);
      if (![w, n, d].every(Number.isFinite) || d === 0) return false;
      const impN = w * d + n, impD = d;
      const ans = q.answer;
      const aN = ans.w * ans.d + ans.n, aD = ans.d;
      return impN * aD === aN * impD; // equal value
    }
    case 'ratio': {
      const parts = input.map((x) => parseInt(x, 10));
      if (parts.some((p) => !Number.isFinite(p))) return false;
      const s = simplifyRatio(parts);
      return s.length === q.answer.length && s.every((v, i) => v === q.answer[i]);
    }
    case 'linear': {
      const coeff = parseFloat(input.coeff), c = parseFloat(input.c);
      if (!Number.isFinite(coeff) || !Number.isFinite(c)) return false;
      return coeff === q.answer.coeff && c === q.answer.c;
    }
    case 'coord': {
      const x = parseFloat(input.x), y = parseFloat(input.y);
      if (!Number.isFinite(x) || !Number.isFinite(y)) return false;
      return Math.abs(x - q.answer.x) < 1e-6 && Math.abs(y - q.answer.y) < 1e-6;
    }
    case 'choice':
      return Number(input) === q.answer;
    case 'order': {
      // input is the learner's arrangement of item ids; correct when the
      // matching values run strictly in the requested direction.
      if (!Array.isArray(input) || input.length !== q.items.length) return false;
      const valOf = (id) => q.items.find((it) => it.id === id)?.value;
      const vals = input.map(valOf);
      if (vals.some((v) => v === undefined)) return false;
      for (let k = 1; k < vals.length; k++) {
        const ok = q.direction === 'desc' ? vals[k] < vals[k - 1] : vals[k] > vals[k - 1];
        if (!ok) return false;
      }
      return true;
    }
    case 'primefac':
      return checkPrimeFac(input, q.answer);
    case 'integer': {
      const v = parseFloat(String(input).trim());
      return Number.isFinite(v) && v === q.answer;
    }
    default: { // decimal
      const v = parseFloat(String(input).trim());
      return Number.isFinite(v) && Math.abs(v - q.answer) < 1e-6;
    }
  }
}

export function applyResult(learner, question, isCorrect) {
  const next = structuredClone(learner);
  const st = next.skills[question.skillId];
  st.attempts += 1;
  if (isCorrect) st.correct += 1;
  st.recent = [...st.recent, isCorrect].slice(-RECENT_WINDOW);
  st.lastSeenRound = next.round + 1;

  const last3 = st.recent.slice(-3);
  if (last3.length === 3 && last3.every(Boolean) && st.level < MAX_LEVEL) st.level += 1;
  if (last3.filter((x) => !x).length >= 2 && st.level > 1) st.level -= 1;

  st.mastery = computeMastery(st);

  next.totalAttempts += 1;
  if (isCorrect) {
    next.totalCorrect += 1;
    next.streak += 1;
    next.bestStreak = Math.max(next.bestStreak, next.streak);
    next.xp += 10 + Math.min(next.streak, 10) + (st.level - 1) * 5;
  } else {
    next.streak = 0;
  }
  bumpDay(next, { attempts: 1, correct: isCorrect ? 1 : 0 });
  return next;
}

export function finishRound(learner, correctCount, total = ROUND_SIZE) {
  const next = structuredClone(learner);
  next.round += 1;
  next.history = [...next.history, { round: next.round, correct: correctCount, total, at: Date.now() }].slice(-50);
  bumpDay(next, { rounds: 1 });
  return next;
}

export function overallAccuracy(learner) {
  return learner.totalAttempts ? Math.round((learner.totalCorrect / learner.totalAttempts) * 100) : 0;
}
export function weakestSkills(learner, n = 3) {
  return SKILLS.map((s) => ({ ...s, st: learner.skills[s.id] }))
    .filter((s) => s.st.attempts > 0)
    .sort((a, b) => a.st.mastery - b.st.mastery)
    .slice(0, n);
}
export function learnerLevel(xp) { return Math.floor(xp / 200) + 1; }
