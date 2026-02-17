import { initDB } from './data/storage.js';
import { parseRoute, requireAuth, denyIfNoAccess, go } from './core/router.js';
import { currentUser } from './core/auth.js';
import {
  loginPage, hubPage, homePage, membersPage, memberNewPage, memberProfilePage, notificationsPage,
  cashClosurePage, inventoryPage, shopPage, receiptPage, reportsPage, settingsPage, membershipChargePage,
  accessGranted, accessDenied, ensureStaffRestrictions, ensureSessionRoot
} from './pages/screens.js';

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
