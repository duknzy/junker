import fs from 'fs';

const log = fs.readFileSync('C:\\Users\\kokih\\.gemini\\antigravity-ide\\brain\\2acc5d4e-a9d9-4497-975d-2463544dda0e\\.system_generated\\tasks\\task-729.log', 'utf8');
const jsonStart = log.indexOf('{');
const obj = JSON.parse(log.slice(jsonStart));
const text = obj.candidates[0].content.parts[0].text;
const problem = JSON.parse(text);

function formatKyotsuSectionText(rawText) {
    if (!rawText) return '';
    let s = String(rawText);
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
            });
        }
    }
    return parts.join('').replace(/\n/g, '<br>');
}

console.log('=== PROBLEM TITLE ===');
console.log(problem.title);

problem.sections.forEach((sec, i) => {
    console.log(`\n=== SECTION ${i+1} (${sec.section_id}) ===`);
    const formatted = formatKyotsuSectionText(sec.section_text);
    console.log(formatted);
    console.log(`Marks in JSON:`, sec.marks.map(m => m.id));
    // Find all mark slots in formatted text
    const spanMarks = [...formatted.matchAll(/data-mark-id="([^"]+)"/g)].map(m => m[1]);
    const mathMarks = [...formatted.matchAll(/slot-mark-([\u30A2-\u30F3a-zA-Z0-9\u00B1]+)/g)].map(m => m[1]);
    console.log(`Found span marks:`, spanMarks);
    console.log(`Found math marks:`, mathMarks);
    const allFound = [...spanMarks, ...mathMarks];
    const missing = sec.marks.filter(m => !allFound.includes(m.id));
    if (missing.length > 0) {
        console.error(`MISSING MARKS IN TEXT:`, missing.map(m => m.id));
    } else {
        console.log(`ALL MARKS FOUND SUCCESSFULLY!`);
    }
});
