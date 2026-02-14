import { login, currentUser, session, setCurrentGym } from '../core/auth.js';
import { go } from '../core/router.js';
import { db, save, uid, resetDB } from '../data/storage.js';
import { appLayout, bindLayoutEvents, money } from '../components/layout.js';

const tag = (s) => `<span class="tag ${s === 'active' ? 'ok' : 'bad'}">${s}</span>`;
const byGym = (gymId) => db().members.filter((m) => m.gymId === gymId);

export function loginPage(root) {
  root.innerHTML = `<div class="center panel"><h1>Unified Admin Login</h1><p class="muted">Usuarios demo: super@gym.local / super123, staff@gym.local / staff123</p>
  <label>Email</label><input id="email" value="super@gym.local"/>
  <label>Password</label><input id="password" type="password" value="super123"/>
  <button id="login" class="btn primary" style="margin-top:.7rem">Ingresar</button></div>`;
  document.getElementById('login').onclick = () => {
    const s = login(document.getElementById('email').value, document.getElementById('password').value);
    if (!s) return alert('Credenciales inválidas');
    const u = currentUser();
    if (u.role === 'super') go('/hub'); else go(`/${s.gymId}/home`);
  };
}

export function hubPage(root) {
  const data = db();
  const cards = data.gyms.map((g) => `<div class="panel"><h3>${g.name}</h3><p class="muted">${g.address}</p><button class="btn primary" data-gym="${g.id}">Entrar</button></div>`).join('');
  root.innerHTML = `<div class="center"><div class="hero"><h1>Multi-Gym Admin Hub</h1><p>Elegí un gimnasio para operar.</p></div><div class="grid">${cards}</div></div>`;
  root.querySelectorAll('[data-gym]').forEach((b) => b.onclick = () => { setCurrentGym(b.dataset.gym); go(`/${b.dataset.gym}/home`); });
}

export function homePage(root, gymId) {
  const members = byGym(gymId);
  const sales = db().sales.filter((s) => s.gymId === gymId);
  root.innerHTML = appLayout({ gymId, title: 'Home', active: 'home', body: `<div class="hero"><h2>Dashboard ${gymId}</h2><p class="muted">Horarios según sucursal. Consultá por WhatsApp.</p></div>
  <div class="grid-3"><div class="panel"><div class="kpi">${members.length}</div><div class="muted">Socios</div></div><div class="panel"><div class="kpi">${members.filter((m) => m.status === 'overdue').length}</div><div class="muted">Morosos</div></div><div class="panel"><div class="kpi">${money(sales.reduce((a, s) => a + s.total, 0))}</div><div class="muted">Ingresos registrados</div></div></div>` });
  bindLayoutEvents();
}

export function membersPage(root, gymId) {
  const rows = byGym(gymId).map((m) => `<tr><td><a href="#/${gymId}/members/${m.id}">${m.fullName}</a></td><td>${m.nextDueDate || '-'}</td><td>${tag(m.status)}</td></tr>`).join('');
  root.innerHTML = appLayout({ gymId, title: 'Simplified Member List', active: 'members', body: `<div class="panel"><a class="btn primary" href="#/${gymId}/members/new">+ Alta de socio</a><table><thead><tr><th>Nombre</th><th>Vence</th><th>Estado</th></tr></thead><tbody>${rows}</tbody></table></div>` });
  bindLayoutEvents();
}

export function memberNewPage(root, gymId) {
  root.innerHTML = appLayout({ gymId, title: 'Add New Member Form', active: 'members', body: `<div class="panel"><label>Nombre y apellido</label><input id="name"/><label>Teléfono</label><input id="phone"/><label>Fecha inicio</label><input id="start" type="date"/><label>Vencimiento</label><input id="due" type="date"/><button id="save" class="btn primary" style="margin-top:.6rem">Guardar</button></div>` });
  bindLayoutEvents();
  document.getElementById('save').onclick = () => {
    const data = db();
    data.members.push({ id: uid('m'), gymId, fullName: document.getElementById('name').value, phone: document.getElementById('phone').value, status: 'active', planName: 'Pase libre', startDate: document.getElementById('start').value, nextDueDate: document.getElementById('due').value });
    save(data); go(`/${gymId}/members`);
  };
}

