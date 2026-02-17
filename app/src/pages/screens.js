import { login, currentUser, session, setCurrentGym, currentGymId } from '../core/auth.js';
import { go, canAccessGym, parseRoute } from '../core/router.js';
import { db, save, uid, resetDB, nextReceiptNumber, exportDB, importDB } from '../data/storage.js';
import { appLayout, bindLayoutEvents, money } from '../components/layout.js';

/* ── helpers ── */
const tag = (s) => `<span class="tag ${s === 'active' ? 'ok' : s === 'overdue' ? 'bad' : 'warn'}">${s}</span>`;
const byGym = (gymId) => db().members.filter((m) => m.gymId === gymId);
const MEMBERSHIP_PRICE = 35000;
const ENROLLMENT_PRICE = 10000;

/* ══════════════════════════════════════════════
   LOGIN
   ══════════════════════════════════════════════ */
export function loginPage(root) {
  root.innerHTML = `<div class="center panel">
    <h1>🏋️ Gym Admin Login</h1>
    <p class="muted">Demo: super@gym.local / super123 — staff@gym.local / staff123</p>
    <label>Email</label><input id="email" value="super@gym.local"/>
    <label>Password</label><input id="password" type="password" value="super123"/>
    <div id="login-error" class="error-msg"></div>
    <button id="login" class="btn primary" style="margin-top:.7rem;width:100%">Ingresar</button>
  </div>`;
  const doLogin = () => {
    const s = login(document.getElementById('email').value, document.getElementById('password').value);
    if (!s) { document.getElementById('login-error').textContent = 'Credenciales inválidas'; return; }
    const u = currentUser();
    if (u.role === 'super') go('/hub'); else go(`/${s.gymId}/home`);
  };
  document.getElementById('login').onclick = doLogin;
  document.getElementById('password').onkeydown = (e) => { if (e.key === 'Enter') doLogin(); };
}

/* ══════════════════════════════════════════════
   HUB (super only)
   ══════════════════════════════════════════════ */
export function hubPage(root) {
  const data = db();
  const cards = data.gyms.map((g) => {
    const memberCount = data.members.filter(m => m.gymId === g.id).length;
    return `<div class="panel hub-card">
      <h3>${g.name}</h3>
      <p class="muted">${g.address}</p>
      <p class="muted">${memberCount} socios</p>
      <button class="btn primary" data-gym="${g.id}">Entrar →</button>
    </div>`;
  }).join('');
  root.innerHTML = `<div class="center" style="max-width:700px">
    <div class="hero"><h1>🏢 Multi-Gym Hub</h1><p>Elegí un gimnasio para operar.</p></div>
    <div class="grid">${cards}</div>
  </div>`;
  root.querySelectorAll('[data-gym]').forEach((b) => b.onclick = () => {
    setCurrentGym(b.dataset.gym);
    go(`/${b.dataset.gym}/home`);
  });
}

/* ══════════════════════════════════════════════
   HOME / DASHBOARD
   ══════════════════════════════════════════════ */
export function homePage(root, gymId) {
  const data = db();
  const members = byGym(gymId);
  const gym = data.gyms.find(g => g.id === gymId);
  const sales = data.sales.filter((s) => s.gymId === gymId);
  const todaySales = sales.filter(s => s.paidAt === new Date().toISOString().slice(0, 10));
  root.innerHTML = appLayout({
    gymId, title: gym ? gym.name : gymId, active: 'home', body: `
    <div class="hero"><h2>Dashboard</h2><p class="muted">Operación diaria · ${new Date().toLocaleDateString('es-AR')}</p></div>
    <div class="grid-3">
      <div class="panel"><div class="kpi">${members.length}</div><div class="muted">Socios</div></div>
      <div class="panel"><div class="kpi" style="color:var(--orange)">${members.filter((m) => m.status === 'overdue').length}</div><div class="muted">Morosos</div></div>
      <div class="panel"><div class="kpi" style="color:var(--green)">${money(todaySales.reduce((a, s) => a + s.total, 0))}</div><div class="muted">Ventas hoy</div></div>
    </div>
    <div class="grid">
      <div class="panel"><div class="kpi">${money(sales.reduce((a, s) => a + s.total, 0))}</div><div class="muted">Ingresos totales</div></div>
      <div class="panel"><div class="kpi">${data.inventory.filter(i => i.gymId === gymId).length}</div><div class="muted">Productos en inventario</div></div>
    </div>` });
  bindLayoutEvents();
}

/* ══════════════════════════════════════════════
   MEMBERS LIST
   ══════════════════════════════════════════════ */
