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

/** Increment receipt counter and return formatted number "000123" */
export function nextReceiptNumber() {
  const data = db();
  data.receiptCounter = (data.receiptCounter || 0) + 1;
  save(data);
  return String(data.receiptCounter).padStart(6, '0');
}

/** Export full DB as JSON string */
export function exportDB() {
  return localStorage.getItem(KEY);
}

/** Import full DB from JSON string, returns true on success */
export function importDB(jsonStr) {
  try {
    const parsed = JSON.parse(jsonStr);
    if (!parsed.gyms || !parsed.admins) throw new Error('Formato inválido');
    localStorage.setItem(KEY, JSON.stringify(parsed));
    return true;
  } catch (e) {
    return false;
  }
}
