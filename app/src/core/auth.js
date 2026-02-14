import { db } from '../data/storage.js';

const SESSION_KEY = 'gym-mvp-session';

export function login(email, password) {
  const user = db().admins.find((u) => u.email === email && u.passwordHash === password);
  if (!user) return null;
  const session = { userId: user.id, gymId: user.role === 'staff' ? user.gymIds[0] : null };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
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

export function setCurrentGym(gymId) {
  const s = session();
  if (!s) return;
  localStorage.setItem(SESSION_KEY, JSON.stringify({ ...s, gymId }));
}
