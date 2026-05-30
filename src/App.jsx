import React, { useEffect, useState } from 'react';
import { load, save, reset as resetStore, setupComplete } from './engine/storage.js';
import { freshLearner, chooseRound, applyResult, finishRound, ensureAllSkills, ROUND_SIZE } from './engine/adaptive.js';
import Setup from './components/Setup.jsx';
import Home from './components/Home.jsx';
import Round from './components/Round.jsx';
import Summary from './components/Summary.jsx';
import Progress from './components/Progress.jsx';
import TopicPicker from './components/TopicPicker.jsx';
import Keypad from './components/Keypad.jsx';

export default function App() {
  const [learner, setLearner] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState('train');           // 'train' | 'progress'
  const [screen, setScreen] = useState('home');       // 'home' | 'round' | 'summary' | 'topics'
  const [questions, setQuestions] = useState(null);
  const [lastCorrect, setLastCorrect] = useState(0);
  const [lastTotal, setLastTotal] = useState(ROUND_SIZE);
  const [pinUnlocked, setPinUnlocked] = useState(false);
  const [pinEntry, setPinEntry] = useState('');
  const [pinErr, setPinErr] = useState('');

  // load on mount
  useEffect(() => {
    const s = load();
    if (s && setupComplete(s)) setLearner(ensureAllSkills(s));
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

  const startRound = (mode = 'adaptive', topicId = null) => {
    const size = mode === 'quickfire' ? 8 : ROUND_SIZE;
    const qs = chooseRound(learner, { mode, topicId, size });
    qs.roundNo = learner.round + 1;
    qs.mode = mode;
    qs.topicId = topicId;
    setQuestions(qs);
    setScreen('round');
  };

  const handleResult = (q, correct) => setLearner((prev) => applyResult(prev, q, correct));
  const handleFinish = (correctCount) => {
    const total = questions.length;
    setLearner((prev) => finishRound(prev, correctCount, total));
    setLastCorrect(correctCount);
    setLastTotal(total);
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

      {tab === 'train' && screen === 'home' && (
        <Home
          learner={learner}
          onStart={() => startRound('adaptive')}
          onWeak={() => startRound('weak')}
          onQuickfire={() => startRound('quickfire')}
          onTopics={() => setScreen('topics')}
        />
      )}

      {tab === 'train' && screen === 'topics' && (
        <TopicPicker
          learner={learner}
          onPick={(id) => startRound('topic', id)}
          onCancel={() => setScreen('home')}
        />
      )}

      {tab === 'train' && screen === 'round' && questions && (
        <Round questions={questions} onResult={handleResult} onFinish={handleFinish} />
      )}

      {tab === 'train' && screen === 'summary' && (
        <Summary
          correct={lastCorrect}
          total={lastTotal}
          learner={learner}
          onAgain={() => startRound(questions.mode, questions.topicId)}
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
