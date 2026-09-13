import { execSync } from 'child_process';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const target = 'C:\\Users\\kokih\\.gemini\\antigravity-ide\\brain\\2acc5d4e-a9d9-4497-975d-2463544dda0e\\kyotsu_mode_screen.png';
const cmd = `"${edgePath}" --headless --virtual-time-budget=5000 --window-size=1200,900 --screenshot="${target}" "http://localhost:3000/custom-sprint.html?mode=kyotsu"`;
execSync(cmd);
console.log('Saved kyotsu_mode_screen.png');
