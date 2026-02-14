import { seeds } from './seeds.js';
const KEY = 'gym-mvp-v2-db';

const clone = (v) => JSON.parse(JSON.stringify(v));

export function initDB() {
  if (!localStorage.getItem(KEY)) localStorage.setItem(KEY, JSON.stringify(seeds));
}

export function db() {
  return JSON.parse(localStorage.getItem(KEY));
}

export function save(next) {
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function resetDB() {
  localStorage.setItem(KEY, JSON.stringify(clone(seeds)));
}

export function uid(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}
