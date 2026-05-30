import React, { useState } from 'react';
import Keypad from './Keypad.jsx';

// First run. The parent enters the learner's name and chooses a 4-digit PIN that
// protects the Progress view. (Phase 2: this moves under the parent's login.)
export default function Setup({ onDone }) {
  const [step, setStep] = useState('name'); // name -> pin -> confirm
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [confirm, setConfirm] = useState('');
  const [err, setErr] = useState('');

  if (step === 'name') {
    return (
      <div className="center-wrap fade-in">
        <div className="card setup">
          <h1>Let’s set up</h1>
          <p>Quick one-time setup. You can change this later.</p>
          <label className="lbl">Who’s training?</label>
          <input
            className="text-input"
            placeholder="First name"
            value={name}
            autoFocus
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && name.trim() && setStep('pin')}
          />
          <div style={{ height: 16 }} />
          <button className="btn" disabled={!name.trim()} onClick={() => name.trim() && setStep('pin')}>
            Continue
          </button>
        </div>
        <p className="footer-note">Saved on this device only · no account needed yet</p>
      </div>
    );
  }

  if (step === 'pin') {
    return (
      <div className="center-wrap fade-in">
        <div className="card setup" style={{ textAlign: 'center' }}>
          <h1>Create a parent PIN</h1>
          <p>4 digits. You’ll use this to open the Progress page.</p>
          <Keypad value={pin} onChange={(v) => { setPin(v); setErr(''); }} onComplete={() => setStep('confirm')} />
        </div>
      </div>
    );
  }

  return (
    <div className="center-wrap fade-in">
      <div className="card setup" style={{ textAlign: 'center' }}>
        <h1>Confirm the PIN</h1>
        <p>Type the same 4 digits again.</p>
        <Keypad
          value={confirm}
          onChange={(v) => { setConfirm(v); setErr(''); }}
          onComplete={(c) => {
            if (c === pin) onDone({ name: name.trim(), pin });
            else { setErr('PINs don’t match — try again'); setConfirm(''); setPin(''); setStep('pin'); }
          }}
        />
        <div className="err-msg">{err}</div>
      </div>
    </div>
  );
}
