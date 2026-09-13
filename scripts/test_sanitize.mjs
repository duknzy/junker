function sanitizeMathDelimiters(text) {
    if (!text) return "";
    let s = String(text);

    // 1. TeX コマンド (\leqq, \sqrt, \frac 等) を含むのに $ で始まっていないブロックを修復
    // 例: "およびa = [ セ ] + \sqrt{ [ ソ ] }$" -> "および$a = [ セ ] + \sqrt{ [ ソ ] }$"
    // 例: "また、0 \leqq x \leqq 2におけるf(x)$" -> "また、$0 \leqq x \leqq 2$における$f(x)$"
    s = s.replace(/([、。・\s]|^)([0-9a-zA-Z\(\[\{\s\+\-\=]*\\[a-zA-Z]+[^\$]*?)\$/g, (match, prefix, mathPart) => {
        return `${prefix}$${mathPart.trim()}$`;
    });

    // 2. 助詞の直後で閉じ忘れられた $ を修復
    // 例: "$0 \leqq x \leqq 2におけるf(x)$" -> "$0 \leqq x \leqq 2$における$f(x)$"
    s = s.replace(/\$([^\$\n]*?)(における|のとき|となる|について)([^\$\n]*?)\$/g, (match, before, particle, after) => {
        return `$${before.trim()}$${particle}$${after.trim()}$`;
    });

    // 2. 日本語の助詞・接続語が $ ... $ の中に紛れ込んでいる場合を分割
    // 例: "$M(a) = -a^2 + [ キ ] a・0 \leqq a \leqq 2のとき、M(a) = [ ク ] a$"
    s = s.replace(/\$([^\$\n]+)\$/g, (match, inner) => {
        // inner の中に "のとき" や "・" や "において" や "となる" などの日本語が入っている場合
        if (/([のとき|において|となる|または|および|であり|とする|・])/.test(inner)) {
            // 日本語の境界で $ を閉じて開き直す
            let split = inner.replace(/([、。・\s]+(?:のとき|において|となる|または|および|であり|とする)[、。・\s]*)/g, '$$$1$$');
            // 余分な空数式 $$ を除去
            split = split.replace(/\$\$/g, '');
            return `$${split}$`;
        }
        return match;
    });

    return s;
}

function formatKyotsuSectionText(rawText) {
    if (!rawText) return "";
    let s = sanitizeMathDelimiters(rawText);

    // $$ ... $$ と $ ... $ を安全に分割
    const parts = s.split(/(\$\$[\s\S]*?\$\$|\$[^\$\n]+?\$)/g);
    for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 1) {
            // 数式ブロック内（$ ... $）
            let inner = parts[i];
            let isDisplay = inner.startsWith("$$");
            let delim = isDisplay ? "$$" : "$";
            let mathContent = inner.slice(delim.length, -delim.length);

            // 数式内にあるマーク [ア] を MathJax が解釈できる \cssId と \class と \bbox に置換
            mathContent = mathContent.replace(/\[\s*([ア-ンa-zA-Z0-9±]{1,4})\s*\]/g, (match, markId) => {
                return `\\cssId{slot-mark-${markId}}{\\class{kyotsu-mark-slot}{\\bbox[2px,border:1.5px solid #059669;border-radius:4px;padding:1px 6px;background:rgba(5,150,105,0.08);color:#059669;font-weight:bold;cursor:pointer]{\\text{${markId}}}}}`;
            });
            parts[i] = delim + mathContent + delim;
        } else {
            // テキストブロック内（日本語文）
            // テキスト内にあるマーク [ア] を クリック可能な HTML span に置換
            parts[i] = parts[i].replace(/\[\s*([ア-ンa-zA-Z0-9±]{1,4})\s*\]/g, (match, markId) => {
                return `<span class="kyotsu-mark-slot" data-mark-id="${markId}" id="slot-mark-${markId}">[ ${markId} ]</span>`;
            });
        }
    }
    return parts.join("").replace(/\n/g, "<br>");
}

// テスト: ユーザーのスクリーンショットにあった3つの小問テキスト
const testCases = [
    `a = 3 のとき、f(x) = -x^2 + 6x + 3 となる。このとき、y = f(x) のグラフの頂点の座標は $([ ア ], [ イウ ])$である。また、0 \\leqq x \\leqq 2におけるf(x)$の最大値は $[ エオ ]$、最小値は $[ カ ]$ である。`,
    `・$a < 0$ のとき、$M(a) = -a^2 + [ キ ] a・0 \\leqq a \\leqq 2のとき、M(a) = [ ク ] a・a > 2のとき、M(a) = -a^2 + [ ケ ] a - [ コ ] $`,
    `(ii) M(a) = 7 となる a の値は、小さい順に $a = \\frac{ [ シ ] }{ [ ス ] }$およびa = [ セ ] + \\sqrt{ [ ソ ] }$ である。`
];

testCases.forEach((tc, idx) => {
    console.log(`--- TEST ${idx + 1} ---`);
    const formatted = formatKyotsuSectionText(tc);
    console.log(formatted);
});
