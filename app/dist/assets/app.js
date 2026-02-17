// src/data/seeds.js
const seeds = {
  gyms: [
    { id: 'espartano', name: 'Gym Espartano', address: 'Av. Fuerza 123', phone: '+54 9 11 1111-1111' },
    { id: 'centro', name: 'Infinit Centro', address: 'Calle Central 456', phone: '+54 9 11 2222-2222' }
  ],
  admins: [
    { id: 'u-super', email: 'super@gym.local', passwordHash: 'super123', role: 'super', gymIds: ['espartano', 'centro'] },
    { id: 'u-staff', email: 'staff@gym.local', passwordHash: 'staff123', role: 'staff', gymIds: ['espartano'] }
  ],
  members: [
    { id: 'm1', gymId: 'espartano', fullName: 'Juan Pérez', phone: '111', status: 'active', planName: 'Pase libre', startDate: '2026-01-01', nextDueDate: '2026-02-28' },
    { id: 'm2', gymId: 'espartano', fullName: 'Ana Ruiz', phone: '112', status: 'overdue', planName: 'Pase libre', startDate: '2026-01-10', nextDueDate: '2026-01-31' },
    { id: 'm3', gymId: 'espartano', fullName: 'Marcos Diaz', phone: '113', status: 'active', planName: 'Pase libre', startDate: '2026-01-15', nextDueDate: '2026-03-05' },
    { id: 'm4', gymId: 'espartano', fullName: 'Lucía Soto', phone: '114', status: 'blocked', planName: 'Pase libre', startDate: '2026-01-20', nextDueDate: '2026-01-25' },
    { id: 'm5', gymId: 'espartano', fullName: 'Pablo Arias', phone: '115', status: 'active', planName: 'Pase libre', startDate: '2026-02-01', nextDueDate: '2026-03-01' },
    { id: 'm6', gymId: 'centro', fullName: 'Caro Núñez', phone: '211', status: 'active', planName: 'Pase libre', startDate: '2026-01-05', nextDueDate: '2026-02-25' },
    { id: 'm7', gymId: 'centro', fullName: 'Diego Paz', phone: '212', status: 'overdue', planName: 'Pase libre', startDate: '2026-01-07', nextDueDate: '2026-01-30' },
    { id: 'm8', gymId: 'centro', fullName: 'Juli Mena', phone: '213', status: 'active', planName: 'Pase libre', startDate: '2026-01-12', nextDueDate: '2026-03-02' },
    { id: 'm9', gymId: 'centro', fullName: 'Nora Giménez', phone: '214', status: 'active', planName: 'Pase libre', startDate: '2026-01-18', nextDueDate: '2026-03-10' },
    { id: 'm10', gymId: 'centro', fullName: 'Sergio Mora', phone: '215', status: 'overdue', planName: 'Pase libre', startDate: '2026-01-25', nextDueDate: '2026-02-02' }
  ],
  biometrics: [{ memberId: 'm1', weightKg: 82, bodyFatPct: 20, musclePct: 39, updatedAt: '2026-02-01' }],
  inventory: [
    { id: 'i1', gymId: 'espartano', name: 'Powerade', stock: 20, price: 1800 },
    { id: 'i2', gymId: 'espartano', name: 'Monster', stock: 12, price: 2300 },
    { id: 'i3', gymId: 'espartano', name: 'Whey 1kg', stock: 6, price: 35000 },
    { id: 'i4', gymId: 'centro', name: 'Agua', stock: 30, price: 1200 },
    { id: 'i5', gymId: 'centro', name: 'Creatina', stock: 8, price: 28000 }
  ],
  sales: [
    { id: 's1', gymId: 'espartano', memberId: 'm1', items: [{ itemId: 'i1', qty: 1, price: 1800 }], total: 1800, paidAt: '2026-02-01', method: 'cash' },
    { id: 's2', gymId: 'espartano', memberId: 'm2', items: [{ itemId: 'i2', qty: 2, price: 2300 }], total: 4600, paidAt: '2026-02-03', method: 'card' },
    { id: 's3', gymId: 'centro', memberId: 'm6', items: [{ itemId: 'i4', qty: 2, price: 1200 }], total: 2400, paidAt: '2026-02-05', method: 'mp' },
    { id: 's4', gymId: 'centro', memberId: 'm7', items: [{ itemId: 'i5', qty: 1, price: 28000 }], total: 28000, paidAt: '2026-02-06', method: 'cash' },
    { id: 's5', gymId: 'espartano', memberId: null, items: [{ itemId: 'i3', qty: 1, price: 35000 }], total: 35000, paidAt: '2026-02-07', method: 'card' }
  ],
  closures: [],
  notifications: []
};

