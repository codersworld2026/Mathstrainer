import React, { useEffect, useRef, useState } from 'react';
import papers from '../../data/ks3EnglishExamPapers.js';
import { markAnswer } from '../../engine/englishExam.js';
import ExamResults from './ExamResults.jsx';

const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
const wc = (s) => (s || '').trim().split(/\s+/).filter(Boolean).length;

const TIME_OPTIONS = [
  { mins: 15, label: '15 min', sub: 'Quick challenge' },
  { mins: 30, label: '30 min', sub: 'Full challenge' },
  { mins: 45, label: '45 min', sub: 'Extended challenge' },
];

// Real Exam Mode — a timed, serious-but-not-scary challenge. No sentence
// starters, suggested quotes or PEEL hints during writing. Auto-submits when
// the timer ends (using the current answer, so nothing is lost).
export default function RealExam({ onBack, onExam, onPractiseWithHelp }) {
  const [stage, setStage] = useState('list');     // list | setup | exam | results
  const [paper, setPaper] = useState(null);
  const [mins, setMins] = useState(30);
  const [answer, setAnswer] = useState('');
  const [left, setLeft] = useState(0);            // seconds remaining
  const [confirm, setConfirm] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [result, setResult] = useState(null);

  const answerRef = useRef('');
  answerRef.current = answer;
  const finishedRef = useRef(false);

  const finish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    const r = markAnswer(paper, answerRef.current);
    setResult(r);
    onExam && onExam({
      paperId: paper.id, title: paper.title, mode: 'real',
      score: r.score, level: r.level, answer: answerRef.current, timeSpent: mins * 60 - left,
    });
    setStage('results');
  };

  // countdown while in the exam; auto-submit at zero
  useEffect(() => {
    if (stage !== 'exam') return;
    if (left <= 0) { setTimeUp(true); finish(); return; }
    const id = setInterval(() => setLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [stage, left]);

  const beginSetup = (p) => { setPaper(p); setMins(p.timeLimit || 30); setStage('setup'); };
  const startExam = () => {
    setAnswer(''); setLeft(mins * 60); setTimeUp(false); setConfirm(false);
    finishedRef.current = false; setStage('exam');
  };

  if (stage === 'results' && result) {
    return (
      <ExamResults
        result={result} mode="real" paper={paper}
        onTryAgain={() => beginSetup(paper)}
        onSwitch={onPractiseWithHelp}
        onHome={onBack}
      />
    );
  }

  if (stage === 'exam' && paper) {
    const words = wc(answer);
    const low = left <= 60;
    return (
      <div className="english-wrap fade-in real-exam">
        <div className={`exam-bar ${low ? 'low' : ''}`}>
          <span className="exam-bar-title">⏱ Real Exam Challenge</span>
          <span className="exam-timer">{fmt(Math.max(0, left))}</span>
        </div>

        {timeUp && <div className="time-up-banner">⏰ Time is up — submitting your answer…</div>}

        <div className="card scroll-card">
          <div className="eng-kicker">📜 Extract</div>
          <blockquote className="ex-text">“{paper.extract}”</blockquote>
        </div>

        <div className="card scroll-card question-scroll">
          <div className="eng-kicker">Question</div>
          <p className="pq-text">{paper.question}</p>
        </div>

        <div className="card">
          <textarea className="peel-area exam-answer" rows={12} placeholder="Write your full answer here…"
            value={answer} onChange={(e) => setAnswer(e.target.value)} autoFocus />
          <div className="exam-answer-foot">
            <span className="word-count">{words} word{words === 1 ? '' : 's'}</span>
            <button className="btn small-cta" onClick={() => setConfirm(true)}>Submit Exam</button>
          </div>
        </div>

        {confirm && (
          <div className="modal-overlay" onClick={() => setConfirm(false)}>
            <div className="modal" onClick={(ev) => ev.stopPropagation()}>
              <div className="modal-ico">📝</div>
              <h2>Submit your exam?</h2>
              <p>Are you sure you want to submit your exam? You won’t be able to change your answer afterwards.</p>
              <div className="modal-actions">
                <button className="btn secondary" onClick={() => setConfirm(false)}>Keep writing</button>
                <button className="btn small-cta" onClick={finish}>Yes, submit</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (stage === 'setup' && paper) {
    return (
      <div className="english-wrap fade-in">
        <button className="btn ghost small" onClick={() => setStage('list')}>← Real exams</button>
        <div className="card eng-hero exam-setup-hero">
          <span className="eng-badge">⏱ Real Exam Challenge</span>
          <h1 className="eng-title">{paper.title}</h1>
          <p className="eng-hero-sub">{paper.focus} · {paper.play}</p>
        </div>

        <div className="card">
          <div className="eng-kicker">⏳ Choose your time</div>
          <div className="time-options">
            {TIME_OPTIONS.map((o) => (
              <button key={o.mins} className={`time-option ${mins === o.mins ? 'active' : ''}`} onClick={() => setMins(o.mins)}>
                <span className="to-mins">{o.label}</span>
                <span className="to-sub">{o.sub}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="eng-kicker">📋 Instructions</div>
          <ul className="exam-list step">
            <li>Read the extract carefully.</li>
            <li>Answer the question in full sentences.</li>
            <li>Use quotes from the extract.</li>
            <li>Explain what Shakespeare is showing.</li>
          </ul>
          <div className="dc-label">What you’ll do</div>
          <p className="dc-role">Write your answer on your own — there are no hints or sentence starters in a real exam. The timer will show how long you have left.</p>
        </div>

        <button className="btn eng-cta start-exam-cta" onClick={startExam}>Start Exam ⏱</button>
      </div>
    );
  }

  // ---- list of real-exam papers ----
  return (
    <div className="english-wrap fade-in">
      <button className="btn ghost small" onClick={onBack}>← English home</button>
      <div className="card eng-hero">
        <span className="eng-badge">⏱ Real Exam Mode</span>
        <h1 className="eng-title">Try without help</h1>
        <p className="eng-hero-sub">A timed exam-style challenge — no hints. Calm, focused, and a great way to show what you can do.</p>
      </div>

      <div className="challenge-grid">
        {papers.map((p) => (
          <div className="card challenge-card real-paper" key={p.id}>
            <div className="ch-top">
              <span className="ch-num">⏱ Real exam</span>
              <span className={`ch-diff ${p.difficulty.toLowerCase()}`}>{p.difficulty}</span>
            </div>
            <div className="ch-title">{p.title}</div>
            <div className="eq-tags"><span className="ex-tag">{p.character}</span><span className="ex-tag theme">{p.focus}</span></div>
            <p className="ch-question">{p.question}</p>
            <div className="paper-meta">⏱ {p.timeLimit} mins · no hints</div>
            <button className="btn small-cta" onClick={() => beginSetup(p)}>Start real exam</button>
          </div>
        ))}
      </div>
    </div>
  );
}