export function membersPage(root, gymId) {
  const members = byGym(gymId);
  const rows = members.length === 0
    ? `<tr><td colspan="5" class="muted" style="text-align:center;padding:2rem">Sin socios registrados. <a href="#/${gymId}/members/new" class="btn primary" style="margin-left:.5rem">+ Alta de socio</a></td></tr>`
    : members.map((m) => `<tr>
        <td><a href="#/${gymId}/members/${m.id}">${m.fullName}</a></td>
        <td>${m.nextDueDate || '-'}</td>
        <td>${tag(m.status)}</td>
        <td>${m.isEnrolled ? '✅' : '❌'}</td>
        <td><button class="btn renew-btn" data-mid="${m.id}" title="Renovar mes">⚡ Renovar</button></td>
      </tr>`).join('');
  root.innerHTML = appLayout({
    gymId, title: 'Socios', active: 'members', body: `
    <div class="panel">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
        <span class="muted">${members.length} socios</span>
        <a class="btn primary" href="#/${gymId}/members/new">+ Alta de socio</a>
      </div>
      <table><thead><tr><th>Nombre</th><th>Vence</th><th>Estado</th><th>Inscrito</th><th>Acción</th></tr></thead>
      <tbody>${rows}</tbody></table>
    </div>` });
  bindLayoutEvents();

  // Quick renew buttons
  root.querySelectorAll('.renew-btn').forEach(btn => {
    btn.onclick = () => {
      const memberId = btn.dataset.mid;
      const data = db();
      const member = data.members.find(m => m.id === memberId && m.gymId === gymId);
      if (!member) return;
      const amount = member.isEnrolled ? MEMBERSHIP_PRICE : (MEMBERSHIP_PRICE + ENROLLMENT_PRICE);
      const label = member.isEnrolled ? `Mensualidad ${money(MEMBERSHIP_PRICE)}` : `Inscripción ${money(ENROLLMENT_PRICE)} + Mensualidad ${money(MEMBERSHIP_PRICE)}`;
      if (!confirm(`¿Renovar cuota de ${member.fullName}?\n${label}\nTotal: ${money(amount)}\nMétodo: Efectivo`)) return;
      // process
      if (!member.isEnrolled) member.isEnrolled = true;
      const today = new Date();
      const next = new Date(today); next.setDate(next.getDate() + 30);
      member.nextDueDate = next.toISOString().slice(0, 10);
      member.status = 'active';
      const receiptNumber = nextReceiptNumber();
      // re-read data after receipt number increment
      const freshData = db();
      const freshMember = freshData.members.find(m => m.id === memberId && m.gymId === gymId);
      if (!freshMember.isEnrolled) freshMember.isEnrolled = true;
      freshMember.nextDueDate = member.nextDueDate;
      freshMember.status = 'active';
      const items = [];
      if (!member.isEnrolled) items.push({ name: 'Inscripción', qty: 1, price: ENROLLMENT_PRICE });
      items.push({ name: 'Mensualidad', qty: 1, price: MEMBERSHIP_PRICE });
      const sale = { id: uid('s'), gymId, receiptNumber, type: 'membership', memberId, items, total: amount, paidAt: today.toISOString().slice(0, 10), method: 'cash' };
      freshData.sales.push(sale);
      save(freshData);
      go(`/${gymId}/receipt/${sale.id}`);
    };
  });
}

/* ══════════════════════════════════════════════
   NEW MEMBER
   ══════════════════════════════════════════════ */
export function memberNewPage(root, gymId) {
  root.innerHTML = appLayout({
    gymId, title: 'Alta de socio', active: 'members', body: `
    <div class="panel">
      <label>Nombre y apellido *</label><input id="name"/>
      <label>Teléfono</label><input id="phone"/>
      <label>Fecha inicio</label><input id="start" type="date" value="${new Date().toISOString().slice(0, 10)}"/>
      <label>Vencimiento</label><input id="due" type="date"/>
      <div id="form-error" class="error-msg"></div>
      <div style="display:flex;gap:.5rem;margin-top:.8rem">
        <button id="save" class="btn primary">Guardar</button>
        <a class="btn" href="#/${gymId}/members">Cancelar</a>
      </div>
    </div>` });
  bindLayoutEvents();
  document.getElementById('save').onclick = () => {
    const name = document.getElementById('name').value.trim();
    if (!name) { document.getElementById('form-error').textContent = 'El nombre es obligatorio'; return; }
    const data = db();
    data.members.push({
      id: uid('m'), gymId, fullName: name,
      phone: document.getElementById('phone').value,
      status: 'active', planName: 'Pase libre', isEnrolled: false,
      startDate: document.getElementById('start').value,
      nextDueDate: document.getElementById('due').value || null
    });
    save(data);
    go(`/${gymId}/members`);
  };
}

