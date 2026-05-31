// Tiny synthesised sound effects (Web Audio) — no audio files to bundle.
// Off by default; App flips `enabled` from the saved preference and the toggle.

let ctx = null;
let enabled = false;

export function setSoundEnabled(v) { enabled = !!v; }
export function isSoundEnabled() { return enabled; }

function ac() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, startIn, dur, type = 'sine', gain = 0.14) {
  const c = ac();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  o.connect(g); g.connect(c.destination);
  const t = c.currentTime + startIn;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.start(t);
  o.stop(t + dur + 0.02);
}

// rising two-note "ding" for a correct answer
export function playCorrect() { if (!enabled) return; tone(660, 0, 0.12); tone(990, 0.09, 0.16); }
// soft low blip for a miss (gentle, not harsh)
export function playWrong() { if (!enabled) return; tone(196, 0, 0.2, 'triangle', 0.1); }
// little fanfare for finishing / a streak
export function playWin() { if (!enabled) return; [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.1, 0.18, 'triangle', 0.13)); }
