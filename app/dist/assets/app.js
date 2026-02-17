// src/data/seeds.js
const seeds = {
  gyms: [
    { id: 'espartano', name: 'Gym Espartano', address: 'Av. Fuerza 123', phone: '+54 9 11 1111-1111' },
    { id: 'centro', name: 'Infinit Centro', address: 'Calle Central 456', phone: '+54 9 11 2222-2222' }
  ],
  admins: [
    { id: 'u-super', email: 'user', passwordHash: 'admin', role: 'super', gymIds: ['espartano', 'centro'] },
    { id: 'u-staff', email: 'staff', passwordHash: 'admin', role: 'staff', gymIds: ['espartano'] }
  ],
  members: [
    { id: 'm1', gymId: 'espartano', fullName: 'Juan Pérez', phone: '111', status: 'active', planName: 'Pase libre', startDate: '2026-01-01', nextDueDate: '2026-02-28', isEnrolled: true },
    { id: 'm2', gymId: 'espartano', fullName: 'Ana Ruiz', phone: '112', status: 'overdue', planName: 'Pase libre', startDate: '2026-01-10', nextDueDate: '2026-01-31', isEnrolled: false },
    { id: 'm3', gymId: 'espartano', fullName: 'Marcos Diaz', phone: '113', status: 'active', planName: 'Pase libre', startDate: '2026-01-15', nextDueDate: '2026-03-05', isEnrolled: true },
    { id: 'm4', gymId: 'espartano', fullName: 'Lucía Soto', phone: '114', status: 'blocked', planName: 'Pase libre', startDate: '2026-01-20', nextDueDate: '2026-01-25', isEnrolled: false },
    { id: 'm5', gymId: 'espartano', fullName: 'Pablo Arias', phone: '115', status: 'active', planName: 'Pase libre', startDate: '2026-02-01', nextDueDate: '2026-03-01', isEnrolled: true },
    { id: 'm6', gymId: 'centro', fullName: 'Caro Núñez', phone: '211', status: 'active', planName: 'Pase libre', startDate: '2026-01-05', nextDueDate: '2026-02-25', isEnrolled: true },
    { id: 'm7', gymId: 'centro', fullName: 'Diego Paz', phone: '212', status: 'overdue', planName: 'Pase libre', startDate: '2026-01-07', nextDueDate: '2026-01-30', isEnrolled: false },
    { id: 'm8', gymId: 'centro', fullName: 'Juli Mena', phone: '213', status: 'active', planName: 'Pase libre', startDate: '2026-01-12', nextDueDate: '2026-03-02', isEnrolled: true },
    { id: 'm9', gymId: 'centro', fullName: 'Nora Giménez', phone: '214', status: 'active', planName: 'Pase libre', startDate: '2026-01-18', nextDueDate: '2026-03-10', isEnrolled: false },
    { id: 'm10', gymId: 'centro', fullName: 'Sergio Mora', phone: '215', status: 'overdue', planName: 'Pase libre', startDate: '2026-01-25', nextDueDate: '2026-02-02', isEnrolled: true }
  ],
  biometrics: [{ memberId: 'm1', weightKg: 82, bodyFatPct: 20, musclePct: 39, updatedAt: '2026-02-01' }],
  inventory: [
    { id: 'i1', gymId: 'espartano', name: 'Agua', stock: 45, price: 1200 },
    { id: 'i2', gymId: 'espartano', name: 'Bebida isotónica', stock: 26, price: 1800 },
    { id: 'i3', gymId: 'espartano', name: 'Proteína whey 1kg', stock: 9, price: 35000 },
    { id: 'i4', gymId: 'espartano', name: 'Barra proteica', stock: 30, price: 2200 },
    { id: 'i5', gymId: 'centro', name: 'Agua', stock: 40, price: 1200 },
    { id: 'i6', gymId: 'centro', name: 'Bebida isotónica', stock: 24, price: 1800 },
    { id: 'i7', gymId: 'centro', name: 'Creatina 300g', stock: 12, price: 28000 },
    { id: 'i8', gymId: 'centro', name: 'Barra proteica', stock: 28, price: 2200 }
  ],
  sales: [
    { id: 's1', gymId: 'espartano', memberId: 'm1', items: [{ itemId: 'i2', name: 'Bebida isotónica', qty: 1, price: 1800, subtotal: 1800 }], total: 1800, paidAt: '2026-02-01', method: 'cash', type: 'product', receiptNumber: 1 },
    { id: 's2', gymId: 'espartano', memberId: 'm2', items: [{ itemId: 'i4', name: 'Barra proteica', qty: 2, price: 2200, subtotal: 4400 }], total: 4400, paidAt: '2026-02-03', method: 'card', type: 'product', receiptNumber: 2 },
    { id: 's3', gymId: 'centro', memberId: 'm6', items: [{ itemId: 'i5', name: 'Agua', qty: 2, price: 1200, subtotal: 2400 }], total: 2400, paidAt: '2026-02-05', method: 'transfer', type: 'product', receiptNumber: 3 },
    { id: 's4', gymId: 'centro', memberId: 'm7', items: [{ itemId: 'i7', name: 'Creatina 300g', qty: 1, price: 28000, subtotal: 28000 }], total: 28000, paidAt: '2026-02-06', method: 'cash', type: 'product', receiptNumber: 1 },
    { id: 's5', gymId: 'espartano', memberId: null, items: [{ itemId: 'i3', name: 'Proteína whey 1kg', qty: 1, price: 35000, subtotal: 35000 }], total: 35000, paidAt: '2026-02-07', method: 'card', type: 'product', receiptNumber: 5 }
  ],
  closures: [],
  notifications: [],
  receiptCounter: 5
};

