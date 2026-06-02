// High-level topic groups for the mastery dashboard. Each maps to the
// fine-grained learning objectives (skills) underneath it. Percentages and
// Statistics have no questions in the AP3 pack yet, so they show as "coming
// soon" rather than faking progress.

import { SKILLS } from './skills.js';

export const TOPIC_GROUPS = [
  { key: 'fractions',   name: 'Fractions',   icon: '🍕', ids: ['lo1', 'lo2', 'lo5', 'lo8', 'lo10', 'lo11', 'lo17', 'lo18', 'lo23', 'lo24', 'lo25'] },
  { key: 'decimals',    name: 'Decimals',    icon: '🔢', ids: ['lo15', 'lo28', 'lo29', 'pow10'] },
  { key: 'percentages', name: 'Percentages', icon: '％', ids: [] },
  { key: 'ratio',       name: 'Ratio',       icon: '⚖️', ids: ['lo3', 'lo9', 'lo12', 'lo13', 'lo16', 'lo16b', 'lo26'] },
  { key: 'algebra',     name: 'Algebra',     icon: '🧮', ids: ['lo14', 'lo19', 'lo20'] },
  { key: 'geometry',    name: 'Geometry',    icon: '📐', ids: ['lo4', 'lo21', 'lo22', 'lo30'] },
  { key: 'statistics',  name: 'Statistics',  icon: '📊', ids: [] },
  { key: 'number',      name: 'Number',      icon: '➕', ids: ['lo6', 'lo7', 'lo27'] },
];

// Per-group aggregate: average mastery + average tier across its skills.
export function groupMastery(learner) {
  return TOPIC_GROUPS.map((g) => {
    const sts = g.ids.map((id) => learner.skills?.[id]).filter(Boolean);
    const attempts = sts.reduce((a, s) => a + (s.attempts || 0), 0);
    const mastery = sts.length ? sts.reduce((a, s) => a + (s.mastery || 0), 0) / sts.length : 0;
    const level = sts.length ? Math.round(sts.reduce((a, s) => a + (s.level || 1), 0) / sts.length) : 1;
    return { ...g, count: sts.length, attempts, pct: Math.round(mastery * 100), level };
  });
}

// The single best topic to practise next: lowest-mastery tried skill, else the
// first untried objective. Returns a SKILLS entry ({ id, name }).
export function nextBest(learner) {
  const tried = SKILLS
    .map((s) => ({ s, st: learner.skills?.[s.id] }))
    .filter((x) => x.st && x.st.attempts > 0)
    .sort((a, b) => a.st.mastery - b.st.mastery);
  if (tried.length) return tried[0].s;
  return SKILLS.find((s) => learner.skills?.[s.id] && learner.skills[s.id].attempts === 0) || SKILLS[0];
}
