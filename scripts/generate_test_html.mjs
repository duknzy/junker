import fs from 'fs';
import { execSync } from 'child_process';

const log = fs.readFileSync('C:\\Users\\kokih\\.gemini\\antigravity-ide\\brain\\2acc5d4e-a9d9-4497-975d-2463544dda0e\\.system_generated\\tasks\\task-729.log', 'utf8');
const jsonStart = log.indexOf('{');
const apiRes = JSON.parse(log.slice(jsonStart));
const text = apiRes.candidates[0].content.parts[0].text;
const prob = JSON.parse(text);

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Hiragino Kaku Gothic ProN", Meiryo, sans-serif;
    padding: 2rem;
    background: #f8fafc;
    color: #1e293b;
    line-height: 1.8;
}
.kyotsu-mark-slot, mjx-mstyle.kyotsu-mark-slot, [id^="slot-mark-"] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 32px;
    height: 26px;
    padding: 0 6px;
    margin: 0 3px;
    background: #fff;
    border: 2px solid #059669;
    border-radius: 4px;
    color: #059669;
    font-weight: 800;
    font-size: 0.95rem;
    cursor: pointer !important;
    vertical-align: middle;
}
.kyotsu-mark-slot.active, mjx-mstyle.kyotsu-mark-slot.active, [id^="slot-mark-"].active {
    box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.35) !important;
    outline: 2px solid #059669 !important;
}
.sec-card {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 1.5rem;
    margin-top: 1.5rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.03);
}
.sec-head {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-weight: 800;
    font-size: 1.1rem;
    margin-bottom: 1rem;
    color: #0f172a;
}
.sec-badge {
    background: #059669;
    color: #fff;
    padding: 2px 10px;
    border-radius: 6px;
    font-size: 0.85rem;
}
.choice-box {
    margin-top: 1rem;
    padding: 1rem;
    background: #f1f5f9;
    border-radius: 6px;
    border-left: 4px solid #059669;
}
.choice-item {
    padding: 4px 0;
}
</style>
<script>
window.MathJax = {
  loader: { load: ['[tex]/bbox', '[tex]/color', '[tex]/html'] },
  tex: {
    packages: { '[+]': ['bbox', 'color', 'html'] },
    inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
    displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']]
  }
};
</script>
<script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"></script>
</head>
<body>
<h2 style="color: #059669; margin-top: 0;">${prob.title}</h2>
<div id="content"></div>
<div id="out" style="margin-top: 1rem; font-weight: bold;"></div>

<script>
function formatKyotsuSectionText(rawText) {
    if (!rawText) return "";
    let s = String(rawText).replace(/\\n(?![a-zA-Z])/g, "\n");

    const parts = s.split(/(\\$\\$[\\s\\S]*?\\$\\$|\\$[^\\$\\n]+?\\$)/g);
    for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 1) {
            let inner = parts[i];
            let isDisplay = inner.startsWith("$$");
            let delim = isDisplay ? "$$" : "$";
            let mathContent = inner.slice(delim.length, -delim.length);

            mathContent = mathContent.replace(/\\[\\s*([ア-ンa-zA-Z0-9±]{1,4})\\s*\\]/g, (match, markId) => {
                return "\\\\cssId{slot-mark-" + markId + "}{\\\\class{kyotsu-mark-slot}{\\\\bbox[border:1.5px solid #059669]{\\\\text{" + markId + "}}}}";
            });
            parts[i] = delim + mathContent + delim;
        } else {
            parts[i] = parts[i].replace(/\\[\\s*([ア-ンa-zA-Z0-9±]{1,4})\\s*\\]/g, (match, markId) => {
                return '<span class="kyotsu-mark-slot" data-mark-id="' + markId + '" id="slot-mark-' + markId + '">[ ' + markId + ' ]</span>';
            }).replace(/\\n/g, "<br>");
        }
    }
    return parts.join("");
}

const problemData = ${JSON.stringify(prob)};

const container = document.getElementById("content");
let html = '<div style="background:#e0f2fe; padding:1.2rem; border-radius:8px; border:1px solid #bae6fd; font-weight:500;">' + formatKyotsuSectionText(problemData.context_text) + '</div>';
problemData.sections.forEach(sec => {
  let choicesHtml = "";
  if (sec.choices_groups && sec.choices_groups.length > 0) {
    choicesHtml = sec.choices_groups.map(grp => \`
      <div class="choice-box">
        <div style="font-weight:700; margin-bottom:0.5rem; color:#059669;">📌 [ \${grp.target_marks} ] の解答群</div>
        \${grp.options.map(opt => \`<div class="choice-item">\${opt}</div>\`).join("")}
      </div>
    \`).join("");
  }
  html += \`
    <div class="sec-card">
      <div class="sec-head">
        <span class="sec-badge">\${sec.section_id}</span>
        <span>\${sec.section_title || ""}</span>
      </div>
      <div>\${formatKyotsuSectionText(sec.section_text)}</div>
      \${choicesHtml}
    </div>
  \`;
});
container.innerHTML = html;

window.addEventListener('load', () => {
  setTimeout(() => {
    const allMarks = [];
    problemData.sections.forEach(s => s.marks.forEach(m => allMarks.push(m.id)));
    const found = {};
    allMarks.forEach(s => {
      const el = document.getElementById('slot-mark-' + s);
      found[s] = !!el;
    });
    document.getElementById('out').textContent = JSON.stringify({
      totalMarks: allMarks.length,
      foundAllSlots: Object.values(found).every(Boolean),
      foundDetails: found
    });
  }, 1500);
});
</script>
</body>
</html>`;

fs.writeFileSync('scripts/test_mathjax.html', html);
console.log('Saved test_mathjax.html');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const target = 'C:\\Users\\kokih\\.gemini\\antigravity-ide\\brain\\2acc5d4e-a9d9-4497-975d-2463544dda0e\\test_render.png';
execSync(`"${edgePath}" --headless --virtual-time-budget=4000 --window-size=1000,1000 --screenshot="${target}" http://localhost:3000/scripts/test_mathjax.html`);
console.log('Saved screenshot to:', target);
