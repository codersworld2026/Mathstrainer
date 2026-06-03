import React from 'react';

// The learning cards (kept working — each opens a live page via onOpen).
const CARDS = [
  { key: 'peel', icon: '✍️', title: 'PEEL Practice', sub: 'Build Point, Evidence, Explain, Link step by step' },
  { key: 'twelfth', icon: '🎭', title: 'Twelfth Night', sub: 'The play hub — story, themes and characters' },
  { key: 'characters', icon: '👥', title: 'Characters', sub: 'Viola, Malvolio, Orsino, Olivia and more' },
  { key: 'symbolism', icon: '🔑', title: 'Symbolism', sub: 'Themes and symbols, with useful quotes' },
  { key: 'extracts', icon: '📜', title: 'Extract Questions', sub: 'Pick a question and practise it in PEEL' },
];

// The four PEEL steps, explained simply with an example starter.
const PEEL_STEPS = [
  { letter: 'P', name: 'Point', icon: '🎯', desc: 'Say your main idea.', eg: 'Shakespeare presents Viola as…' },
  { letter: 'E', name: 'Evidence', icon: '🔍', desc: 'Choose a short quote.', eg: 'This is shown when…' },
  { letter: 'E', name: 'Explain', icon: '💭', desc: 'Explain the quote.', eg: 'This suggests…' },
  { letter: 'L', name: 'Link', icon: '🔗', desc: 'Answer the question.', eg: 'This links back because…' },
];

// Visual-only reward goals.
const STARS = [
  { icon: '❝', label: 'Use a quote' },
  { icon: '💡', label: 'Explain a word' },
  { icon: '🧩', label: 'Finish a PEEL paragraph' },
  { icon: '🎯', label: 'Try a new question' },
];

// Toolkit shortcuts — each links straight to the right section.
const TOOLKIT = [
  { icon: '❝', title: 'Useful quotes', sub: 'A quote for every question', go: 'extracts' },
  { icon: '🪶', title: 'Sentence starters', sub: 'Ways to begin each step', go: 'peel' },
  { icon: '👥', title: 'Character help', sub: 'Notes on everyone in the play', go: 'characters' },
  { icon: '🔑', title: 'Theme help', sub: 'Big ideas and symbols', go: 'symbolism' },
];

// Famous lines that rotate by day.
const QUOTES = [
  { text: 'If music be the food of love, play on.', by: 'Orsino' },
  { text: 'I am not what I am.', by: 'Viola' },
  { text: "Some are born great, some achieve greatness, and some have greatness thrust upon 'em.", by: 'Malvolio' },
  { text: 'Be not afraid of greatness.', by: 'The forged letter' },
  { text: 'Better a witty fool than a foolish wit.', by: 'Feste' },
  { text: 'Love sought is good, but given unsought is better.', by: 'Olivia' },
];

// A gentle daily mission, also rotating by day.
const MISSIONS = [
  { text: 'Write one full PEEL paragraph about Viola and disguise.', cta: 'Start this PEEL', go: 'peel' },
  { text: 'Meet three characters and note one useful quote for each.', cta: 'Open characters', go: 'characters' },
  { text: 'Pick a theme and learn why Shakespeare uses it.', cta: 'Explore themes', go: 'symbolism' },
  { text: 'Choose a new extract question and give it a go.', cta: 'Pick a challenge', go: 'extracts' },
];

// Decorative section heading with a small flourish + gold rule.
function Flourish({ children }) {
  return <h2 className="eng-sec-title"><span className="eng-orn">✦</span>{children}<span className="eng-orn">✦</span></h2>;
}

