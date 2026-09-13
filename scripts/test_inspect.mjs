import fs from 'fs';

const log = fs.readFileSync('C:\\Users\\kokih\\.gemini\\antigravity-ide\\brain\\2acc5d4e-a9d9-4497-975d-2463544dda0e\\.system_generated\\tasks\\task-729.log', 'utf8');
const jsonStart = log.indexOf('{');
const apiRes = JSON.parse(log.slice(jsonStart));
const text = apiRes.candidates[0].content.parts[0].text;
const prob = JSON.parse(text);

function formatKyotsuSectionText(rawText) {
    if (!rawText) return '';
    let s = String(rawText).replace(/\\n/g, '\n');

    const parts = s.split(/(\$\$[\s\S]*?\$\$|\$[^\$\n]+?\$)/g);
    for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 1) {
            let inner = parts[i];
            let isDisplay = inner.startsWith('$$');
            let delim = isDisplay ? '$$' : '$';
            let mathContent = inner.slice(delim.length, -delim.length);

            mathContent = mathContent.replace(/\[\s*([\u30A2-\u30F3a-zA-Z0-9\u00B1]{1,4})\s*\]/g, (match, markId) => {
                return `\\cssId{slot-mark-${markId}}{\\class{kyotsu-mark-slot}{\\bbox[border:1.5px solid #059669]{\\text{${markId}}}}}`;
            });
            parts[i] = delim + mathContent + delim;
        } else {
            parts[i] = parts[i].replace(/\[\s*([\u30A2-\u30F3a-zA-Z0-9\u00B1]{1,4})\s*\]/g, (match, markId) => {
                return `<span class="kyotsu-mark-slot" data-mark-id="${markId}" id="slot-mark-${markId}">[ ${markId} ]</span>`;
            }).replace(/\n/g, '<br>');
        }
    }
    return parts.join('');
}

console.log('--- Section 1 formatted:');
console.log(formatKyotsuSectionText(prob.sections[0].section_text));
console.log('\n--- Section 2 formatted:');
console.log(formatKyotsuSectionText(prob.sections[1].section_text));
