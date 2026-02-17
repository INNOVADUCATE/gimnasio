import { mkdirSync, rmSync, readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve('.');
const DIST = resolve(ROOT, 'dist');
const ASSETS = resolve(DIST, 'assets');

const sourceFiles = [
  'src/data/seeds.js',
  'src/data/storage.js',
  'src/core/auth.js',
  'src/core/router.js',
  'src/components/layout.js',
  'src/pages/screens.js',
  'src/main.js'
];

function transformModule(code) {
  return code
    .replace(/^import\s+[^;]+;\s*$/gm, '')
    .replace(/^export\s+function\s+/gm, 'function ')
    .replace(/^export\s+const\s+/gm, 'const ')
    .replace(/^export\s+\{[^}]+\};\s*$/gm, '')
    .trim();
}

rmSync(DIST, { recursive: true, force: true });
mkdirSync(ASSETS, { recursive: true });

copyFileSync(resolve(ROOT, 'styles.css'), resolve(DIST, 'styles.css'));

const bundle = sourceFiles
  .map((file) => {
    const abs = resolve(ROOT, file);
    const raw = readFileSync(abs, 'utf8');
    return `// ${file}\n${transformModule(raw)}\n`;
  })
  .join('\n');

writeFileSync(resolve(ASSETS, 'app.js'), `${bundle}\n`, 'utf8');

const indexSrc = readFileSync(resolve(ROOT, 'index.html'), 'utf8');
const indexDist = indexSrc
  .replace('./src/main.js', './assets/app.js')
  .replace('type="module"', 'defer');

writeFileSync(resolve(DIST, 'index.html'), indexDist, 'utf8');

console.log('Build generated in app/dist (index.html, styles.css, assets/app.js)');