/* ══════════════════════════════════════════════
   MEMBER PROFILE + CUOTAS
   ══════════════════════════════════════════════ */
export function memberProfilePage(root, gymId, memberId) {
  const data = db();
  const m = data.members.find((x) => x.id === memberId && x.gymId === gymId);
  if (!m) { root.innerHTML = appLayout({ gymId, title: 'Socio no encontrado', active: 'members', body: `<div class="panel"><p>No se encontró el socio.</p><a class="btn" href="#/${gymId}/members">← Volver</a></div>` }); bindLayoutEvents(); return; }
  const b = data.biometrics.find((x) => x.memberId === memberId) || { weightKg: '', bodyFatPct: '', musclePct: '' };
  const enrolledLabel = m.isEnrolled ? 'Inscripto ✅' : 'No inscripto ❌';
  const cuotaLabel = m.isEnrolled
    ? `Mensualidad ${money(MEMBERSHIP_PRICE)}`
    : `Inscripción ${money(ENROLLMENT_PRICE)} + Mensualidad ${money(MEMBERSHIP_PRICE)} = ${money(ENROLLMENT_PRICE + MEMBERSHIP_PRICE)}`;

  root.innerHTML = appLayout({
    gymId, title: m.fullName, active: 'members', body: `
    <div class="panel">
      <h3>${m.fullName} ${tag(m.status)}</h3>
      <p class="muted">${enrolledLabel} · Vence: ${m.nextDueDate || 'sin fecha'}</p>
      <label>Estado</label>
      <select id="status">
        <option ${m.status === 'active' ? 'selected' : ''}>active</option>
        <option ${m.status === 'overdue' ? 'selected' : ''}>overdue</option>
        <option ${m.status === 'blocked' ? 'selected' : ''}>blocked</option>
      </select>
      <label>Vencimiento</label><input id="due" type="date" value="${m.nextDueDate || ''}"/>
      <button id="saveProfile" class="btn primary" style="margin-top:.6rem">Guardar cambios</button>
    </div>

    <div class="panel">
      <h3>💰 Cobrar cuota</h3>
      <p>${cuotaLabel}</p>
      <label>Método de pago</label>
      <select id="cuota-method">
        <option value="cash">Efectivo</option>
        <option value="card">Tarjeta</option>
        <option value="mp">MercadoPago</option>
        <option value="transfer">Transferencia</option>
      </select>
      <button id="cobrarCuota" class="btn primary" style="margin-top:.6rem;width:100%">Cobrar cuota</button>
    </div>

    <div class="panel">
      <h3>📊 Biometría</h3>
      <label>Peso kg</label><input id="weight" type="number" value="${b.weightKg}"/>
      <label>% Grasa</label><input id="fat" type="number" value="${b.bodyFatPct}"/>
      <label>% Músculo</label><input id="muscle" type="number" value="${b.musclePct}"/>
      <button id="saveBio" class="btn" style="margin-top:.6rem">Guardar biometría</button>
    </div>

    <a class="btn" href="#/${gymId}/members" style="margin-top:.5rem">← Volver a socios</a>`
  });
  bindLayoutEvents();

  // Save profile
  document.getElementById('saveProfile').onclick = () => {
    const data2 = db();
    const mem = data2.members.find(x => x.id === memberId && x.gymId === gymId);
    mem.status = document.getElementById('status').value;
    mem.nextDueDate = document.getElementById('due').value;
    save(data2);
    go(`/${gymId}/members/${memberId}`);
  };

  // Save biometrics
  document.getElementById('saveBio').onclick = () => {
    const data2 = db();
    const next = { memberId, weightKg: Number(document.getElementById('weight').value), bodyFatPct: Number(document.getElementById('fat').value), musclePct: Number(document.getElementById('muscle').value), updatedAt: new Date().toISOString().slice(0, 10) };
    const found = data2.biometrics.find((x) => x.memberId === memberId);
    if (found) Object.assign(found, next); else data2.biometrics.push(next);
    save(data2);
    alert('Biometría guardada');
  };

  // Cobrar cuota
  document.getElementById('cobrarCuota').onclick = () => {
    const method = document.getElementById('cuota-method').value;
    const needsEnrollment = !m.isEnrolled;
    const total = needsEnrollment ? (ENROLLMENT_PRICE + MEMBERSHIP_PRICE) : MEMBERSHIP_PRICE;
    if (!confirm(`¿Cobrar cuota a ${m.fullName}?\nTotal: ${money(total)}\nMétodo: ${method}`)) return;

    const receiptNumber = nextReceiptNumber();
    const data2 = db();
    const mem = data2.members.find(x => x.id === memberId && x.gymId === gymId);
    if (!mem.isEnrolled) mem.isEnrolled = true;
    const today = new Date();
    const nextDate = new Date(today); nextDate.setDate(nextDate.getDate() + 30);
    mem.nextDueDate = nextDate.toISOString().slice(0, 10);
    mem.status = 'active';
    const items = [];
    if (needsEnrollment) items.push({ name: 'Inscripción', qty: 1, price: ENROLLMENT_PRICE });
    items.push({ name: 'Mensualidad', qty: 1, price: MEMBERSHIP_PRICE });
    const sale = { id: uid('s'), gymId, receiptNumber, type: 'membership', memberId, items, total, paidAt: today.toISOString().slice(0, 10), method };
    data2.sales.push(sale);
    save(data2);
    go(`/${gymId}/receipt/${sale.id}`);
  };
}

