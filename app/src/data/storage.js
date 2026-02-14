import { seeds } from './seeds.js';
const KEY = 'gym-mvp-v2-db';

const clone = (v) => JSON.parse(JSON.stringify(v));

function normalizeData(data) {
  const next = clone(data || {});
  next.gyms = Array.isArray(next.gyms) ? next.gyms : [];
  next.admins = Array.isArray(next.admins) ? next.admins : [];
  next.members = Array.isArray(next.members) ? next.members : [];
  next.biometrics = Array.isArray(next.biometrics) ? next.biometrics : [];
  next.inventory = Array.isArray(next.inventory) ? next.inventory : [];
  next.sales = Array.isArray(next.sales) ? next.sales : [];
  next.closures = Array.isArray(next.closures) ? next.closures : [];
  next.notifications = Array.isArray(next.notifications) ? next.notifications : [];

  next.members.forEach((m) => {
    if (typeof m.isEnrolled !== 'boolean') m.isEnrolled = false;
  });

  const existingMax = next.sales.reduce((mx, s) => Math.max(mx, Number(s.receiptNumber || 0)), 0);
  let counter = Number.isFinite(Number(next.receiptCounter)) ? Number(next.receiptCounter) : existingMax;
  if (counter < existingMax) counter = existingMax;

  // Assign only for legacy sales lacking number.
  next.sales.forEach((sale) => {
    if (!sale.receiptNumber) {
      counter += 1;
      sale.receiptNumber = counter;
    }
  });

  next.receiptCounter = counter;
  return next;
}

export function initDB() {
  const initial = localStorage.getItem(KEY) ? JSON.parse(localStorage.getItem(KEY)) : seeds;
  localStorage.setItem(KEY, JSON.stringify(normalizeData(initial)));
}

export function db() {
  return normalizeData(JSON.parse(localStorage.getItem(KEY)));
}

export function save(next) {
  localStorage.setItem(KEY, JSON.stringify(normalizeData(next)));
}

export function replaceAllData(next) {
  localStorage.clear();
  localStorage.setItem(KEY, JSON.stringify(normalizeData(next)));
}

export function resetDB() {
  localStorage.setItem(KEY, JSON.stringify(normalizeData(clone(seeds))));
}

export function nextReceiptNumber(state) {
  const next = normalizeData(state);
  next.receiptCounter += 1;
  return { state: next, receiptNumber: next.receiptCounter };
}

export function uid(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}
