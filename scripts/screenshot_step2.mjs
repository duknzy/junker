import { execSync } from 'child_process';
import fs from 'fs';

// custom-sprint.html に STEP 2 を自動で開くスクリプトを一時的に付与したファイルを作る
const html = fs.readFileSync('custom-sprint.html', 'utf8');
const modifiedHtml = html.replace(
    'let currentMode = "speed";',
    `let currentMode = "kyotsu"; 
     window.addEventListener("DOMContentLoaded", () => { 
       setTimeout(() => { 
         switchMode("kyotsu"); 
         setTimeout(() => { 
           document.getElementById("btn-kyotsu-proceed-step2")?.click(); 
         }, 500); 
       }, 500); 
     });`
);
fs.writeFileSync('temp_step2.html', modifiedHtml);

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const target = 'C:\\Users\\kokih\\.gemini\\antigravity-ide\\brain\\2acc5d4e-a9d9-4497-975d-2463544dda0e\\kyotsu_step2.png';
const cmd = `"${edgePath}" --headless --virtual-time-budget=5000 --window-size=1200,1200 --screenshot="${target}" "http://localhost:3000/temp_step2.html"`;
execSync(cmd);
fs.unlinkSync('temp_step2.html');
console.log('Saved kyotsu_step2.png');