export function memberProfilePage(root, gymId, memberId) {
  const data = db();
  const m = data.members.find((x) => x.id === memberId && x.gymId === gymId);
  const b = data.biometrics.find((x) => x.memberId === memberId) || { weightKg: '', bodyFatPct: '', musclePct: '' };
  root.innerHTML = appLayout({ gymId, title: 'Member Profile & Biometrics', active: 'members', body: `<div class="panel"><h3>${m.fullName}</h3><p>${tag(m.status)}</p><label>Estado</label><select id="status"><option ${m.status === 'active' ? 'selected' : ''}>active</option><option ${m.status === 'overdue' ? 'selected' : ''}>overdue</option><option ${m.status === 'blocked' ? 'selected' : ''}>blocked</option></select><label>Vencimiento</label><input id="due" type="date" value="${m.nextDueDate || ''}"/></div>
  <div class="panel"><h3>Biometría</h3><label>Peso kg</label><input id="weight" type="number" value="${b.weightKg}"/><label>% Grasa</label><input id="fat" type="number" value="${b.bodyFatPct}"/><label>% Músculo</label><input id="muscle" type="number" value="${b.musclePct}"/><button id="save" class="btn primary" style="margin-top:.6rem">Guardar cambios</button></div>` });
  bindLayoutEvents();
  document.getElementById('save').onclick = () => {
    m.status = document.getElementById('status').value;
    m.nextDueDate = document.getElementById('due').value;
    const found = data.biometrics.find((x) => x.memberId === memberId);
    const next = { memberId, weightKg: Number(document.getElementById('weight').value), bodyFatPct: Number(document.getElementById('fat').value), musclePct: Number(document.getElementById('muscle').value), updatedAt: new Date().toISOString().slice(0, 10) };
    if (found) Object.assign(found, next); else data.biometrics.push(next);
    save(data); go('/access-granted');
  };
}

export function notificationsPage(root, gymId) {
  const overdue = byGym(gymId).filter((m) => m.status === 'overdue');
  const rows = overdue.map((m) => `<tr><td>${m.fullName}</td><td>${m.nextDueDate}</td><td><a class="btn" target="_blank" href="https://wa.me/54${m.phone || ''}">WhatsApp</a></td></tr>`).join('');
  root.innerHTML = appLayout({ gymId, title: 'Overdue & Notifications', active: 'notifications', body: `<div class="panel"><table><thead><tr><th>Socio</th><th>Venció</th><th>Acción</th></tr></thead><tbody>${rows || '<tr><td colspan="3">Sin morosos</td></tr>'}</tbody></table></div>` });
  bindLayoutEvents();
}

export function inventoryPage(root, gymId) {
  const items = db().inventory.filter((i) => i.gymId === gymId);
  root.innerHTML = appLayout({ gymId, title: 'Product Inventory Management', active: 'inventory', body: `<div class="panel"><table><thead><tr><th>Producto</th><th>Stock</th><th>Precio</th></tr></thead><tbody>${items.map((i) => `<tr><td>${i.name}</td><td>${i.stock}</td><td>${money(i.price)}</td></tr>`).join('')}</tbody></table></div>` });
  bindLayoutEvents();
}

export function shopPage(root, gymId) {
  const data = db();
  const items = data.inventory.filter((i) => i.gymId === gymId);
  root.innerHTML = appLayout({ gymId, title: 'Hydration & Supplements Shop', active: 'shop', body: `<div class="panel"><p>Venta simulada para demo.</p>${items.map((i) => `<div style="display:flex;justify-content:space-between;margin:.4rem 0"><span>${i.name} (${money(i.price)})</span><button class="btn" data-sell="${i.id}">Agregar</button></div>`).join('')}</div>` });
  bindLayoutEvents();
  root.querySelectorAll('[data-sell]').forEach((b) => b.onclick = () => {
    const item = data.inventory.find((i) => i.id === b.dataset.sell);
    data.sales.push({ id: uid('s'), gymId, memberId: null, items: [{ itemId: item.id, qty: 1, price: item.price }], total: item.price, paidAt: new Date().toISOString().slice(0, 10), method: 'cash' });
    save(data); go(`/${gymId}/receipt`);
  });
}

