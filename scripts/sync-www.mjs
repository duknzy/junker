import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const wwwDir = path.join(rootDir, 'www');

// Clean previous www directory to avoid stale or deleted assets
if (fs.existsSync(wwwDir)) {
  fs.rmSync(wwwDir, { recursive: true, force: true });
}
fs.mkdirSync(wwwDir, { recursive: true });

// Copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 1. Copy root files matching web assets
const files = fs.readdirSync(rootDir, { withFileTypes: true });
const excludeFiles = new Set(['server.js', 'package.json', 'package-lock.json', 'README.md']);

let copiedCount = 0;

for (const f of files) {
  if (!f.isFile()) continue;
  const name = f.name;
  if (excludeFiles.has(name) || name.startsWith('.')) continue;

  const ext = path.extname(name).toLowerCase();
  if (['.html', '.css', '.js', '.jpg', '.jpeg', '.png', '.svg', '.json', '.webp', '.ico'].includes(ext)) {
    fs.copyFileSync(path.join(rootDir, name), path.join(wwwDir, name));
    copiedCount++;
  }
}

// 2. Copy directories: icons, m
for (const sub of ['icons', 'm']) {
  const srcSub = path.join(rootDir, sub);
  const destSub = path.join(wwwDir, sub);
  if (fs.existsSync(srcSub)) {
    copyDir(srcSub, destSub);
  }
}

console.log(`[sync-www] Cleanly synchronized ${copiedCount} root assets and subdirectories (icons, m) to www/`);
