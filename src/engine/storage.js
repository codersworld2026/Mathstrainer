// Local persistence — the device-side store.
//
// In local-only mode (no Firebase keys) this IS the database. In cloud mode it
// doubles as an offline cache while the source of truth is the per-account
// Firestore document (see firebase.js: cloudLoad / cloudSave). Same data shape
// either way, so nothing downstream cares which mode is active.

const KEY = 'maths-trainer:v1';

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function save(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage full / disabled — ignore */
  }
}

export function reset() {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
}

// Theme preference ('light' | 'dark') — kept separate from learner data so it
// applies before/without a profile and survives a progress reset.
const THEME_KEY = 'maths-trainer:theme';
export function loadTheme() {
  try { return localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light'; } catch { return 'light'; }
}
export function saveTheme(theme) {
  try { localStorage.setItem(THEME_KEY, theme); } catch { /* ignore */ }
}

// --- PIN (Phase 1: stored locally; Phase 2: this whole concept moves under the
//     parent's Firebase account, and the parent dashboard sits behind their login) ---
export function setupComplete(state) {
  return !!(state && state.name && state.pin);
}
