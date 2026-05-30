import React, { useEffect, useState } from 'react';
import { load, save, reset as resetStore, setupComplete } from './engine/storage.js';
import { freshLearner, chooseRound, applyResult, finishRound } from './engine/adaptive.js';
import Setup from './components/Setup.jsx';
import Home from './components/Home.jsx';
import Round from './components/Round.jsx';
import Summary from './components/Summary.jsx';
import Progress from './components/Progress.jsx';
import Keypad from './components/Keypad.jsx';

export default function App() {
  const [learner, setLearner] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState('train');           // 'train' | 'progress'
  const [screen, setScreen] = useState('home');       // 'home' | 'round' | 'summary'
  const [questions, setQuestions] = useState(null);
  const [lastCorrect, setLastCorrect] = useState(0);
  const [pinUnlocked, setPinUnlocked] = useState(false);
  const [pinEntry, setPinEntry] = useState('');
  const [pinErr, setPinErr] = useState('');

  // load on mount
  useEffect(() => {
    const s = load();
    if (s && setupComplete(s)) setLearner(s);
    setLoaded(true);
  }, []);

  // persist on change
  useEffect(() => { if (learner) save(learner); }, [learner]);

  if (!loaded) return <div className="app" />;

  // first run
  if (!learner) {
    return (
      <div className="app">
        <Setup onDone={({ name, pin }) => {
          const base = freshLearner(name);
          base.pin = pin;
          setLearner(base);
        }} />
      </div>
    );
  }

  const startRound = () => {
    const qs = chooseRound(learner);
    qs.roundNo = learner.round + 1;
    setQuestions(qs);
    setScreen('round');
  };

  const handleResult = (q, correct) => setLearner((prev) => applyResult(prev, q, correct));
  const handleFinish = (correctCount) => {
    setLearner((prev) => finishRound(prev, correctCount));
    setLastCorrect(correctCount);
    setScreen('summary');
  };

  const goProgress = () => {
    setTab('progress');
    if (!pinUnlocked) { setPinEntry(''); setPinErr(''); }
  };

  const tryPin = (entered) => {
    if (entered === learner.pin) { setPinUnlocked(true); setPinErr(''); }
    else { setPinErr('Wrong PIN'); setPinEntry(''); }
  };

  const doReset = () => {
    if (!confirm('Reset all progress? This cannot be undone.')) return;
    resetStore();
    const base = freshLearner(learner.name);
    base.pin = learner.pin;
    setLearner(base);
    setScreen('home');
    setTab('train');
  };

  return (
    <div className="app">
      <div className="topbar">
        <div className="brand">
          <span className="mark">M</span>
          <span className="name">Maths Trainer</span>
        </div>
        <div className="tabs">
          <button className={tab === 'train' ? 'active' : ''}
            onClick={() => { setTab('train'); }}>Train</button>
          <button className={tab === 'progress' ? 'active' : ''} onClick={goProgress}>Progress</button>
        </div>
      </div>

      {tab === 'train' && screen === 'home' && <Home learner={learner} onStart={startRound} />}

      {tab === 'train' && screen === 'round' && questions && (
        <Round questions={questions} onResult={handleResult} onFinish={handleFinish} />
      )}

      {tab === 'train' && screen === 'summary' && (
        <Summary
          correct={lastCorrect}
          learner={learner}
          onAgain={startRound}
          onHome={() => setScreen('home')}
        />
      )}

      {tab === 'progress' && !pinUnlocked && (
        <div className="center-wrap fade-in">
          <div className="card setup" style={{ textAlign: 'center' }}>
            <h1>Parent PIN</h1>
            <p>Enter your 4-digit PIN to see progress.</p>
            <Keypad value={pinEntry} onChange={(v) => { setPinEntry(v); setPinErr(''); }} onComplete={tryPin} />
            <div className="err-msg">{pinErr}</div>
            <button className="btn ghost" onClick={() => setTab('train')}>Cancel</button>
          </div>
        </div>
      )}

      {tab === 'progress' && pinUnlocked && <Progress learner={learner} onReset={doReset} />}
    </div>
  );
}