export function receiptPage(root, gymId) {
  const sale = db().sales.filter((s) => s.gymId === gymId).slice(-1)[0];
  root.innerHTML = appLayout({ gymId, title: 'Digital Payment Receipt', active: 'shop', body: `<div class="panel"><h3>Comprobante digital</h3><p>ID: ${sale?.id || '-'}</p><p>Total: ${money(sale?.total || 0)}</p><p>Método: ${sale?.method || '-'}</p><p>Fecha: ${sale?.paidAt || '-'}</p></div>` });
  bindLayoutEvents();
}

export function cashClosurePage(root, gymId) {
  root.innerHTML = appLayout({ gymId, title: 'Daily Cash Closure', active: 'cash', body: `<div class="panel"><label>Apertura</label><input id="opening" type="number" value="0"/><label>Efectivo entra</label><input id="cashIn" type="number" value="0"/><label>Efectivo sale</label><input id="cashOut" type="number" value="0"/><label>Notas</label><textarea id="notes"></textarea><button id="saveClosure" class="btn primary" style="margin-top:.6rem">Guardar cierre</button></div><div class="panel" id="summary"></div>` });
  bindLayoutEvents();
  const renderSummary = () => {
    const last = db().closures.filter((c) => c.gymId === gymId).slice(-1)[0];
    document.getElementById('summary').innerHTML = last ? `<h3>Último cierre</h3><p>${last.date} · Cierre ${money(last.closing)}</p>` : '<p class="muted">Sin cierres aún.</p>';
  };
  renderSummary();
  document.getElementById('saveClosure').onclick = () => {
    const opening = Number(document.getElementById('opening').value);
    const cashIn = Number(document.getElementById('cashIn').value);
    const cashOut = Number(document.getElementById('cashOut').value);
    const data = db();
    data.closures.push({ id: uid('cc'), gymId, date: new Date().toISOString().slice(0, 10), opening, cashIn, cashOut, closing: opening + cashIn - cashOut, notes: document.getElementById('notes').value });
    save(data); renderSummary();
  };
}

export function reportsPage(root, gymId) {
  const month = new Date().toISOString().slice(0, 7);
  const rows = db().sales.filter((s) => s.gymId === gymId && s.paidAt.startsWith(month));
  const total = rows.reduce((a, s) => a + s.total, 0);
  root.innerHTML = appLayout({ gymId, title: 'Monthly Revenue Report', active: 'reports', body: `<div class="panel"><h3>Total mes ${month}</h3><div class="kpi">${money(total)}</div><table><thead><tr><th>Venta</th><th>Fecha</th><th>Total</th></tr></thead><tbody>${rows.map((s) => `<tr><td>${s.id}</td><td>${s.paidAt}</td><td>${money(s.total)}</td></tr>`).join('')}</tbody></table></div>` });
  bindLayoutEvents();
}

export function settingsPage(root, gymId) {
  root.innerHTML = appLayout({ gymId, title: 'System Settings', active: 'settings', body: `<div class="panel"><p>Ajustes MVP</p><button id="reset" class="btn warn">Reset demo data</button></div>` });
  bindLayoutEvents();
  document.getElementById('reset').onclick = () => { resetDB(); alert('Datos reiniciados'); };
}

export function accessGranted(root) { root.innerHTML = `<div class="center panel success"><h1>Access Granted</h1><p>Operación realizada correctamente.</p><a class="btn primary" href="#/login">Volver</a></div>`; }
export function accessDenied(root) { root.innerHTML = `<div class="center panel danger"><h1>Access Denied</h1><p>No tenés permisos para esta sección.</p><a class="btn" href="#/login">Volver</a></div>`; }

export function ensureStaffRestrictions(route, gymId) {
  const u = currentUser();
  if (!u) return false;
  if (u.role === 'staff' && route.endsWith('/settings')) {
    go('/access-denied');
    return true;
  }
  return false;
}

export function ensureSessionRoot() {
  const s = session();
  if (!s) return go('/login');
  const u = currentUser();
  if (u.role === 'super' && !s.gymId) return go('/hub');
  if (u.role === 'staff') return go(`/${u.gymIds[0]}/home`);
}