// src/data/storage.js
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

function initDB() {
  const initial = localStorage.getItem(KEY) ? JSON.parse(localStorage.getItem(KEY)) : seeds;
  localStorage.setItem(KEY, JSON.stringify(normalizeData(initial)));
}

function db() {
  return normalizeData(JSON.parse(localStorage.getItem(KEY)));
}

function save(next) {
  localStorage.setItem(KEY, JSON.stringify(normalizeData(next)));
}

function replaceAllData(next) {
  localStorage.clear();
  localStorage.setItem(KEY, JSON.stringify(normalizeData(next)));
}

function resetDB() {
  localStorage.setItem(KEY, JSON.stringify(normalizeData(clone(seeds))));
}

function nextReceiptNumber(state) {
  const next = normalizeData(state);
  next.receiptCounter += 1;
  return { state: next, receiptNumber: next.receiptCounter };
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
const todayISO = () => new Date().toISOString().slice(0, 10);
const plusDaysFromToday = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};
const paymentOptions = [
  { value: 'cash', label: 'Efectivo' },
  { value: 'transfer', label: 'Transferencia' },
  { value: 'card', label: 'Tarjeta' },
  { value: 'mp', label: 'Mercado Pago' }
];
const receiptLabel = (n) => `Comprobante N° ${String(n || 0).padStart(6, '0')}`;

function loginPage(root) {
  root.innerHTML = `<div class="center panel"><h1>Unified Admin Login</h1><p class="muted">Usuarios demo: user / admin, staff / admin</p>
  <label>Email</label><input id="email" value="user"/>
  <label>Password</label><input id="password" type="password" value="admin"/>
  <button id="login" class="btn primary big" style="margin-top:.7rem">Ingresar</button></div>`;
  document.getElementById('login').onclick = () => {
    const s = login(document.getElementById('email').value, document.getElementById('password').value);
    if (!s) return alert('Credenciales inválidas');
    const u = currentUser();
    if (u.role === 'super') go('/hub'); else go(`/${s.gymId}/home`);
  };
}

function hubPage(root) {
  const data = db();
  const cards = data.gyms.map((g) => `<div class="panel"><h3>${g.name}</h3><p class="muted">${g.address}</p><button class="btn primary big" data-gym="${g.id}">Entrar</button></div>`).join('');
  root.innerHTML = `<div class="center"><div class="hero"><h1>Multi-Gym Admin Hub</h1><p>Elegí un gimnasio para operar.</p></div><div class="grid">${cards}</div></div>`;
  root.querySelectorAll('[data-gym]').forEach((b) => b.onclick = () => { setCurrentGym(b.dataset.gym); go(`/${b.dataset.gym}/home`); });
}

