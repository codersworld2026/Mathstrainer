import React, { useState } from 'react';
import { signIn, signUp, resetPassword, authMessage } from '../engine/firebase.js';

// Parent login gate (Phase 2). On success, App's auth listener swaps screens —
// this component just drives the form and surfaces errors.
export default function Auth() {
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
    <div className="app">
      <div className="topbar">
        <div className="brand">
          <span className="mark">M</span>
          <span className="name">Maths Trainer</span>
        </div>
      </div>

      <div className="center-wrap fade-in">
        <form className="card setup" onSubmit={submit}>
          <h1>{mode === 'signup' ? 'Create your account' : 'Welcome back'}</h1>
          <p>{mode === 'signup'
            ? 'A parent account keeps his progress synced across your devices.'
            : 'Log in to pick up his progress on this device.'}</p>

          <label className="lbl" htmlFor="email">Email</label>
          <input id="email" className="text-input" type="email" autoComplete="email"
            inputMode="email" value={email} disabled={busy}
            onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />

          <label className="lbl" htmlFor="password">Password</label>
          <input id="password" className="text-input" type="password"
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            value={password} disabled={busy}
            onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />

          <div className="err-msg">{err}</div>
          {note && <div className="auth-note">{note}</div>}

          <div style={{ height: 6 }} />
          <button className="btn accent" type="submit" disabled={busy}>
            {busy ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Log in'}
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
        </form>
      </div>
    </div>
  );
}
