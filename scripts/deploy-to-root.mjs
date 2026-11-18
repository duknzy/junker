import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'next', 'dist');

if (!fs.existsSync(distDir)) {
  console.error('Error: next/dist does not exist. Please run "npm run build" in next/ first.');
  process.exit(1);
}

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('Deploying next/dist to repository root...');

// 1. Copy assets directory
const distAssets = path.join(distDir, 'assets');
const rootAssets = path.join(rootDir, 'assets');
if (fs.existsSync(distAssets)) {
  copyDirRecursive(distAssets, rootAssets);
  console.log('✓ Copied assets/');
}

// 2. Copy images directory
const distImages = path.join(distDir, 'images');
const rootImages = path.join(rootDir, 'images');
if (fs.existsSync(distImages)) {
  copyDirRecursive(distImages, rootImages);
  console.log('✓ Copied images/');
}

// 2b. Copy PWA icons directory
const distIcons = path.join(distDir, 'icons');
const rootIcons = path.join(rootDir, 'icons');
if (fs.existsSync(distIcons)) {
  copyDirRecursive(distIcons, rootIcons);
  console.log('✓ Copied icons/');
}

// 3. Copy root files from next/dist (index.html, _redirects, _headers, etc.)
const distEntries = fs.readdirSync(distDir, { withFileTypes: true });
for (const entry of distEntries) {
  if (entry.isFile()) {
    const srcPath = path.join(distDir, entry.name);
    const destPath = path.join(rootDir, entry.name);
    fs.copyFileSync(srcPath, destPath);
    console.log(`✓ Copied ${entry.name}`);
  }
}

// 4. Create 404.html as a copy of index.html for SPA routing (e.g. GitHub Pages)
const indexHtmlPath = path.join(rootDir, 'index.html');
const fallback404Path = path.join(rootDir, '404.html');
if (fs.existsSync(indexHtmlPath)) {
  fs.copyFileSync(indexHtmlPath, fallback404Path);
  console.log('✓ Created 404.html (SPA fallback for GitHub Pages / static hosting)');
}

console.log('\nDeployment to root completed successfully!');