function homePage(root, gymId) {
  const members = byGym(gymId);
  const sales = db().sales.filter((s) => s.gymId === gymId);
  root.innerHTML = appLayout({ gymId, title: 'Home', active: 'home', body: `<div class="hero"><h2>Dashboard ${gymId}</h2><p class="muted">Horarios según sucursal. Consultá por WhatsApp.</p></div>
  <div class="grid-3"><div class="panel"><div class="kpi">${members.length}</div><div class="muted">Socios</div></div><div class="panel"><div class="kpi">${members.filter((m) => m.status === 'overdue').length}</div><div class="muted">Morosos</div></div><div class="panel"><div class="kpi">${money(sales.reduce((a, s) => a + s.total, 0))}</div><div class="muted">Ingresos registrados</div></div></div>
  <div class="panel action-row"><a class="btn primary big" href="#/${gymId}/membership-charge">COBRAR CUOTA</a><a class="btn big" href="#/${gymId}/shop">VENDER PRODUCTOS</a></div>` });
  bindLayoutEvents();
}

function membersPage(root, gymId) {
  const members = byGym(gymId);
  const rows = members.map((m) => `<tr><td><a href="#/${gymId}/members/${m.id}">${m.fullName}</a></td><td>${m.nextDueDate || '-'}</td><td>${m.isEnrolled ? 'Sí' : 'No'}</td><td>${tag(m.status)}</td><td><button class="btn big" data-renew="${m.id}">Renovar mes</button></td></tr>`).join('');
  root.innerHTML = appLayout({ gymId, title: 'Simplified Member List', active: 'members', body: `<div class="panel"><a class="btn primary" href="#/${gymId}/members/new">+ Alta de socio</a><table><thead><tr><th>Nombre</th><th>Vence</th><th>Inscripto</th><th>Estado</th><th>Acción</th></tr></thead><tbody>${rows}</tbody></table><p id="members-error" class="error-text"></p></div>
  <div id="renew-modal" class="modal hidden"><div class="modal-card panel"><h3>Renovar mensualidad</h3><p id="renew-text"></p><label>Método</label><select id="renew-method">${paymentOptions.map((p) => `<option value="${p.value}">${p.label}</option>`).join('')}</select><div class="modal-actions"><button id="renew-cancel" class="btn">Cancelar</button><button id="renew-confirm" class="btn primary big">Confirmar</button></div></div></div>` });
  bindLayoutEvents();

  const modal = document.getElementById('renew-modal');
  const closeModal = () => modal.classList.add('hidden');
  const openModal = () => modal.classList.remove('hidden');
  const error = document.getElementById('members-error');
  let memberId = '';

  root.querySelectorAll('[data-renew]').forEach((btn) => {
    btn.onclick = () => {
      memberId = btn.dataset.renew;
      const member = members.find((m) => m.id === memberId);
      document.getElementById('renew-text').textContent = `¿Confirmás renovación mensual por ${money(35000)} para ${member.fullName}?`;
      openModal();
    };
  });

  const confirmRenew = () => {
    const method = document.getElementById('renew-method').value;
    const fresh = db();
    const member = fresh.members.find((m) => m.id === memberId && m.gymId === gymId);
    if (!member) return;
    member.nextDueDate = plusDaysFromToday(30);
    member.status = 'active';

    const receipt = nextReceiptNumber(fresh);
    const sale = {
      id: uid('s'),
      gymId,
      memberId,
      items: [{ itemId: 'monthly', name: 'Mensualidad', qty: 1, price: 35000, subtotal: 35000 }],
      total: 35000,
      paidAt: todayISO(),
      method,
      type: 'membership',
      receiptNumber: receipt.receiptNumber
    };
    receipt.state.sales.push(sale);
    save(receipt.state);
    closeModal();
    go(`/${gymId}/receipt/${sale.id}`);
  };

  document.getElementById('renew-cancel').onclick = closeModal;
  document.getElementById('renew-confirm').onclick = confirmRenew;

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
    if (e.key === 'Enter' && !modal.classList.contains('hidden')) confirmRenew();
    if (e.key === 'Escape') error.textContent = '';
  });
}

