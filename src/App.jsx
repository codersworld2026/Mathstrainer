import React, { useEffect, useRef, useState } from 'react';
import { load, save, reset as resetStore, setupComplete, loadTheme, saveTheme } from './engine/storage.js';
import { freshLearner, chooseRound, applyResult, finishRound, ensureAllSkills, setSkillLevel, setAllLevels, addActiveTime, ROUND_SIZE } from './engine/adaptive.js';
import Setup from './components/Setup.jsx';
import Home from './components/Home.jsx';
import Round from './components/Round.jsx';
import Summary from './components/Summary.jsx';
import Progress from './components/Progress.jsx';
import TopicPicker from './components/TopicPicker.jsx';
import Keypad from './components/Keypad.jsx';
import Auth from './components/Auth.jsx';
import { isFirebaseConfigured, onAuth, cloudLoad, cloudSave, logOut } from './engine/firebase.js';

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
  const [theme, setTheme] = useState(loadTheme);
  const [authUser, setAuthUser] = useState(null);   // Firebase user (cloud mode)
  const [authReady, setAuthReady] = useState(false); // first auth state received

  // apply + persist the day/night theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    saveTheme(theme);
  }, [theme]);

  // mount: local-only when Firebase isn't configured, else watch auth state
  useEffect(() => {
    if (!isFirebaseConfigured) {
      const s = load();
      if (s && setupComplete(s)) setLearner(ensureAllSkills(s));
      setLoaded(true);
      setAuthReady(true);
      return;
    }
    return onAuth((user) => { setAuthUser(user); setAuthReady(true); });
  }, []);

  // cloud mode: load this account's learner doc on login, clear on logout
  useEffect(() => {
    if (!isFirebaseConfigured) return;
    if (!authUser) {
      setLearner(null); setLoaded(false); setPinUnlocked(false);
      setTab('train'); setScreen('home');
      return;
    }
    let cancelled = false;
    setLoaded(false);
    cloudLoad(authUser.uid)
      .then((doc) => {
        if (cancelled) return;
        setLearner(doc && setupComplete(doc) ? ensureAllSkills(doc) : null);
        setLoaded(true);
      })
      .catch(() => { if (!cancelled) { setLearner(null); setLoaded(true); } });
    return () => { cancelled = true; };
  }, [authUser]);

  // persist on change — local cache (always) + throttled cloud write (cloud mode)
  useEffect(() => { if (learner) save(learner); }, [learner]);

  const learnerRef = useRef(learner);
  learnerRef.current = learner;
  const dirty = useRef(false);
  useEffect(() => { if (isFirebaseConfigured && authUser && learner) dirty.current = true; }, [learner, authUser]);
  useEffect(() => {
    if (!isFirebaseConfigured || !authUser) return;
    const uid = authUser.uid;
    const flush = () => {
      if (dirty.current && learnerRef.current) { cloudSave(uid, learnerRef.current); dirty.current = false; }
    };
    const id = setInterval(flush, 15000);
    const onVis = () => { if (document.visibilityState === 'hidden') flush(); };
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('pagehide', flush);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('pagehide', flush);
      flush();
    };
  }, [authUser]);

  // active screen-time tracking — accrues only while the Train tab is visible
  // and there's been recent interaction (so idle / backgrounded time isn't counted).
  const tabRef = useRef(tab);
  tabRef.current = tab;
  const ready = !!learner;
  useEffect(() => {
    if (!ready) return;
    const TICK = 5, IDLE_MS = 90_000;
    let lastActive = Date.now();
    const bump = () => { lastActive = Date.now(); };
    window.addEventListener('pointerdown', bump);
    window.addEventListener('keydown', bump);
    const id = setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      if (tabRef.current !== 'train') return;
      if (Date.now() - lastActive > IDLE_MS) return;
      setLearner((prev) => (prev ? addActiveTime(prev, TICK) : prev));
    }, TICK * 1000);
    return () => {
      clearInterval(id);
      window.removeEventListener('pointerdown', bump);
      window.removeEventListener('keydown', bump);
    };
  }, [ready]);

  // Phase 2: parent login gate (only when Firebase is configured)
  if (isFirebaseConfigured) {
    if (!authReady) return <div className="app" />;
    if (!authUser) return <Auth />;
  }

  if (!loaded) return <div className="app" />;

  // first run on this account / device — set up the child's profile
  if (!learner) {
    return (
      <div className="app">
        <Setup onDone={({ name, pin }) => {
          const base = freshLearner(name);
          base.pin = pin;
          setLearner(base);
          if (isFirebaseConfigured && authUser) cloudSave(authUser.uid, base);
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
    if (isFirebaseConfigured && authUser) cloudSave(authUser.uid, base);
    setScreen('home');
    setTab('train');
  };

  const doLogout = async () => {
    if (!confirm('Log out of this account? His progress is saved to the cloud.')) return;
    try { await logOut(); } catch { /* listener still clears local state */ }
  };

  return (
    <div className="app">
      <div className="topbar">
        <div className="brand">
          <span className="mark">M</span>
          <span className="name">Maths Trainer</span>
        </div>
        <div className="topbar-right">
          <div className="tabs">
            <button className={tab === 'train' ? 'active' : ''}
              onClick={() => { setTab('train'); }}>Train</button>
            <button className={tab === 'progress' ? 'active' : ''} onClick={goProgress}>Progress</button>
          </div>
          <button className="theme-btn" onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            aria-label={theme === 'dark' ? 'Switch to day mode' : 'Switch to night mode'}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
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
        <Round questions={questions} onResult={handleResult} onFinish={handleFinish}
          onExit={() => setScreen('home')} />
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

      {tab === 'progress' && pinUnlocked && (
        <Progress
          learner={learner}
          onReset={doReset}
          onLogout={isFirebaseConfigured ? doLogout : null}
          onSetLevel={(id, lvl) => setLearner((p) => setSkillLevel(p, id, lvl))}
          onSetAll={(lvl) => setLearner((p) => setAllLevels(p, lvl))}
        />
      )}
    </div>
  );
}
