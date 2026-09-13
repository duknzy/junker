import { execSync } from 'child_process';
import fs from 'fs';

// custom-sprint.html に一時的に自動で kyotsu モードに切り替えるコードを注入したテストページを作るか、
// または Edge の DevTools Protocol / evaluate を使う。
// 簡易的に test_kyotsu_ui.html を作り、custom-sprint.html の内容を読み込んで
// 初期選択を mode-kyotsu にした状態でレンダリングさせる。

const html = fs.readFileSync('custom-sprint.html', 'utf8');
const modifiedHtml = html.replace(
    'let currentMode = "speed";',
    'let currentMode = "kyotsu"; window.addEventListener("DOMContentLoaded", () => { setTimeout(() => { document.querySelector(\'[data-mode="kyotsu"]\')?.click(); }, 300); });'
);
fs.writeFileSync('scripts/test_kyotsu_ui.html', modifiedHtml);

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const target = 'C:\\Users\\kokih\\.gemini\\antigravity-ide\\brain\\2acc5d4e-a9d9-4497-975d-2463544dda0e\\app_kyotsu_mode.png';
const cmd = `"${edgePath}" --headless --virtual-time-budget=4000 --window-size=1200,900 --screenshot="${target}" http://localhost:3000/scripts/test_kyotsu_ui.html`;
execSync(cmd);
console.log('Saved app_kyotsu_mode.png');
