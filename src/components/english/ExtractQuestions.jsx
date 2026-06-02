import React from 'react';
import extracts from '../../data/twelfthNightExtracts.js';

// A list of practice questions. "Practise this question" opens the PEEL page
// with that exact extract pre-loaded.
export default function ExtractQuestions({ onBack, onPractise }) {
  return (
    <div className="english-wrap fade-in">
      <button className="btn ghost small" onClick={onBack}>← English home</button>
      <div className="card eng-hero">
        <span className="eng-badge">📜 Extract Questions</span>
        <h1>Practice questions</h1>
        <p>Pick a question to practise. It will open in the PEEL builder with the extract ready.</p>
      </div>

      <div className="eq-list">
        {extracts.map((e, i) => (
          <div className="card eq-item" key={e.id}>
            <div className="eq-head">
              <span className="eq-num">{i + 1}</span>
              <div className="eq-titles">
                <div className="eq-title">{e.question}</div>
                <div className="eq-tags"><span className="ex-tag">{e.character}</span><span className="ex-tag theme">{e.theme}</span></div>
              </div>
            </div>
            <blockquote className="eq-extract">“{e.extract}”</blockquote>
            <div className="eq-quotes">
              <span className="qr-label">Suggested quotes:</span>
              {e.suggestedQuotes.map((q, k) => <span className="ref-chip" key={k}>“{q}”</span>)}
            </div>
            <button className="btn small-cta" onClick={() => onPractise(e.id)}>✍️ Practise this question</button>
          </div>
        ))}
      </div>
    </div>
  );
}