function memberNewPage(root, gymId) {
  root.innerHTML = appLayout({ gymId, title: 'Add New Member Form', active: 'members', body: `<div class="panel"><label>Nombre y apellido</label><input id="name"/><label>Teléfono</label><input id="phone"/><label>Fecha inicio</label><input id="start" type="date"/><label>Vencimiento</label><input id="due" type="date"/><button id="save" class="btn primary big" style="margin-top:.6rem">Guardar</button></div>` });
  bindLayoutEvents();
  document.getElementById('save').onclick = () => {
    const data = db();
    data.members.push({ id: uid('m'), gymId, fullName: document.getElementById('name').value, phone: document.getElementById('phone').value, status: 'active', planName: 'Pase libre', startDate: document.getElementById('start').value, nextDueDate: document.getElementById('due').value, isEnrolled: false });
    save(data); go(`/${gymId}/members`);
  };
}

function memberProfilePage(root, gymId, memberId) {
  const data = db();
  const m = data.members.find((x) => x.id === memberId && x.gymId === gymId);
  const b = data.biometrics.find((x) => x.memberId === memberId) || { weightKg: '', bodyFatPct: '', musclePct: '' };
  root.innerHTML = appLayout({ gymId, title: 'Member Profile & Biometrics', active: 'members', body: `<div class="panel"><h3>${m.fullName}</h3><p>${tag(m.status)} · Inscripto: <strong>${m.isEnrolled ? 'Sí' : 'No'}</strong></p><label>Estado</label><select id="status"><option ${m.status === 'active' ? 'selected' : ''}>active</option><option ${m.status === 'overdue' ? 'selected' : ''}>overdue</option><option ${m.status === 'blocked' ? 'selected' : ''}>blocked</option></select><label>Vencimiento</label><input id="due" type="date" value="${m.nextDueDate || ''}"/><a class="btn primary big" style="margin-top:.8rem" href="#/${gymId}/membership-charge/${m.id}">Cobrar cuota</a></div>
  <div class="panel"><h3>Biometría</h3><label>Peso kg</label><input id="weight" type="number" value="${b.weightKg}"/><label>% Grasa</label><input id="fat" type="number" value="${b.bodyFatPct}"/><label>% Músculo</label><input id="muscle" type="number" value="${b.musclePct}"/><button id="save" class="btn primary big" style="margin-top:.6rem">Guardar cambios</button></div>` });
  bindLayoutEvents();
  document.getElementById('save').onclick = () => {
    m.status = document.getElementById('status').value;
    m.nextDueDate = document.getElementById('due').value;
    const found = data.biometrics.find((x) => x.memberId === memberId);
    const next = { memberId, weightKg: Number(document.getElementById('weight').value), bodyFatPct: Number(document.getElementById('fat').value), musclePct: Number(document.getElementById('muscle').value), updatedAt: todayISO() };
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
  const render = () => {
    const data = db();
    const items = data.inventory.filter((i) => i.gymId === gymId);
    root.innerHTML = appLayout({ gymId, title: 'Product Inventory Management', active: 'inventory', body: `<div class="panel"><button id="add-product" class="btn primary big">+ Agregar producto</button><table><thead><tr><th>Producto</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr></thead><tbody>${items.map((i) => `<tr><td>${i.name}</td><td>${money(i.price)}</td><td>${i.stock}</td><td><div class="action-row"><button class="btn big" data-edit="${i.id}">Editar</button><button class="btn big" data-plus10="${i.id}">+10</button><button class="btn big" data-minus10="${i.id}">-10</button></div></td></tr>`).join('')}</tbody></table><p id="inv-error" class="error-text"></p></div>
    <div id="inv-modal" class="modal hidden"><div class="modal-card panel"><h3 id="inv-title">Producto</h3><label>Nombre</label><input id="inv-name"/><label>Precio</label><input id="inv-price" type="number" min="0"/><label>Stock</label><input id="inv-stock" type="number" min="0" step="1"/><p id="inv-modal-error" class="error-text"></p><div class="modal-actions"><button id="inv-cancel" class="btn">Cancelar</button><button id="inv-save" class="btn primary big">Guardar</button></div></div></div>` });
    bindLayoutEvents();

    const modal = document.getElementById('inv-modal');
    const closeModal = () => modal.classList.add('hidden');
    const openModal = () => modal.classList.remove('hidden');
    const err = document.getElementById('inv-error');
    const modalErr = document.getElementById('inv-modal-error');
    let editingId = '';

    const saveProduct = () => {
      modalErr.textContent = '';
      const fresh = db();
      const name = document.getElementById('inv-name').value.trim();
      const price = Number(document.getElementById('inv-price').value);
      const stock = Number(document.getElementById('inv-stock').value);
      if (!name || price < 0 || stock < 0 || !Number.isInteger(stock)) {
        modalErr.textContent = 'Completá nombre, precio y stock válidos.';
        return;
      }
      if (editingId) {
        const prod = fresh.inventory.find((p) => p.id === editingId && p.gymId === gymId);
        Object.assign(prod, { name, price, stock });
      } else {
        fresh.inventory.push({ id: uid('i'), gymId, name, price, stock });
      }
      save(fresh);
      err.textContent = '';
      closeModal();
      render();
    };

    document.getElementById('add-product').onclick = () => {
      editingId = '';
      document.getElementById('inv-title').textContent = 'Agregar producto';
      document.getElementById('inv-name').value = '';
      document.getElementById('inv-price').value = '0';
      document.getElementById('inv-stock').value = '0';
      modalErr.textContent = '';
      openModal();
    };

    root.querySelectorAll('[data-edit]').forEach((b) => b.onclick = () => {
      const fresh = db();
      const p = fresh.inventory.find((x) => x.id === b.dataset.edit && x.gymId === gymId);
      editingId = p.id;
      document.getElementById('inv-title').textContent = 'Editar producto';
      document.getElementById('inv-name').value = p.name;
      document.getElementById('inv-price').value = p.price;
      document.getElementById('inv-stock').value = p.stock;
      modalErr.textContent = '';
      openModal();
    });

    root.querySelectorAll('[data-plus10]').forEach((b) => b.onclick = () => {
      const fresh = db();
      const p = fresh.inventory.find((x) => x.id === b.dataset.plus10 && x.gymId === gymId);
      p.stock += 10;
      save(fresh);
      render();
    });

    root.querySelectorAll('[data-minus10]').forEach((b) => b.onclick = () => {
      const fresh = db();
      const p = fresh.inventory.find((x) => x.id === b.dataset.minus10 && x.gymId === gymId);
      if (p.stock - 10 < 0) {
        err.textContent = `No se puede bajar de 0 en ${p.name}.`;
        return;
      }
      p.stock -= 10;
      save(fresh);
      render();
    });

    document.getElementById('inv-cancel').onclick = closeModal;
    document.getElementById('inv-save').onclick = saveProduct;

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'Enter' && !modal.classList.contains('hidden')) saveProduct();
    });
  };

  render();
}

