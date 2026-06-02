import React, { useState, useRef, useEffect } from 'react';
import { checkAnswer, tierName } from '../engine/adaptive.js';
import { SKILL_NAME } from '../engine/skills.js';
import { fracStr, mixedStr, ratioStr, primeFacStr, choice } from '../engine/math.js';
import { playCorrect, playWrong, playWin } from '../engine/sound.js';
import Diagram from './Diagram.jsx';
import OrderList from './OrderList.jsx';
import Confetti from './Confetti.jsx';

const PRAISE = ['Nice!', 'Boom!', 'Smashed it!', 'Yes!', 'Spot on!', 'Great!'];
const STREAK_PRAISE = ['On fire! 🔥', 'Unstoppable!', 'Combo!', 'Brilliant run!'];
const ENCOURAGE = ['Almost!', 'Good try!', 'Keep going!', 'Nearly had it!'];
// trailing run of correct answers
const trailingStreak = (arr) => { let n = 0; for (let k = arr.length - 1; k >= 0 && arr[k]; k--) n++; return n; };

// blank input shape for each answer type
const initAns = (q) => {
  switch (q.answerType) {
    case 'fraction': return { n: '', d: '' };
    case 'mixed': return { w: '', n: '', d: '' };
    case 'ratio': return q.answer.map(() => '');
    case 'linear': return { coeff: '', c: '' };
    case 'coord': return { x: '', y: '' };
    case 'choice': return null;
    case 'order': return q.items.map((it) => it.id);
    default: return '';
  }
};

const filled = (q, a) => {
  switch (q.answerType) {
    case 'fraction': return a.n !== '' && a.d !== '';
    case 'mixed': return a.w !== '' || (a.n !== '' && a.d !== '');
    case 'ratio': return a.every((x) => x !== '');
    case 'linear': return a.coeff !== '' && a.c !== '';
    case 'coord': return a.x !== '' && a.y !== '';
    case 'choice': return a !== null;
    case 'order': return true; // always a complete arrangement
    default: { const s = String(a).trim(); return s !== '' && s !== '-'; }
  }
};

const formatAnswer = (q) => {
  switch (q.answerType) {
    case 'fraction': return fracStr(q.answer);
    case 'mixed': return mixedStr(q.answer);
    case 'ratio': return ratioStr(q.answer);
    case 'linear': { const { coeff, c, v } = q.answer; return `${coeff}${v} ${c < 0 ? '−' : '+'} ${Math.abs(c)}`; }
    case 'coord': return `(${q.answer.x}, ${q.answer.y})`;
    case 'choice': return q.options[q.answer];
    case 'primefac': return primeFacStr(q.answer);
    case 'order': {
      const sorted = [...q.items].sort((a, b) => (q.direction === 'desc' ? b.value - a.value : a.value - b.value));
      return sorted.map((it) => it.label).join(q.direction === 'desc' ? ' > ' : ' < ');
    }
    default: return String(q.answer);
  }
};

const clampNum = (s) => s.replace(/[^0-9.\-]/g, '');

const QUICKFIRE_SECONDS = 25;

