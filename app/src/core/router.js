import { currentUser, session } from './auth.js';

export function parseRoute() {
  const h = window.location.hash.replace(/^#/, '') || '/login';
  return h;
}

export function go(path) {
  window.location.hash = path;
}

export function requireAuth() {
  if (!session()) {
    go('/login');
    return false;
  }
  return true;
}

export function canAccessGym(gymId) {
  const user = currentUser();
  if (!user) return false;
  // super can ALWAYS access any gym
  if (user.role === 'super') return true;
  return user.gymIds.includes(gymId);
}

export function denyIfNoAccess(gymId) {
  if (!canAccessGym(gymId)) {
    go('/access-denied');
    return true;
  }
  return false;
}