/* ══════════════════════════════════════════════
   NOTIFICATIONS / MOROSOS
   ══════════════════════════════════════════════ */
export function notificationsPage(root, gymId) {
  const overdue = byGym(gymId).filter((m) => m.status === 'overdue');
  const rows = overdue.length === 0
    ? `<tr><td colspan="3" class="muted" style="text-align:center;padding:2rem">🎉 Sin morosos</td></tr>`
    : overdue.map((m) => `<tr>
        <td><a href="#/${gymId}/members/${m.id}">${m.fullName}</a></td>
        <td>${m.nextDueDate}</td>
        <td><a class="btn" target="_blank" href="https://wa.me/54${m.phone || ''}">WhatsApp</a></td>
      </tr>`).join('');
  root.innerHTML = appLayout({
    gymId, title: 'Morosos', active: 'notifications', body: `
    <div class="panel">
      <p class="muted">${overdue.length} socios con cuota vencida</p>
      <table><thead><tr><th>Socio</th><th>Venció</th><th>Acción</th></tr></thead>
      <tbody>${rows}</tbody></table>
    </div>` });
  bindLayoutEvents();
}

/* ══════════════════════════════════════════════
   INVENTORY CRUD
   ══════════════════════════════════════════════ */
export function inventoryPage(root, gymId) {
  const renderInventory = () => {
    const items = db().inventory.filter((i) => i.gymId === gymId);
    const rows = items.length === 0
      ? `<tr><td colspan="5" class="muted" style="text-align:center;padding:2rem">Sin productos. ¡Agregá el primero!</td></tr>`
      : items.map((i) => `<tr>
          <td>${i.name}</td>
          <td>${i.stock}</td>
          <td>${money(i.price)}</td>
          <td class="action-cell">
            <button class="btn small-btn" data-edit="${i.id}" title="Editar">✏️</button>
            <button class="btn small-btn ok-btn" data-add10="${i.id}" title="+10">+10</button>
            <button class="btn small-btn warn-btn" data-sub10="${i.id}" title="-10" ${i.stock < 10 ? 'disabled' : ''}>-10</button>
          </td>
        </tr>`).join('');

    root.innerHTML = appLayout({
      gymId, title: 'Inventario', active: 'inventory', body: `
      <div class="panel">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
          <span class="muted">${items.length} productos</span>
          <button id="addProduct" class="btn primary">+ Agregar producto</button>
        </div>
        <table><thead><tr><th>Producto</th><th>Stock</th><th>Precio</th><th>Acciones</th></tr></thead>
        <tbody>${rows}</tbody></table>
      </div>
      <div id="inv-modal" class="modal-overlay" style="display:none">
        <div class="modal-box panel">
          <h3 id="modal-title">Agregar producto</h3>
          <label>Nombre *</label><input id="inv-name"/>
          <label>Stock *</label><input id="inv-stock" type="number" min="0" value="0"/>
          <label>Precio *</label><input id="inv-price" type="number" min="0" value="0"/>
          <div id="inv-error" class="error-msg"></div>
          <div style="display:flex;gap:.5rem;margin-top:.8rem">
            <button id="inv-save" class="btn primary">Guardar</button>
            <button id="inv-cancel" class="btn">Cancelar</button>
          </div>
        </div>
      </div>` });
    bindLayoutEvents();

    let editingId = null;
    const modal = document.getElementById('inv-modal');
    const openModal = (item = null) => {
      editingId = item ? item.id : null;
      document.getElementById('modal-title').textContent = item ? 'Editar producto' : 'Agregar producto';
      document.getElementById('inv-name').value = item ? item.name : '';
      document.getElementById('inv-stock').value = item ? item.stock : 0;
      document.getElementById('inv-price').value = item ? item.price : 0;
      document.getElementById('inv-error').textContent = '';
      modal.style.display = 'flex';
    };
    const closeModal = () => { modal.style.display = 'none'; editingId = null; };

    document.getElementById('addProduct').onclick = () => openModal();
    document.getElementById('inv-cancel').onclick = closeModal;
    modal.onclick = (e) => { if (e.target === modal) closeModal(); };

    document.getElementById('inv-save').onclick = () => {
      const name = document.getElementById('inv-name').value.trim();
      const stock = parseInt(document.getElementById('inv-stock').value, 10);
      const price = parseInt(document.getElementById('inv-price').value, 10);
      if (!name) { document.getElementById('inv-error').textContent = 'El nombre es obligatorio'; return; }
      if (isNaN(stock) || stock < 0) { document.getElementById('inv-error').textContent = 'Stock debe ser >= 0'; return; }
      if (isNaN(price) || price < 0) { document.getElementById('inv-error').textContent = 'Precio debe ser >= 0'; return; }

      const data = db();
      if (editingId) {
        const item = data.inventory.find(i => i.id === editingId);
        if (item) { item.name = name; item.stock = stock; item.price = price; }
      } else {
        data.inventory.push({ id: uid('i'), gymId, name, stock, price });
      }
      save(data);
      closeModal();
      renderInventory();
    };

    // +10 / -10
    root.querySelectorAll('[data-add10]').forEach(btn => {
      btn.onclick = () => {
        const data = db();
        const item = data.inventory.find(i => i.id === btn.dataset.add10);
        if (item) { item.stock += 10; save(data); renderInventory(); }
      };
    });
    root.querySelectorAll('[data-sub10]').forEach(btn => {
      btn.onclick = () => {
        const data = db();
        const item = data.inventory.find(i => i.id === btn.dataset.sub10);
        if (item && item.stock >= 10) { item.stock -= 10; save(data); renderInventory(); }
      };
    });

    // Edit buttons
    root.querySelectorAll('[data-edit]').forEach(btn => {
      btn.onclick = () => {
        const item = db().inventory.find(i => i.id === btn.dataset.edit);
        if (item) openModal(item);
      };
    });
  };

  renderInventory();
}

