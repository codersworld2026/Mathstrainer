import React, { useEffect, useRef, useState } from 'react';
import papers from '../../data/ks3EnglishExamPapers.js';
import { markAnswer, EXAM_STARTERS } from '../../engine/englishExam.js';
import ExamResults from './ExamResults.jsx';

const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
const wc = (s) => (s || '').trim().split(/\s+/).filter(Boolean).length;

// Practice Exams — exam-style Shakespeare questions WITH support: planning,
// quotes, hints, sentence starters, a word bank and friendly feedback you can
// improve and re-check. An optional (not forced) timer.
export default function PracticeExams({ onBack, onExam, onTryReal }) {
  const [stage, setStage] = useState('list');      // list | work | results
  const [paper, setPaper] = useState(null);
  const [planning, setPlanning] = useState('');
  const [answer, setAnswer] = useState('');
  const [checked, setChecked] = useState(null);     // inline check result (improve loop)
  const [result, setResult] = useState(null);       // final result
  const [showHelp, setShowHelp] = useState(false);
  const [timerOn, setTimerOn] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const answerRef = useRef(null);

  // optional count-up stopwatch (practice is never forced)
  useEffect(() => {
    if (!timerOn) return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [timerOn]);

  const open = (p) => {
    setPaper(p); setPlanning(''); setAnswer(''); setChecked(null); setResult(null);
    setShowHelp(false); setTimerOn(false); setElapsed(0); setStage('work');
  };

  // append a snippet to the writing box (quote / starter / word-bank word)
  const append = (text) => setAnswer((a) => (a.trim() ? `${a.trim()} ${text}` : text));
  const addQuote = (q) => { append(`“${q}”`); setChecked(null); };

  const check = () => setChecked(markAnswer(paper, answer));
  const finish = () => {
    const r = markAnswer(paper, answer);
    setResult(r);
    onExam && onExam({ paperId: paper.id, title: paper.title, mode: 'practice', score: r.score, level: r.level, answer, timeSpent: elapsed });
    setStage('results');
  };

  if (stage === 'results' && result) {
    return (
      <ExamResults
        result={result} mode="practice" paper={paper}
        onTryAgain={() => open(paper)}
        onSwitch={onTryReal}
        onHome={onBack}
      />
    );
  }

  if (stage === 'work' && paper) {
    const words = wc(answer);
    return (
      <div className="english-wrap fade-in">
        <div className="exam-work-top">
          <button className="btn ghost small" onClick={() => setStage('list')}>← Practice papers</button>
          <button className={`btn ghost small timer-toggle ${timerOn ? 'on' : ''}`} onClick={() => setTimerOn((t) => !t)}>
            ⏱ {timerOn ? fmt(elapsed) : 'Timer'}
          </button>
        </div>

        <div className="card scroll-card">
          <div className="eng-kicker">📜 Extract</div>
          <blockquote className="ex-text">“{paper.extract}”</blockquote>
          <div className="eq-tags"><span className="ex-tag">{paper.character}</span><span className="ex-tag theme">{paper.focus}</span></div>
        </div>

        <div className="card scroll-card question-scroll">
          <div className="eng-kicker">✍️ Your writing mission</div>
          <p className="pq-text">{paper.question}</p>
        </div>

        <div className="card">
          <div className="eng-kicker">🧠 Plan your ideas</div>
          <p className="peel-help">Jot down quick ideas first — this won’t be marked.</p>
          <ul className="plan-prompts">
            {paper.planningPrompts.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
          <textarea className="peel-area" rows={3} placeholder="Plan your ideas here…"
            value={planning} onChange={(e) => setPlanning(e.target.value)} />
        </div>

        <div className="card">
          <div className="eng-kicker">✒️ Write your answer</div>
          <p className="peel-help">Remember <b>PEEL</b>: Point · Evidence · Explain · Link.</p>
          <textarea ref={answerRef} className="peel-area" rows={8} placeholder="Write your answer here…"
            value={answer} onChange={(e) => { setAnswer(e.target.value); setChecked(null); }} />
          <div className="word-count">{words} word{words === 1 ? '' : 's'}</div>

          <div className="exam-actions">
            <button className="btn small-cta ghost-cta" onClick={check}>✅ Check my answer</button>
            <button className="btn small-cta" onClick={finish}>🌟 See my feedback</button>
          </div>

          {checked && (
            <div className="check-panel">
              <div className="check-head">
                <span className="check-score">{checked.score}/{checked.max}</span>
                <span className="check-level">{checked.level}</span>
              </div>
              <p className="exam-headline">{checked.headline}</p>
              {checked.nextSteps.length > 0 && (
                <ul className="exam-list step">
                  {checked.nextSteps.map((s, i) => <li key={i}>→ {s}</li>)}
                </ul>
              )}
              <p className="check-tip">Improve your answer above, then check again — or press <b>See my feedback</b> when you’re happy.</p>
            </div>
          )}
        </div>

        {/* ---- help cards (this is the supportive mode) ---- */}
        <div className="card help-card">
          <div className="eng-kicker">🔑 Tap a quote to add it</div>
          <div className="quote-row">
            {paper.suggestedQuotes.map((q, i) => (
              <button key={i} type="button" className="quote-chip" onClick={() => addQuote(q)}>“{q}”</button>
            ))}
          </div>
        </div>

        <div className="card help-card">
          <div className="eng-kicker">🪶 Sentence starters</div>
          <div className="starter-row">
            {EXAM_STARTERS.map((s, i) => (
              <button key={i} type="button" className="starter-chip" onClick={() => { append(s); setChecked(null); }}>{s}</button>
            ))}
          </div>
        </div>

        <div className="card help-card">
          <div className="eng-kicker">📚 Word bank</div>
          <div className="starter-row">
            {paper.wordBank.map((w, i) => (
              <button key={i} type="button" className="word-chip" onClick={() => { append(w); setChecked(null); }}>{w}</button>
            ))}
          </div>
        </div>

        <button className="btn ghost small help-toggle" onClick={() => setShowHelp((h) => !h)}>
          {showHelp ? '▲ Hide help' : '❓ Need help?'}
        </button>
        {showHelp && (
          <div className="card help-card tips-card">
            <div className="eng-kicker">💡 How to build a great answer</div>
            <ul className="exam-list step">
              <li><b>P</b>oint — answer the question: “Shakespeare presents…”.</li>
              <li><b>E</b>vidence — add a short quote in “quotation marks”.</li>
              <li><b>E</b>xplain — say what it shows: “this suggests…”.</li>
              <li><b>L</b>ink — connect back to the question and the play.</li>
            </ul>
            <div className="dc-label">Focus for this question</div>
            <p className="dc-role">{paper.focus} — think about {paper.character}.</p>
          </div>
        )}
      </div>
    );
  }

  // ---- list of practice papers ----
  return (
    <div className="english-wrap fade-in">
      <button className="btn ghost small" onClick={onBack}>← English home</button>
      <div className="card eng-hero">
        <span className="eng-badge">📝 Practice Exams</span>
        <h1 className="eng-title">Practice with help</h1>
        <p className="eng-hero-sub">Exam-style Shakespeare questions with planning, quotes, sentence starters and friendly feedback.</p>
      </div>

      <div className="challenge-grid">
        {papers.map((p) => (
          <div className="card challenge-card practice-paper" key={p.id}>
            <div className="ch-top">
              <span className="ch-num">📝 Practice</span>
              <span className={`ch-diff ${p.difficulty.toLowerCase()}`}>{p.difficulty}</span>
            </div>
            <div className="ch-title">{p.title}</div>
            <div className="eq-tags"><span className="ex-tag">{p.character}</span><span className="ex-tag theme">{p.focus}</span></div>
            <p className="ch-question">{p.question}</p>
            <div className="paper-meta">⏱ about {p.timeLimit} mins · with help</div>
            <button className="btn small-cta" onClick={() => open(p)}>Practise with help</button>
          </div>
        ))}
      </div>
    </div>
  );
}
