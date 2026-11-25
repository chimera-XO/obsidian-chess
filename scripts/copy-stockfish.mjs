import fs from 'fs';
import path from 'path';

const srcDir = path.resolve('node_modules/stockfish/src');
const destDir = path.resolve('public/stockfish');

fs.mkdirSync(destDir, { recursive: true });

if (fs.existsSync(srcDir)) {
  const files = fs.readdirSync(srcDir);
  const liteSingleJs = files.find((f) => f.includes('lite-single') && f.endsWith('.js'))
    || files.find((f) => f.includes('single') && f.endsWith('.js'))
    || files.find((f) => f.endsWith('.js'));

  const liteSingleWasm = files.find((f) => f.includes('lite-single') && f.endsWith('.wasm'))
    || files.find((f) => f.includes('single') && f.endsWith('.wasm'))
    || files.find((f) => f.endsWith('.wasm'));

  if (liteSingleJs) {
    fs.copyFileSync(path.join(srcDir, liteSingleJs), path.join(destDir, 'stockfish.js'));
    fs.copyFileSync(path.join(srcDir, liteSingleJs), path.join(destDir, liteSingleJs));
    console.log(`[stockfish] Copied ${liteSingleJs} -> public/stockfish/stockfish.js`);
  }
  if (liteSingleWasm) {
    fs.copyFileSync(path.join(srcDir, liteSingleWasm), path.join(destDir, liteSingleWasm));
    fs.copyFileSync(path.join(srcDir, liteSingleWasm), path.join(destDir, 'stockfish.wasm'));
    console.log(`[stockfish] Copied ${liteSingleWasm} -> public/stockfish/`);
  }
} else {
  console.warn('[stockfish] node_modules/stockfish/src not found. Copy stockfish.js & .wasm into public/stockfish/ manually.');
}
