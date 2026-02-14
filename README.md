# Gym Espartano MVP (multi-gym)

MVP funcional (Vanilla JS + hash router) para operación diaria de gimnasio.

## Source of truth (orden y consistencia)

### ✅ Editable
- `app/src/**` → lógica de la app (router, auth, pages, data fake backend)
- `app/index.html` → shell principal
- `app/styles.css` → estilos globales

### ❌ No editable (generado o raw)
- `app/dist/**` → salida de build (se regenera con `npm run build`)
- `stitch_raw/**` → export crudo de Stitch (trazabilidad, no tocar)

## Stitch raw oficial

La fuente oficial de exportaciones Stitch es:
- `stitch_raw/<screenId>/code.html`
- `stitch_raw/<screenId>/screen.png` (archivo local opcional, omitido en git durante pruebas)

`stitch_raw/_legacy_named_exports/` se mantiene solo como referencia opcional histórica, no como fuente primaria.

En etapa de pruebas, los screenshots PNG (`screen.png`) se omiten del control de versiones (ver `.gitignore`).

## Estructura

```text
.
├── app/
│   ├── index.html
│   ├── styles.css
│   ├── package.json
│   ├── scripts/build.mjs
│   ├── src/
│   │   ├── main.js
│   │   ├── core/{auth.js,router.js}
│   │   ├── data/{seeds.js,storage.js}
│   │   ├── components/layout.js
│   │   └── pages/screens.js
│   └── dist/
│       ├── index.html
│       ├── styles.css
│       └── assets/app.js
├── scripts/download_stitch_raw.sh
└── stitch_raw/
    ├── <screenId>/{code.html,screen.png}
    └── _legacy_named_exports/ (opcional)
```

## Comandos

```bash
cd app
npm install
npm run dev
```

Dev server: `http://localhost:5173`

Build:

```bash
cd app
npm run build
```

Resultado de build consistente en `app/dist/`:
- `index.html`
- `styles.css`
- `assets/app.js`

## Usuarios demo

- Super admin: `super@gym.local` / `super123`
- Staff: `staff@gym.local` / `staff123`

## Rutas

- `#/login`
- `#/hub` (solo super)
- `#/:gymId/home`
- `#/:gymId/members`
- `#/:gymId/members/new`
- `#/:gymId/members/:memberId`
- `#/:gymId/notifications`
- `#/:gymId/cash-closure`
- `#/:gymId/inventory`
- `#/:gymId/shop`
- `#/:gymId/receipt`
- `#/:gymId/reports/monthly`
- `#/:gymId/settings`
- `#/access-granted`
- `#/access-denied`

## Stitch download (curl -L)

```bash
export STITCH_BASE_URL="https://<endpoint-stitch>"
./scripts/download_stitch_raw.sh
```

## Nota de stack

Se mantiene Opción B (Vanilla + hash router) por restricción del entorno (`403` al bootstrap de Vite/React en registry npm).
