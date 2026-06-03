// KS3 Shakespeare exam marking for Study Trainer. This is encouraging PRACTICE
// feedback for a Year 7 learner — it is NOT official GCSE/KS3 exam-board
// marking, and the UI says so. The marking is heuristic (no network/AI): it
// looks for the building blocks of a good answer and rewards them out of 20.
//
// Pure functions only — no learner state here. Progress saving lives in
// engine/english.js (recordExam / englishExamTotals).

export const EXAM_MAX = 20;

const wc = (s) => (s || '').trim().split(/\s+/).filter(Boolean).length;
const lc = (s) => (s || '').toLowerCase();
const hasQuoteMarks = (s) => /["“”]/.test(s || '');

// KS3-friendly bands.
export function examLevel(score) {
  if (score <= 5) return 'Getting started';
  if (score <= 10) return 'Building skills';
  if (score <= 15) return 'Confident writer';
  return 'Strong Shakespeare answer';
}

// A short, supportive headline for the result.
export function examHeadline(score, words) {
  if (!words) return 'Have a go — write your answer in the box, then check it when you’re ready.';
  if (score >= 16) return 'Excellent — a strong Shakespeare answer! 🌟';
  if (score >= 11) return 'Great work — you’re writing with real confidence.';
  if (score >= 6) return 'Good start — you’re building the right skills.';
  return 'Nice try — let’s build this answer up together.';
}

// Mark an answer against a paper. Returns a rich result the UI can render.
export function markAnswer(paper, answer) {
  const text = (answer || '').trim();
  const t = lc(text);
  const words = wc(text);
  const sentences = (text.match(/[.!?]+/g) || []).length;

  // words that show the student is on-topic (focus / character / word bank)
  const focusWords = [
    ...(paper.wordBank || []),
    ...(paper.character ? paper.character.toLowerCase().split(/[^a-z]+/) : []),
    ...(paper.focus ? paper.focus.toLowerCase().split(/[^a-z]+/) : []),
  ].filter((w) => w && w.length > 3);
  const mentionsFocus = focusWords.some((w) => t.includes(w));

  // a quote = quotation marks with enough inside, ideally matching the extract
  const matchesSuggested = (paper.suggestedQuotes || []).some((q) => {
    const key = lc(q).replace(/["“”]/g, '').trim().slice(0, 10);
    return key && t.includes(key);
  });
  const usesQuote = hasQuoteMarks(text) && (matchesSuggested || words >= 8);

  const explains = /\b(suggest|show|because|implies|imply|reveal|tells us|tell us|creates|create|highlight|emphasis|portray|convey|means|makes us|makes the audience|this is why)\b/.test(t);
  const methods = /\bshakespeare\b/.test(t) || /\b(language|imagery|metaphor|technique|present|uses|word|phrase|dramatic|comedy|humour|symbol)\b/.test(t);
  const linksPlay = /\b(overall|throughout|the play|audience|theme|links back|link back|in the end|by the end|wider|whole play)\b/.test(t);
  const structure = words >= 40 && sentences >= 2;

  const startsCapital = /^["“]?[A-Z]/.test(text);
  const endsPunct = /[.!?]["”]?$/.test(text);
  const spag = words >= 12 && startsCapital && endsPunct;

  const clearAnswer = words >= 25 && mentionsFocus;

  // 8 KS3 criteria, weighted to total 20.
  const criteria = [
    { key: 'answer', label: 'Clear answer to the question', max: 3, got: clearAnswer,
      pts: clearAnswer ? 3 : (words >= 12 ? 1 : 0),
      tip: 'Answer the question directly — say what Shakespeare presents.' },
    { key: 'understanding', label: 'Understanding of the character or theme', max: 2, got: mentionsFocus,
      pts: mentionsFocus ? 2 : 0,
      tip: `Show you understand the focus: ${paper.focus.toLowerCase()}.` },
    { key: 'quote', label: 'A quote from the extract', max: 3, got: usesQuote,
      pts: usesQuote ? 3 : 0,
      tip: 'Add a short quote in “quotation marks” from the extract.' },
    { key: 'explain', label: 'Explanation of the quote', max: 3, got: explains,
      pts: explains ? 3 : 0,
      tip: 'Explain what your quote shows — try “this suggests…”.' },
    { key: 'methods', label: 'Shakespeare’s methods', max: 2, got: methods,
      pts: methods ? 2 : 0,
      tip: 'Name what Shakespeare does — e.g. “Shakespeare uses…”.' },
    { key: 'link', label: 'Link to the wider play', max: 2, got: linksPlay,
      pts: linksPlay ? 2 : 0,
      tip: 'Link your idea to the whole play or to the audience.' },
    { key: 'structure', label: 'Clear paragraph structure', max: 3, got: structure,
      pts: structure ? 3 : 0,
      tip: 'Write in full sentences to build a clear paragraph.' },
    { key: 'spag', label: 'Spelling, punctuation & grammar', max: 2, got: spag,
      pts: spag ? 2 : 0,
      tip: 'Start with a capital letter and end with a full stop.' },
  ];

  const score = Math.min(EXAM_MAX, criteria.reduce((s, c) => s + c.pts, 0));
  const level = examLevel(score);
  const wentWell = criteria.filter((c) => c.got).map((c) => c.label);
  const nextSteps = criteria.filter((c) => !c.got).slice(0, 3).map((c) => c.tip);

  // a friendly model sentence the student can borrow and adapt
  const q = (paper.suggestedQuotes && paper.suggestedQuotes[0]) || '';
  const improvedSentence = q
    ? `Shakespeare presents ${paper.focusShort || lc(paper.focus)} when he writes, “${q}”, which suggests…`
    : `Shakespeare presents ${lc(paper.focus)} clearly in this extract, which suggests…`;

  return {
    score, max: EXAM_MAX, level, words,
    headline: examHeadline(score, words),
    criteria, wentWell, nextSteps, improvedSentence,
  };
}

// Generic, encouraging sentence starters for the Practice Exam helper.
export const EXAM_STARTERS = [
  'Shakespeare presents…',
  'In this extract, Shakespeare shows…',
  'This is shown when Shakespeare writes, “…”',
  'This suggests that…',
  'The word “…” is important because…',
  'This links back to the question because…',
];