/* ══════════════════════════════════════════════
   SHOP (POS) — REAL CART
   ══════════════════════════════════════════════ */
export function shopPage(root, gymId) {
  let cart = []; // [{itemId, name, price, qty}]

  const renderShop = () => {
    const items = db().inventory.filter((i) => i.gymId === gymId && i.stock > 0);
    const cartTotal = cart.reduce((a, c) => a + c.price * c.qty, 0);
    const cartRows = cart.length === 0
      ? '<p class="muted" style="text-align:center">Carrito vacío</p>'
      : cart.map(c => `<div class="cart-row">
          <span>${c.name} × ${c.qty}</span>
          <span>${money(c.price * c.qty)}</span>
          <div>
            <button class="btn small-btn" data-cart-add="${c.itemId}">+</button>
            <button class="btn small-btn" data-cart-sub="${c.itemId}">−</button>
          </div>
        </div>`).join('');

    const productCards = items.length === 0
      ? '<p class="muted">Sin productos en stock. <a href="#/' + gymId + '/inventory">Ir a inventario</a></p>'
      : items.map(i => {
        const inCart = cart.find(c => c.itemId === i.id);
        return `<div class="product-card panel">
            <strong>${i.name}</strong>
            <span class="muted">Stock: ${i.stock}</span>
            <span>${money(i.price)}</span>
            <button class="btn primary" data-add-cart="${i.id}" ${inCart && inCart.qty >= i.stock ? 'disabled' : ''}>
              ${inCart ? `En carrito (${inCart.qty})` : 'Agregar'}
            </button>
          </div>`;
      }).join('');

    root.innerHTML = appLayout({
      gymId, title: 'Shop / POS', active: 'shop', body: `
      <div class="shop-layout">
        <div class="shop-products">
          <h3>Productos</h3>
          <div class="product-grid">${productCards}</div>
        </div>
        <div class="shop-cart panel">
          <h3>🛒 Carrito</h3>
          ${cartRows}
          <hr/>
          <div style="display:flex;justify-content:space-between;font-weight:700;font-size:1.2rem">
            <span>Total</span><span>${money(cartTotal)}</span>
          </div>
          <label>Método de pago</label>
          <select id="pay-method">
            <option value="cash">Efectivo</option>
            <option value="card">Tarjeta</option>
            <option value="mp">MercadoPago</option>
            <option value="transfer">Transferencia</option>
          </select>
          <div id="shop-error" class="error-msg"></div>
          <button id="checkout" class="btn primary" style="width:100%;margin-top:.5rem" ${cart.length === 0 ? 'disabled' : ''}>
            Cobrar ${money(cartTotal)}
          </button>
          ${cart.length > 0 ? '<button id="clear-cart" class="btn warn" style="width:100%;margin-top:.3rem">Vaciar carrito</button>' : ''}
        </div>
      </div>` });
    bindLayoutEvents();

    // Add to cart
    root.querySelectorAll('[data-add-cart]').forEach(btn => {
      btn.onclick = () => {
        const itemId = btn.dataset.addCart;
        const item = db().inventory.find(i => i.id === itemId);
        if (!item) return;
        const inCart = cart.find(c => c.itemId === itemId);
        if (inCart) {
          if (inCart.qty < item.stock) inCart.qty++;
        } else {
          cart.push({ itemId, name: item.name, price: item.price, qty: 1 });
        }
        renderShop();
      };
    });

    // Cart +/-
    root.querySelectorAll('[data-cart-add]').forEach(btn => {
      btn.onclick = () => {
        const itemId = btn.dataset.cartAdd;
        const item = db().inventory.find(i => i.id === itemId);
        const inCart = cart.find(c => c.itemId === itemId);
        if (inCart && item && inCart.qty < item.stock) { inCart.qty++; renderShop(); }
      };
    });
    root.querySelectorAll('[data-cart-sub]').forEach(btn => {
      btn.onclick = () => {
        const itemId = btn.dataset.cartSub;
        const inCart = cart.find(c => c.itemId === itemId);
        if (inCart) {
          inCart.qty--;
          if (inCart.qty <= 0) cart = cart.filter(c => c.itemId !== itemId);
          renderShop();
        }
      };
    });

    // Clear cart
    const clearBtn = document.getElementById('clear-cart');
    if (clearBtn) clearBtn.onclick = () => { cart = []; renderShop(); };

    // Checkout
    document.getElementById('checkout').onclick = () => {
      if (cart.length === 0) return;
      const method = document.getElementById('pay-method').value;
      const data = db();

      // Validate stock
      for (const c of cart) {
        const inv = data.inventory.find(i => i.id === c.itemId);
        if (!inv || inv.stock < c.qty) {
          document.getElementById('shop-error').textContent = `Stock insuficiente para "${c.name}". Disponible: ${inv ? inv.stock : 0}`;
          return;
        }
      }

      // Deduct stock
      for (const c of cart) {
        const inv = data.inventory.find(i => i.id === c.itemId);
        inv.stock -= c.qty;
      }

      const total = cart.reduce((a, c) => a + c.price * c.qty, 0);
      save(data);
      const receiptNumber = nextReceiptNumber();
      const data2 = db();
      const sale = {
        id: uid('s'), gymId, receiptNumber, type: 'product', memberId: null,
        items: cart.map(c => ({ itemId: c.itemId, name: c.name, qty: c.qty, price: c.price })),
        total, paidAt: new Date().toISOString().slice(0, 10), method
      };
      data2.sales.push(sale);
      save(data2);
      cart = [];
      go(`/${gymId}/receipt/${sale.id}`);
    };
  };

  renderShop();
}