function shopPage(root, gymId) {
  const data = db();
  const products = data.inventory.filter((i) => i.gymId === gymId);
  const cart = {};

  root.innerHTML = appLayout({ gymId, title: 'Hydration & Supplements Shop', active: 'shop', body: `<div class="grid pos-grid">
    <div class="panel">
      <h3>Punto de venta</h3>
      ${products.map((p) => `<div class="line-item"><div><strong>${p.name}</strong><div class="muted">${money(p.price)} · Stock ${p.stock}</div></div><div class="qty-controls"><button class="btn big" data-minus="${p.id}">-</button><span id="qty-${p.id}" class="qty-value">0</span><button class="btn primary big" data-plus="${p.id}">+</button></div></div>`).join('')}
    </div>
    <div class="panel">
      <h3>Carrito</h3>
      <div id="cart-rows" class="muted">Sin productos</div>
      <div class="total-box">Total: <span id="cart-total">${money(0)}</span></div>
      <div class="action-row"><button id="clear-cart" class="btn big">Vaciar carrito</button><button id="charge-btn" class="btn primary big">COBRAR</button></div>
      <p id="pos-error" class="error-text"></p>
    </div>
  </div>
  <div id="charge-modal" class="modal hidden"><div class="modal-card panel"><h3>Confirmar cobro</h3><label>Método</label><select id="charge-method">${paymentOptions.filter((p) => p.value !== 'mp').map((m) => `<option value="${m.value}">${m.label}</option>`).join('')}</select><div class="modal-actions"><button id="cancel-charge" class="btn">Cancelar</button><button id="confirm-charge" class="btn primary big">Confirmar cobro</button></div></div></div>` });
  bindLayoutEvents();

  const error = document.getElementById('pos-error');
  const modal = document.getElementById('charge-modal');
  const closeModal = () => modal.classList.add('hidden');
  const openModal = () => modal.classList.remove('hidden');

  const drawCart = () => {
    const rows = Object.entries(cart).filter(([, qty]) => qty > 0).map(([id, qty]) => {
      const p = products.find((x) => x.id === id);
      const subtotal = qty * p.price;
      return { itemId: id, name: p.name, qty, price: p.price, subtotal };
    });
    const total = rows.reduce((a, r) => a + r.subtotal, 0);
    document.getElementById('cart-total').textContent = money(total);
    document.getElementById('cart-rows').innerHTML = rows.length ? `<table><thead><tr><th>Item</th><th>Cant</th><th>Precio</th><th>Sub</th></tr></thead><tbody>${rows.map((r) => `<tr><td>${r.name}</td><td>${r.qty}</td><td>${money(r.price)}</td><td>${money(r.subtotal)}</td></tr>`).join('')}</tbody></table>` : '<span class="muted">Sin productos</span>';
    return { rows, total };
  };

  const resetCart = () => {
    Object.keys(cart).forEach((k) => { cart[k] = 0; const q = document.getElementById(`qty-${k}`); if (q) q.textContent = '0'; });
    drawCart();
  };

  root.querySelectorAll('[data-plus]').forEach((b) => b.onclick = () => {
    const id = b.dataset.plus;
    cart[id] = (cart[id] || 0) + 1;
    document.getElementById(`qty-${id}`).textContent = cart[id];
    drawCart();
  });

  root.querySelectorAll('[data-minus]').forEach((b) => b.onclick = () => {
    const id = b.dataset.minus;
    cart[id] = Math.max((cart[id] || 0) - 1, 0);
    document.getElementById(`qty-${id}`).textContent = cart[id];
    drawCart();
  });

  document.getElementById('clear-cart').onclick = resetCart;
  document.getElementById('cancel-charge').onclick = closeModal;
  document.getElementById('charge-btn').onclick = () => {
    error.textContent = '';
    const { rows } = drawCart();
    if (!rows.length) return (error.textContent = 'Agregá productos antes de cobrar.');
    openModal();
  };

  const confirmCharge = () => {
    const { rows, total } = drawCart();
    if (!rows.length) return;
    const method = document.getElementById('charge-method').value;
    if (!window.confirm(`¿Confirmás el cobro de ${money(total)}?`)) return;

    const fresh = db();
    for (const row of rows) {
      const inv = fresh.inventory.find((i) => i.id === row.itemId && i.gymId === gymId);
      if (!inv || inv.stock < row.qty) {
        closeModal();
        return (error.textContent = `Stock insuficiente para ${row.name}.`);
      }
    }

    rows.forEach((row) => {
      const inv = fresh.inventory.find((i) => i.id === row.itemId && i.gymId === gymId);
      inv.stock -= row.qty;
    });

    const receipt = nextReceiptNumber(fresh);
    const sale = {
      id: uid('s'),
      gymId,
      memberId: null,
      items: rows,
      total,
      paidAt: todayISO(),
      method,
      type: 'product',
      receiptNumber: receipt.receiptNumber
    };

    receipt.state.sales.push(sale);
    save(receipt.state);
    go(`/${gymId}/receipt/${sale.id}`);
  };

  document.getElementById('confirm-charge').onclick = confirmCharge;
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
    if (e.key === 'Enter' && !modal.classList.contains('hidden')) confirmCharge();
  });
}

