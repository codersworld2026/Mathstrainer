// Persistence layer.
//
// PHASE 1 (now): everything is saved to this device with localStorage. No login,
// so you can run it in Antigravity and see it working straight away.
//
// PHASE 2 (next): replace the bodies of load()/save() with Firebase calls.
// The data shape does NOT change, so nothing else in the app needs touching.
// The exact spots to edit are marked with  >>> PHASE 2 <<<.

const KEY = 'maths-trainer:v1';

export function load() {
  // >>> PHASE 2 <<<  swap for: getDoc(doc(db, 'learners', uid)) and return .data()
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function save(state) {
  // >>> PHASE 2 <<<  swap for: setDoc(doc(db, 'learners', uid), state, { merge: true })
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage full / disabled — ignore for Phase 1 */
  }
}

export function reset() {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
}

// --- PIN (Phase 1: stored locally; Phase 2: this whole concept moves under the
//     parent's Firebase account, and the parent dashboard sits behind their login) ---
export function setupComplete(state) {
  return !!(state && state.name && state.pin);
}
