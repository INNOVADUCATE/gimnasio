import { initDB } from './data/storage.js';
import { parseRoute, requireAuth, denyIfNoAccess, go } from './core/router.js';
import { currentUser } from './core/auth.js';
import {
  loginPage, hubPage, homePage, membersPage, memberNewPage, memberProfilePage, notificationsPage,
  cashClosurePage, inventoryPage, shopPage, receiptPage, reportsPage, settingsPage, accessDenied,
  ensureStaffRestrictions, ensureSessionRoot
} from './pages/screens.js';

const app = document.getElementById('app');
initDB();

function render() {
  const route = parseRoute();

  // Public routes
  if (route === '/login') return loginPage(app);
  if (route === '/access-denied') return accessDenied(app);

  // Auth required from here
  if (!requireAuth()) return;

  // Root redirect
  if (route === '/' || route === '') return ensureSessionRoot();

  // Hub (super only)
  if (route === '/hub') {
    if (currentUser().role !== 'super') return go('/access-denied');
    return hubPage(app);
  }

  // Gym-scoped routes
  // Match: /:gymId/:section and /:gymId/:section/:extra
  const m = route.match(/^\/([^/]+)\/(home|members|notifications|cash-closure|inventory|shop|receipt|reports\/monthly|settings)(?:\/([^/]+))?$/);
  if (m) {
    const gymId = m[1];
    const section = m[2];
    const extra = m[3];

    // Access guard
    if (denyIfNoAccess(gymId)) return;
    if (ensureStaffRestrictions(route, gymId)) return;

    // Route dispatch
    if (section === 'home') return homePage(app, gymId);
    if (section === 'members' && !extra) return membersPage(app, gymId);
    if (section === 'members' && extra === 'new') return memberNewPage(app, gymId);
    if (section === 'members' && extra) return memberProfilePage(app, gymId, extra);
    if (section === 'notifications') return notificationsPage(app, gymId);
    if (section === 'cash-closure') return cashClosurePage(app, gymId);
    if (section === 'inventory') return inventoryPage(app, gymId);
    if (section === 'shop') return shopPage(app, gymId);
    if (section === 'receipt' && extra) return receiptPage(app, gymId, extra);
    if (section === 'receipt') return receiptPage(app, gymId, null);
    if (section === 'reports/monthly') return reportsPage(app, gymId);
    if (section === 'settings') return settingsPage(app, gymId);
  }

  // 404
  app.innerHTML = `<div class="center panel">
    <h2>Ruta no encontrada</h2>
    <p class="muted"><code>${route}</code></p>
    <a class="btn primary" href="#/login">Ir a login</a>
  </div>`;
}

window.addEventListener('hashchange', render);
render();
