import React, { useEffect, useRef, useState } from 'react';
import { load, save, reset as resetStore, setupComplete, loadTheme, saveTheme, loadSound, saveSound } from './engine/storage.js';
import { freshLearner, chooseRound, applyResult, finishRound, ensureAllSkills, setSkillLevel, setAllLevels, addActiveTime, dailyAvailable, ROUND_SIZE, DAILY_SIZE } from './engine/adaptive.js';
import { setSoundEnabled } from './engine/sound.js';
import Setup from './components/Setup.jsx';
import Landing from './components/Landing.jsx';
import SubjectNav from './components/SubjectNav.jsx';
import English from './components/english/English.jsx';
import EnglishProgress from './components/english/EnglishProgress.jsx';
import { ensureEnglish, freshEnglish, recordPeel, addEnglishTime } from './engine/english.js';
import Home from './components/Home.jsx';
import Round from './components/Round.jsx';
import Summary from './components/Summary.jsx';
import Progress from './components/Progress.jsx';
import TopicPicker from './components/TopicPicker.jsx';
import Scene from './components/Scene.jsx';
import Keypad from './components/Keypad.jsx';
import Auth from './components/Auth.jsx';
import { isFirebaseConfigured, onAuth, cloudLoad, cloudSave, logOut } from './engine/firebase.js';