// src/data/storage.js
const KEY = 'gym-mvp-v2-db';

const clone = (v) => JSON.parse(JSON.stringify(v));

function initDB() {
  if (!localStorage.getItem(KEY)) localStorage.setItem(KEY, JSON.stringify(seeds));
}

function db() {
  return JSON.parse(localStorage.getItem(KEY));
}

function save(next) {
  localStorage.setItem(KEY, JSON.stringify(next));
}

function resetDB() {
  localStorage.setItem(KEY, JSON.stringify(clone(seeds)));
}

function uid(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

// src/core/auth.js
const SESSION_KEY = 'gym-mvp-session';

function login(email, password) {
  const user = db().admins.find((u) => u.email === email && u.passwordHash === password);
  if (!user) return null;
  const session = { userId: user.id, gymId: user.role === 'staff' ? user.gymIds[0] : null };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

function logout() {
  localStorage.removeItem(SESSION_KEY);
}

function session() {
  return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
}

function currentUser() {
  const s = session();
  if (!s) return null;
  return db().admins.find((u) => u.id === s.userId) || null;
}

function setCurrentGym(gymId) {
  const s = session();
  if (!s) return;
  localStorage.setItem(SESSION_KEY, JSON.stringify({ ...s, gymId }));
}

// src/core/router.js
function parseRoute() {
  const h = window.location.hash.replace(/^#/, '') || '/login';
  return h;
}

function go(path) {
  window.location.hash = path;
}

function requireAuth() {
  if (!session()) {
    go('/login');
    return false;
  }
  return true;
}

function canAccessGym(gymId) {
  const user = currentUser();
  if (!user) return false;
  return user.role === 'super' || user.gymIds.includes(gymId);
}

function denyIfNoAccess(gymId) {
  if (!canAccessGym(gymId)) {
    go('/access-denied');
    return true;
  }
  return false;
}

// src/components/layout.js
function appLayout({ gymId, title, body, active }) {
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

function bindLayoutEvents() {
  const b = document.getElementById('logout-btn');
  if (b) b.onclick = () => {
    logout();
    window.location.hash = '/login';
  };
}

const money = (n) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);

// src/pages/screens.js
const tag = (s) => `<span class="tag ${s === 'active' ? 'ok' : 'bad'}">${s}</span>`;
const byGym = (gymId) => db().members.filter((m) => m.gymId === gymId);

function loginPage(root) {
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

function hubPage(root) {
  const data = db();
  const cards = data.gyms.map((g) => `<div class="panel"><h3>${g.name}</h3><p class="muted">${g.address}</p><button class="btn primary" data-gym="${g.id}">Entrar</button></div>`).join('');
  root.innerHTML = `<div class="center"><div class="hero"><h1>Multi-Gym Admin Hub</h1><p>Elegí un gimnasio para operar.</p></div><div class="grid">${cards}</div></div>`;
  root.querySelectorAll('[data-gym]').forEach((b) => b.onclick = () => { setCurrentGym(b.dataset.gym); go(`/${b.dataset.gym}/home`); });
}

function homePage(root, gymId) {
  const members = byGym(gymId);
  const sales = db().sales.filter((s) => s.gymId === gymId);
  root.innerHTML = appLayout({ gymId, title: 'Home', active: 'home', body: `<div class="hero"><h2>Dashboard ${gymId}</h2><p class="muted">Horarios según sucursal. Consultá por WhatsApp.</p></div>
  <div class="grid-3"><div class="panel"><div class="kpi">${members.length}</div><div class="muted">Socios</div></div><div class="panel"><div class="kpi">${members.filter((m) => m.status === 'overdue').length}</div><div class="muted">Morosos</div></div><div class="panel"><div class="kpi">${money(sales.reduce((a, s) => a + s.total, 0))}</div><div class="muted">Ingresos registrados</div></div></div>` });
  bindLayoutEvents();
}

function membersPage(root, gymId) {
  const rows = byGym(gymId).map((m) => `<tr><td><a href="#/${gymId}/members/${m.id}">${m.fullName}</a></td><td>${m.nextDueDate || '-'}</td><td>${tag(m.status)}</td></tr>`).join('');
  root.innerHTML = appLayout({ gymId, title: 'Simplified Member List', active: 'members', body: `<div class="panel"><a class="btn primary" href="#/${gymId}/members/new">+ Alta de socio</a><table><thead><tr><th>Nombre</th><th>Vence</th><th>Estado</th></tr></thead><tbody>${rows}</tbody></table></div>` });
  bindLayoutEvents();
}

function memberNewPage(root, gymId) {
  root.innerHTML = appLayout({ gymId, title: 'Add New Member Form', active: 'members', body: `<div class="panel"><label>Nombre y apellido</label><input id="name"/><label>Teléfono</label><input id="phone"/><label>Fecha inicio</label><input id="start" type="date"/><label>Vencimiento</label><input id="due" type="date"/><button id="save" class="btn primary" style="margin-top:.6rem">Guardar</button></div>` });
  bindLayoutEvents();
  document.getElementById('save').onclick = () => {
    const data = db();
    data.members.push({ id: uid('m'), gymId, fullName: document.getElementById('name').value, phone: document.getElementById('phone').value, status: 'active', planName: 'Pase libre', startDate: document.getElementById('start').value, nextDueDate: document.getElementById('due').value });
    save(data); go(`/${gymId}/members`);
  };
}

function memberProfilePage(root, gymId, memberId) {
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

function notificationsPage(root, gymId) {
  const overdue = byGym(gymId).filter((m) => m.status === 'overdue');
  const rows = overdue.map((m) => `<tr><td>${m.fullName}</td><td>${m.nextDueDate}</td><td><a class="btn" target="_blank" href="https://wa.me/54${m.phone || ''}">WhatsApp</a></td></tr>`).join('');
  root.innerHTML = appLayout({ gymId, title: 'Overdue & Notifications', active: 'notifications', body: `<div class="panel"><table><thead><tr><th>Socio</th><th>Venció</th><th>Acción</th></tr></thead><tbody>${rows || '<tr><td colspan="3">Sin morosos</td></tr>'}</tbody></table></div>` });
  bindLayoutEvents();
}

function inventoryPage(root, gymId) {
  const items = db().inventory.filter((i) => i.gymId === gymId);
  root.innerHTML = appLayout({ gymId, title: 'Product Inventory Management', active: 'inventory', body: `<div class="panel"><table><thead><tr><th>Producto</th><th>Stock</th><th>Precio</th></tr></thead><tbody>${items.map((i) => `<tr><td>${i.name}</td><td>${i.stock}</td><td>${money(i.price)}</td></tr>`).join('')}</tbody></table></div>` });
  bindLayoutEvents();
}

function shopPage(root, gymId) {
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

function receiptPage(root, gymId) {
  const sale = db().sales.filter((s) => s.gymId === gymId).slice(-1)[0];
  root.innerHTML = appLayout({ gymId, title: 'Digital Payment Receipt', active: 'shop', body: `<div class="panel"><h3>Comprobante digital</h3><p>ID: ${sale?.id || '-'}</p><p>Total: ${money(sale?.total || 0)}</p><p>Método: ${sale?.method || '-'}</p><p>Fecha: ${sale?.paidAt || '-'}</p></div>` });
  bindLayoutEvents();
}

function cashClosurePage(root, gymId) {
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

function reportsPage(root, gymId) {
  const month = new Date().toISOString().slice(0, 7);
  const rows = db().sales.filter((s) => s.gymId === gymId && s.paidAt.startsWith(month));
  const total = rows.reduce((a, s) => a + s.total, 0);
  root.innerHTML = appLayout({ gymId, title: 'Monthly Revenue Report', active: 'reports', body: `<div class="panel"><h3>Total mes ${month}</h3><div class="kpi">${money(total)}</div><table><thead><tr><th>Venta</th><th>Fecha</th><th>Total</th></tr></thead><tbody>${rows.map((s) => `<tr><td>${s.id}</td><td>${s.paidAt}</td><td>${money(s.total)}</td></tr>`).join('')}</tbody></table></div>` });
  bindLayoutEvents();
}

function settingsPage(root, gymId) {
  root.innerHTML = appLayout({ gymId, title: 'System Settings', active: 'settings', body: `<div class="panel"><p>Ajustes MVP</p><button id="reset" class="btn warn">Reset demo data</button></div>` });
  bindLayoutEvents();
  document.getElementById('reset').onclick = () => { resetDB(); alert('Datos reiniciados'); };
}

function accessGranted(root) { root.innerHTML = `<div class="center panel success"><h1>Access Granted</h1><p>Operación realizada correctamente.</p><a class="btn primary" href="#/login">Volver</a></div>`; }
function accessDenied(root) { root.innerHTML = `<div class="center panel danger"><h1>Access Denied</h1><p>No tenés permisos para esta sección.</p><a class="btn" href="#/login">Volver</a></div>`; }

function ensureStaffRestrictions(route, gymId) {
  const u = currentUser();
  if (!u) return false;
  if (u.role === 'staff' && route.endsWith('/settings')) {
    go('/access-denied');
    return true;
  }
  return false;
}

function ensureSessionRoot() {
  const s = session();
  if (!s) return go('/login');
  const u = currentUser();
  if (u.role === 'super' && !s.gymId) return go('/hub');
  if (u.role === 'staff') return go(`/${u.gymIds[0]}/home`);
}

// src/main.js
const app = document.getElementById('app');
initDB();

function render() {
  const route = parseRoute();
  if (route === '/login') return loginPage(app);
  if (route === '/access-granted') return accessGranted(app);
  if (route === '/access-denied') return accessDenied(app);

  if (!requireAuth()) return;
  if (route === '/' || route === '') return ensureSessionRoot();
  if (route === '/hub') {
    if (currentUser().role !== 'super') return go('/access-denied');
    return hubPage(app);
  }

  const m = route.match(/^\/([^/]+)\/(home|members|notifications|cash-closure|inventory|shop|receipt|reports\/monthly|settings)(?:\/([^/]+))?$/);
  if (m) {
    const gymId = m[1];
    const section = m[2];
    const extra = m[3];
    if (denyIfNoAccess(gymId)) return;
    if (ensureStaffRestrictions(route, gymId)) return;
    if (section === 'home') return homePage(app, gymId);
    if (section === 'members' && !extra) return membersPage(app, gymId);
    if (section === 'members' && extra === 'new') return memberNewPage(app, gymId);
    if (section === 'members' && extra) return memberProfilePage(app, gymId, extra);
    if (section === 'notifications') return notificationsPage(app, gymId);
    if (section === 'cash-closure') return cashClosurePage(app, gymId);
    if (section === 'inventory') return inventoryPage(app, gymId);
    if (section === 'shop') return shopPage(app, gymId);
    if (section === 'receipt') return receiptPage(app, gymId);
    if (section === 'reports/monthly') return reportsPage(app, gymId);
    if (section === 'settings') return settingsPage(app, gymId);
  }

  app.innerHTML = '<div class="center panel"><h2>Ruta no encontrada</h2><a class="btn" href="#/login">Ir a login</a></div>';
}

window.addEventListener('hashchange', render);
render();

