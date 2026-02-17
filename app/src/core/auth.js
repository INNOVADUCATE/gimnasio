import { db } from '../data/storage.js';

const SESSION_KEY = 'gym-mvp-session';

export function login(email, password) {
  const user = db().admins.find((u) => u.email === email && u.passwordHash === password);
  if (!user) return null;
  // super gets first gym set so session is never in limbo
  const gymId = user.role === 'staff' ? user.gymIds[0] : user.gymIds[0];
  const sess = { userId: user.id, gymId };
  localStorage.setItem(SESSION_KEY, JSON.stringify(sess));
  return sess;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function session() {
  return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
}

export function currentUser() {
  const s = session();
  if (!s) return null;
  return db().admins.find((u) => u.id === s.userId) || null;
}

export function currentGymId() {
  const s = session();
  return s ? s.gymId : null;
}

export function setCurrentGym(gymId) {
  const s = session();
  if (!s) return;
  localStorage.setItem(SESSION_KEY, JSON.stringify({ ...s, gymId }));
}
