import React, { useMemo, useState } from 'react';
import extracts from '../../data/twelfthNightExtracts.js';

// Sentence starters for each PEEL step (KS3-friendly).
const STARTERS = {
  point: [
    'Shakespeare presents…',
    'At this moment, the character seems…',
    'One way Shakespeare shows this is…',
    'The extract suggests that…',
    'Shakespeare uses this to show…',
  ],
  evidence: [
    'This is shown when Shakespeare writes, "…"',
    'A useful quote from the extract is "…"',
    'We can see this in the line "…"',
    'The word/phrase "…" shows…',
    'Shakespeare uses the phrase "…" to suggest…',
  ],
  explain: [
    'This suggests that…',
    'This makes the audience think…',
    'The word "…" is important because…',
    'Shakespeare may be showing that…',
    'This creates the impression that…',
    'This could make the audience feel…',
  ],
  link: [
    'This links back to the question because…',
    'Therefore, Shakespeare presents…',
    'Overall, this shows that…',
    'This helps the audience understand that…',
    'This is important because…',
  ],
};

const STEP_LABELS = { point: 'Point', evidence: 'Evidence', explain: 'Explain', link: 'Link' };
const wc = (s) => s.trim().split(/\s+/).filter(Boolean).length;
const hasQuote = (s) => /["“”]/.test(s);

// Lightweight, encouraging PEEL check (no harsh GCSE wording).
function checkPeel({ point, evidence, explain, link }) {
  const parts = {
    point: wc(point) >= 3,
    evidence: hasQuote(evidence) || wc(evidence) >= 4,
    explain: wc(explain) >= 4,
    link: wc(link) >= 3,
  };
  const score = Object.values(parts).filter(Boolean).length;

  let message;
  if (score === 4) message = 'Excellent PEEL paragraph! You have used a clear point, a quote, an explanation and a link. 🌟';
  else if (!parts.point) message = 'Great start. Write your main idea in the Point box to answer the question.';
  else if (!parts.evidence) message = 'Good point. Now try adding a short quote from the extract in the Evidence box.';
  else if (!parts.explain) message = 'Nice evidence. Now explain what the quote tells us about the character or theme.';
  else if (!parts.link) message = 'Almost there! Now link your idea back to the question.';
  else message = 'Well done — keep building your paragraph step by step.';

  // a gentle nudge if they wrote evidence but forgot the quotation marks
  if (parts.point && wc(evidence) >= 4 && !hasQuote(evidence)) {
    message = 'You have a good idea here. Try using one short quote with quotation marks to support it.';
  }
  return { score, parts, message };
}

export default function PeelPractice({ onBack, initialExtractId = null }) {
  const startId = extracts.some((e) => e.id === initialExtractId) ? initialExtractId : extracts[0].id;
  const [extractId, setExtractId] = useState(startId);
  const ex = useMemo(() => extracts.find((e) => e.id === extractId) || extracts[0], [extractId]);

  const [peel, setPeel] = useState({ point: '', evidence: '', explain: '', link: '' });
  const [built, setBuilt] = useState('');
  const [result, setResult] = useState(null);

  const set = (k, v) => { setPeel((p) => ({ ...p, [k]: v })); setResult(null); setBuilt(''); };
  const reset = () => { setPeel({ point: '', evidence: '', explain: '', link: '' }); setBuilt(''); setResult(null); };

  // append a sentence starter to a box (start fresh line if there's text)
  const addStarter = (k, text) => set(k, peel[k] ? `${peel[k].trim()} ${text}` : text);

  // insert a quote into Evidence with quotation marks; don't overwrite unless empty
  const addQuote = (quote) => {
    const q = `"${quote}"`;
    setPeel((p) => ({ ...p, evidence: p.evidence.trim() ? `${p.evidence.trim()} ${q}` : q }));
    setResult(null); setBuilt('');
  };

  const buildParagraph = () => {
    const para = ['point', 'evidence', 'explain', 'link']
      .map((k) => peel[k].trim()).filter(Boolean).join(' ');
    setBuilt(para);
  };

  const live = checkPeel(peel).parts; // live progress dots use the same checker

  const Box = (k) => (
    <div className="peel-box">
      <label className="peel-label">
        <span className={`peel-dot ${live[k] ? 'on' : ''}`} />{STEP_LABELS[k]}
      </label>
      <textarea className="peel-area" rows={k === 'point' || k === 'link' ? 2 : 3}
        placeholder={`Write your ${STEP_LABELS[k].toLowerCase()} here…`}
        value={peel[k]} onChange={(e) => set(k, e.target.value)} />
      {k === 'evidence' && (
        <div className="quote-row">
          <span className="qr-label">Tap a quote to add it:</span>
          {ex.suggestedQuotes.map((q, i) => (
            <button key={i} type="button" className="quote-chip" onClick={() => addQuote(q)}>“{q}”</button>
          ))}
        </div>
      )}
      <div className="starter-row">
        {STARTERS[k].map((s, i) => (
          <button key={i} type="button" className="starter-chip" onClick={() => addStarter(k, s)}>{s}</button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="english-wrap fade-in">
      <button className="btn ghost small" onClick={onBack}>← English home</button>

      <div className="card peel-extract">
        <div className="peel-pick">
          {extracts.map((e) => (
            <button key={e.id} className={`pick-chip ${e.id === extractId ? 'active' : ''}`}
              onClick={() => { setExtractId(e.id); reset(); }}>{e.title}</button>
          ))}
        </div>
        <div className="ex-tags"><span className="ex-tag">{ex.character}</span><span className="ex-tag theme">{ex.theme}</span></div>
        <blockquote className="ex-text">“{ex.extract}”</blockquote>
      </div>

      <div className="card peel-question">
        <span className="pq-label">📝 Your question</span>
        <p className="pq-text">{ex.question}</p>
      </div>

      <div className="card peel-progress">
        {['point', 'evidence', 'explain', 'link'].map((k) => (
          <div key={k} className={`pp-step ${live[k] ? 'done' : ''}`}>
            <span className="pp-mark">{live[k] ? '✓' : '•'}</span>{STEP_LABELS[k]}
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="peel-h">Build your PEEL paragraph</h2>
        <p className="peel-help">Fill in each box one step at a time. Use the sentence starters and quotes to help you.</p>
        {Box('point')}
        {Box('evidence')}
        {Box('explain')}
        {Box('link')}

        <div className="peel-actions">
          <button className="btn small-cta" onClick={buildParagraph}>🧩 Build my paragraph</button>
          <button className="btn small-cta ghost-cta" onClick={() => setResult(checkPeel(peel))}>✅ Check my PEEL</button>
        </div>
      </div>

      {built && (
        <div className="card peel-built">
          <span className="pq-label">📄 Your paragraph</span>
          <p className="built-text">{built}</p>
        </div>
      )}

      {result && (
        <div className="card peel-result">
          <div className="score-line">Your PEEL score: <b>{result.score}/4</b></div>
          <div className="score-pills">
            {['point', 'evidence', 'explain', 'link'].map((k) => (
              <span key={k} className={`score-pill ${result.parts[k] ? 'got' : ''}`}>
                {result.parts[k] ? '✓' : '–'} {STEP_LABELS[k]}
              </span>
            ))}
          </div>
          <p className="peel-feedback">{result.message}</p>
        </div>
      )}
    </div>
  );
}