export default function EnglishHome({ studentName, onOpen }) {
  const day = Math.floor(Date.now() / 864e5);
  const quote = QUOTES[day % QUOTES.length];
  const mission = MISSIONS[day % MISSIONS.length];

  return (
    <div className="english-wrap fade-in">
      <div className="card eng-hero">
        <span className="eng-badge">🎭 English Trainer</span>
        <h1 className="eng-title">Welcome to the stage, {studentName}</h1>
        <p className="eng-hero-sub">
          Explore Shakespeare’s <em>Twelfth Night</em> and master great writing —
          one PEEL paragraph at a time.
        </p>
        <div className="eng-hero-cta">
          <button className="btn eng-cta" onClick={() => onOpen('peel')}>✍️ Start writing</button>
          <button className="btn eng-cta ghost" onClick={() => onOpen('twelfth')}>🎭 Explore the play</button>
        </div>
      </div>

      <div className="eng-duo">
        <div className="card eng-mission">
          <div className="eng-kicker">🎯 Today’s mission</div>
          <p className="eng-mission-text">{mission.text}</p>
          <button className="btn small-cta" onClick={() => onOpen(mission.go)}>{mission.cta}</button>
        </div>
        <div className="card eng-quote-card">
          <div className="eng-kicker">📜 Quote of the day</div>
          <blockquote className="eng-quote">“{quote.text}”</blockquote>
          <div className="eng-quote-by">— {quote.by}</div>
        </div>
      </div>

      <div className="card eng-peel-how">
        <div className="eng-kicker centered">🪄 How PEEL works</div>
        <p className="eng-how-sub">Four small steps build one strong paragraph.</p>
        <div className="peel-flow">
          {PEEL_STEPS.map((s, i) => (
            <React.Fragment key={i}>
              <div className="flow-step">
                <span className="flow-badge">{s.letter}</span>
                <span className="flow-icon">{s.icon}</span>
                <span className="flow-name">{s.name}</span>
                <span className="flow-desc">{s.desc}</span>
                <span className="flow-eg">“{s.eg}”</span>
              </div>
              {i < PEEL_STEPS.length - 1 && <span className="flow-arrow" aria-hidden="true">→</span>}
            </React.Fragment>
          ))}
        </div>
        <button className="btn small-cta" onClick={() => onOpen('peel')}>Try it now ✍️</button>
      </div>

      <Flourish>Exam zone</Flourish>
      <div className="exam-zone">
        <button className="exam-feature practice" onClick={() => onOpen('practice-exams')}>
          <span className="ef-ico">📝</span>
          <span className="ef-title">Practice Exams</span>
          <span className="ef-sub">Practise Shakespeare questions with help.</span>
          <span className="ef-btn">Start practice</span>
        </button>
        <button className="exam-feature real" onClick={() => onOpen('real-exam')}>
          <span className="ef-ico">⏱️</span>
          <span className="ef-title">Real Exam Mode</span>
          <span className="ef-sub">Try a timed exam with no hints.</span>
          <span className="ef-btn">Start exam</span>
        </button>
      </div>

      <Flourish>Choose your next challenge</Flourish>
      <div className="eng-card-grid">
        {CARDS.map((c) => (
          <button key={c.key} className="eng-card" onClick={() => onOpen(c.key)}>
            <span className="eng-ico">{c.icon}</span>
            <span className="eng-card-text">
              <span className="eng-card-title">{c.title}</span>
              <span className="eng-card-sub">{c.sub}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="card eng-stars">
        <div className="eng-kicker">⭐ Writing stars</div>
        <p className="eng-how-sub">Earn a star for every great writing habit.</p>
        <div className="stars-row">
          {STARS.map((s, i) => (
            <span className="star-goal" key={i}><span className="star-ico">{s.icon}</span>{s.label}</span>
          ))}
        </div>
      </div>

      <Flourish>Shakespeare toolkit</Flourish>
      <div className="toolkit-grid">
        {TOOLKIT.map((t) => (
          <button key={t.go} className="toolkit-card" onClick={() => onOpen(t.go)}>
            <span className="tk-ico">{t.icon}</span>
            <span className="tk-title">{t.title}</span>
            <span className="tk-sub">{t.sub}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