function membershipChargePage(root, gymId, presetMemberId = '') {
  const data = db();
  const members = data.members.filter((m) => m.gymId === gymId);
  const selected = presetMemberId || (members[0]?.id || '');
  const selectedMember = members.find((m) => m.id === selected);

  root.innerHTML = appLayout({ gymId, title: 'Cobro de cuota', active: 'home', body: `<div class="panel">
    <h3>Recepción · Cobro de cuota</h3>
    <label>Buscar socio</label>
    <input id="member-search" placeholder="Nombre del socio" />
    <label>Socio</label>
    <select id="member-select">${members.map((m) => `<option value="${m.id}" ${m.id === selected ? 'selected' : ''}>${m.fullName}</option>`).join('')}</select>
    <label><input id="enroll-check" type="checkbox" ${selectedMember && !selectedMember.isEnrolled ? 'checked' : ''}/> Incluir inscripción (${money(10000)})</label>
    <label>Mensualidad</label>
    <input id="amount" type="number" value="35000" min="0" />
    <label>Método</label>
    <select id="method">${paymentOptions.map((m) => `<option value="${m.value}">${m.label}</option>`).join('')}</select>
    <p id="membership-error" class="error-text"></p>
    <button id="confirm-membership" class="btn primary big" style="margin-top:.7rem">COBRAR CUOTA</button>
  </div>` });
  bindLayoutEvents();

  const search = document.getElementById('member-search');
  const select = document.getElementById('member-select');
  const enrollCheck = document.getElementById('enroll-check');
  const error = document.getElementById('membership-error');

  const refreshEnrollDefault = () => {
    const fresh = db();
    const member = fresh.members.find((m) => m.id === select.value && m.gymId === gymId);
    enrollCheck.checked = member ? !member.isEnrolled : false;
  };

  select.onchange = refreshEnrollDefault;

  const applySearch = () => {
    const q = search.value.toLowerCase().trim();
    const found = members.find((m) => m.fullName.toLowerCase().includes(q));
    if (found) {
      select.value = found.id;
      refreshEnrollDefault();
    }
  };

  const confirmMembership = () => {
    error.textContent = '';
    const memberId = select.value;
    const monthlyAmount = Number(document.getElementById('amount').value || 0);
    const method = document.getElementById('method').value;
    const includeEnrollment = enrollCheck.checked;
    if (!memberId || monthlyAmount < 0) {
      error.textContent = 'Seleccioná socio y monto válido.';
      return;
    }

    const total = monthlyAmount + (includeEnrollment ? 10000 : 0);
    if (!window.confirm(`¿Confirmás el cobro de ${money(total)}?`)) return;

    const fresh = db();
    const member = fresh.members.find((m) => m.id === memberId && m.gymId === gymId);
    member.nextDueDate = plusDaysFromToday(30);
    member.status = 'active';
    if (includeEnrollment) member.isEnrolled = true;

    const items = [];
    if (includeEnrollment) items.push({ itemId: 'enrollment', name: 'Inscripción', qty: 1, price: 10000, subtotal: 10000 });
    items.push({ itemId: 'monthly', name: 'Mensualidad', qty: 1, price: monthlyAmount, subtotal: monthlyAmount });

    const receipt = nextReceiptNumber(fresh);
    const sale = {
      id: uid('s'),
      gymId,
      memberId,
      items,
      total,
      paidAt: todayISO(),
      method,
      type: 'membership',
      receiptNumber: receipt.receiptNumber
    };

    receipt.state.sales.push(sale);
    save(receipt.state);
    go(`/${gymId}/receipt/${sale.id}`);
  };

  search.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      applySearch();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') error.textContent = '';
  });

  document.getElementById('confirm-membership').onclick = confirmMembership;
}

