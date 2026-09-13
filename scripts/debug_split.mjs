import fs from 'fs';

const log = fs.readFileSync('C:\\Users\\kokih\\.gemini\\antigravity-ide\\brain\\2acc5d4e-a9d9-4497-975d-2463544dda0e\\.system_generated\\tasks\\task-500.log', 'utf8');
const jsonMatch = log.match(/OUTPUT:\s*([\s\S]*)/);
if (!jsonMatch) {
    console.error('No JSON found in log');
    process.exit(1);
}
const apiRes = JSON.parse(jsonMatch[1]);
const text = apiRes.candidates[0].content.parts[0].text;
const prob = JSON.parse(text);

function formatKyotsuSectionText(rawText) {
    if (!rawText) return "";
    let s = String(rawText);

    // $$ ... $$ と $ ... $ を安全に分割
    const parts = s.split(/(\$\$[\s\S]*?\$\$|\$[^\$\n]+?\$)/g);
    for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 1) {
            // 数式ブロック内（$ ... $）
            let inner = parts[i];
            let isDisplay = inner.startsWith("$$");
            let delim = isDisplay ? "$$" : "$";
            let mathContent = inner.slice(delim.length, -delim.length);

            mathContent = mathContent.replace(/\[\s*([ア-ンa-zA-Z0-9±]{1,4})\s*\]/g, (match, markId) => {
                return `\\cssId{slot-mark-${markId}}{\\class{kyotsu-mark-slot}{\\bbox[2px,border:1.5px solid #059669;border-radius:4px;padding:1px 6px;background:rgba(5,150,105,0.08);color:#059669;font-weight:bold;cursor:pointer]{\\text{${markId}}}}}`;
            });
            parts[i] = delim + mathContent + delim;
        } else {
            // テキストブロック内（日本語文）
            parts[i] = parts[i].replace(/\[\s*([ア-ンa-zA-Z0-9±]{1,4})\s*\]/g, (match, markId) => {
                return `<span class="kyotsu-mark-slot" data-mark-id="${markId}" id="slot-mark-${markId}">[ ${markId} ]</span>`;
            });
        }
    }
    return parts.join("").replace(/\n/g, "<br>");
}

prob.sections.forEach((sec, idx) => {
    console.log(`=== SECTION ${sec.section_id} ===`);
    console.log('RAW:');
    console.log(sec.section_text);
    console.log('FORMATTED:');
    const f = formatKyotsuSectionText(sec.section_text);
    console.log(f);
});
