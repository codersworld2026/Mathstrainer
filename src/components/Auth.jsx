import React, { useState } from 'react';
import { signIn, signUp, resetPassword, authMessage } from '../engine/firebase.js';

// Parent login gate (Phase 2). On success, App's auth listener swaps screens —
// this component just drives the form and surfaces errors.

// Big, dense maths symbols drifting around the background — purely decorative.
// Heavier than the landing page (more of them, larger). Kept toward the edges
// so they sit behind the card's margins, not its text.
const DECOR = [
  { s: '+', x: 6, y: 10, size: 56, c: 'd-blue', delay: 0 },
  { s: '×', x: 90, y: 8, size: 48, c: 'd-pink', delay: 0.7 },
  { s: '÷', x: 3, y: 40, size: 52, c: 'd-green', delay: 1.4 },
  { s: '√', x: 92, y: 34, size: 58, c: 'd-purple', delay: 0.3 },
  { s: '%', x: 8, y: 70, size: 46, c: 'd-amber', delay: 1.1 },
  { s: 'π', x: 88, y: 66, size: 60, c: 'd-orange', delay: 2.0 },
  { s: '=', x: 48, y: 4, size: 44, c: 'd-green', delay: 1.3 },
  { s: '−', x: 80, y: 92, size: 56, c: 'd-blue', delay: 0.6 },
  { s: '▲', x: 16, y: 28, size: 34, c: 'd-amber', delay: 1.8 },
  { s: '●', x: 84, y: 50, size: 30, c: 'd-pink', delay: 0.2 },
  { s: '7', x: 95, y: 22, size: 44, c: 'd-purple', delay: 2.3 },
  { s: '½', x: 4, y: 88, size: 46, c: 'd-orange', delay: 0.9 },
  { s: '∑', x: 14, y: 54, size: 40, c: 'd-pink', delay: 1.6 },
  { s: '∞', x: 90, y: 84, size: 42, c: 'd-blue', delay: 0.5 },
  { s: '<', x: 46, y: 94, size: 40, c: 'd-purple', delay: 2.1 },
  { s: '²', x: 32, y: 8, size: 38, c: 'd-amber', delay: 1.0 },
  { s: '◆', x: 70, y: 6, size: 30, c: 'd-green', delay: 0.4 },
  { s: '3', x: 6, y: 22, size: 40, c: 'd-orange', delay: 1.9 },
];

const ICONS = [
  { s: '＋', c: 'ai-blue' },
  { s: '−', c: 'ai-green' },
  { s: '×', c: 'ai-amber' },
  { s: '÷', c: 'ai-purple' },
  { s: '√', c: 'ai-pink' },
];

export default function Auth({ onBack }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [note, setNote] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setErr(''); setNote(''); setBusy(true);
    try {
      if (mode === 'signup') await signUp(email, password);
      else await signIn(email, password);
      // App's onAuth listener takes over from here.
    } catch (ex) {
      setErr(authMessage(ex.code));
      setBusy(false);
    }
  };

  const forgot = async () => {
    setErr(''); setNote('');
    if (!email.trim()) { setErr('Enter your email first, then tap reset.'); return; }
    try {
      await resetPassword(email);
      setNote('Password reset email sent — check your inbox.');
    } catch (ex) {
      setErr(authMessage(ex.code));
    }
  };

  return (
    <div className="app auth-page">
      <div className="auth-decor" aria-hidden="true">
        {DECOR.map((d, i) => (
          <span key={i} className={`decor ${d.c}`}
            style={{ left: `${d.x}%`, top: `${d.y}%`, fontSize: d.size, animationDelay: `${d.delay}s` }}>
            {d.s}
          </span>
        ))}
      </div>

      <div className="topbar">
        <div className="brand">
          <span className="mark">M</span>
          <span className="name">Maths Trainer</span>
        </div>
      </div>

      <div className="center-wrap fade-in">
        <form className="card setup auth-card" onSubmit={submit}>
          <div className="auth-icons" aria-hidden="true">
            {ICONS.map((ic, i) => (
              <span key={i} className={`ai ${ic.c}`} style={{ animationDelay: `${i * 0.18}s` }}>{ic.s}</span>
            ))}
          </div>

          <h1>{mode === 'signup' ? '🧮 Create your account' : '🔢 Welcome back'}</h1>
          <p>{mode === 'signup'
            ? 'A parent account keeps his progress synced across your devices.'
            : 'Log in to pick up his progress on this device.'}</p>

          <label className="lbl" htmlFor="email">📧 Email</label>
          <input id="email" className="text-input" type="email" autoComplete="email"
            inputMode="email" value={email} disabled={busy}
            onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />

          <label className="lbl" htmlFor="password">🔒 Password</label>
          <input id="password" className="text-input" type="password"
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            value={password} disabled={busy}
            onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />

          <div className="err-msg">{err}</div>
          {note && <div className="auth-note">{note}</div>}

          <div style={{ height: 6 }} />
          <button className="btn accent" type="submit" disabled={busy}>
            {busy ? 'Please wait…' : mode === 'signup' ? '✏️ Create account' : '🚀 Log in'}
          </button>

          {mode === 'login' && (
            <button type="button" className="btn ghost" onClick={forgot} disabled={busy}>
              Forgot password?
            </button>
          )}

          <div className="auth-switch">
            {mode === 'signup' ? 'Already have an account?' : 'New here?'}{' '}
            <button type="button" onClick={() => { setMode(mode === 'signup' ? 'login' : 'signup'); setErr(''); setNote(''); }}>
              {mode === 'signup' ? 'Log in' : 'Create one'}
            </button>
          </div>

          {onBack && (
            <button type="button" className="btn ghost" onClick={onBack} disabled={busy}>
              ← Back to home
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
