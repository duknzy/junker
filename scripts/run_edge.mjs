import { execSync } from 'child_process';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const cmd = `"${edgePath}" --headless --virtual-time-budget=8000 --dump-dom http://localhost:3000/scripts/test_mathjax.html`;
const out = execSync(cmd, { encoding: 'utf8' });
const match = out.match(/<div id="out">([\s\S]*?)<\/div>/);
console.log('OUT DIV:', match ? match[1] : 'NOT FOUND');