function receiptPage(root, gymId, saleId = '') {
  const data = db();
  const sale = saleId ? data.sales.find((s) => s.id === saleId && s.gymId === gymId) : data.sales.filter((s) => s.gymId === gymId).slice(-1)[0];
  const methodLabel = paymentOptions.find((m) => m.value === sale?.method)?.label || sale?.method || '-';
  const rows = (sale?.items || []).map((it) => {
    const inv = data.inventory.find((x) => x.id === it.itemId && x.gymId === gymId);
    const name = it.name || inv?.name || it.itemId;
    const qty = Number(it.qty || 0);
    const price = Number(it.price || 0);
    const subtotal = Number(it.subtotal ?? qty * price);
    return `<tr><td>${name}</td><td>${qty}</td><td>${money(price)}</td><td>${money(subtotal)}</td></tr>`;
  }).join('');

  root.innerHTML = appLayout({ gymId, title: 'Digital Payment Receipt', active: 'shop', body: `<div class="panel"><h3>${receiptLabel(sale?.receiptNumber)}</h3><p><strong>ID:</strong> ${sale?.id || '-'}</p><p><strong>Fecha:</strong> ${sale?.paidAt || '-'}</p><p><strong>Método:</strong> ${methodLabel}</p><p><strong>Total:</strong> ${money(sale?.total || 0)}</p>
  <table><thead><tr><th>Item</th><th>Cant</th><th>Precio</th><th>Subtotal</th></tr></thead><tbody>${rows || '<tr><td colspan="4">Sin ítems</td></tr>'}</tbody></table>
  <div class="action-row" style="margin-top:.8rem"><button id="print-receipt" class="btn big">Imprimir</button><a class="btn primary big" href="#/${gymId}/shop">Nueva venta</a><a class="btn big" href="#/${gymId}/membership-charge">Cobrar otra cuota</a></div></div>` });
  bindLayoutEvents();
  document.getElementById('print-receipt').onclick = () => window.print();
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
    data.closures.push({ id: uid('cc'), gymId, date: todayISO(), opening, cashIn, cashOut, closing: opening + cashIn - cashOut, notes: document.getElementById('notes').value });
    save(data); renderSummary();
  };
}

