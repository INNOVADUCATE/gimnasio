# Gym MVP (multi-gym) — Sistema de gestión para gimnasios

MVP funcional (Vanilla JS + hash router + localStorage) para operación diaria de recepción.

## Quick Start

```bash
cd app
npm install
npm run dev
```

Dev server: `http://localhost:5173`

## Credenciales demo

| Rol   | Email              | Password   | Acceso                          |
|-------|--------------------|------------|---------------------------------|
| Super | super@gym.local    | super123   | Todas las sedes y settings      |
| Staff | staff@gym.local    | staff123   | Solo Gym Espartano, sin settings|

## Funcionalidades

- **Multi-gym**: Hub para super, datos aislados por sede (espartano/centro)
- **Socios**: CRUD, perfil, biometría, estado (active/overdue/blocked)
- **Cuotas**: Inscripción $10.000 (una vez) + Mensualidad $35.000, nextDueDate +30 días
- **Inventario**: CRUD con modal (agregar/editar), +10/-10 stock rápido
- **Shop / POS**: Carrito real con +/-, método de pago, valida stock, descuenta inventario
- **Comprobantes**: N° secuencial (000001...), detalle de items, imprimir
- **Caja diaria**: Apertura/cierre con resumen
- **Reportes**: Ingreso mensual con desglose productos vs cuotas
- **Backup**: Export/Import JSON completo
- **Debug panel**: Info de sesión y permisos (en Settings)

## Rutas

```
#/login
#/hub                          (solo super)
#/:gymId/home
#/:gymId/members
#/:gymId/members/new
#/:gymId/members/:memberId
#/:gymId/notifications
#/:gymId/cash-closure
#/:gymId/inventory             (CRUD real)
#/:gymId/shop                  (POS con carrito)
#/:gymId/receipt/:saleId
#/:gymId/reports/monthly
#/:gymId/settings              (solo super)
#/access-denied
```

## Estructura

```
app/
├── index.html
├── styles.css
├── package.json
├── scripts/{build.mjs, dev.mjs}
├── src/
│   ├── main.js               (router dispatch)
│   ├── core/
│   │   ├── auth.js            (login, session, currentUser)
│   │   └── router.js          (parseRoute, guards)
│   ├── data/
│   │   ├── seeds.js           (demo data)
│   │   └── storage.js         (localStorage CRUD, backup, receipts)
│   ├── components/
│   │   └── layout.js          (sidebar + nav)
│   └── pages/
│       └── screens.js         (todas las pantallas)
└── dist/                      (build output)
```

## Source of truth

- ✅ Editable: `app/src/**`, `app/index.html`, `app/styles.css`
- ❌ No tocar: `app/dist/**` (regenerado), `stitch_raw/**` (exports raw)

## Build

```bash
cd app
npm run build
```

Resultado en `app/dist/`.