/* ══════════════════════════════════════════════
   RECEIPT (by saleId)
   ══════════════════════════════════════════════ */
export function receiptPage(root, gymId, saleId) {
  const data = db();
  let sale;
  if (saleId) {
    sale = data.sales.find(s => s.id === saleId && s.gymId === gymId);
  } else {
    sale = data.sales.filter(s => s.gymId === gymId).slice(-1)[0];
  }
  if (!sale) {
    root.innerHTML = appLayout({ gymId, title: 'Comprobante', active: 'shop', body: `<div class="panel"><p class="muted">No se encontró la venta.</p><a class="btn" href="#/${gymId}/shop">← Volver a Shop</a></div>` });
    bindLayoutEvents(); return;
  }
  const member = sale.memberId ? data.members.find(m => m.id === sale.memberId) : null;
  const gym = data.gyms.find(g => g.id === gymId);
  const itemRows = (sale.items || []).map(it => `<tr>
    <td>${it.name || it.itemId}</td>
    <td style="text-align:center">${it.qty}</td>
    <td style="text-align:right">${money(it.price)}</td>
    <td style="text-align:right">${money(it.price * it.qty)}</td>
  </tr>`).join('');

  const methodLabels = { cash: 'Efectivo', card: 'Tarjeta', mp: 'MercadoPago', transfer: 'Transferencia' };

  root.innerHTML = appLayout({
    gymId, title: 'Comprobante', active: 'shop', body: `
    <div class="panel receipt-panel">
      <div style="text-align:center;margin-bottom:1rem">
        <h2 style="margin:0">${gym ? gym.name : gymId}</h2>
        <p class="muted" style="margin:0">${gym ? gym.address : ''}</p>
        <p style="font-size:1.3rem;font-weight:700;color:var(--green);margin:.5rem 0">Comprobante N° ${sale.receiptNumber || '—'}</p>
      </div>
      <table>
        <thead><tr><th>Detalle</th><th style="text-align:center">Cant.</th><th style="text-align:right">Precio</th><th style="text-align:right">Subtotal</th></tr></thead>
        <tbody>${itemRows}</tbody>
      </table>
      <hr/>
      <div style="display:flex;justify-content:space-between;font-size:1.3rem;font-weight:700">
        <span>TOTAL</span><span>${money(sale.total)}</span>
      </div>
      <p class="muted" style="margin-top:.5rem">Método: ${methodLabels[sale.method] || sale.method} · Fecha: ${sale.paidAt}${member ? ` · Socio: ${member.fullName}` : ''}</p>
      <p class="muted">Tipo: ${sale.type === 'membership' ? 'Cuota/Membresía' : 'Venta de productos'}</p>
      <div style="display:flex;gap:.5rem;margin-top:1rem">
        <button id="print-receipt" class="btn primary">🖨️ Imprimir</button>
        <a class="btn" href="#/${gymId}/shop">Nueva venta</a>
        <a class="btn" href="#/${gymId}/members">Socios</a>
      </div>
    </div>` });
  bindLayoutEvents();
  document.getElementById('print-receipt').onclick = () => window.print();
}