function reportsPage(root, gymId) {
  const month = new Date().toISOString().slice(0, 7);
  const rows = db().sales.filter((s) => s.gymId === gymId && s.paidAt.startsWith(month));
  const total = rows.reduce((a, s) => a + s.total, 0);
  root.innerHTML = appLayout({ gymId, title: 'Monthly Revenue Report', active: 'reports', body: `<div class="panel"><h3>Total mes ${month}</h3><div class="kpi">${money(total)}</div><table><thead><tr><th>Venta</th><th>Comprobante</th><th>Fecha</th><th>Total</th></tr></thead><tbody>${rows.map((s) => `<tr><td>${s.id}</td><td>${receiptLabel(s.receiptNumber)}</td><td>${s.paidAt}</td><td>${money(s.total)}</td></tr>`).join('')}</tbody></table></div>` });
  bindLayoutEvents();
}

function settingsPage(root, gymId) {
  root.innerHTML = appLayout({ gymId, title: 'System Settings', active: 'settings', body: `<div class="panel"><p>Ajustes MVP</p><button id="reset" class="btn warn big">Reset demo data</button></div>
  <div class="panel"><h3>Respaldo</h3><div class="action-row"><button id="backup-download" class="btn primary big">Descargar backup</button><label class="btn big" for="backup-file">Importar backup</label><input id="backup-file" type="file" accept="application/json" hidden /></div><p id="backup-msg" class="error-text"></p></div>` });
  bindLayoutEvents();

  const msg = document.getElementById('backup-msg');
  document.getElementById('reset').onclick = () => { resetDB(); alert('Datos reiniciados'); };

  document.getElementById('backup-download').onclick = () => {
    const payload = db();
    const date = new Date().toISOString().slice(0, 10);
    const fileName = `gym_backup_${date}.json`;
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    msg.style.color = '#88ff9f';
    msg.textContent = 'Backup descargado';
  };

  document.getElementById('backup-file').onchange = (e) => {
    msg.style.color = '#ff9d9d';
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || '{}'));
        if (!Array.isArray(parsed.members) || !Array.isArray(parsed.sales)) {
          msg.textContent = 'Backup inválido: faltan members/sales como arrays.';
          return;
        }
        if (!window.confirm('Esto reemplazará todos los datos actuales. ¿Continuar?')) return;
        replaceAllData(parsed);
        location.reload();
      } catch {
        msg.textContent = 'No se pudo importar el backup. Revisá el archivo JSON.';
      }
    };
    reader.readAsText(file);
  };
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

  let m = route.match(/^\/([^/]+)\/receipt\/([^/]+)$/);
  if (m) {
    const gymId = m[1];
    const saleId = m[2];
    if (denyIfNoAccess(gymId)) return;
    return receiptPage(app, gymId, saleId);
  }

  m = route.match(/^\/([^/]+)\/membership-charge(?:\/([^/]+))?$/);
  if (m) {
    const gymId = m[1];
    const memberId = m[2] || '';
    if (denyIfNoAccess(gymId)) return;
    return membershipChargePage(app, gymId, memberId);
  }

  m = route.match(/^\/([^/]+)\/(home|members|notifications|cash-closure|inventory|shop|receipt|reports\/monthly|settings)(?:\/([^/]+))?$/);
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

