import { execSync } from 'child_process';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const target = 'C:\\Users\\kokih\\.gemini\\antigravity-ide\\brain\\2acc5d4e-a9d9-4497-975d-2463544dda0e\\test_render.png';
const cmd = `"${edgePath}" --headless --virtual-time-budget=5000 --window-size=1000,900 --screenshot="${target}" http://localhost:3000/scripts/test_mathjax.html`;
execSync(cmd);
console.log('Saved screenshot to:', target);
