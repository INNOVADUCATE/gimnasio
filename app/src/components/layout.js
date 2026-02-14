import { currentUser, logout } from '../core/auth.js';

export function appLayout({ gymId, title, body, active }) {
  const user = currentUser();
  const links = [
    ['home', `/${gymId}/home`, 'Home'],
    ['members', `/${gymId}/members`, 'Socios'],
    ['notifications', `/${gymId}/notifications`, 'Morosos'],
    ['cash', `/${gymId}/cash-closure`, 'Caja diaria'],
    ['inventory', `/${gymId}/inventory`, 'Inventario'],
    ['shop', `/${gymId}/shop`, 'Shop'],
    ['reports', `/${gymId}/reports/monthly`, 'Reporte mensual'],
    ['settings', `/${gymId}/settings`, 'Settings']
  ];
  const hubLink = user.role === 'super' ? `<a href="#/hub" class="${active === 'hub' ? 'active' : ''}">Hub multi-gym</a>` : '';
  return `<div class="layout">
    <aside class="sidebar">
      <div class="logo">GYM HUB <small>${gymId}</small></div>
      <nav class="nav">${hubLink}${links.map(([key, href, label]) => `<a href="#${href}" class="${active === key ? 'active' : ''}">${label}</a>`).join('')}</nav>
      <div style="margin-top:1rem"><button id="logout-btn" class="btn">Salir (${user.email})</button></div>
    </aside>
    <main class="content"><h1>${title}</h1>${body}</main>
  </div>`;
}

export function bindLayoutEvents() {
  const b = document.getElementById('logout-btn');
  if (b) b.onclick = () => {
    logout();
    window.location.hash = '/login';
  };
}

export const money = (n) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);
