import fs from 'fs';
import { execSync } from 'child_process';

const testCases = [
  { id: '1', math: 'f(x) = x^2 - \\cssId{slot-mark-ア}{\\class{kyotsu-mark-slot}{\\bbox[border:1.5px solid #059669]{\\text{ア}}}}x' },
  { id: '2', math: 'f(x) = x^2 - \\bbox[border:1.5px solid #059669]{\\text{ア}}x' },
  { id: '3', math: 'f(x) = x^2 - \\class{kyotsu-mark-slot}{\\text{ア}}x' },
  { id: '4', math: 'f(x) = x^2 - \\cssId{slot-mark-ア}{\\text{ア}}x' },
  { id: '5', math: 'f(x) = x^2 - \\boxed{\\text{ア}}x' },
  { id: '6', math: 'f(x) = x^2 - \\fbox{\\text{ア}}x' }
];

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<script>
window.MathJax = {
  loader: { load: ['[tex]/bbox', '[tex]/color', '[tex]/html'] },
  tex: {
    packages: { '[+]': ['bbox', 'color', 'html'] },
    inlineMath: [['$', '$']]
  }
};
</script>
<script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"></script>
</head>
<body>
${testCases.map(tc => `<div id="tc-${tc.id}"><h3>Test ${tc.id}</h3><p>$${tc.math}$</p></div>`).join('\n')}
</body>
</html>`;

fs.writeFileSync('scripts/test_cases.html', html);
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const target = 'C:\\Users\\kokih\\.gemini\\antigravity-ide\\brain\\2acc5d4e-a9d9-4497-975d-2463544dda0e\\test_cases.png';
execSync(`"${edgePath}" --headless --virtual-time-budget=3000 --window-size=800,800 --screenshot="${target}" http://localhost:3000/scripts/test_cases.html`);
console.log('Saved test_cases.png');