/* ══════════════════════════════════════════════
   CASH CLOSURE
   ══════════════════════════════════════════════ */
export function cashClosurePage(root, gymId) {
  root.innerHTML = appLayout({
    gymId, title: 'Caja diaria', active: 'cash', body: `
    <div class="panel">
      <label>Apertura</label><input id="opening" type="number" value="0"/>
      <label>Efectivo entra</label><input id="cashIn" type="number" value="0"/>
      <label>Efectivo sale</label><input id="cashOut" type="number" value="0"/>
      <label>Notas</label><textarea id="notes"></textarea>
      <button id="saveClosure" class="btn primary" style="margin-top:.6rem">Guardar cierre</button>
    </div>
    <div class="panel" id="summary"></div>` });
  bindLayoutEvents();
  const renderSummary = () => {
    const last = db().closures.filter((c) => c.gymId === gymId).slice(-1)[0];
    document.getElementById('summary').innerHTML = last
      ? `<h3>Último cierre</h3><p>${last.date} · Cierre ${money(last.closing)}</p><p class="muted">${last.notes || ''}</p>`
      : '<p class="muted">Sin cierres aún.</p>';
  };
  renderSummary();
  document.getElementById('saveClosure').onclick = () => {
    const opening = Number(document.getElementById('opening').value);
    const cashIn = Number(document.getElementById('cashIn').value);
    const cashOut = Number(document.getElementById('cashOut').value);
    const data = db();
    data.closures.push({ id: uid('cc'), gymId, date: new Date().toISOString().slice(0, 10), opening, cashIn, cashOut, closing: opening + cashIn - cashOut, notes: document.getElementById('notes').value });
    save(data);
    renderSummary();
    alert('Cierre guardado');
  };
}

/* ══════════════════════════════════════════════
   REPORTS
   ══════════════════════════════════════════════ */
export function reportsPage(root, gymId) {
  const month = new Date().toISOString().slice(0, 7);
  const allSales = db().sales.filter((s) => s.gymId === gymId && s.paidAt.startsWith(month));
  const total = allSales.reduce((a, s) => a + s.total, 0);
  const productSales = allSales.filter(s => s.type !== 'membership');
  const membershipSales = allSales.filter(s => s.type === 'membership');
  root.innerHTML = appLayout({
    gymId, title: 'Reporte mensual', active: 'reports', body: `
    <div class="panel">
      <h3>Total mes ${month}</h3>
      <div class="kpi" style="color:var(--green)">${money(total)}</div>
      <div class="grid" style="margin-top:1rem">
        <div class="panel"><div class="kpi">${money(productSales.reduce((a, s) => a + s.total, 0))}</div><div class="muted">Ventas productos (${productSales.length})</div></div>
        <div class="panel"><div class="kpi">${money(membershipSales.reduce((a, s) => a + s.total, 0))}</div><div class="muted">Cuotas (${membershipSales.length})</div></div>
      </div>
      <table style="margin-top:1rem"><thead><tr><th>N°</th><th>Tipo</th><th>Fecha</th><th>Método</th><th style="text-align:right">Total</th></tr></thead>
      <tbody>${allSales.map((s) => `<tr>
        <td><a href="#/${gymId}/receipt/${s.id}">${s.receiptNumber || s.id}</a></td>
        <td>${s.type === 'membership' ? '💪 Cuota' : '🛒 Producto'}</td>
        <td>${s.paidAt}</td>
        <td>${s.method}</td>
        <td style="text-align:right">${money(s.total)}</td>
      </tr>`).join('')}</tbody></table>
    </div>` });
  bindLayoutEvents();
}

