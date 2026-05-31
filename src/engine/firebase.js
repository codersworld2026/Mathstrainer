// Firebase (Phase 2) — cloud login + per-account sync.
//
// Config comes from a gitignored `.env.local` (see `.env.example`). Until those
// keys are filled in, `isFirebaseConfigured` is false and the whole app falls
// back to the Phase-1 local-only mode — so it always runs, with or without a
// Firebase project wired up.
//
// You (the parent) create the Firebase project, enable Email/Password auth and
// Firestore, then paste the web-app config values into `.env.local`. No
// credentials live in this file or in the repo.

import { initializeApp } from 'firebase/app';
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, sendPasswordResetEmail, signOut,
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

const cfg = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(cfg.apiKey && cfg.projectId && cfg.appId);

let auth = null;
let db = null;
if (isFirebaseConfigured) {
  const app = initializeApp(cfg);
  auth = getAuth(app);
  db = getFirestore(app);
}
export { auth, db };

// --- auth helpers (only call these when isFirebaseConfigured) ---
export const onAuth = (cb) => onAuthStateChanged(auth, cb);
export const signIn = (email, password) => signInWithEmailAndPassword(auth, email.trim(), password);
export const signUp = (email, password) => createUserWithEmailAndPassword(auth, email.trim(), password);
export const resetPassword = (email) => sendPasswordResetEmail(auth, email.trim());
export const logOut = () => signOut(auth);

// --- per-account learner document (one doc per uid) ---
export async function cloudLoad(uid) {
  const snap = await getDoc(doc(db, 'learners', uid));
  return snap.exists() ? snap.data() : null;
}
export function cloudSave(uid, state) {
  return setDoc(doc(db, 'learners', uid), state);
}

// Turn Firebase auth error codes into something a parent can read.
export function authMessage(code) {
  switch (code) {
    case 'auth/invalid-email': return 'That doesn’t look like a valid email.';
    case 'auth/missing-password': return 'Please enter a password.';
    case 'auth/weak-password': return 'Password should be at least 6 characters.';
    case 'auth/email-already-in-use': return 'That email already has an account — try logging in.';
    case 'auth/operation-not-allowed': return 'Email/Password sign-in isn’t switched on in Firebase yet (Authentication → Sign-in method).';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found': return 'Email or password is incorrect.';
    case 'auth/too-many-requests': return 'Too many attempts — wait a moment and try again.';
    case 'auth/network-request-failed': return 'Network problem — check your connection.';
    default: return 'Something went wrong. Please try again.';
  }
}
