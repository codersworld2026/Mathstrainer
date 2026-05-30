import React, { useState, useRef, useEffect } from 'react';
import { checkAnswer, ROUND_SIZE, tierName } from '../engine/adaptive.js';
import { SKILL_NAME } from '../engine/skills.js';
import { fracStr, mixedStr, ratioStr, primeFacStr } from '../engine/math.js';
import Diagram from './Diagram.jsx';
import OrderList from './OrderList.jsx';

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
    default: return String(a).trim() !== '';
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

export default function Round({ questions, onResult, onFinish }) {
  const [i, setI] = useState(0);
  const [phase, setPhase] = useState('answer');
  const [ans, setAns] = useState(() => initAns(questions[0]));
  const [wasCorrect, setWasCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const results = useRef([]);
  const firstField = useRef(null);

  const q = questions[i];
  useEffect(() => { firstField.current?.focus(); }, [i]);

  const grade = (value) => {
    const correct = checkAnswer(q, value);
    results.current.push(correct);
    setWasCorrect(correct);
    setPhase('reveal');
    onResult(q, correct);
  };

  const submit = () => {
    if (phase === 'reveal') return;
    if (!filled(q, ans)) return;
    grade(ans);
  };

  const next = () => {
    if (i + 1 >= ROUND_SIZE) { onFinish(results.current.filter(Boolean).length); return; }
    const ni = i + 1;
    setI(ni);
    setAns(initAns(questions[ni]));
    setPhase('answer');
    setShowHint(false);
  };

  const onKey = (e) => { if (e.key === 'Enter') (phase === 'answer' ? submit() : next()); };

  // --- input renderers ---
  const numField = (val, set, extraClass = '', ref = null, ph = '?') => (
    <input ref={ref} className={`field ${extraClass}`} inputMode="numeric" placeholder={ph}
      value={val} disabled={phase === 'reveal'} onKeyDown={onKey}
      onChange={(e) => set(clampNum(e.target.value))} />
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
            {numField(ans.n, (v) => setAns({ ...ans, n: v }), 'frac', firstField)}
            <span className="frac-bar">/</span>
            {numField(ans.d, (v) => setAns({ ...ans, d: v }), 'frac')}
          </div>
        );
      case 'mixed':
        return (
          <div className="answer-row">
            {numField(ans.w, (v) => setAns({ ...ans, w: v }), 'frac', firstField, 'whole')}
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
            {numField(ans.coeff, (v) => setAns({ ...ans, coeff: v }), 'frac', firstField)}
            <span className="frac-bar">{q.answer.v} +</span>
            {numField(ans.c, (v) => setAns({ ...ans, c: v }), 'frac')}
          </div>
        );
      case 'coord':
        return (
          <div className="answer-row">
            <span className="frac-bar">(</span>
            {numField(ans.x, (v) => setAns({ ...ans, x: v }), 'frac', firstField)}
            <span className="frac-bar">,</span>
            {numField(ans.y, (v) => setAns({ ...ans, y: v }), 'frac')}
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
            <input ref={firstField} className="field" inputMode="decimal" placeholder="Your answer"
              value={ans} disabled={phase === 'reveal'} onKeyDown={onKey}
              onChange={(e) => setAns(clampNum(e.target.value))} />
          </div>
        );
    }
  };

  const isChoice = q.answerType === 'choice';

  return (
    <div className="fade-in">
      <div className="round-head">
        <div className="round-tag">
          Round {questions.roundNo || ''}<span className="sub"> · {i + 1} of {ROUND_SIZE}</span>
        </div>
        <div className="dots">
          {Array.from({ length: ROUND_SIZE }).map((_, k) => {
            let cls = 'dot';
            if (k < results.current.length) cls += results.current[k] ? ' done' : ' miss';
            else if (k === i) cls += ' current';
            return <span key={k} className={cls} />;
          })}
        </div>
      </div>

      <div className="card">
        <div className="skill-label">
          {SKILL_NAME[q.skillId]}
          <span className={`tier tier-${q.level}`}>{tierName(q.level)}</span>
        </div>

        <div className={`prompt ${q.diagram ? 'with-diagram' : ''}`}>{q.prompt}</div>

        {q.diagram && <Diagram data={q.diagram} />}

        {renderInput()}

        {phase === 'answer' && !isChoice && (
          <div className="hint-line" onClick={() => setShowHint(true)} style={{ cursor: 'pointer' }}>
            {showHint ? q.hint : <span style={{ textDecoration: 'underline dotted' }}>Need a hint?</span>}
          </div>
        )}

        {phase === 'reveal' && (
          <div className={`feedback ${wasCorrect ? 'good' : 'bad'} fade-in`}>
            <div className="verdict">{wasCorrect ? '✓ Correct' : '✕ Not quite'}</div>
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
        : <button className="btn accent" onClick={next} autoFocus>{i + 1 >= ROUND_SIZE ? 'Finish round' : 'Next'}</button>}
    </div>
  );
}