export default function Round({ questions, onResult, onFinish, onExit, onMood }) {
  const size = questions.length;
  const timed = questions.mode === 'quickfire';
  const [i, setI] = useState(0);
  const [phase, setPhase] = useState('answer');
  const [ans, setAns] = useState(() => initAns(questions[0]));
  const [wasCorrect, setWasCorrect] = useState(false);
  const [outOfTime, setOutOfTime] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUICKFIRE_SECONDS);
  const [praise, setPraise] = useState('');     // encouraging line on reveal
  const [xpGain, setXpGain] = useState(0);       // floating "+N" on a correct answer
  const [streak, setStreak] = useState(0);       // live run of correct this round
  const [fire, setFire] = useState(0);           // confetti trigger counter
  const results = useRef([]);
  const firstField = useRef(null);
  const lock = useRef(false); // one verdict per question (guards timeout vs submit race)

  const q = questions[i];
  useEffect(() => { firstField.current?.focus(); }, [i]);

  // Quickfire countdown — a timeout counts the question as missed.
  useEffect(() => {
    if (!timed || phase !== 'answer') return;
    setTimeLeft(QUICKFIRE_SECONDS);
    let r = QUICKFIRE_SECONDS;
    const id = setInterval(() => {
      r -= 1;
      setTimeLeft(r);
      if (r <= 0) { clearInterval(id); finalize(false, true); }
    }, 1000);
    return () => clearInterval(id);
  }, [i, phase, timed]);

  const finalize = (correct, timeout = false) => {
    if (lock.current) return;
    lock.current = true;
    results.current.push(correct);
    setWasCorrect(correct);
    setOutOfTime(timeout);
    setPhase('reveal');
    onResult(q, correct);

    const run = trailingStreak(results.current);
    setStreak(correct ? run : 0);
    onMood?.(correct ? 'happy' : 'sad');
    if (correct) {
      playCorrect();
      setXpGain(10 + (q.level - 1) * 5);
      setPraise(run >= 3 ? choice(STREAK_PRAISE) : choice(PRAISE));
      if (run >= 3 && run % 3 === 0) { setFire((f) => f + 1); playWin(); } // celebrate every 3 in a row
    } else {
      playWrong();
      setXpGain(0);
      setPraise(timeout ? '' : choice(ENCOURAGE));
    }
  };
  const grade = (value) => finalize(checkAnswer(q, value));

  const submit = () => {
    if (phase === 'reveal') return;
    if (!filled(q, ans)) return;
    grade(ans);
  };

  const exitRound = () => {
    const answered = results.current.length;
    if (answered > 0 && answered < size &&
      !window.confirm('End this round now? Your answers so far are saved.')) return;
    onExit();
  };

  const next = () => {
    if (i + 1 >= size) { onFinish(results.current.filter(Boolean).length); return; }
    const ni = i + 1;
    lock.current = false;
    setOutOfTime(false);
    setI(ni);
    setAns(initAns(questions[ni]));
    setPhase('answer');
    setShowHint(false);
    setPraise('');
    setXpGain(0);
    onMood?.('idle');
  };

  const onKey = (e) => { if (e.key === 'Enter') (phase === 'answer' ? submit() : next()); };

  // --- input renderers ---
  // A ± button toggles the leading minus — touch number-pads have no minus key,
  // so this is the only reliable way to enter a negative answer on a tablet.
  const flipSign = (val) => (String(val).startsWith('-') ? String(val).slice(1) : '-' + val);
  const signBtn = (val, set) => (
    <button type="button" className="sign-btn" tabIndex={-1} disabled={phase === 'reveal'}
      onClick={() => set(flipSign(val))} aria-label="Make the number negative or positive">±</button>
  );

  const numField = (val, set, extraClass = '', ref = null, ph = '?', signed = false) => (
    <span className="num-wrap">
      {signed && signBtn(val, set)}
      <input ref={ref} className={`field ${extraClass}`} inputMode="numeric" placeholder={ph}
        value={val} disabled={phase === 'reveal'} onKeyDown={onKey}
        onChange={(e) => set(clampNum(e.target.value))} />
    </span>
  );

  const renderInput = () => {
    switch (q.answerType) {
      case 'choice':
        return (
          <div className="choices">
            {q.options.map((opt, idx) => {
              let cls = 'choice-btn';
              if (phase === 'reveal') {
                if (idx === q.answer) cls += ' correct';
                else if (idx === ans) cls += ' chosen-wrong';
              } else if (idx === ans) cls += ' selected';
              return (
                <button key={idx} className={cls} disabled={phase === 'reveal'}
                  onClick={() => { setAns(idx); grade(idx); }}>{opt}</button>
              );
            })}
          </div>
        );
      case 'fraction':
        return (
          <div className="answer-row">
            {numField(ans.n, (v) => setAns({ ...ans, n: v }), 'frac', firstField, '?', true)}
            <span className="frac-bar">/</span>
            {numField(ans.d, (v) => setAns({ ...ans, d: v }), 'frac')}
          </div>
        );
      case 'mixed':
        return (
          <div className="answer-row">
            {numField(ans.w, (v) => setAns({ ...ans, w: v }), 'frac', firstField, 'whole', true)}
            <span style={{ width: 8 }} />
            {numField(ans.n, (v) => setAns({ ...ans, n: v }), 'frac')}
            <span className="frac-bar">/</span>
            {numField(ans.d, (v) => setAns({ ...ans, d: v }), 'frac')}
          </div>
        );
      case 'ratio':
        return (
          <div className="answer-row">
            {ans.map((val, k) => (
              <React.Fragment key={k}>
                {k > 0 && <span className="frac-bar">:</span>}
                {numField(val, (v) => { const c = [...ans]; c[k] = v; setAns(c); }, 'frac', k === 0 ? firstField : null)}
              </React.Fragment>
            ))}
          </div>
        );
      case 'linear':
        return (
          <div className="answer-row">
            {numField(ans.coeff, (v) => setAns({ ...ans, coeff: v }), 'frac', firstField, '?', true)}
            <span className="frac-bar">{q.answer.v} +</span>
            {numField(ans.c, (v) => setAns({ ...ans, c: v }), 'frac', null, '?', true)}
          </div>
        );
      case 'coord':
        return (
          <div className="answer-row">
            <span className="frac-bar">(</span>
            {numField(ans.x, (v) => setAns({ ...ans, x: v }), 'frac', firstField, '?', true)}
            <span className="frac-bar">,</span>
            {numField(ans.y, (v) => setAns({ ...ans, y: v }), 'frac', null, '?', true)}
            <span className="frac-bar">)</span>
          </div>
        );
      case 'order':
        return (
          <OrderList items={q.items} order={ans} onReorder={setAns}
            disabled={phase === 'reveal'} direction={q.direction} />
        );
      case 'primefac':
        return (
          <div className="answer-row">
            <input ref={firstField} className="field" inputMode="text" placeholder="e.g. 2^2 x 3^2"
              value={ans} disabled={phase === 'reveal'} onKeyDown={onKey}
              onChange={(e) => setAns(e.target.value)} style={{ maxWidth: 280 }} />
          </div>
        );
      default: // integer / decimal
        return (
          <div className="answer-row">
            <span className="num-wrap">
              {signBtn(ans, setAns)}
              <input ref={firstField} className="field" inputMode="decimal" placeholder="Your answer"
                value={ans} disabled={phase === 'reveal'} onKeyDown={onKey}
                onChange={(e) => setAns(clampNum(e.target.value))} />
            </span>
          </div>
        );
    }
  };

  const isChoice = q.answerType === 'choice';
  const modeLabel = questions.mode === 'weak' ? 'Weak spots'
    : questions.mode === 'quickfire' ? 'Quickfire'
    : questions.mode === 'topic' ? SKILL_NAME[questions.topicId]
    : `Round ${questions.roundNo || ''}`;

  return (
    <div className="fade-in">
      <div className="round-head">
        <div className="round-head-left">
          <button className="exit-btn" onClick={exitRound} aria-label="End round and go home">✕</button>
          <div className="round-tag">
            {modeLabel}<span className="sub"> · {i + 1} of {size}</span>
            {timed && phase === 'answer' && (
              <span className={`timer ${timeLeft <= 5 ? 'low' : ''}`}>⏱ {timeLeft}s</span>
            )}
          </div>
          {streak >= 2 && <span className="streak-flame" key={`fl-${streak}`}>🔥 {streak}</span>}
        </div>
        <div className="dots">
          {Array.from({ length: size }).map((_, k) => {
            let cls = 'dot';
            if (k < results.current.length) cls += results.current[k] ? ' done' : ' miss';
            else if (k === i) cls += ' current';
            return <span key={k} className={cls} />;
          })}
        </div>
      </div>

      <div className="card">
        <Confetti fire={fire} />
        <div key={i} className="q-enter">
          <div className="skill-label">
            {SKILL_NAME[q.skillId]}
            <span className={`tier tier-${q.level}`}>{tierName(q.level)}</span>
          </div>

          <div className={`prompt ${q.diagram ? 'with-diagram' : ''}`}>{q.prompt}</div>

          {q.diagram && <Diagram data={q.diagram} />}
        </div>

        <div className={`answer-zone${phase === 'reveal' ? (wasCorrect ? ' pop good' : (outOfTime ? '' : ' shake')) : ''}`}>
          {renderInput()}
          {phase === 'reveal' && wasCorrect && xpGain > 0 && (
            <span className="xp-pop" key={`xp-${i}`}>+{xpGain}</span>
          )}
        </div>

        {phase === 'answer' && !isChoice && (
          <div className="hint-line" onClick={() => setShowHint(true)} style={{ cursor: 'pointer' }}>
            {showHint ? q.hint : <span style={{ textDecoration: 'underline dotted' }}>Need a hint?</span>}
          </div>
        )}

        {phase === 'reveal' && (
          <div className={`feedback ${wasCorrect ? 'good' : 'bad'} fade-in`}>
            <div className="verdict">
              {wasCorrect ? `✓ ${praise || 'Correct'}` : outOfTime ? "⏱ Time's up" : `✕ ${praise || 'Not quite'}`}
            </div>
            {!wasCorrect && (
              <div className="solution">
                {q.steps.map((s, k) => <div className="step" key={k}>{s}</div>)}
                <div className="corr">Answer: {formatAnswer(q)}</div>
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ height: 14 }} />
      {phase === 'answer'
        ? (!isChoice && <button className="btn" onClick={submit}>Check</button>)
        : <button className="btn accent" onClick={next} autoFocus>{i + 1 >= size ? 'Finish round' : 'Next'}</button>}
    </div>
  );
}
