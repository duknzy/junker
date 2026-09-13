import { execSync } from 'child_process';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const target = 'C:\\Users\\kokih\\.gemini\\antigravity-ide\\brain\\2acc5d4e-a9d9-4497-975d-2463544dda0e\\ai_settings_cards.png';
// feature-card-kyotsu_sprint までスクロールさせて撮影
const cmd = `"${edgePath}" --headless --virtual-time-budget=5000 --window-size=1200,1200 --screenshot="${target}" "http://localhost:3000/ai-settings.html#feature-card-kyotsu_sprint"`;
execSync(cmd);
console.log('Saved ai_settings_cards.png');