export default function App() {
  const [learner, setLearner] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [subject, setSubject] = useState('maths');    // platform subject: 'maths' | 'english'
  const [tab, setTab] = useState('train');           // 'train' | 'progress'
  const [screen, setScreen] = useState('home');       // 'home' | 'round' | 'summary' | 'topics'
  const [questions, setQuestions] = useState(null);
  const [lastCorrect, setLastCorrect] = useState(0);
  const [lastTotal, setLastTotal] = useState(ROUND_SIZE);
  const [lastDaily, setLastDaily] = useState(false); // did the last finished round count as the daily?
  const [pinUnlocked, setPinUnlocked] = useState(false);
  const [pinEntry, setPinEntry] = useState('');
  const [pinErr, setPinErr] = useState('');
  const [theme, setTheme] = useState(loadTheme);
  const [soundOn, setSoundOn] = useState(loadSound);
  const [mascotMood, setMascotMood] = useState('idle'); // ladybug reaction on Train
  const [authUser, setAuthUser] = useState(null);   // Firebase user (cloud mode)
  const [authReady, setAuthReady] = useState(false); // first auth state received
  const [entered, setEntered] = useState(false);     // left the landing page for the trainer

  // apply + persist the day/night theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    saveTheme(theme);
  }, [theme]);

  // sound-effects preference → engine + storage
  useEffect(() => { setSoundEnabled(soundOn); saveSound(soundOn); }, [soundOn]);

  // mount: local-only when Firebase isn't configured, else watch auth state
  useEffect(() => {
    if (!isFirebaseConfigured) {
      const s = load();
      if (s && setupComplete(s)) setLearner(ensureEnglish(ensureAllSkills(s)));
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
      setTab('train'); setScreen('home'); setEntered(false);
      return;
    }
    let cancelled = false;
    setLoaded(false);
    cloudLoad(authUser.uid)
      .then((doc) => {
        if (cancelled) return;
        setLearner(doc && setupComplete(doc) ? ensureEnglish(ensureAllSkills(doc)) : null);
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
  const subjectRef = useRef(subject);
  subjectRef.current = subject;
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
      if (tabRef.current !== 'train') return; // 'train' tab = the practise area in either subject
      if (Date.now() - lastActive > IDLE_MS) return;
      const add = subjectRef.current === 'english' ? addEnglishTime : addActiveTime;
      setLearner((prev) => (prev ? add(prev, TICK) : prev));
    }, TICK * 1000);
    return () => {
      clearInterval(id);
      window.removeEventListener('pointerdown', bump);
      window.removeEventListener('keydown', bump);
    };
  }, [ready]);

  const doLogout = async () => {
    if (!confirm('Log out of this account? His progress is saved to the cloud.')) return;
    try { await logOut(); } catch { /* listener still clears local state */ }
  };

  // wait until we know the auth state — avoids a Login/Logout flash on the landing page
  if (isFirebaseConfigured && !authReady) return <div className="app" />;

  // public landing page — the first screen everyone sees
  if (!entered) {
    return (
      <Landing
        firebaseOn={isFirebaseConfigured}
        authUser={authUser}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        onStart={() => setEntered(true)}
        onLogin={() => setEntered(true)}
        onLogout={doLogout}
      />
    );
  }

  // Phase 2: the trainer sits behind the parent login when Firebase is configured
  if (isFirebaseConfigured && !authUser) return <Auth onBack={() => setEntered(false)} />;

  if (!loaded) return <div className="app" />;

  // first run on this account / device — set up the child's profile
  if (!learner) {
    return (
      <div className="app">
        <Setup onDone={({ name, pin }) => {
          const base = freshLearner(name);
          base.pin = pin;
          base.english = freshEnglish();
          setLearner(base);
          if (isFirebaseConfigured && authUser) cloudSave(authUser.uid, base);
        }} />
      </div>
    );
  }

  const startRound = (mode = 'adaptive', topicId = null) => {
    const size = mode === 'quickfire' ? 8 : mode === 'daily' ? DAILY_SIZE : ROUND_SIZE;
    const qs = chooseRound(learner, { mode, topicId, size });
    qs.roundNo = learner.round + 1;
    qs.mode = mode;
    qs.topicId = topicId;
    setQuestions(qs);
    setMascotMood('idle');
    setScreen('round');
  };

  // Practise one topic now — used by the weak-area chips / "Recommended next"
  // on the parent dashboard, so it jumps back to the Train side.
  const practiseTopic = (topicId) => { setTab('train'); startRound('topic', topicId); };

  const handleResult = (q, correct) => setLearner((prev) => applyResult(prev, q, correct));
  const handleFinish = (correctCount) => {
    const total = questions.length;
    // only award the daily bonus if this really was today's (still-available) daily
    const isDaily = questions.mode === 'daily' && dailyAvailable(learner);
    setLearner((prev) => finishRound(prev, correctCount, total, { daily: isDaily }));
    setLastCorrect(correctCount);
    setLastTotal(total);
    setLastDaily(isDaily);
    setMascotMood(correctCount >= Math.ceil(total / 2) ? 'happy' : 'idle');
    setScreen('summary');
  };

  const goHome = () => { setMascotMood('idle'); setScreen('home'); };

  const goProgress = () => {
    setTab('progress');
    if (!pinUnlocked) { setPinEntry(''); setPinErr(''); }
  };

  const tryPin = (entered) => {
    if (entered === learner.pin) { setPinUnlocked(true); setPinErr(''); }
    else { setPinErr('Wrong PIN'); setPinEntry(''); }
  };

  // English progress handlers (kept fully separate from maths state)
  const onPeelResult = (extractId, score) => setLearner((p) => recordPeel(p, extractId, score));
  const doResetEnglish = () => setLearner((p) => ({ ...p, english: freshEnglish() }));

  // switch subject — land on its practise area, keep the other subject's state
  const switchSubject = (s) => { setSubject(s); setTab('train'); };

  // Confirmed by the modal in Progress before this runs. Resets maths only —
  // English progress is preserved.
  const doReset = () => {
    resetStore();
    const base = freshLearner(learner.name);
    base.pin = learner.pin;
    base.english = learner.english || freshEnglish();
    setLearner(base);
    if (isFirebaseConfigured && authUser) cloudSave(authUser.uid, base);
    setScreen('home');
    setTab('train');
  };

  const wide = (subject === 'maths' && tab === 'progress' && pinUnlocked) || subject === 'english';

  return (
    <div className={`app${wide ? ' wide' : ''}`}>
      {subject === 'maths' && tab === 'train' && <Scene mood={mascotMood} />}

      <SubjectNav
        subject={subject}
        onSubject={switchSubject}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        onLogout={doLogout}
        firebaseOn={isFirebaseConfigured}
      />

      {/* ---------- Maths Trainer (existing, unchanged behaviour) ---------- */}
      {subject === 'maths' && (
        <>
          <div className="topbar maths-topbar">
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
              {tab === 'train' && (
                <button className="theme-btn" onClick={() => setSoundOn((s) => !s)}
                  aria-label={soundOn ? 'Mute sound' : 'Turn sound on'}>
                  {soundOn ? '🔊' : '🔇'}
                </button>
              )}
            </div>
          </div>

          {tab === 'train' && screen === 'home' && (
            <Home
              learner={learner}
              onStart={() => startRound('adaptive')}
              onWeak={() => startRound('weak')}
              onQuickfire={() => startRound('quickfire')}
              onTopics={() => setScreen('topics')}
              onDaily={() => startRound('daily')}
              onTopic={(id) => startRound('topic', id)}
              dailyAvailable={dailyAvailable(learner)}
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
              onExit={goHome} onMood={setMascotMood} />
          )}

          {tab === 'train' && screen === 'summary' && (
            <Summary
              correct={lastCorrect}
              total={lastTotal}
              learner={learner}
              daily={lastDaily}
              onAgain={() => startRound(questions.mode === 'daily' ? 'adaptive' : questions.mode, questions.topicId)}
              onHome={goHome}
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
              onSetExamDate={(d) => setLearner((p) => ({ ...p, examDate: d }))}
              onPractise={practiseTopic}
            />
          )}
        </>
      )}

      {/* ---------- English Trainer (new, self-contained) ---------- */}
      {subject === 'english' && (
        <>
          <div className="topbar maths-topbar">
            <div className="brand">
              <span className="mark">E</span>
              <span className="name">English Trainer</span>
            </div>
            <div className="topbar-right">
              <div className="tabs">
                <button className={tab === 'train' ? 'active' : ''}
                  onClick={() => { setTab('train'); }}>Practise</button>
                <button className={tab === 'progress' ? 'active' : ''} onClick={goProgress}>Progress</button>
              </div>
            </div>
          </div>

          {tab === 'train' && <English studentName={learner.name} onPeelResult={onPeelResult} />}

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
            <EnglishProgress learner={learner} onReset={doResetEnglish} />
          )}
        </>
      )}
    </div>
  );
}