/* ══════════════════════════════════════════════
   SETTINGS + BACKUP + DEBUG
   ══════════════════════════════════════════════ */
export function settingsPage(root, gymId) {
  const user = currentUser();
  const s = session();
  const route = parseRoute();
  const access = canAccessGym(gymId);

  root.innerHTML = appLayout({
    gymId, title: 'Settings', active: 'settings', body: `
    <div class="panel">
      <h3>💾 Backup</h3>
      <p class="muted">Exportá e importá todos los datos del sistema.</p>
      <div style="display:flex;gap:.5rem;flex-wrap:wrap">
        <button id="export-backup" class="btn primary">📥 Exportar backup JSON</button>
        <label class="btn" style="cursor:pointer">📤 Importar backup<input type="file" id="import-backup" accept=".json" style="display:none"/></label>
      </div>
      <div id="backup-msg" class="error-msg"></div>
    </div>

    <div class="panel">
      <h3>🔧 Debug Panel</h3>
      <table>
        <tr><td class="muted">Email</td><td>${user?.email || '—'}</td></tr>
        <tr><td class="muted">Role</td><td><span class="tag ${user?.role === 'super' ? 'ok' : 'warn'}">${user?.role || '—'}</span></td></tr>
        <tr><td class="muted">gymIds</td><td>${(user?.gymIds || []).join(', ')}</td></tr>
        <tr><td class="muted">currentGymId</td><td>${s?.gymId || '—'}</td></tr>
        <tr><td class="muted">Ruta actual</td><td><code>${route}</code></td></tr>
        <tr><td class="muted">canAccess</td><td><span class="tag ${access ? 'ok' : 'bad'}">${access}</span></td></tr>
        <tr><td class="muted">receiptCounter</td><td>${db().receiptCounter || 0}</td></tr>
      </table>
    </div>

    <div class="panel">
      <h3>⚠️ Reset</h3>
      <p class="muted">Limpia todos los datos y restaura la demo inicial.</p>
      <button id="reset" class="btn warn">Reset demo data</button>
    </div>` });
  bindLayoutEvents();

  // Export
  document.getElementById('export-backup').onclick = () => {
    const json = exportDB();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gym_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    document.getElementById('backup-msg').textContent = '✅ Backup exportado';
    document.getElementById('backup-msg').style.color = 'var(--green)';
  };

  // Import
  document.getElementById('import-backup').onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!confirm('⚠️ Esto reemplazará TODOS los datos actuales. ¿Continuar?')) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const ok = importDB(ev.target.result);
      if (ok) {
        document.getElementById('backup-msg').textContent = '✅ Backup importado. Recargando...';
        document.getElementById('backup-msg').style.color = 'var(--green)';
        setTimeout(() => location.reload(), 800);
      } else {
        document.getElementById('backup-msg').textContent = '❌ Archivo inválido';
      }
    };
    reader.readAsText(file);
  };

  // Reset
  document.getElementById('reset').onclick = () => {
    if (!confirm('¿Reiniciar todos los datos a la demo inicial?')) return;
    resetDB();
    localStorage.removeItem('gym-mvp-session');
    window.location.hash = '/login';
    location.reload();
  };
}

/* ══════════════════════════════════════════════
   ACCESS DENIED
   ══════════════════════════════════════════════ */
export function accessDenied(root) {
  const user = currentUser();
  const backLink = user
    ? (user.role === 'super' ? '#/hub' : `#/${user.gymIds[0]}/home`)
    : '#/login';
  const backLabel = user ? (user.role === 'super' ? 'Ir al Hub' : 'Ir a Home') : 'Ir a Login';
  root.innerHTML = `<div class="center panel danger">
    <h1>🚫 Access Denied</h1>
    <p>No tenés permisos para esta sección.</p>
    <a class="btn primary" href="${backLink}">${backLabel}</a>
  </div>`;
}

/* ══════════════════════════════════════════════
   SESSION ROOT REDIRECT
   ══════════════════════════════════════════════ */
export function ensureSessionRoot() {
  const s = session();
  if (!s) return go('/login');
  const u = currentUser();
  if (!u) return go('/login');
  if (u.role === 'super') return go('/hub');
  return go(`/${u.gymIds[0]}/home`);
}

/* ══════════════════════════════════════════════
   STAFF RESTRICTIONS
   ══════════════════════════════════════════════ */
export function ensureStaffRestrictions(route, gymId) {
  const u = currentUser();
  if (!u) return false;
  // Staff cannot access settings (super only)
  if (u.role === 'staff' && route.includes('/settings')) {
    go('/access-denied');
    return true;
  }
  return false;
}
