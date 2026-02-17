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

Dev server: `http://localhost:5173` (servidor Node nativo, sin dependencia de Python).

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

- Super admin: `user` / `admin`
- Staff: `staff` / `admin`

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
- `#/:gymId/receipt/:saleId`
- `#/:gymId/membership-charge`
- `#/:gymId/membership-charge/:memberId`
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

> Este MVP funciona en **1 PC** con `localStorage`. Hacer **backup diario** desde Settings > Respaldo.


## Modo recepción: Vender / Cobrar cuota / Imprimir

- **Inventario (CRUD):** agregar producto, editar precio/stock y ajustar stock con `+10` / `-10` (sin bajar de 0).
- **Vender (Shop POS):** usar `+` y `-` por producto, revisar carrito y total, opcional **Vaciar carrito**, luego **COBRAR**.
- **Renovar mes rápido:** desde lista de Socios con botón **Renovar mes** (mensualidad $35.000).
- **Cobro de cuota:** desde Home (`COBRAR CUOTA`) o desde Perfil (`Cobrar cuota`).
  - Mensualidad default: `$35.000`.
  - Inscripción única: `$10.000` (checkbox activo por defecto si el socio aún no está inscripto).
- **Comprobante secuencial:** cada venta/cuota genera número correlativo (ej. `Comprobante N° 000123`).
- **Receipt real:** muestra ID, fecha, método, total y detalle de items.
- **Imprimir:** desde receipt con botón **Imprimir** (`window.print`).
- **Backup:** en Settings > Respaldo se puede **Descargar backup** e **Importar backup** JSON.
- Atajos de recepción: `Enter` confirma búsqueda/acciones en modal, `Escape` cierra modales.
