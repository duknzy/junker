// 文系数学の図（SVG）データ
// question: 問題文の下に表示 / answer: 模範解答の直後に表示
// 座標・長さは「見やすさ優先」の模式図であり、厳密な作図比ではない。

const FONT = "'Segoe UI', 'Hiragino Sans', sans-serif";
const ACCENT = "#10b981";

const S_MAIN = 'stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round" stroke-linecap="round"';
const S_THIN = 'stroke="currentColor" stroke-width="1.5" fill="none" stroke-linejoin="round"';
const S_DASH = 'stroke="currentColor" stroke-width="1.6" stroke-dasharray="6 5" fill="none" opacity="0.75"';
const S_GRID = 'stroke="currentColor" stroke-width="1.2" opacity="0.35" fill="none"';
const SHADE = 'fill="#10b981" fill-opacity="0.18" stroke="none"';

function svg(w, h, aria, body) {
    return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${aria}">${body}</svg>`;
}
function line(x1, y1, x2, y2, style = S_MAIN) {
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${style}/>`;
}
function seg(a, b, style = S_MAIN) {
    return line(a[0], a[1], b[0], b[1], style);
}
function poly(points, style = S_MAIN) {
    return `<polygon points="${points.map(p => p.join(",")).join(" ")}" ${style}/>`;
}
function path(d, style = S_MAIN) {
    return `<path d="${d}" ${style}/>`;
}
function circle(cx, cy, r, style = S_MAIN) {
    return `<circle cx="${cx}" cy="${cy}" r="${r}" ${style}/>`;
}
function dot(x, y, r = 4.5) {
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="${ACCENT}"/>`;
}
function dots(list) {
    return `<g>${list.map(([x, y, r]) => dot(x, y, r)).join("")}</g>`;
}
function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function txt(x, y, s, o = {}) {
    return `<text x="${x}" y="${y}" text-anchor="${o.anchor || "middle"}" font-family="${FONT}" font-size="${o.size || 17}" font-weight="${o.weight || 700}" fill="${o.fill || "currentColor"}">${esc(s)}</text>`;
}
function txtRot(x, y, s, deg, o = {}) {
    return `<text x="${x}" y="${y}" text-anchor="${o.anchor || "middle"}" font-family="${FONT}" font-size="${o.size || 17}" font-weight="${o.weight || 700}" fill="${o.fill || "currentColor"}" transform="rotate(${deg} ${x} ${y})">${esc(s)}</text>`;
}
function labels(list) {
    return `<g>${list.map(a => txt(...a)).join("")}</g>`;
}
function arrow(x1, y1, x2, y2, style = S_THIN) {
    const a = Math.atan2(y2 - y1, x2 - x1);
    const L = 9, W = 0.4;
    const p1 = [x2 - L * Math.cos(a - W), y2 - L * Math.sin(a - W)];
    const p2 = [x2 - L * Math.cos(a + W), y2 - L * Math.sin(a + W)];
    return line(x1, y1, x2, y2, style) + `<path d="M${x2},${y2} L${p1[0]},${p1[1]} L${p2[0]},${p2[1]} Z" fill="currentColor"/>`;
}
function plane(w, h, xmin, xmax, ymin, ymax, pad = 42) {
    const X = x => pad + (x - xmin) / (xmax - xmin) * (w - 2 * pad);
    const Y = y => h - pad - (y - ymin) / (ymax - ymin) * (h - 2 * pad);
    return { w, h, xmin, xmax, ymin, ymax, X, Y };
}
function axes(P, xn = "x", yn = "y") {
    const y0 = P.Y(Math.max(P.ymin, Math.min(0, P.ymax)));
    const x0 = P.X(Math.max(P.xmin, Math.min(0, P.xmax)));
    let s = "";
    s += arrow(P.X(P.xmin) + 8, y0, P.X(P.xmax) - 4, y0);
    s += arrow(x0, P.Y(P.ymin) - 8, x0, P.Y(P.ymax) + 4);
    if (xn) s += txt(P.X(P.xmax) - 6, y0 + 24, xn, { anchor: "end", size: 16 });
    if (yn) s += txt(x0 + 12, P.Y(P.ymax) + 12, yn, { anchor: "start", size: 16 });
    s += txt(x0 - 9, y0 + 22, "O", { anchor: "end", size: 15 });
    return s;
}
function curve(P, f, x1, x2, style = S_MAIN, steps = 160) {
    const pts = [];
    for (let i = 0; i <= steps; i++) {
        const x = x1 + (x2 - x1) * i / steps;
        pts.push(`${P.X(x).toFixed(1)},${P.Y(f(x)).toFixed(1)}`);
    }
    return `<polyline points="${pts.join(" ")}" ${style}/>`;
}
function shadeBetween(P, f, gfn, x1, x2, steps = 120) {
    const top = [], bottom = [];
    for (let i = 0; i <= steps; i++) {
        const x = x1 + (x2 - x1) * i / steps;
        top.push(`${P.X(x).toFixed(1)},${P.Y(f(x)).toFixed(1)}`);
        bottom.push(`${P.X(x).toFixed(1)},${P.Y(gfn(x)).toFixed(1)}`);
    }
    bottom.reverse();
    return `<polygon points="${top.concat(bottom).join(" ")}" ${SHADE}/>`;
}
function figureBody(parts) {
    return parts.join("");
}
function graph(w, h, xmin, xmax, ymin, ymax, draw, aria = "関数のグラフ", pad = 46) {
    const P = plane(w, h, xmin, xmax, ymin, ymax, pad);
    return svg(w, h, aria, axes(P) + draw(P));
}
function graphN(w, h, xmin, xmax, ymin, ymax, draw, aria, xn, yn, pad = 46) {
    const P = plane(w, h, xmin, xmax, ymin, ymax, pad);
    return svg(w, h, aria, axes(P, xn, yn) + draw(P));
}
function panel(ox, w, h, xmin, xmax, ymin, ymax, draw, pad = 34) {
    const P = plane(w, h, xmin, xmax, ymin, ymax, pad);
    return `<g transform="translate(${ox},0)">${axes(P) + draw(P)}</g>`;
}
function panelXY(ox, oy, w, h, xmin, xmax, ymin, ymax, draw, pad = 34) {
    const P = plane(w, h, xmin, xmax, ymin, ymax, pad);
    return `<g transform="translate(${ox},${oy})">${axes(P) + draw(P)}</g>`;
}
function openDot(x, y, r = 5) {
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="currentColor" stroke-width="2"/>`;
}
function arcShade(cx, cy, r, a1, a2, steps = 90) {
    const pts = [];
    for (let i = 0; i <= steps; i++) {
        const a = a1 + (a2 - a1) * i / steps;
        pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy - r * Math.sin(a)).toFixed(1)}`);
    }
    return `<polygon points="${pts.join(" ")}" ${SHADE}/>`;
}
function arcStroke(cx, cy, r, a1, a2, width = 5, steps = 96) {
    const pts = [];
    for (let i = 0; i <= steps; i++) {
        const a = a1 + (a2 - a1) * i / steps;
        pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy - r * Math.sin(a)).toFixed(1)}`);
    }
    return `<polyline points="${pts.join(" ")}" stroke="${ACCENT}" stroke-width="${width}" fill="none" stroke-linecap="round"/>`;
}
function unitCircle(cx, cy, r, arm = 44) {
    return arrow(cx - r - arm, cy, cx + r + arm, cy)
        + arrow(cx, cy + r + arm, cx, cy - r - arm)
        + circle(cx, cy, r, S_THIN)
        + txt(cx - 8, cy + 20, "O", { size: 13, anchor: "end" });
}
function polar(cx, cy, r, deg) {
    const a = deg * Math.PI / 180;
    return [cx + r * Math.cos(a), cy - r * Math.sin(a)];
}

// ===========================================================================
// 例題
// ===========================================================================
const REIDAI = {
    25: {
        question: {
            svg: svg(760, 360, "図1はAB=5、AC=8、角A=60度の三角形ABC。図2はAC=4、角A=120度の三角形ABC。", figureBody([
                txt(190, 28, "図1", { size: 16 }),
                txt(570, 28, "図2", { size: 16 }),
                poly([[70, 80], [200, 80], [174, 260]]),
                labels([
                    [134, 70, "5", { size: 15 }],
                    [100, 176, "8", { size: 15, anchor: "end" }],
                    [210, 178, "BC", { size: 14, anchor: "start" }],
                    [98, 112, "60°", { anchor: "start", size: 14 }],
                    [56, 96, "A", { size: 16 }],
                    [208, 72, "B", { size: 16 }],
                    [180, 282, "C", { size: 16 }]
                ]),
                poly([[450, 240], [480, 292], [550, 67]]),
                labels([
                    [464, 208, "4", { size: 15, anchor: "end" }],
                    [506, 156, "AC", { size: 14, anchor: "start" }],
                    [496, 250, "120°", { anchor: "start", size: 14 }],
                    [438, 224, "A", { size: 16, anchor: "end" }],
                    [474, 314, "B", { size: 16 }],
                    [564, 58, "C", { size: 16 }],
                    [580, 226, "sin B = 2/√7", { anchor: "start", size: 13, weight: 600 }]
                ])
            ])),
            caption: "図1：AB = 5, AC = 8, ∠A = 60°　／　図2：AC = 4, ∠A = 120°, sin B = 2/√7"
        }
    },
    26: {
        question: {
            svg: svg(420, 330, "AB=2、BC=4、CA=3の三角形ABCと、角Aの二等分線AD。", figureBody([
                poly([[156, 160], [80, 240], [300, 240]]),
                seg([156, 160], [168, 240], S_THIN),
                labels([
                    [110, 190, "2", { size: 15 }],
                    [236, 186, "3", { size: 15 }],
                    [214, 264, "4", { size: 15 }],
                    [148, 148, "A", { size: 16 }],
                    [64, 262, "B", { size: 16 }],
                    [314, 262, "C", { size: 16 }],
                    [158, 262, "D", { size: 15, anchor: "end" }],
                    [188, 204, "AD", { anchor: "start", size: 13, weight: 600 }]
                ]),
                dots([[156, 160], [80, 240], [300, 240], [168, 240]])
            ])),
            caption: "AD は ∠A の二等分線である。"
        }
    },
    28: {
        answer: {
            svg: svg(440, 330, "3辺の比が3対7対8の三角形ABCとその内接円。", figureBody([
                poly([[280, 121], [360, 260], [300, 260]]),
                circle(320, 237, 23, S_THIN),
                labels([
                    [346, 190, "8", { size: 15, anchor: "start" }],
                    [266, 190, "7", { size: 15, anchor: "end" }],
                    [330, 286, "3", { size: 15 }],
                    [272, 108, "A", { size: 16 }],
                    [372, 282, "B", { size: 16 }],
                    [292, 286, "C", { size: 16 }]
                ])
            ])),
            caption: "sin A : sin B : sin C = 3 : 7 : 8 より、BC : CA : AB = 3 : 7 : 8。I は内接円の中心。"
        }
    },
    29: {
        question: {
            svg: svg(520, 360, "円に内接する四角形ABCD。AB=2、BC=3、CD=4、DA=2。", figureBody([
                circle(260, 180, 120, S_THIN),
                poly([[147, 221], [301, 293], [378, 159], [219, 67]]),
                labels([
                    [212, 268, "2", { size: 15 }],
                    [350, 238, "3", { size: 15 }],
                    [310, 96, "4", { size: 15 }],
                    [166, 132, "2", { size: 15 }],
                    [130, 236, "A", { size: 16 }],
                    [310, 312, "B", { size: 16 }],
                    [394, 156, "C", { size: 16 }],
                    [212, 54, "D", { size: 16 }]
                ])
            ])),
            caption: "四角形 ABCD は円に内接する。対角線 BD の長さと四角形の面積を求める。"
        }
    },
    30: {
        question: {
            svg: svg(440, 380, "四面体OABC。Oから平面ABCへ垂線OHを下ろす。", figureBody([
                poly([[90, 300], [330, 270], [230, 340]]),
                seg([220, 70], [90, 300], S_MAIN),
                seg([220, 70], [330, 270], S_MAIN),
                seg([220, 70], [230, 340], S_MAIN),
                seg([220, 70], [210, 300], S_DASH),
                labels([
                    [214, 56, "O", { size: 16 }],
                    [72, 318, "A", { size: 16 }],
                    [344, 272, "B", { size: 16 }],
                    [238, 360, "C", { size: 16 }],
                    [194, 306, "H", { size: 14, anchor: "end" }],
                    [126, 178, "7", { size: 14 }],
                    [292, 160, "7", { size: 14 }],
                    [246, 200, "7", { size: 14, anchor: "start" }],
                    [210, 278, "5", { size: 14 }],
                    [292, 300, "7", { size: 14, anchor: "start" }],
                    [148, 312, "8", { size: 14, anchor: "end" }]
                ])
            ])),
            caption: "四面体 OABC（OA = OB = OC = 7, AB = 5, BC = 7, CA = 8）。OH ⊥ 平面 ABC。"
        }
    },
    39: {
        question: {
            svg: svg(520, 430, "AからBへ向かう道路の格子図。PはAから右に2・上に1、Qは右に3・上に3の位置にある。", figureBody([
                `<g ${S_GRID}>` + [70, 140, 210, 280, 350, 420].map(x => line(x, 70, x, 350)).join("") + [70, 140, 210, 280, 350].map(y => line(70, y, 420, y)).join("") + `</g>`,
                dots([[70, 350], [420, 70], [210, 280], [280, 140]]),
                labels([
                    [56, 380, "A", { size: 18 }],
                    [438, 78, "B", { size: 18, anchor: "start" }],
                    [200, 272, "P", { size: 18, anchor: "end" }],
                    [290, 132, "Q", { size: 18, anchor: "start" }]
                ])
            ])),
            caption: "A を原点とすると、B は右に 5・上に 4 の位置にある。P は右に 2・上に 1、Q は右に 3・上に 3 の位置にある。"
        }
    },
    40: {
        answer: {
            svg: svg(520, 390, "正八角形A1A2A3A4A5A6A7A8。各頂点に印をつける。", figureBody([
                poly([[260, 60], [352, 98], [390, 190], [352, 282], [260, 320], [168, 282], [130, 190], [168, 98]]),
                dots([[260, 60], [352, 98], [390, 190], [352, 282], [260, 320], [168, 282], [130, 190], [168, 98]], 5),
                labels([
                    [260, 42, "A₁", { size: 15 }],
                    [370, 84, "A₂", { size: 15, anchor: "start" }],
                    [404, 194, "A₃", { size: 15, anchor: "start" }],
                    [368, 304, "A₄", { size: 15, anchor: "start" }],
                    [260, 344, "A₅", { size: 15 }],
                    [150, 304, "A₆", { size: 15, anchor: "end" }],
                    [114, 194, "A₇", { size: 15, anchor: "end" }],
                    [150, 84, "A₈", { size: 15, anchor: "end" }]
                ])
            ])),
            caption: "正八角形 A₁A₂…A₈ の頂点を結んで三角形を作る。頂点の黒丸は、2辺を共有する三角形の頂点になる点。"
        }
    },
    51: {
        question: {
            svg: svg(760, 380, "図1は三角形ABCの外心O、図2は三角形ABCの内心Iを示す。", figureBody([
                txt(190, 30, "図1", { size: 18 }),
                txt(570, 30, "図2", { size: 18 }),
                poly([[70, 300], [310, 300], [214, 94]]),
                poly([[450, 300], [690, 300], [648, 64]]),
                `<g ${S_DASH}>` + [
                    line(190, 231, 70, 300), line(190, 231, 310, 300), line(190, 231, 214, 94),
                    line(604, 228, 450, 300), line(604, 228, 690, 300), line(604, 228, 648, 64)
                ].join("") + `</g>`,
                `<g stroke="currentColor" stroke-width="1.6" fill="none" opacity="0.9">` + [
                    path("M 128 300 A 58 58 0 0 0 103.3 252.5"),
                    path("M 112 300 A 42 42 0 0 0 106.4 279"),
                    path("M 188.2 130.9 A 45 45 0 0 0 206.2 138.3"),
                    path("M 508 300 A 58 58 0 0 0 545.3 255.6"),
                    path("M 619.1 98.5 A 45 45 0 0 0 636.4 107.5"),
                    path("M 638.5 257 A 45 45 0 0 0 615.6 184.6")
                ].join("") + `</g>`,
                dots([[190, 231], [604, 228]]),
                labels([
                    [56, 330, "A", { size: 18 }], [326, 330, "B", { size: 18 }], [214, 78, "C", { size: 18 }],
                    [202, 226, "O", { size: 18, anchor: "start" }],
                    [436, 330, "A", { size: 18 }], [706, 330, "B", { size: 18 }], [648, 48, "C", { size: 18 }],
                    [616, 222, "I", { size: 18, anchor: "start" }]
                ]),
                `<g font-family="${FONT}" font-size="16" font-weight="700" fill="currentColor">` + [
                    txt(140, 280, "55°", { anchor: "start", size: 16 }),
                    txt(126, 294, "α", { anchor: "start", size: 16 }),
                    txt(184, 158, "25°", { size: 16 }),
                    txt(516, 275, "50°", { anchor: "start", size: 16 }),
                    txt(612, 124, "25°", { size: 16 }),
                    txt(666, 214, "β", { anchor: "start", size: 16 })
                ].join("") + `</g>`
            ])),
            caption: "図1：点Oは三角形ABCの外心　／　図2：点Iは三角形ABCの内心"
        }
    },
    52: {
        question: {
            svg: svg(520, 360, "三角形ABCと、辺AB上のD、辺BC上のE、AEとCDの交点F、BFとACの交点G。", figureBody([
                poly([[230, 60], [100, 280], [400, 280]]),
                seg([230, 60], [325, 280], S_THIN),
                seg([400, 280], [174, 154], S_THIN),
                seg([100, 280], [348, 212], S_THIN),
                labels([
                    [230, 44, "A", { size: 16 }],
                    [84, 296, "B", { size: 16 }],
                    [414, 296, "C", { size: 16 }],
                    [168, 146, "D", { size: 15 }],
                    [334, 298, "E", { size: 15 }],
                    [306, 222, "F", { size: 15 }],
                    [356, 206, "G", { size: 15 }]
                ]),
                dots([[174, 154], [325, 280], [301, 225], [348, 212]])
            ])),
            caption: "AD : DB = 3 : 4、BE : EC = 3 : 1、F = AE ∩ CD、G = BF ∩ AC"
        }
    },
    53: {
        question: {
            svg: svg(520, 360, "1辺2の正三角形ABC。ABを3対1に内分するP、BCの中点Q、CPとAQの交点R。", figureBody([
                poly([[260, 40], [110, 300], [410, 300]]),
                seg([410, 300], [147, 235], S_THIN),
                seg([260, 40], [260, 300], S_THIN),
                labels([
                    [260, 26, "A", { size: 16 }],
                    [94, 316, "B", { size: 16 }],
                    [424, 316, "C", { size: 16 }],
                    [140, 228, "P", { size: 15, anchor: "end" }],
                    [268, 320, "Q", { size: 15 }],
                    [268, 258, "R", { size: 15 }],
                    [196, 172, "2", { size: 14, anchor: "end" }],
                    [336, 172, "2", { size: 14, anchor: "start" }],
                    [260, 344, "2", { size: 14 }]
                ]),
                dots([[147, 235], [260, 300], [260, 263]])
            ])),
            caption: "正三角形 ABC（1辺 2）。AP : PB = 3 : 1、Q は BC の中点、R = CP ∩ AQ。"
        },
        answer: {
            svg: svg(440, 330, "高さが等しい2つの三角形ABDとACD。BD対DCが2対3。", figureBody([
                poly([[140, 70], [80, 260], [360, 260]]),
                seg([140, 70], [192, 260], S_THIN),
                labels([
                    [140, 54, "A", { size: 16 }],
                    [64, 280, "B", { size: 16 }],
                    [374, 280, "C", { size: 16 }],
                    [192, 282, "D", { size: 15 }],
                    [132, 270, "2", { size: 14, anchor: "end" }],
                    [280, 270, "3", { size: 14 }],
                    [110, 156, "高さは共通", { size: 12, anchor: "end", weight: 600 }]
                ]),
                dots([[192, 260]])
            ])),
            caption: "△ABD と △ACD は高さが等しいので、面積比は底辺の比 BD : DC = 2 : 3 に等しい。"
        }
    },
    54: {
        question: {
            svg: svg(760, 370, "図1は4点B,C,E,Dが同一円周上にある三角形。図2は円Kの接線と直線BCの交点P。", figureBody([
                txt(190, 26, "図1", { size: 16 }),
                txt(570, 26, "図2", { size: 16 }),
                poly([[100, 60], [250, 60], [168, 248]]),
                circle(225, 161, 104, S_THIN),
                labels([
                    [92, 52, "A", { size: 15 }],
                    [258, 52, "B", { size: 15 }],
                    [160, 266, "C", { size: 15 }],
                    [208, 46, "D", { size: 14 }],
                    [116, 126, "E", { size: 14, anchor: "end" }]
                ]),
                dots([[250, 60], [168, 248], [125.5, 130.5], [200, 60]]),
                circle(600, 180, 100, S_THIN),
                seg([443.9, 270.2], [510.3, 135.7], S_MAIN),
                seg([443.9, 270.2], [665.1, 255.9], S_MAIN),
                labels([
                    [500, 122, "A", { size: 15, anchor: "end" }],
                    [538, 286, "B", { size: 15 }],
                    [678, 262, "C", { size: 15, anchor: "start" }],
                    [430, 290, "P", { size: 15, anchor: "end" }],
                    [600, 202, "K", { size: 14 }],
                    [528, 206, "60°", { anchor: "start", size: 13 }]
                ]),
                dots([[600, 180], [510.3, 135.7], [545.2, 263.6], [665.1, 255.9], [443.9, 270.2]])
            ])),
            caption: "図1：4点 B, C, E, D は同一円周上　／　図2：PA は円 K の接線で、P は直線 BC との交点"
        }
    },
    72: {
        answer: {
            svg: svg(520, 380, "座標平面上の3点A(2,0)、B(4,2)、C(3,7)と、内分点D、外分点E、重心G。", figureBody([
                `<g ${S_GRID}>` + [110, 140, 170, 200, 230, 260].map(x => line(x, 90, x, 330)).join("") + [90, 120, 150, 180, 210, 240, 270, 300].map(y => line(80, y, 290, y)).join("") + `</g>`,
                arrow(60, 330, 310, 330),
                arrow(80, 350, 80, 80),
                poly([[140, 320], [200, 260], [170, 110]]),
                seg([140, 320], [220, 240], S_DASH),
                labels([
                    [140, 342, "A", { size: 15 }],
                    [192, 256, "B", { size: 15, anchor: "end" }],
                    [170, 96, "C", { size: 15 }],
                    [172, 288, "D", { size: 14, anchor: "end" }],
                    [230, 232, "E", { size: 14, anchor: "start" }],
                    [160, 222, "G", { size: 14, anchor: "end" }],
                    [66, 342, "O", { size: 14, anchor: "end" }],
                    [300, 348, "x", { size: 14, anchor: "end" }],
                    [68, 88, "y", { size: 14 }]
                ]),
                dots([[140, 320], [200, 260], [170, 110], [180, 280], [220, 240], [170, 230]])
            ])),
            caption: "A(2,0), B(4,2), C(3,7)。D は AB を 2:1 に内分する点、E は 4:1 に外分する点、G は △ABC の重心。"
        }
    },
    80: {
        answer: {
            svg: svg(560, 430, "座標平面上の2点A(-2,0)、B(1,0)と、PA対PBが2対1となる点Pの軌跡である円。", figureBody([
                arrow(30, 215, 525, 215),
                arrow(255, 385, 255, 45),
                txt(519, 239, "x", { anchor: "end", size: 15 }),
                txt(267, 57, "y", { anchor: "start", size: 15 }),
                txt(246, 233, "O", { anchor: "end", size: 14 }),
                circle(355, 215, 100, S_THIN),
                dots([[155, 215], [305, 215], [415, 135]]),
                seg([415, 135], [155, 215], S_DASH),
                seg([415, 135], [305, 215], S_DASH),
                labels([
                    [155, 239, "A", { size: 15 }],
                    [305, 239, "B", { size: 15 }],
                    [425, 129, "P", { size: 15, anchor: "start" }],
                    [355, 350, "(x−2)²+y²=4", { size: 13, weight: 600 }]
                ])
            ])),
            caption: "PA : PB = 2 : 1 を満たす点 P の軌跡は、中心 (2,0)、半径 2 の円。"
        }
    },
    107: {
        answer: {
            svg: svg(520, 400, "半径1の球に内接する円柱と、球の中心O、上面の中心A、上面の円周上の点Bからなる三角形OAB。", figureBody([
                circle(260, 190, 130, S_THIN),
                `<ellipse cx="260" cy="100" rx="94" ry="18" ${S_MAIN}/>`,
                `<ellipse cx="260" cy="280" rx="94" ry="18" ${S_MAIN}/>`,
                seg([166, 100], [166, 280], S_MAIN),
                seg([354, 100], [354, 280], S_MAIN),
                seg([260, 190], [260, 100], S_DASH),
                seg([260, 100], [354, 100], S_DASH),
                seg([260, 190], [354, 100], S_DASH),
                labels([
                    [246, 200, "O", { size: 15, anchor: "end" }],
                    [260, 84, "A", { size: 15 }],
                    [366, 96, "B", { size: 15, anchor: "start" }],
                    [246, 164, "h/2", { size: 13, anchor: "end" }],
                    [304, 88, "r", { size: 13 }],
                    [320, 156, "1", { size: 13, anchor: "start" }]
                ]),
                dots([[260, 190], [260, 100], [354, 100]])
            ])),
            caption: "半径 1 の球に内接する円柱。O は球の中心、A は上面の円の中心、B は上面の円周上の点で、OA = h/2、AB = r、OB = 1。"
        }
    },
    133: {
        question: {
            svg: svg(520, 390, "正六角形ABCDEFと、ADとBEの交点O、OCの中点G、GEを2対1に内分する点H。", figureBody([
                poly([[130, 190], [195, 77], [325, 77], [390, 190], [325, 303], [195, 303]]),
                seg([130, 190], [390, 190], S_THIN),
                seg([195, 77], [325, 303], S_THIN),
                seg([260, 190], [325, 77], S_THIN),
                seg([292.5, 133.7], [325, 303], S_THIN),
                labels([
                    [112, 194, "A", { size: 16, anchor: "end" }],
                    [186, 64, "B", { size: 16 }],
                    [334, 64, "C", { size: 16 }],
                    [406, 194, "D", { size: 16, anchor: "start" }],
                    [334, 320, "E", { size: 16 }],
                    [186, 320, "F", { size: 16 }],
                    [252, 206, "O", { size: 14, anchor: "end" }],
                    [300, 128, "G", { size: 14, anchor: "start" }],
                    [320, 252, "H", { size: 14, anchor: "start" }]
                ]),
                dots([[260, 190], [292.5, 133.7], [314.2, 246.3]])
            ])),
            caption: "正六角形 ABCDEF。O = AD ∩ BE、G は OC の中点、H は GE を 2 : 1 に内分する点。"
        }
    },
    20: {
        answer: {
            svg: graph(520, 360, -1.2, 4.2, -0.6, 8.5, P => figureBody([
                curve(P, x => x * x - 3 * x + 5, -1.2, 4.2),
                labels([
                    [330, 118, "y = x² − 3x + 5", { size: 13, anchor: "start" }],
                    [250, 296, "頂点 (3/2, 11/4)", { size: 13 }]
                ])
            ]), "放物線 y=x²−3x+5 のグラフ。x軸と共有点をもたない。"),
            caption: "y = x² − 3x + 5 のグラフは常に x 軸の上側にあるため、x² − 3x + 5 > 0 の解はすべての実数。"
        }
    },
    32: {
        answer: {
            svg: svg(560, 300, "箱ひげ図。最小値21、第1四分位数24、中央値29、第3四分位数33、最大値35。", figureBody([
                line(60, 190, 510, 190, S_THIN),
                line(96, 168, 96, 212, S_MAIN),
                line(96, 190, 175, 190, S_MAIN),
                `<rect x="175" y="152" width="236" height="76" fill="none" stroke="currentColor" stroke-width="2"/>`,
                line(306, 152, 306, 228, S_MAIN),
                line(411, 190, 464, 190, S_MAIN),
                line(464, 168, 464, 212, S_MAIN),
                labels([
                    [96, 244, "21", { size: 14 }],
                    [175, 244, "24", { size: 14 }],
                    [306, 244, "29", { size: 14 }],
                    [411, 244, "33", { size: 14 }],
                    [464, 244, "35", { size: 14 }],
                    [96, 148, "最小値", { size: 12 }],
                    [175, 136, "Q₁", { size: 12 }],
                    [306, 136, "中央値", { size: 12 }],
                    [411, 136, "Q₃", { size: 12 }],
                    [464, 148, "最大値", { size: 12 }]
                ])
            ])),
            caption: "最小値 21、第1四分位数 24、中央値 29、第3四分位数 33、最大値 35 の箱ひげ図。"
        }
    },
    38: {
        answer: {
            svg: svg(520, 400, "円形のテーブルに6人が座る図。Aを席1に固定すると、Bは向かいの席4になる。", figureBody([
                circle(260, 195, 120, S_THIN),
                dots([[260, 75], [364, 135], [364, 255], [260, 315], [156, 255], [156, 135]]),
                labels([
                    [260, 62, "①", { size: 14 }],
                    [382, 132, "②", { size: 14, anchor: "start" }],
                    [382, 258, "③", { size: 14, anchor: "start" }],
                    [260, 338, "④", { size: 14 }],
                    [138, 258, "⑤", { size: 14, anchor: "end" }],
                    [138, 132, "⑥", { size: 14, anchor: "end" }],
                    [260, 98, "A", { size: 16, fill: ACCENT }],
                    [260, 302, "B", { size: 16, fill: ACCENT }]
                ])
            ])),
            caption: "A を①の席に固定すると、A の向かいは④の席に決まる。B は④に座る1通り。"
        }
    },
    77: {
        answer: {
            svg: svg(520, 380, "円Cと直線lの交点P、Q、および弦PQの中点M。中心AとMを結ぶ線分はPQに垂直。", figureBody([
                circle(250, 190, 110, S_THIN),
                line(80, 80, 460, 240, S_MAIN),
                line(250, 190, 263.7, 157.4, S_DASH),
                path("M263.7,157.4 L272.9,161.3 L268.6,171.5 L259.4,167.6 Z", S_THIN),
                labels([
                    [240, 182, "A", { size: 15, anchor: "end" }],
                    [158, 110, "P", { size: 15, anchor: "end" }],
                    [370, 206, "Q", { size: 15, anchor: "start" }],
                    [274, 178, "M", { size: 14, anchor: "start" }],
                    [72, 72, "l", { size: 15, anchor: "end" }]
                ]),
                dots([[250, 190], [167.8, 117], [359.7, 197.8], [263.7, 157.4]])
            ])),
            caption: "円の中心 A と弦 PQ の中点 M を結ぶ直線は、弦 PQ と垂直に交わる（AM ⊥ PQ）。"
        }
    },
    82: {
        answer: {
            svg: graph(560, 400, -1.8, 3.8, -1, 9.5, P => {
                const f = x => x * x, g = x => 3 * x;
                return figureBody([
                    shadeBetween(P, f, g, 0, 3),
                    shadeBetween(P, g, f, -1.5, 0),
                    shadeBetween(P, g, f, 3, 3.6),
                    curve(P, f, -1.5, 3.6),
                    curve(P, g, -1.5, 3.6),
                    labels([
                        [418, 92, "y = x²", { size: 13, anchor: "start" }],
                        [96, 64, "y = 3x", { size: 13, anchor: "start" }],
                        [220, 250, "この間が求める領域", { size: 12, weight: 600 }]
                    ])
                ]);
            }, "放物線 y=x² と直線 y=3x で囲まれた領域の図示。"),
            caption: "求める領域は灰色の部分。境界の曲線・直線は含まない。"
        }
    },
    83: {
        answer: {
            svg: graph(520, 400, -1, 5, -1, 5.5, P => {
                const l1 = x => 3 * x - 6, l2 = x => -x / 3 + 4, l3 = x => -2 * x + 4;
                return figureBody([
                    shadeBetween(P, l2, l3, 0, 2),
                    shadeBetween(P, l2, l1, 2, 3),
                    curve(P, l1, -0.2, 3.6),
                    curve(P, l2, -0.6, 4.6),
                    curve(P, l3, -0.4, 2.6),
                    dots([[P.X(2), P.Y(0)], [P.X(3), P.Y(3)], [P.X(0), P.Y(4)]]),
                    labels([
                        [P.X(2), P.Y(0) + 22, "(2,0)", { size: 12 }],
                        [P.X(3) + 8, P.Y(3) - 6, "(3,3)", { size: 12, anchor: "start" }],
                        [P.X(0) - 8, P.Y(4) - 6, "(0,4)", { size: 12, anchor: "end" }],
                        [P.X(1.0), P.Y(2.6), "D", { size: 14 }],
                        [P.X(4.4), P.Y(2.2), "y = −x/3 + 4", { size: 11, anchor: "end" }],
                        [P.X(3.4), P.Y(0.6), "y = 3x − 6", { size: 11, anchor: "end" }],
                        [P.X(0.4), P.Y(3.4), "y = −2x + 4", { size: 11, anchor: "start" }]
                    ])
                ]);
            }, "3つの不等式が表す領域D（三角形）。"),
            caption: "領域 D は3直線で囲まれた三角形の内部で、境界を含む。"
        }
    },
    84: {
        answer: {
            svg: svg(480, 380, "単位円と直線 y=1/2 の交点。", figureBody([
                arrow(70, 200, 430, 200),
                arrow(240, 340, 240, 40),
                circle(240, 200, 120, S_THIN),
                line(100, 140, 380, 140, S_DASH),
                dots([[344, 140], [136, 140]]),
                labels([
                    [240, 366, "x", { size: 14 }],
                    [252, 40, "y", { size: 14, anchor: "start" }],
                    [226, 220, "O", { size: 14, anchor: "end" }],
                    [120, 134, "1/2", { size: 13, anchor: "end" }],
                    [352, 132, "θ", { size: 14, anchor: "start" }],
                    [136, 128, "θ", { size: 14, anchor: "end" }],
                    [366, 206, "1", { size: 12, anchor: "start" }]
                ])
            ])),
            caption: "単位円上の高さが 1/2 になる点の角を読み取る。"
        }
    },
    87: {
        answer: {
            svg: svg(480, 360, "1、√3、2の直角三角形。角αは合成したときの角。", figureBody([
                poly([[120, 290], [240, 290], [240, 82]]),
                labels([
                    [180, 310, "1", { size: 15 }],
                    [254, 190, "√3", { size: 15, anchor: "start" }],
                    [160, 176, "2", { size: 15, anchor: "end" }],
                    [150, 272, "α", { size: 15 }],
                    [110, 306, "O", { size: 15, anchor: "end" }],
                    [252, 76, "P(1, √3)", { size: 13, anchor: "start" }],
                    [270, 210, "sin x + √3 cos x", { size: 13, anchor: "start" }],
                    [270, 232, "= 2 sin(x + 60°)", { size: 13, anchor: "start" }]
                ]),
                dots([[240, 82]])
            ])),
            caption: "点 P(1, √3) をとると OP = 2、動径 OP の角は 60°。これが合成の図。"
        }
    },
    88: {
        answer: {
            svg: svg(500, 370, "3、4、5の直角三角形。角αは sinα=4/5、cosα=3/5 を満たす角。", figureBody([
                poly([[120, 300], [270, 300], [270, 100]]),
                labels([
                    [195, 320, "3", { size: 15 }],
                    [284, 200, "4", { size: 15, anchor: "start" }],
                    [176, 180, "5", { size: 15, anchor: "end" }],
                    [150, 282, "α", { size: 15 }],
                    [110, 316, "O", { size: 15, anchor: "end" }],
                    [282, 94, "P(3, 4)", { size: 13, anchor: "start" }]
                ]),
                dots([[270, 100]])
            ])),
            caption: "sin α = 4/5、cos α = 3/5 を満たす角 α は、3 : 4 : 5 の直角三角形で表せる。"
        }
    },
    95: {
        answer: {
            svg: graph(560, 400, 0, 10, 0, 60, P => figureBody([
                curve(P, t => t * t - 4 * t + 10, 1, 9),
                line(P.X(1), P.Y(7), P.X(1), P.Y(0), S_DASH),
                line(P.X(2), P.Y(6), P.X(2), P.Y(0), S_DASH),
                line(P.X(9), P.Y(55), P.X(9), P.Y(0), S_DASH),
                dots([[P.X(1), P.Y(7)], [P.X(2), P.Y(6)], [P.X(9), P.Y(55)]]),
                labels([
                    [P.X(1), P.Y(7) - 12, "7", { size: 13 }],
                    [P.X(2), P.Y(6) + 22, "6", { size: 13 }],
                    [P.X(9) - 6, P.Y(55) - 10, "55", { size: 13, anchor: "end" }],
                    [P.X(2.6), P.Y(31), "y = t² − 4t + 10", { size: 13, anchor: "start" }]
                ])
            ]), "1以上9以下における t²−4t+10 のグラフ。"),
            caption: "1 ≦ t ≦ 9 の範囲で、t = 9 のとき最大値 55、t = 2 のとき最小値 6 をとる。"
        }
    },
    100: {
        answer: {
            svg: graph(520, 360, -0.3, 5.5, -4.5, 2.5, P => figureBody([
                curve(P, x => Math.log2(x), 0.06, 5.5),
                line(P.X(1 / 16), P.Y(-4), P.X(1 / 16), P.Y(0), S_DASH),
                line(P.X(4), P.Y(2), P.X(4), P.Y(0), S_DASH),
                dots([[P.X(1 / 16), P.Y(-4)], [P.X(4), P.Y(2)]]),
                labels([
                    [P.X(1.2), P.Y(2.0), "y = log₂ x", { size: 13, anchor: "start" }],
                    [P.X(1 / 16) + 8, P.Y(-4) - 6, "1/16", { size: 12, anchor: "start" }],
                    [P.X(4) - 8, P.Y(2) - 8, "4", { size: 12, anchor: "end" }]
                ])
            ]), "y=log₂x のグラフ。"),
            caption: "y = log₂ x は、x が 0 に近づくと負の方向へ限りなく小さくなる（t = log₂ x は負の値もとる）。"
        }
    },
    105: {
        answer: {
            svg: graph(520, 400, -2.3, 2.3, -4, 4, P => figureBody([
                curve(P, x => x ** 3 - 3 * x, -2.1, 2.1),
                line(P.X(-1), P.Y(2), P.X(-1), P.Y(0), S_DASH),
                line(P.X(1), P.Y(-2), P.X(1), P.Y(0), S_DASH),
                dots([[P.X(-1), P.Y(2)], [P.X(1), P.Y(-2)]]),
                labels([
                    [P.X(-1) - 6, P.Y(2) - 10, "極大 2", { size: 13, anchor: "end" }],
                    [P.X(1) + 6, P.Y(-2) + 22, "極小 −2", { size: 13, anchor: "start" }],
                    [P.X(0.35), P.Y(3.3), "y = x³ − 3x", { size: 13, anchor: "start" }]
                ])
            ]), "y=x³−3x のグラフ。"),
            caption: "x = −1 で極大値 2、x = 1 で極小値 −2 をとる。"
        }
    },
    114: {
        answer: {
            svg: graph(620, 420, -1, 5.5, -5, 4, P => {
                const c1 = x => x * x, c2 = x => (x - 3) ** 2, c3 = x => (x - 2) ** 2 - 4;
                return figureBody([
                    shadeBetween(P, c1, c3, 0, 1.5),
                    shadeBetween(P, c2, c3, 1.5, 4.5),
                    curve(P, c1, -1, 2.2),
                    curve(P, c2, 1.2, 5.2),
                    curve(P, c3, -0.2, 4.4),
                    labels([
                        [P.X(1.9), P.Y(3.2), "C₁", { size: 13 }],
                        [P.X(4.3), P.Y(3.2), "C₂", { size: 13 }],
                        [P.X(0.9), P.Y(-3.4), "C₃", { size: 13 }],
                        [P.X(0.8), P.Y(-1.6), "S", { size: 13 }]
                    ])
                ]);
            }, "3つの放物線 C1, C2, C3 で囲まれた部分。"),
            caption: "3つの放物線 C₁, C₂, C₃ で囲まれた部分（灰色）。"
        }
    },
    117: {
        answer: {
            svg: graph(560, 420, -3, 3, -8, 16, P => {
                const c = x => x * x - 3 * x + 4, t1 = x => x, t2 = x => -7 * x;
                return figureBody([
                    shadeBetween(P, c, t1, 0, 2),
                    shadeBetween(P, c, t2, -2, 0),
                    curve(P, c, -2.6, 2.6),
                    curve(P, t1, -2.6, 2.6),
                    curve(P, t2, -2.4, 2.4),
                    dots([[P.X(2), P.Y(2)], [P.X(-2), P.Y(14)]]),
                    labels([
                        [P.X(2) + 8, P.Y(2) + 24, "A(2,2)", { size: 12, anchor: "start" }],
                        [P.X(-2) - 8, P.Y(14) - 16, "B(−2,14)", { size: 12, anchor: "end" }],
                        [P.X(1.4), P.Y(6.2), "y = x² − 3x + 4", { size: 12, anchor: "start" }],
                        [P.X(2.3), P.Y(1.4), "y = x", { size: 12, anchor: "start" }],
                        [P.X(-1.8), P.Y(10.6), "y = −7x", { size: 12, anchor: "start" }]
                    ])
                ]);
            }, "放物線Cと2本の接線で囲まれた部分。"),
            caption: "2本の接線と放物線 C で囲まれた部分（灰色）の面積を求める。"
        }
    },
    118: {
        answer: {
            svg: graph(520, 400, -2.5, 1.5, 0, 10, P => {
                const c = x => x ** 3 - 4 * x + 8, t = x => -x + 6;
                return figureBody([
                    shadeBetween(P, c, t, -2, 1),
                    curve(P, c, -2.4, 1.3),
                    curve(P, t, -2.4, 1.3),
                    dots([[P.X(1), P.Y(5)]]),
                    labels([
                        [P.X(1) + 8, P.Y(5) - 8, "A(1,5)", { size: 12, anchor: "start" }],
                        [P.X(-1.6), P.Y(8.6), "y = x³ − 4x + 8", { size: 12, anchor: "start" }],
                        [P.X(0.2), P.Y(6.7), "l : y = −x + 6", { size: 12, anchor: "start" }]
                    ])
                ]);
            }, "曲線Cと接線lで囲まれた部分。"),
            caption: "曲線 C と接線 l で囲まれた部分（灰色）の面積を求める。"
        }
    },
    12: {
        answer: {
            svg: graph(520, 520, -1.55, 1.55, -1.55, 1.55, P => figureBody([
                `<rect x="${P.X(-1)}" y="${P.Y(1)}" width="${P.X(1) - P.X(-1)}" height="${P.Y(-1) - P.Y(1)}" ${S_THIN}/>`,
                `<circle cx="${P.X(0)}" cy="${P.Y(0)}" r="${P.X(1) - P.X(0)}" ${SHADE}/>`,
                circle(P.X(0), P.Y(0), P.X(1) - P.X(0), S_MAIN),
                dots([[P.X(0.9), P.Y(0.9)]]),
                labels([
                    [P.X(-0.55), P.Y(0.55), "P", { size: 14 }],
                    [P.X(1.12), P.Y(0.5), "Q", { size: 14, anchor: "start" }],
                    [P.X(0), P.Y(-1.36), "緑の点は Q に含まれるが P に含まれない点", { size: 11 }]
                ])
            ]), "円Pが正方形Qに含まれる図。"),
            caption: "P（円の内部）は Q（正方形の内部）に含まれる。Q の角の部分は P に含まれないので q ⇒ p は偽。"
        }
    },
    15: {
        answer: {
            svg: "<svg viewBox=\"0 0 560 400\" role=\"img\" aria-label=\"y=2x²-3x+1 の -1≦x≦2 におけるグラフ。\"><line x1=\"54\" y1=\"299.6470588235294\" x2=\"510\" y2=\"299.6470588235294\" stroke=\"currentColor\" stroke-width=\"1.5\" fill=\"none\" stroke-linejoin=\"round\"/><path d=\"M510,299.6470588235294 L501.71045105397405,303.15182390430726 L501.71045105397405,296.1422937427515 Z\" fill=\"currentColor\"/><line x1=\"224.28571428571428\" y1=\"346\" x2=\"224.28571428571428\" y2=\"50\" stroke=\"currentColor\" stroke-width=\"1.5\" fill=\"none\" stroke-linejoin=\"round\"/><path d=\"M224.28571428571428,50 L227.79047936649212,58.28954894602597 L220.78094920493643,58.28954894602597 Z\" fill=\"currentColor\"/><text x=\"508\" y=\"323.6470588235294\" text-anchor=\"end\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"16\" font-weight=\"700\" fill=\"currentColor\">x</text><text x=\"236.28571428571428\" y=\"58\" text-anchor=\"start\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"16\" font-weight=\"700\" fill=\"currentColor\">y</text><text x=\"215.28571428571428\" y=\"321.6470588235294\" text-anchor=\"end\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"15\" font-weight=\"700\" fill=\"currentColor\">O</text><line x1=\"112.85714285714286\" y1=\"354\" x2=\"112.85714285714286\" y2=\"67.74117647058824\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-dasharray=\"6 5\" fill=\"none\" opacity=\"0.75\"/><line x1=\"447.1428571428571\" y1=\"354\" x2=\"447.1428571428571\" y2=\"176.4470588235294\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-dasharray=\"6 5\" fill=\"none\" opacity=\"0.75\"/><polyline points=\"68.3,-30.8 70.9,-23.5 73.6,-16.2 76.2,-9.0 78.9,-1.9 81.5,5.2 84.2,12.1 86.8,19.0 89.5,25.8 92.1,32.5 94.8,39.1 97.4,45.6 100.0,52.1 102.7,58.5 105.3,64.8 108.0,71.0 110.6,77.1 113.3,83.2 115.9,89.2 118.6,95.0 121.2,100.9 123.9,106.6 126.5,112.2 129.2,117.8 131.8,123.3 134.4,128.7 137.1,134.0 139.7,139.2 142.4,144.4 145.0,149.4 147.7,154.4 150.3,159.3 153.0,164.2 155.6,168.9 158.3,173.6 160.9,178.1 163.6,182.6 166.2,187.1 168.9,191.4 171.5,195.6 174.1,199.8 176.8,203.9 179.4,207.9 182.1,211.8 184.7,215.7 187.4,219.5 190.0,223.1 192.7,226.7 195.3,230.2 198.0,233.7 200.6,237.0 203.3,240.3 205.9,243.5 208.5,246.6 211.2,249.6 213.8,252.6 216.5,255.4 219.1,258.2 221.8,260.9 224.4,263.5 227.1,266.1 229.7,268.5 232.4,270.9 235.0,273.2 237.7,275.4 240.3,277.5 242.9,279.6 245.6,281.6 248.2,283.4 250.9,285.2 253.5,287.0 256.2,288.6 258.8,290.1 261.5,291.6 264.1,293.0 266.8,294.3 269.4,295.6 272.1,296.7 274.7,297.8 277.4,298.7 280.0,299.6 282.6,300.5 285.3,301.2 287.9,301.9 290.6,302.4 293.2,302.9 295.9,303.3 298.5,303.7 301.2,303.9 303.8,304.1 306.5,304.2 309.1,304.2 311.8,304.1 314.4,303.9 317.1,303.7 319.7,303.4 322.3,303.0 325.0,302.5 327.6,301.9 330.3,301.2 332.9,300.5 335.6,299.7 338.2,298.8 340.9,297.8 343.5,296.8 346.2,295.6 348.8,294.4 351.5,293.1 354.1,291.7 356.7,290.2 359.4,288.7 362.0,287.0 364.7,285.3 367.3,283.5 370.0,281.7 372.6,279.7 375.3,277.7 377.9,275.5 380.6,273.3 383.2,271.0 385.9,268.7 388.5,266.2 391.2,263.7 393.8,261.1 396.4,258.4 399.1,255.6 401.7,252.7 404.4,249.8 407.0,246.8 409.7,243.7 412.3,240.5 415.0,237.2 417.6,233.9 420.3,230.4 422.9,226.9 425.6,223.3 428.2,219.6 430.8,215.9 433.5,212.0 436.1,208.1 438.8,204.1 441.4,200.0 444.1,195.9 446.7,191.6 449.4,187.3 452.0,182.9 454.7,178.4 457.3,173.8 460.0,169.1 462.6,164.4 465.3,159.6 467.9,154.7 470.5,149.7 473.2,144.6 475.8,139.5 478.5,134.3 481.1,128.9 483.8,123.5 486.4,118.1 489.1,112.5 491.7,106.9\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/><g><circle cx=\"112.85714285714286\" cy=\"82.23529411764707\" r=\"4.5\" fill=\"#10b981\"/><circle cx=\"307.8571428571429\" cy=\"304.1764705882353\" r=\"4.5\" fill=\"#10b981\"/><circle cx=\"447.1428571428571\" cy=\"190.94117647058823\" r=\"4.5\" fill=\"#10b981\"/></g><g><text x=\"102.85714285714286\" y=\"70.23529411764707\" text-anchor=\"end\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"12\" font-weight=\"700\" fill=\"currentColor\">最大 6</text><text x=\"315.8571428571429\" y=\"324.1764705882353\" text-anchor=\"start\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"12\" font-weight=\"700\" fill=\"currentColor\">最小 −1/8</text><text x=\"457.1428571428571\" y=\"180.94117647058823\" text-anchor=\"start\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"12\" font-weight=\"700\" fill=\"currentColor\">3</text><text x=\"285.5714285714286\" y=\"129.3411764705882\" text-anchor=\"start\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"12\" font-weight=\"700\" fill=\"currentColor\">y = 2x² − 3x + 1</text><text x=\"112.85714285714286\" y=\"366.3764705882353\" text-anchor=\"middle\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"12\" font-weight=\"700\" fill=\"currentColor\">−1</text><text x=\"447.1428571428571\" y=\"366.3764705882353\" text-anchor=\"middle\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"12\" font-weight=\"700\" fill=\"currentColor\">2</text></g></svg>",
            caption: "頂点 (3/4, −1/8) が区間内。最大値は x = −1 で 6、最小値は x = 3/4 で −1/8。"
        }
    },
    17: {
        answer: {
            svg: "<svg viewBox=\"0 0 560 400\" role=\"img\" aria-label=\"z=-x²+5x-5 の 0≦x≦3 におけるグラフ。\"><line x1=\"54\" y1=\"136.58823529411762\" x2=\"510\" y2=\"136.58823529411762\" stroke=\"currentColor\" stroke-width=\"1.5\" fill=\"none\" stroke-linejoin=\"round\"/><path d=\"M510,136.58823529411762 L501.71045105397405,140.09300037489547 L501.71045105397405,133.08347021333978 Z\" fill=\"currentColor\"/><line x1=\"104.5\" y1=\"346\" x2=\"104.5\" y2=\"50\" stroke=\"currentColor\" stroke-width=\"1.5\" fill=\"none\" stroke-linejoin=\"round\"/><path d=\"M104.5,50 L108.00476508077786,58.28954894602597 L100.99523491922214,58.28954894602597 Z\" fill=\"currentColor\"/><text x=\"508\" y=\"160.58823529411762\" text-anchor=\"end\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"16\" font-weight=\"700\" fill=\"currentColor\">x</text><text x=\"116.5\" y=\"58\" text-anchor=\"start\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"16\" font-weight=\"700\" fill=\"currentColor\">y</text><text x=\"95.5\" y=\"158.58823529411762\" text-anchor=\"end\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"15\" font-weight=\"700\" fill=\"currentColor\">O</text><line x1=\"104.5\" y1=\"354\" x2=\"104.5\" y2=\"303.2705882352941\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-dasharray=\"6 5\" fill=\"none\" opacity=\"0.75\"/><line x1=\"455.5\" y1=\"354\" x2=\"455.5\" y2=\"85.85882352941178\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-dasharray=\"6 5\" fill=\"none\" opacity=\"0.75\"/><polyline points=\"81.1,355.4 83.6,351.3 86.1,347.2 88.6,343.1 91.0,339.1 93.5,335.1 96.0,331.1 98.5,327.1 101.0,323.2 103.5,319.4 106.0,315.5 108.4,311.7 110.9,307.9 113.4,304.2 115.9,300.4 118.4,296.8 120.9,293.1 123.4,289.5 125.9,285.9 128.3,282.4 130.8,278.8 133.3,275.3 135.8,271.9 138.3,268.5 140.8,265.1 143.3,261.7 145.7,258.4 148.2,255.1 150.7,251.9 153.2,248.6 155.7,245.4 158.2,242.3 160.7,239.1 163.1,236.1 165.6,233.0 168.1,230.0 170.6,227.0 173.1,224.0 175.6,221.1 178.1,218.2 180.5,215.3 183.0,212.5 185.5,209.7 188.0,206.9 190.5,204.2 193.0,201.5 195.5,198.8 198.0,196.2 200.4,193.6 202.9,191.0 205.4,188.5 207.9,186.0 210.4,183.5 212.9,181.0 215.4,178.6 217.8,176.3 220.3,173.9 222.8,171.6 225.3,169.3 227.8,167.1 230.3,164.9 232.8,162.7 235.2,160.6 237.7,158.4 240.2,156.4 242.7,154.3 245.2,152.3 247.7,150.3 250.2,148.4 252.7,146.4 255.1,144.6 257.6,142.7 260.1,140.9 262.6,139.1 265.1,137.4 267.6,135.6 270.1,134.0 272.5,132.3 275.0,130.7 277.5,129.1 280.0,127.5 282.5,126.0 285.0,124.5 287.5,123.1 289.9,121.6 292.4,120.2 294.9,118.9 297.4,117.6 299.9,116.3 302.4,115.0 304.9,113.8 307.3,112.6 309.8,111.4 312.3,110.3 314.8,109.2 317.3,108.1 319.8,107.1 322.3,106.1 324.8,105.1 327.2,104.2 329.7,103.3 332.2,102.4 334.7,101.6 337.2,100.8 339.7,100.0 342.2,99.3 344.6,98.6 347.1,97.9 349.6,97.2 352.1,96.6 354.6,96.1 357.1,95.5 359.6,95.0 362.0,94.5 364.5,94.1 367.0,93.7 369.5,93.3 372.0,92.9 374.5,92.6 377.0,92.4 379.4,92.1 381.9,91.9 384.4,91.7 386.9,91.6 389.4,91.4 391.9,91.4 394.4,91.3 396.9,91.3 399.3,91.3 401.8,91.4 404.3,91.4 406.8,91.5 409.3,91.7 411.8,91.9 414.3,92.1 416.7,92.3 419.2,92.6 421.7,92.9 424.2,93.3 426.7,93.6 429.2,94.0 431.7,94.5 434.1,94.9 436.6,95.5 439.1,96.0 441.6,96.6 444.1,97.2 446.6,97.8 449.1,98.5 451.6,99.2 454.0,99.9 456.5,100.7 459.0,101.5 461.5,102.3 464.0,103.2 466.5,104.1 469.0,105.0 471.4,106.0 473.9,107.0 476.4,108.0 478.9,109.0\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/><g><circle cx=\"104.5\" cy=\"317.7647058823529\" r=\"4.5\" fill=\"#10b981\"/><circle cx=\"397\" cy=\"91.29411764705884\" r=\"4.5\" fill=\"#10b981\"/><circle cx=\"455.5\" cy=\"100.35294117647061\" r=\"4.5\" fill=\"#10b981\"/></g><g><text x=\"96.5\" y=\"321.7647058823529\" text-anchor=\"end\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"12\" font-weight=\"700\" fill=\"currentColor\">最小 −5</text><text x=\"405\" y=\"83.29411764705884\" text-anchor=\"start\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"12\" font-weight=\"700\" fill=\"currentColor\">最大 5/4</text><text x=\"463.5\" y=\"92.35294117647061\" text-anchor=\"start\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"12\" font-weight=\"700\" fill=\"currentColor\">1</text><text x=\"145.45\" y=\"82.23529411764707\" text-anchor=\"start\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"12\" font-weight=\"700\" fill=\"currentColor\">z = −x² + 5x − 5</text><text x=\"104.5\" y=\"362.7529411764706\" text-anchor=\"middle\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"12\" font-weight=\"700\" fill=\"currentColor\">0</text><text x=\"455.5\" y=\"362.7529411764706\" text-anchor=\"middle\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"12\" font-weight=\"700\" fill=\"currentColor\">3</text></g></svg>",
            caption: "頂点 (5/2, 5/4) が区間内。最大値 5/4、最小値は x = 0 で −5。"
        }
    },
    18: {
        answer: {
            svg: "<svg viewBox=\"0 0 560 400\" role=\"img\" aria-label=\"m(a) のグラフ。a<-1 は直線、-1≦a≦1 は放物線、a>1 は直線。\"><line x1=\"54\" y1=\"134\" x2=\"510\" y2=\"134\" stroke=\"currentColor\" stroke-width=\"1.5\" fill=\"none\" stroke-linejoin=\"round\"/><path d=\"M510,134 L501.71045105397405,137.50476508077784 L501.71045105397405,130.49523491922216 Z\" fill=\"currentColor\"/><line x1=\"280\" y1=\"346\" x2=\"280\" y2=\"50\" stroke=\"currentColor\" stroke-width=\"1.5\" fill=\"none\" stroke-linejoin=\"round\"/><path d=\"M280,50 L283.5047650807779,58.28954894602597 L276.4952349192221,58.28954894602597 Z\" fill=\"currentColor\"/><text x=\"508\" y=\"158\" text-anchor=\"end\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"16\" font-weight=\"700\" fill=\"currentColor\">a</text><text x=\"271\" y=\"156\" text-anchor=\"end\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"15\" font-weight=\"700\" fill=\"currentColor\">O</text><polyline points=\"55.0,376.0 57.8,371.9 60.6,367.8 63.4,363.6 66.3,359.5 69.1,355.4 71.9,351.3 74.7,347.1 77.5,343.0 80.3,338.9 83.1,334.8 85.9,330.6 88.8,326.5 91.6,322.4 94.4,318.3 97.2,314.1 100.0,310.0 102.8,305.9 105.6,301.8 108.4,297.6 111.3,293.5 114.1,289.4 116.9,285.3 119.7,281.1 122.5,277.0 125.3,272.9 128.1,268.8 130.9,264.6 133.8,260.5 136.6,256.4 139.4,252.3 142.2,248.1 145.0,244.0 147.8,239.9 150.6,235.8 153.4,231.6 156.3,227.5 159.1,223.4 161.9,219.3 164.7,215.1 167.5,211.0 170.3,206.9 173.1,202.8 175.9,198.6 178.8,194.5 181.6,190.4 184.4,186.3 187.2,182.1 190.0,178.0 192.8,173.9 195.6,169.9 198.4,166.0 201.3,162.2 204.1,158.4 206.9,154.8 209.7,151.2 212.5,147.8 215.3,144.4 218.1,141.0 220.9,137.8 223.8,134.7 226.6,131.6 229.4,128.7 232.2,125.8 235.0,123.0 237.8,120.3 240.6,117.7 243.4,115.1 246.3,112.7 249.1,110.3 251.9,108.0 254.7,105.9 257.5,103.8 260.3,101.7 263.1,99.8 265.9,97.9 268.8,96.2 271.6,94.5 274.4,92.9 277.2,91.4 280.0,90.0 282.8,88.7 285.6,87.4 288.4,86.3 291.3,85.2 294.1,84.2 296.9,83.3 299.7,82.5 302.5,81.8 305.3,81.1 308.1,80.5 310.9,80.1 313.8,79.7 316.6,79.4 319.4,79.2 322.2,79.0 325.0,79.0 327.8,79.0 330.6,79.2 333.4,79.4 336.3,79.7 339.1,80.1 341.9,80.5 344.7,81.1 347.5,81.8 350.3,82.5 353.1,83.3 355.9,84.2 358.8,85.2 361.6,86.3 364.4,87.4 367.2,88.7 370.0,90.0 372.8,91.4 375.6,92.8 378.4,94.1 381.3,95.5 384.1,96.9 386.9,98.2 389.7,99.6 392.5,101.0 395.3,102.4 398.1,103.8 400.9,105.1 403.8,106.5 406.6,107.9 409.4,109.3 412.2,110.6 415.0,112.0 417.8,113.4 420.6,114.8 423.4,116.1 426.2,117.5 429.1,118.9 431.9,120.3 434.7,121.6 437.5,123.0 440.3,124.4 443.1,125.8 445.9,127.1 448.8,128.5 451.6,129.9 454.4,131.3 457.2,132.6 460.0,134.0 462.8,135.4 465.6,136.7 468.4,138.1 471.2,139.5 474.1,140.9 476.9,142.3 479.7,143.6 482.5,145.0 485.3,146.4 488.1,147.8 490.9,149.1 493.7,150.5 496.6,151.9 499.4,153.3 502.2,154.6 505.0,156.0\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/><g><circle cx=\"190\" cy=\"178\" r=\"4.5\" fill=\"#10b981\"/><circle cx=\"370\" cy=\"90\" r=\"4.5\" fill=\"#10b981\"/><circle cx=\"325\" cy=\"79\" r=\"4.5\" fill=\"#10b981\"/></g><g><text x=\"182\" y=\"170\" text-anchor=\"end\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"11\" font-weight=\"700\" fill=\"currentColor\">(−1, −1)</text><text x=\"378\" y=\"82\" text-anchor=\"start\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"11\" font-weight=\"700\" fill=\"currentColor\">(1, 1)</text><text x=\"325\" y=\"65\" text-anchor=\"middle\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"12\" font-weight=\"700\" fill=\"currentColor\">最大 5/4</text><text x=\"55.00000000000001\" y=\"222\" text-anchor=\"start\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"12\" font-weight=\"700\" fill=\"currentColor\">m = 3a + 2</text><text x=\"338.5\" y=\"120.80000000000001\" text-anchor=\"middle\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"11\" font-weight=\"700\" fill=\"currentColor\">m = −a² + a + 1</text><text x=\"504.99999999999994\" y=\"186.8\" text-anchor=\"end\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"12\" font-weight=\"700\" fill=\"currentColor\">m = −a + 2</text></g><text x=\"268\" y=\"58\" text-anchor=\"end\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"16\" font-weight=\"700\" fill=\"currentColor\">m</text></svg>",
            caption: "m は a = 1/2 で最大値 5/4 をとる。"
        }
    },
    91: {
        answer: {
            svg: "<svg viewBox=\"0 0 560 400\" role=\"img\" aria-label=\"y=2t²+2t-1 の -1≦t≦√2 におけるグラフ。\"><line x1=\"54\" y1=\"277\" x2=\"510\" y2=\"277\" stroke=\"currentColor\" stroke-width=\"1.5\" fill=\"none\" stroke-linejoin=\"round\"/><path d=\"M510,277 L501.71045105397405,280.5047650807779 L501.71045105397405,273.4952349192221 Z\" fill=\"currentColor\"/><line x1=\"248.8\" y1=\"346\" x2=\"248.8\" y2=\"50\" stroke=\"currentColor\" stroke-width=\"1.5\" fill=\"none\" stroke-linejoin=\"round\"/><path d=\"M248.8,50 L252.30476508077786,58.28954894602597 L245.29523491922217,58.28954894602597 Z\" fill=\"currentColor\"/><text x=\"508\" y=\"301\" text-anchor=\"end\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"16\" font-weight=\"700\" fill=\"currentColor\">t</text><text x=\"260.8\" y=\"58\" text-anchor=\"start\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"16\" font-weight=\"700\" fill=\"currentColor\">y</text><text x=\"239.8\" y=\"299\" text-anchor=\"end\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"15\" font-weight=\"700\" fill=\"currentColor\">O</text><line x1=\"92.80000000000001\" y1=\"354\" x2=\"92.80000000000001\" y2=\"298\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-dasharray=\"6 5\" fill=\"none\" opacity=\"0.75\"/><line x1=\"469.41731573020286\" y1=\"354\" x2=\"469.41731573020286\" y2=\"73.00505063388334\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-dasharray=\"6 5\" fill=\"none\" opacity=\"0.75\"/><polyline points=\"61.6,295.2 64.3,296.9 67.1,298.5 69.8,300.2 72.5,301.7 75.3,303.2 78.0,304.7 80.7,306.2 83.4,307.5 86.2,308.9 88.9,310.2 91.6,311.5 94.4,312.7 97.1,313.9 99.8,315.0 102.6,316.1 105.3,317.2 108.0,318.2 110.7,319.1 113.5,320.0 116.2,320.9 118.9,321.8 121.7,322.6 124.4,323.3 127.1,324.0 129.9,324.7 132.6,325.3 135.3,325.9 138.0,326.4 140.8,326.9 143.5,327.4 146.2,327.8 149.0,328.1 151.7,328.4 154.4,328.7 157.2,329.0 159.9,329.2 162.6,329.3 165.3,329.4 168.1,329.5 170.8,329.5 173.5,329.5 176.3,329.4 179.0,329.3 181.7,329.2 184.4,329.0 187.2,328.7 189.9,328.4 192.6,328.1 195.4,327.8 198.1,327.4 200.8,326.9 203.6,326.4 206.3,325.9 209.0,325.3 211.8,324.7 214.5,324.0 217.2,323.3 219.9,322.6 222.7,321.8 225.4,320.9 228.1,320.0 230.9,319.1 233.6,318.2 236.3,317.2 239.1,316.1 241.8,315.0 244.5,313.9 247.2,312.7 250.0,311.5 252.7,310.2 255.4,308.9 258.2,307.5 260.9,306.2 263.6,304.7 266.4,303.2 269.1,301.7 271.8,300.2 274.5,298.5 277.3,296.9 280.0,295.2 282.7,293.5 285.5,291.7 288.2,289.9 290.9,288.0 293.6,286.1 296.4,284.1 299.1,282.1 301.8,280.1 304.6,278.0 307.3,275.9 310.0,273.7 312.8,271.5 315.5,269.3 318.2,267.0 320.9,264.7 323.7,262.3 326.4,259.8 329.1,257.4 331.9,254.9 334.6,252.3 337.3,249.7 340.1,247.1 342.8,244.4 345.5,241.7 348.3,238.9 351.0,236.1 353.7,233.3 356.4,230.4 359.2,227.4 361.9,224.5 364.6,221.4 367.4,218.4 370.1,215.3 372.8,212.1 375.6,208.9 378.3,205.7 381.0,202.4 383.7,199.1 386.5,195.7 389.2,192.3 391.9,188.8 394.7,185.4 397.4,181.8 400.1,178.2 402.9,174.6 405.6,170.9 408.3,167.2 411.0,163.5 413.8,159.7 416.5,155.9 419.2,152.0 422.0,148.1 424.7,144.1 427.4,140.1 430.1,136.0 432.9,131.9 435.6,127.8 438.3,123.6 441.1,119.4 443.8,115.1 446.5,110.8 449.3,106.5 452.0,102.1 454.7,97.6 457.5,93.2 460.2,88.6 462.9,84.1 465.6,79.5 468.4,74.8 471.1,70.1 473.8,65.4 476.6,60.6 479.3,55.8 482.0,50.9 484.8,46.0 487.5,41.0 490.2,36.0 492.9,31.0 495.7,25.9 498.4,20.8\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/><g><circle cx=\"92.80000000000001\" cy=\"312\" r=\"4.5\" fill=\"#10b981\"/><circle cx=\"170.8\" cy=\"329.5\" r=\"4.5\" fill=\"#10b981\"/><circle cx=\"469.41731573020286\" cy=\"73.00505063388334\" r=\"4.5\" fill=\"#10b981\"/></g><g><text x=\"178.8\" y=\"349.5\" text-anchor=\"start\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"12\" font-weight=\"700\" fill=\"currentColor\">最小 −3/2</text><text x=\"461.41731573020286\" y=\"63.00505063388334\" text-anchor=\"end\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"12\" font-weight=\"700\" fill=\"currentColor\">最大 3+2√2</text><text x=\"49.120000000000005\" y=\"123\" text-anchor=\"start\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"12\" font-weight=\"700\" fill=\"currentColor\">y = 2t² + 2t − 1</text><text x=\"92.80000000000001\" y=\"366.5\" text-anchor=\"middle\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"12\" font-weight=\"700\" fill=\"currentColor\">−1</text><text x=\"469.41731573020286\" y=\"366.5\" text-anchor=\"middle\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"12\" font-weight=\"700\" fill=\"currentColor\">√2</text></g></svg>",
            caption: "頂点 t = −1/2 で最小値 −3/2。t = √2 で最大値 3+2√2。"
        }
    },
    90: {
        answer: {
            svg: "<svg viewBox=\"0 0 560 400\" role=\"img\" aria-label=\"y=-t²+t-1 の -1≦t≦1 におけるグラフ。\"><line x1=\"54\" y1=\"63.11111111111114\" x2=\"510\" y2=\"63.11111111111114\" stroke=\"currentColor\" stroke-width=\"1.5\" fill=\"none\" stroke-linejoin=\"round\"/><path d=\"M510,63.11111111111114 L501.71045105397405,66.615876191889 L501.71045105397405,59.606346030333285 Z\" fill=\"currentColor\"/><line x1=\"280\" y1=\"346\" x2=\"280\" y2=\"50\" stroke=\"currentColor\" stroke-width=\"1.5\" fill=\"none\" stroke-linejoin=\"round\"/><path d=\"M280,50 L283.5047650807779,58.28954894602597 L276.4952349192221,58.28954894602597 Z\" fill=\"currentColor\"/><text x=\"508\" y=\"87.11111111111114\" text-anchor=\"end\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"16\" font-weight=\"700\" fill=\"currentColor\">t</text><text x=\"292\" y=\"58\" text-anchor=\"start\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"16\" font-weight=\"700\" fill=\"currentColor\">y</text><text x=\"271\" y=\"85.11111111111114\" text-anchor=\"end\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"15\" font-weight=\"700\" fill=\"currentColor\">O</text><line x1=\"112.85714285714285\" y1=\"354\" x2=\"112.85714285714285\" y2=\"311.22222222222223\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-dasharray=\"6 5\" fill=\"none\" opacity=\"0.75\"/><line x1=\"447.14285714285717\" y1=\"354\" x2=\"447.14285714285717\" y2=\"140.11111111111111\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-dasharray=\"6 5\" fill=\"none\" opacity=\"0.75\"/><polyline points=\"79.4,374.5 81.9,370.2 84.4,365.9 86.9,361.6 89.5,357.4 92.0,353.2 94.5,349.0 97.0,344.9 99.5,340.9 102.0,336.8 104.5,332.8 107.0,328.9 109.5,324.9 112.0,321.1 114.5,317.2 117.0,313.4 119.5,309.6 122.0,305.9 124.6,302.2 127.1,298.6 129.6,295.0 132.1,291.4 134.6,287.9 137.1,284.4 139.6,280.9 142.1,277.5 144.6,274.1 147.1,270.8 149.6,267.5 152.1,264.2 154.6,261.0 157.1,257.8 159.7,254.6 162.2,251.5 164.7,248.4 167.2,245.4 169.7,242.4 172.2,239.4 174.7,236.5 177.2,233.6 179.7,230.8 182.2,228.0 184.7,225.2 187.2,222.5 189.7,219.8 192.3,217.2 194.8,214.6 197.3,212.0 199.8,209.4 202.3,206.9 204.8,204.5 207.3,202.1 209.8,199.7 212.3,197.3 214.8,195.0 217.3,192.8 219.8,190.6 222.3,188.4 224.8,186.2 227.3,184.1 229.9,182.0 232.4,180.0 234.9,178.0 237.4,176.0 239.9,174.1 242.4,172.2 244.9,170.4 247.4,168.6 249.9,166.8 252.4,165.1 254.9,163.4 257.4,161.8 259.9,160.2 262.5,158.6 265.0,157.1 267.5,155.6 270.0,154.1 272.5,152.7 275.0,151.3 277.5,150.0 280.0,148.7 282.5,147.4 285.0,146.2 287.5,145.0 290.0,143.8 292.5,142.7 295.0,141.7 297.5,140.6 300.1,139.6 302.6,138.7 305.1,137.8 307.6,136.9 310.1,136.0 312.6,135.2 315.1,134.5 317.6,133.7 320.1,133.1 322.6,132.4 325.1,131.8 327.6,131.2 330.1,130.7 332.6,130.2 335.2,129.8 337.7,129.3 340.2,129.0 342.7,128.6 345.2,128.3 347.7,128.0 350.2,127.8 352.7,127.6 355.2,127.5 357.7,127.4 360.2,127.3 362.7,127.3 365.2,127.3 367.8,127.3 370.3,127.4 372.8,127.5 375.3,127.7 377.8,127.9 380.3,128.1 382.8,128.4 385.3,128.7 387.8,129.1 390.3,129.5 392.8,129.9 395.3,130.4 397.8,130.9 400.3,131.4 402.8,132.0 405.4,132.6 407.9,133.3 410.4,134.0 412.9,134.7 415.4,135.5 417.9,136.3 420.4,137.2 422.9,138.1 425.4,139.0 427.9,140.0 430.4,141.0 432.9,142.0 435.4,143.1 437.9,144.2 440.5,145.4 443.0,146.6 445.5,147.8 448.0,149.1 450.5,150.4 453.0,151.8 455.5,153.2 458.0,154.6 460.5,156.1 463.0,157.6 465.5,159.1 468.0,160.7 470.5,162.3 473.1,164.0 475.6,165.7 478.1,167.4 480.6,169.2\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/><g><circle cx=\"112.85714285714285\" cy=\"319.77777777777777\" r=\"4.5\" fill=\"#10b981\"/><circle cx=\"363.5714285714286\" cy=\"127.2777777777778\" r=\"4.5\" fill=\"#10b981\"/><circle cx=\"447.14285714285717\" cy=\"148.66666666666669\" r=\"4.5\" fill=\"#10b981\"/></g><g><text x=\"104.85714285714285\" y=\"323.77777777777777\" text-anchor=\"end\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"12\" font-weight=\"700\" fill=\"currentColor\">最小 −3</text><text x=\"371.5714285714286\" y=\"119.2777777777778\" text-anchor=\"start\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"12\" font-weight=\"700\" fill=\"currentColor\">最大 −3/4</text><text x=\"455.14285714285717\" y=\"140.66666666666669\" text-anchor=\"start\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"12\" font-weight=\"700\" fill=\"currentColor\">−1</text><text x=\"54.357142857142826\" y=\"174.33333333333334\" text-anchor=\"start\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"12\" font-weight=\"700\" fill=\"currentColor\">y = −t² + t − 1</text><text x=\"112.85714285714285\" y=\"361.44444444444446\" text-anchor=\"middle\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"12\" font-weight=\"700\" fill=\"currentColor\">−1</text><text x=\"447.14285714285717\" y=\"361.44444444444446\" text-anchor=\"middle\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"12\" font-weight=\"700\" fill=\"currentColor\">1</text></g></svg>",
            caption: "頂点 t = 1/2 で最大値 −3/4、t = −1 で最小値 −3。"
        }
    },
    96: {
        answer: {
            svg: "<svg viewBox=\"0 0 560 400\" role=\"img\" aria-label=\"y=(t+3)²-7 のグラフ。t≧2 の範囲で最小値18。\"><line x1=\"54\" y1=\"298\" x2=\"510\" y2=\"298\" stroke=\"currentColor\" stroke-width=\"1.5\" fill=\"none\" stroke-linejoin=\"round\"/><path d=\"M510,298 L501.71045105397405,301.5047650807779 L501.71045105397405,294.4952349192221 Z\" fill=\"currentColor\"/><line x1=\"306\" y1=\"346\" x2=\"306\" y2=\"50\" stroke=\"currentColor\" stroke-width=\"1.5\" fill=\"none\" stroke-linejoin=\"round\"/><path d=\"M306,50 L309.5047650807779,58.28954894602597 L302.4952349192221,58.28954894602597 Z\" fill=\"currentColor\"/><text x=\"508\" y=\"322\" text-anchor=\"end\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"16\" font-weight=\"700\" fill=\"currentColor\">t</text><text x=\"318\" y=\"58\" text-anchor=\"start\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"16\" font-weight=\"700\" fill=\"currentColor\">y</text><text x=\"297\" y=\"320\" text-anchor=\"end\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"15\" font-weight=\"700\" fill=\"currentColor\">O</text><line x1=\"410\" y1=\"354\" x2=\"410\" y2=\"197.20000000000002\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-dasharray=\"6 5\" fill=\"none\" opacity=\"0.75\"/><polyline points=\"46.0,314.8 48.9,316.0 51.8,317.2 54.8,318.4 57.7,319.6 60.6,320.7 63.6,321.7 66.5,322.8 69.4,323.7 72.3,324.7 75.3,325.6 78.2,326.5 81.1,327.4 84.0,328.2 86.9,329.0 89.9,329.7 92.8,330.4 95.7,331.1 98.7,331.7 101.6,332.3 104.5,332.9 107.4,333.4 110.3,333.9 113.3,334.4 116.2,334.8 119.1,335.2 122.0,335.6 125.0,335.9 127.9,336.2 130.8,336.4 133.8,336.7 136.7,336.8 139.6,337.0 142.5,337.1 145.5,337.2 148.4,337.2 151.3,337.2 154.2,337.2 157.2,337.1 160.1,337.0 163.0,336.9 165.9,336.7 168.8,336.5 171.8,336.2 174.7,335.9 177.6,335.6 180.5,335.3 183.5,334.9 186.4,334.5 189.3,334.0 192.3,333.5 195.2,333.0 198.1,332.4 201.0,331.8 204.0,331.2 206.9,330.5 209.8,329.8 212.7,329.1 215.7,328.3 218.6,327.5 221.5,326.6 224.4,325.7 227.3,324.8 230.3,323.9 233.2,322.9 236.1,321.8 239.0,320.8 242.0,319.7 244.9,318.5 247.8,317.4 250.8,316.2 253.7,314.9 256.6,313.7 259.5,312.4 262.4,311.0 265.4,309.6 268.3,308.2 271.2,306.8 274.2,305.3 277.1,303.8 280.0,302.2 282.9,300.6 285.8,299.0 288.8,297.3 291.7,295.6 294.6,293.9 297.6,292.1 300.5,290.3 303.4,288.5 306.3,286.6 309.3,284.7 312.2,282.7 315.1,280.7 318.0,278.7 320.9,276.7 323.9,274.6 326.8,272.5 329.7,270.3 332.7,268.1 335.6,265.9 338.5,263.6 341.4,261.3 344.3,259.0 347.3,256.6 350.2,254.2 353.1,251.8 356.1,249.3 359.0,246.8 361.9,244.2 364.8,241.6 367.8,239.0 370.7,236.3 373.6,233.7 376.5,230.9 379.4,228.2 382.4,225.4 385.3,222.5 388.2,219.7 391.2,216.8 394.1,213.8 397.0,210.8 399.9,207.8 402.8,204.8 405.8,201.7 408.7,198.6 411.6,195.4 414.6,192.3 417.5,189.0 420.4,185.8 423.3,182.5 426.3,179.2 429.2,175.8 432.1,172.4 435.0,169.0 437.9,165.5 440.9,162.0 443.8,158.4 446.7,154.9 449.7,151.2 452.6,147.6 455.5,143.9 458.4,140.2 461.3,136.4 464.3,132.6 467.2,128.8 470.1,125.0 473.1,121.1 476.0,117.1 478.9,113.2 481.8,109.2 484.8,105.1 487.7,101.1 490.6,96.9 493.5,92.8 496.4,88.6 499.4,84.4 502.3,80.2 505.2,75.9 508.1,71.5 511.1,67.2 514.0,62.8\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/><g><circle cx=\"410\" cy=\"197.20000000000002\" r=\"4.5\" fill=\"#10b981\"/></g><g><text x=\"404.8\" y=\"189.20000000000002\" text-anchor=\"end\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"12\" font-weight=\"700\" fill=\"currentColor\">t = 2 で最小 18</text><text x=\"66.80000000000001\" y=\"130\" text-anchor=\"start\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"12\" font-weight=\"700\" fill=\"currentColor\">y = (t+3)² − 7</text><text x=\"410\" y=\"365.52\" text-anchor=\"middle\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"12\" font-weight=\"700\" fill=\"currentColor\">2</text><text x=\"150\" y=\"329.2\" text-anchor=\"middle\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"11\" font-weight=\"700\" fill=\"currentColor\">頂点 (−3, −7)</text></g></svg>",
            caption: "t ≧ 2 ではグラフは単調増加。t = 2 のとき最小値 18。"
        }
    },
    108: {
        answer: {
            svg: "<svg viewBox=\"0 0 620 420\" role=\"img\" aria-label=\"3次関数 f(x)=2x³-3x²-12x+5 のグラフと y=k の共有点。\"><line x1=\"54\" y1=\"210\" x2=\"570\" y2=\"210\" stroke=\"currentColor\" stroke-width=\"1.5\" fill=\"none\" stroke-linejoin=\"round\"/><path d=\"M570,210 L561.710451053974,213.50476508077784 L561.710451053974,206.49523491922216 Z\" fill=\"currentColor\"/><line x1=\"257.20000000000005\" y1=\"366\" x2=\"257.20000000000005\" y2=\"50\" stroke=\"currentColor\" stroke-width=\"1.5\" fill=\"none\" stroke-linejoin=\"round\"/><path d=\"M257.20000000000005,50 L260.7047650807779,58.28954894602597 L253.6952349192222,58.28954894602597 Z\" fill=\"currentColor\"/><text x=\"568\" y=\"234\" text-anchor=\"end\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"16\" font-weight=\"700\" fill=\"currentColor\">x</text><text x=\"269.20000000000005\" y=\"58\" text-anchor=\"start\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"16\" font-weight=\"700\" fill=\"currentColor\">y</text><text x=\"248.20000000000005\" y=\"232\" text-anchor=\"end\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"15\" font-weight=\"700\" fill=\"currentColor\">O</text><line x1=\"46\" y1=\"111.59999999999997\" x2=\"574\" y2=\"111.59999999999997\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-dasharray=\"6 5\" fill=\"none\" opacity=\"0.75\"/><line x1=\"46\" y1=\"333\" x2=\"574\" y2=\"333\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-dasharray=\"6 5\" fill=\"none\" opacity=\"0.75\"/><line x1=\"46\" y1=\"169\" x2=\"574\" y2=\"169\" stroke=\"currentColor\" stroke-width=\"1.5\" fill=\"none\" stroke-linejoin=\"round\"/><polyline points=\"53.0,490.5 56.2,470.2 59.4,450.6 62.5,431.7 65.7,413.4 68.9,395.7 72.0,378.7 75.2,362.3 78.4,346.5 81.6,331.3 84.7,316.8 87.9,302.8 91.1,289.4 94.2,276.5 97.4,264.2 100.6,252.5 103.7,241.3 106.9,230.7 110.1,220.5 113.2,210.9 116.4,201.8 119.6,193.2 122.7,185.1 125.9,177.4 129.1,170.3 132.2,163.6 135.4,157.3 138.6,151.5 141.7,146.1 144.9,141.2 148.1,136.7 151.2,132.5 154.4,128.8 157.6,125.5 160.8,122.5 163.9,120.0 167.1,117.7 170.3,115.9 173.4,114.4 176.6,113.2 179.8,112.4 182.9,111.8 186.1,111.6 189.3,111.7 192.4,112.1 195.6,112.7 198.8,113.7 201.9,114.8 205.1,116.3 208.3,118.0 211.4,119.9 214.6,122.1 217.8,124.5 220.9,127.1 224.1,129.9 227.3,132.9 230.4,136.1 233.6,139.4 236.8,142.9 240.0,146.6 243.1,150.4 246.3,154.4 249.5,158.5 252.6,162.7 255.8,167.0 259.0,171.5 262.1,176.0 265.3,180.6 268.5,185.3 271.6,190.1 274.8,194.9 278.0,199.7 281.1,204.7 284.3,209.6 287.5,214.6 290.6,219.5 293.8,224.5 297.0,229.5 300.1,234.5 303.3,239.4 306.5,244.3 309.6,249.2 312.8,254.0 316.0,258.8 319.2,263.5 322.3,268.1 325.5,272.6 328.7,277.1 331.8,281.4 335.0,285.6 338.2,289.8 341.3,293.7 344.5,297.6 347.7,301.3 350.8,304.8 354.0,308.2 357.2,311.4 360.3,314.4 363.5,317.2 366.7,319.8 369.8,322.2 373.0,324.4 376.2,326.4 379.3,328.1 382.5,329.6 385.7,330.8 388.8,331.8 392.0,332.5 395.2,332.9 398.4,333.0 401.5,332.8 404.7,332.3 407.9,331.5 411.0,330.4 414.2,328.9 417.4,327.1 420.5,324.9 423.7,322.4 426.9,319.5 430.0,316.2 433.2,312.5 436.4,308.4 439.5,303.9 442.7,299.0 445.9,293.7 449.0,288.0 452.2,281.8 455.4,275.1 458.5,268.0 461.7,260.4 464.9,252.3 468.0,243.8 471.2,234.7 474.4,225.2 477.6,215.1 480.7,204.5 483.9,193.4 487.1,181.7 490.2,169.5 493.4,156.7 496.6,143.4 499.7,129.4 502.9,114.9 506.1,99.8 509.2,84.1 512.4,67.7 515.6,50.8 518.7,33.2 521.9,15.0 525.1,-3.9 528.2,-23.4 531.4,-43.6 534.6,-64.5 537.7,-86.1 540.9,-108.3 544.1,-131.3 547.2,-154.9 550.4,-179.3 553.6,-204.5 556.8,-230.3 559.9,-256.9\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/><g><circle cx=\"186.8\" cy=\"111.59999999999997\" r=\"4.5\" fill=\"#10b981\"/><circle cx=\"398\" cy=\"333\" r=\"4.5\" fill=\"#10b981\"/><circle cx=\"257.20000000000005\" cy=\"169\" r=\"4.5\" fill=\"#10b981\"/></g><g><text x=\"178.8\" y=\"103.59999999999997\" text-anchor=\"end\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"12\" font-weight=\"700\" fill=\"currentColor\">極大 12</text><text x=\"406\" y=\"355\" text-anchor=\"start\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"12\" font-weight=\"700\" fill=\"currentColor\">極小 −15</text><text x=\"265.20000000000005\" y=\"161\" text-anchor=\"start\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"11\" font-weight=\"700\" fill=\"currentColor\">f(0)=5</text><text x=\"517.6800000000001\" y=\"78.80000000000001\" text-anchor=\"end\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"12\" font-weight=\"700\" fill=\"currentColor\">y = f(x)</text><text x=\"53.040000000000006\" y=\"129.59999999999997\" text-anchor=\"start\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"11\" font-weight=\"700\" fill=\"currentColor\">y = 12</text><text x=\"566.96\" y=\"351\" text-anchor=\"end\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"11\" font-weight=\"700\" fill=\"currentColor\">y = −15</text></g></svg>",
            caption: "3個の共有点をもつのは −15 < k < 12。正の解1個・負の解2個は 5 < k < 12。"
        }
    },
    109: {
        answer: {
            svg: "<svg viewBox=\"0 0 620 420\" role=\"img\" aria-label=\"4次関数 f(x)=x⁴+2x³-2x²+k の概形。最小値は k-8。\"><line x1=\"54\" y1=\"224.9090909090909\" x2=\"570\" y2=\"224.9090909090909\" stroke=\"currentColor\" stroke-width=\"1.5\" fill=\"none\" stroke-linejoin=\"round\"/><path d=\"M570,224.9090909090909 L561.710451053974,228.41385598986875 L561.710451053974,221.40432582831306 Z\" fill=\"currentColor\"/><line x1=\"358.88888888888886\" y1=\"366\" x2=\"358.88888888888886\" y2=\"50\" stroke=\"currentColor\" stroke-width=\"1.5\" fill=\"none\" stroke-linejoin=\"round\"/><path d=\"M358.88888888888886,50 L362.39365396966673,58.28954894602597 L355.384123808111,58.28954894602597 Z\" fill=\"currentColor\"/><text x=\"568\" y=\"248.9090909090909\" text-anchor=\"end\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"16\" font-weight=\"700\" fill=\"currentColor\">x</text><text x=\"370.88888888888886\" y=\"58\" text-anchor=\"start\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"16\" font-weight=\"700\" fill=\"currentColor\">y</text><text x=\"349.88888888888886\" y=\"246.9090909090909\" text-anchor=\"end\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"15\" font-weight=\"700\" fill=\"currentColor\">O</text><polyline points=\"55.8,22.9 59.0,46.1 62.1,68.2 65.3,89.2 68.5,109.1 71.7,127.9 74.8,145.8 78.0,162.6 81.2,178.5 84.4,193.5 87.6,207.6 90.7,220.8 93.9,233.2 97.1,244.8 100.3,255.6 103.4,265.6 106.6,274.9 109.8,283.5 113.0,291.4 116.2,298.6 119.3,305.2 122.5,311.2 125.7,316.7 128.9,321.5 132.0,325.8 135.2,329.6 138.4,332.9 141.6,335.8 144.8,338.2 147.9,340.1 151.1,341.7 154.3,342.8 157.5,343.6 160.6,344.1 163.8,344.2 167.0,344.0 170.2,343.5 173.4,342.7 176.5,341.7 179.7,340.4 182.9,338.9 186.1,337.2 189.2,335.3 192.4,333.2 195.6,331.0 198.8,328.6 202.0,326.1 205.1,323.4 208.3,320.7 211.5,317.8 214.7,314.9 217.8,311.9 221.0,308.8 224.2,305.7 227.4,302.6 230.6,299.5 233.7,296.3 236.9,293.1 240.1,289.9 243.3,286.8 246.4,283.6 249.6,280.5 252.8,277.4 256.0,274.4 259.2,271.4 262.3,268.5 265.5,265.7 268.7,262.9 271.9,260.2 275.0,257.6 278.2,255.0 281.4,252.6 284.6,250.2 287.8,248.0 290.9,245.8 294.1,243.8 297.3,241.9 300.5,240.0 303.6,238.3 306.8,236.7 310.0,235.2 313.2,233.8 316.4,232.5 319.5,231.3 322.7,230.2 325.9,229.3 329.1,228.4 332.2,227.6 335.4,227.0 338.6,226.4 341.8,226.0 345.0,225.6 348.1,225.3 351.3,225.1 354.5,225.0 357.7,224.9 360.8,224.9 364.0,225.0 367.2,225.1 370.4,225.3 373.6,225.5 376.7,225.7 379.9,226.0 383.1,226.2 386.3,226.5 389.4,226.8 392.6,227.0 395.8,227.3 399.0,227.4 402.2,227.6 405.3,227.7 408.5,227.7 411.7,227.6 414.9,227.5 418.0,227.2 421.2,226.8 424.4,226.3 427.6,225.7 430.8,224.8 433.9,223.8 437.1,222.6 440.3,221.2 443.5,219.6 446.6,217.7 449.8,215.6 453.0,213.1 456.2,210.4 459.4,207.4 462.5,204.1 465.7,200.4 468.9,196.3 472.1,191.9 475.2,187.0 478.4,181.7 481.6,175.9 484.8,169.7 488.0,163.0 491.1,155.8 494.3,148.0 497.5,139.7 500.7,130.8 503.8,121.3 507.0,111.1 510.2,100.3 513.4,88.8 516.6,76.6 519.7,63.7 522.9,50.0 526.1,35.5 529.3,20.2 532.4,4.1 535.6,-12.9 538.8,-30.8 542.0,-49.6 545.2,-69.4 548.3,-90.1 551.5,-111.9 554.7,-134.7 557.9,-158.6 561.0,-183.6 564.2,-209.7\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/><g><circle cx=\"163.33333333333334\" cy=\"344.1818181818182\" r=\"4.5\" fill=\"#10b981\"/><circle cx=\"358.88888888888886\" cy=\"224.9090909090909\" r=\"4.5\" fill=\"#10b981\"/><circle cx=\"407.7777777777777\" cy=\"227.70454545454544\" r=\"4.5\" fill=\"#10b981\"/></g><g><text x=\"155.33333333333334\" y=\"366.1818181818182\" text-anchor=\"end\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"12\" font-weight=\"700\" fill=\"currentColor\">最小 k−8</text><text x=\"366.88888888888886\" y=\"216.9090909090909\" text-anchor=\"start\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"11\" font-weight=\"700\" fill=\"currentColor\">極大 k</text><text x=\"415.7777777777777\" y=\"249.70454545454544\" text-anchor=\"start\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"11\" font-weight=\"700\" fill=\"currentColor\">k−3/16</text><text x=\"476.2222222222223\" y=\"135.45454545454544\" text-anchor=\"start\" font-family=\"'Segoe UI', 'Hiragino Sans', sans-serif\" font-size=\"12\" font-weight=\"700\" fill=\"currentColor\">y = f(x)</text></g></svg>",
            caption: "図は k = 0 のグラフ。最小値 k−8 が正であれば、すべての実数 x で f(x) > 0。よって k > 8。"
        }
    },
    16: {
        answer: {
            svg: graphN(560, 400, -2.5, 1.6, -2.5, 8, P => {
                const f = t => (t + 2) ** 2 - 2;
                return figureBody([
                    line(P.X(-1), P.Y(-2.5), P.X(-1), P.Y(0.6), S_DASH),
                    curve(P, f, -2.4, -1, S_DASH),
                    curve(P, f, -1, 1.5),
                    openDot(P.X(-2), P.Y(-2)),
                    dots([[P.X(-1), P.Y(-1)]]),
                    labels([
                        [P.X(-1) - 10, P.Y(-1) - 10, "最小 −1", { size: 12, anchor: "end" }],
                        [P.X(-2), P.Y(-2) + 30, "頂点 (−2, −2)", { size: 11 }],
                        [P.X(0.5), P.Y(6.5), "y = (t+2)² − 2", { size: 12, anchor: "start" }],
                        [P.X(-1), P.Y(-2.4) + 16, "−1", { size: 12 }]
                    ])
                ]);
            }, "y=(t+2)²-2 の t≧-1 におけるグラフ。", "t", "y"),
            caption: "t ≧ −1 ではグラフは単調増加。t = −1 のとき最小値 −1。頂点 t = −2 は範囲外。"
        }
    },
    21: {
        answer: {
            svg: graph(520, 400, -1.5, 3.5, -1, 5, P => {
                const f = x => (x - 1) ** 2 + 1;
                return figureBody([
                    line(P.X(0), P.Y(1), P.X(1), P.Y(1), S_DASH),
                    curve(P, f, -1.2, 3.2),
                    dots([[P.X(1), P.Y(1)]]),
                    labels([
                        [P.X(1) + 10, P.Y(1) + 22, "頂点 (1, 1)", { size: 12, anchor: "start" }],
                        [P.X(0.05), P.Y(1) - 10, "頂点の y 座標", { size: 11, anchor: "start" }],
                        [P.X(2.3), P.Y(3.8), "y = f(x)", { size: 13, anchor: "start" }]
                    ])
                ]);
            }, "下に凸の放物線が常にx軸の上側にある図。"),
            caption: "グラフが常に x 軸の上側にある、すなわち頂点の y 座標が正であることが条件。"
        }
    },
    23: {
        answer: {
            svg: svg(520, 780, "2次方程式の解の配置。(1)は2解とも1より大、(2)は1の両側に解をもつ。", figureBody([
                txt(260, 24, "(1) 2解とも 1 より大", { size: 14 }),
                txt(260, 404, "(2) 1 の両側に解", { size: 14 }),
                panelXY(0, 0, 520, 380, -0.5, 4.5, -2, 5, P => {
                    const f = x => (x - 2) * (x - 3);
                    return figureBody([
                        line(P.X(1), P.Y(0), P.X(1), P.Y(2), S_DASH),
                        curve(P, f, -0.2, 4.2),
                        dots([[P.X(1), P.Y(2)], [P.X(2), P.Y(0)], [P.X(3), P.Y(0)]]),
                        labels([
                            [P.X(1) + 8, P.Y(2) - 8, "x=1", { size: 11, anchor: "start" }],
                            [P.X(1) - 8, P.Y(2) + 18, "f(1)>0", { size: 11, anchor: "end" }],
                            [P.X(2), P.Y(0) + 20, "2", { size: 12 }],
                            [P.X(3), P.Y(0) + 20, "3", { size: 12 }],
                            [P.X(2.5), P.Y(-0.25) + 30, "頂点 y<0", { size: 11 }],
                            [P.X(2.5), P.Y(4.6), "軸 x=m>1", { size: 11 }],
                            [P.X(3.9), P.Y(3.4), "y=f(x)", { size: 12, anchor: "start" }]
                        ])
                    ]);
                }, 40),
                panelXY(0, 380, 520, 380, -0.5, 3.5, -1.5, 3, P => {
                    const f = x => x * (x - 2);
                    return figureBody([
                        line(P.X(1), P.Y(0), P.X(1), P.Y(-1), S_DASH),
                        curve(P, f, -0.2, 2.4),
                        dots([[P.X(0), P.Y(0)], [P.X(2), P.Y(0)], [P.X(1), P.Y(-1)]]),
                        labels([
                            [P.X(1) + 8, P.Y(0) - 8, "x=1", { size: 11, anchor: "start" }],
                            [P.X(1) + 8, P.Y(-1) + 18, "f(1)<0", { size: 11, anchor: "start" }],
                            [P.X(0), P.Y(0) + 20, "0", { size: 12 }],
                            [P.X(2), P.Y(0) + 20, "2", { size: 12 }],
                            [P.X(2.5), P.Y(1.6), "y=f(x)", { size: 12, anchor: "start" }]
                        ])
                    ]);
                }, 40)
            ])),
            caption: "(1) は 軸 m>1、頂点の y 座標<0、f(1)>0 が条件。(2) は f(1)<0 だけでよい。"
        }
    },
    22: {
        answer: {
            svg: svg(520, 1020, "0≦x≦4 における最小値の場合分け。軸 x=a が区間の左・内・右にある3つの場合。", figureBody([
                [0, 340, 680].map((oy, i) => {
                    const vx = [-0.5, 2, 5][i], dotX = [0, 2, 4][i];
                    const ox = 120;
                    const vpx = ox + 90 + vx * 30;
                    const yAt = x => oy + 200 - 0.004 * ((ox + 90 + x * 30) - vpx) ** 2;
                    const pts = [];
                    for (let x = -1.2; x <= 5.2; x += 0.1) {
                        pts.push(`${(ox + 90 + x * 30).toFixed(1)},${yAt(x).toFixed(1)}`);
                    }
                    return figureBody([
                        txt(305, oy + 30, ["(ア) a<0", "(イ) 0≦a≦4", "(ウ) 4<a"][i], { size: 14 }),
                        line(ox + 20, oy + 250, ox + 280, oy + 250, S_THIN),
                        arrow(ox + 260, oy + 250, ox + 282, oy + 250),
                        line(ox + 90, oy + 250, ox + 210, oy + 250, 'stroke="currentColor" stroke-width="5" stroke-linecap="round"'),
                        line(vpx, oy + 200, vpx, oy + 250, S_DASH),
                        `<polyline points="${pts.join(" ")}" ${S_MAIN}/>`,
                        dots([[ox + 90 + dotX * 30, yAt(dotX)]]),
                        labels([
                            [ox + 90, oy + 270, "0", { size: 12 }],
                            [ox + 210, oy + 270, "4", { size: 12 }],
                            [ox + 280, oy + 270, "x", { size: 14, anchor: "end" }],
                            [vpx + 6, oy + 185, "x=a", { size: 11, anchor: "start" }],
                            [ox + 90 + dotX * 30, yAt(dotX) + 18, "最小", { size: 12 }]
                        ])
                    ]);
                })
            ])),
            caption: "0≦x≦4 における最小値は、軸 x=a が区間の左（x=0）、内（頂点）、右（x=4）のどこにあるかで場合分けする（図は模式図）。"
        }
    },
    112: {
        answer: {
            svg: svg(520, 780, "y=|t²-xt| のグラフと積分区間[1,2]。x が区間内か外かで場合分けする。", figureBody([
                txt(260, 24, "(ア) 1<x<2（x=1.5 の例）", { size: 13 }),
                txt(260, 404, "(イ) 2≦x（x=2.5 の例）", { size: 13 }),
                panelXY(0, 0, 520, 380, 0, 3.2, -0.3, 1.7, P => {
                    const g = t => Math.abs(t * t - 1.5 * t);
                    return figureBody([
                        shadeBetween(P, g, () => 0, 1, 2),
                        curve(P, g, 0.9, 2.2),
                        line(P.X(1.5), P.Y(-0.3), P.X(1.5), P.Y(0), S_DASH),
                        dots([[P.X(1.5), P.Y(0)]]),
                        labels([
                            [P.X(1), P.Y(0) + 20, "1", { size: 12 }],
                            [P.X(2), P.Y(0) + 20, "2", { size: 12 }],
                            [P.X(1.5), P.Y(-0.3) + 16, "t=x", { size: 12 }],
                            [P.X(1.62), P.Y(0.28), "t=x で折り返す", { size: 11, anchor: "start" }],
                            [P.X(1.95), P.Y(1.35), "y=|t²−xt|", { size: 12, anchor: "end" }]
                        ])
                    ]);
                }, 40),
                panelXY(0, 380, 520, 380, 0, 3.2, -0.3, 1.7, P => {
                    const g = t => Math.abs(t * t - 2.5 * t);
                    return figureBody([
                        shadeBetween(P, g, () => 0, 1, 2),
                        curve(P, g, 0.9, 3.1),
                        line(P.X(2.5), P.Y(-0.3), P.X(2.5), P.Y(0), S_DASH),
                        dots([[P.X(2.5), P.Y(0)]]),
                        labels([
                            [P.X(1), P.Y(0) + 20, "1", { size: 12 }],
                            [P.X(2), P.Y(0) + 20, "2", { size: 12 }],
                            [P.X(2.5), P.Y(-0.3) + 16, "t=x", { size: 12 }],
                            [P.X(2.55), P.Y(0.5), "t=x（区間外）", { size: 11, anchor: "start" }],
                            [P.X(2.95), P.Y(1.4), "y=|t²−xt|", { size: 12, anchor: "end" }]
                        ])
                    ]);
                }, 40)
            ])),
            caption: "積分区間 [1,2] と t=x の位置関係で場合分けする。x が区間内なら t=x で折り返し、区間外なら折り返さない。"
        }
    },
    86: {
        answer: {
            svg: svg(520, 1060, "三角方程式・不等式を単位円で解く3つの図。", figureBody([
                [0, 340, 680].map((oy, i) => {
                    const cx = 260, cy = oy + 205, r = 100;
                    const title = ["(1) sinθ = 1/2, −1", "(2) −1/2 < cosθ ≦ 1", "(3) cosθ = 0, sinθ = √3/2"][i];
                    const head = txt(260, oy + 26, title, { size: 14 });
                    if (i === 0) {
                        return head + figureBody([
                            unitCircle(cx, cy, r),
                            line(cx - r - 22, cy - 50, cx + r + 22, cy - 50, S_DASH),
                            line(cx - r - 22, cy + r, cx + r + 22, cy + r, S_DASH),
                            dots([[cx + 86.6, cy - 50], [cx - 86.6, cy - 50], [cx, cy + r]]),
                            labels([
                                [cx + 98, cy - 58, "π/6", { size: 12, anchor: "start" }],
                                [cx - 98, cy - 58, "5π/6", { size: 12, anchor: "end" }],
                                [cx + 10, cy + r + 16, "3π/2", { size: 12, anchor: "start" }],
                                [cx - r - 26, cy - 44, "1/2", { size: 12, anchor: "end" }],
                                [cx - r - 26, cy + r + 6, "−1", { size: 12, anchor: "end" }]
                            ])
                        ]);
                    }
                    if (i === 1) {
                        return head + figureBody([
                            unitCircle(cx, cy, r),
                            line(cx - 50, cy - r - 20, cx - 50, cy + r + 20, S_DASH),
                            arcStroke(cx, cy, r, 240 * Math.PI / 180, 480 * Math.PI / 180),
                            openDot(cx - 50, cy + 86.6), openDot(cx - 50, cy - 86.6),
                            labels([
                                [cx - 58, cy + 6, "−1/2", { size: 12, anchor: "end" }],
                                [cx - 62, cy - 100, "2π/3", { size: 12, anchor: "end" }],
                                [cx - 62, cy + 112, "4π/3", { size: 12, anchor: "end" }],
                                [cx + r + 26, cy - 8, "0", { size: 12, anchor: "start" }]
                            ])
                        ]);
                    }
                    return head + figureBody([
                        unitCircle(cx, cy, r),
                        line(cx - r - 22, cy - 86.6, cx + r + 22, cy - 86.6, S_DASH),
                        dots([[cx + 50, cy - 86.6], [cx, cy - r], [cx - 50, cy - 86.6], [cx, cy + r]]),
                        labels([
                            [cx + 62, cy - 94, "π/3", { size: 12, anchor: "start" }],
                            [cx + 8, cy - r - 12, "π/2", { size: 12, anchor: "start" }],
                            [cx - 62, cy - 94, "2π/3", { size: 12, anchor: "end" }],
                            [cx + 10, cy + r + 16, "3π/2", { size: 12, anchor: "start" }],
                            [cx - r - 26, cy - 80, "√3/2", { size: 12, anchor: "end" }]
                        ])
                    ]);
                })
            ])),
            caption: "(1) 高さが 1/2、−1 の点を読む。(2) 緑の弧が cosθ > −1/2 の範囲（端の 2π/3, 4π/3 は除く）。(3) cosθ=0 は上下端、sinθ=√3/2 は π/3 と 2π/3。"
        }
    },
    89: {
        answer: {
            svg: svg(500, 400, "単位円と sin(2x−π/4) のとり得る範囲。−π/4 から 3π/4 まで。", (() => {
                const cx = 240, cy = 200, r = 120;
                const s = polar(cx, cy, r, -45), e = polar(cx, cy, r, 135);
                const sy = cy + r / Math.SQRT2;
                return figureBody([
                    unitCircle(cx, cy, r),
                    arcStroke(cx, cy, r, -Math.PI / 4, 3 * Math.PI / 4),
                    line(cx - r - 20, cy - r, cx + r + 20, cy - r, S_DASH),
                    line(cx - r - 20, sy, cx + r + 20, sy, S_DASH),
                    dots([[cx, cy - r], [s[0], s[1]]]),
                    labels([
                        [cx + r + 26, cy - r + 6, "1", { size: 12, anchor: "start" }],
                        [cx - r - 26, sy + 6, "−1/√2", { size: 12, anchor: "end" }],
                        [s[0] + 14, s[1] + 18, "−π/4", { size: 12, anchor: "start" }],
                        [e[0] - 12, e[1] - 10, "3π/4", { size: 12, anchor: "end" }],
                        [cx + 10, cy - r - 12, "π/2", { size: 12, anchor: "start" }]
                    ])
                ]);
            })()),
            caption: "2x−π/4 は −π/4 から 3π/4 まで動く。sin の最大は 1（2x−π/4=π/2）、最小は −1/√2（2x−π/4=−π/4）。"
        }
    }
};

// ===========================================================================
// 演習（グラフ・図版）
// ===========================================================================
const EX_GRAPH = {
    6: {
        answer: {
            svg: graph(560, 380, -7.5, 5.5, -1.5, 11.5, P => {
                const f = x => (x < -3 ? -2 * x - 2 : (x <= 1 ? 4 : 2 * x + 2));
                return figureBody([
                    line(P.X(-7.3), P.Y(6), P.X(5.3), P.Y(6), S_DASH),
                    line(P.X(-7.3), P.Y(10), P.X(5.3), P.Y(10), S_DASH),
                    curve(P, f, -7.3, 5.3),
                    dots([[-6, 10], [-4, 6], [2, 6], [4, 10]].map(([x, y]) => [P.X(x), P.Y(y)])),
                    labels([
                        [P.X(-1), P.Y(6) - 8, "y = 6", { size: 12 }],
                        [P.X(-1), P.Y(10) - 8, "y = 10", { size: 12 }],
                        [P.X(-6), P.Y(0) + 22, "−6", { size: 12 }],
                        [P.X(-4), P.Y(0) + 22, "−4", { size: 12 }],
                        [P.X(2), P.Y(0) + 22, "2", { size: 12 }],
                        [P.X(4), P.Y(0) + 22, "4", { size: 12 }],
                        [P.X(0.6), P.Y(7.6), "y = |x+3| + |x−1|", { size: 12, anchor: "start" }]
                    ])
                ]);
            }, "y=|x+3|+|x-1| の折れ線グラフ。y=6 と y=10 の位置を示す。"),
            caption: "グラフより 6 ≦ y ≦ 10 となるのは −6 ≦ x ≦ −4 または 2 ≦ x ≦ 4。"
        }
    },
    10: {
        answer: {
            svg: graph(520, 380, -0.8, 3.8, 0, 7, P => figureBody([
                line(P.X(0), P.Y(0), P.X(0), P.Y(6.2), S_DASH),
                line(P.X(3), P.Y(0), P.X(3), P.Y(6.2), S_DASH),
                curve(P, x => x * x - 2 * x + 3, -0.8, 3.8),
                dots([[P.X(1), P.Y(2)], [P.X(3), P.Y(6)], [P.X(0), P.Y(3)]]),
                labels([
                    [P.X(1), P.Y(2) - 12, "頂点 (1, 2)", { size: 12 }],
                    [P.X(3) - 8, P.Y(6) - 10, "最大 6", { size: 12, anchor: "end" }],
                    [P.X(0) + 8, P.Y(3) - 10, "3", { size: 12, anchor: "start" }],
                    [P.X(2.2), P.Y(6.7), "0 ≦ x ≦ 3", { size: 12 }]
                ])
            ]), "y=x²-2x+3 の 0≦x≦3 における最大最小。"),
            caption: "軸 x = 1 が区間に含まれるので、x = 1 で最小値 2、x = 3 で最大値 6。"
        }
    },
    11: {
        answer: {
            svg: graph(520, 380, -4.2, 3, -10, 18, P => figureBody([
                line(P.X(-2), P.Y(-10), P.X(-2), P.Y(17), S_DASH),
                line(P.X(2), P.Y(-10), P.X(2), P.Y(17), S_DASH),
                curve(P, x => -((x + 3) ** 2) + 17, -4.2, 3),
                dots([[P.X(-2), P.Y(16)], [P.X(2), P.Y(-8)]]),
                labels([
                    [P.X(-2) + 8, P.Y(16) - 6, "最大 16", { size: 12, anchor: "start" }],
                    [P.X(2) + 8, P.Y(-8) + 18, "最小 −8", { size: 12, anchor: "start" }],
                    [P.X(-3) - 8, P.Y(12), "軸 x = −3", { size: 12, anchor: "end" }],
                    [P.X(0.5), P.Y(13), "z = −(x+3)² + 17", { size: 12, anchor: "start" }]
                ])
            ]), "z=-(x+3)²+17 の -2≦x≦2 における最大最小。"),
            caption: "−2 ≦ x ≦ 2 ではグラフは単調減少。x = −2 で最大 16、x = 2 で最小 −8。"
        }
    },
    12: {
        answer: {
            svg: graphN(520, 380, -6, 2, -12, 30, P => figureBody([
                line(P.X(-4), P.Y(-12), P.X(-4), P.Y(-9), S_DASH),
                line(P.X(-4.5), P.Y(-12), P.X(-4.5), P.Y(3), S_DASH),
                curve(P, t => t * t + 9 * t + 11, -6, 2),
                dots([[P.X(-4), P.Y(-9)]]),
                labels([
                    [P.X(-4) + 10, P.Y(-9) + 20, "t = −4 で最小 −9", { size: 12, anchor: "start" }],
                    [P.X(-4.5) - 6, P.Y(1.5), "軸 t = −9/2", { size: 12, anchor: "end" }],
                    [P.X(-2), P.Y(26), "y = t² + 9t + 11", { size: 12, anchor: "start" }]
                ])
            ]), "y=t²+9t+11 の t≧-4 におけるグラフ。", "t", "y"),
            caption: "軸 t = −9/2 は範囲 t ≧ −4 の外側なので、t ≧ −4 では単調増加。t = −4 で最小値 −9。"
        }
    },
    13: {
        answer: {
            svg: graph(520, 380, -2.6, 0.6, -1.2, 1.0, P => {
                const f = x => -1.5 * x * x - 3 * x - 1.125;
                return figureBody([
                    shadeBetween(P, x => 0, f, -1.5, -0.5),
                    curve(P, f, -2.5, 0.5),
                    dots([[P.X(-1.5), P.Y(0)], [P.X(-0.5), P.Y(0)]]),
                    labels([
                        [P.X(-1.5) - 30, P.Y(0) + 64, "−3/2", { size: 12, anchor: "end" }],
                        [P.X(-0.5) + 30, P.Y(0) + 64, "−1/2", { size: 12, anchor: "start" }],
                        [P.X(-2.4), P.Y(-1.05), "y = ax² − 3x + b", { size: 12, anchor: "start" }],
                        [P.X(-1.0), P.Y(0.45), "f(x) > 0", { size: 12 }]
                    ])
                ]);
            }, "上に凸の放物線が x 軸と -3/2, -1/2 で交わる図。"),
            caption: "f(x) > 0 となる範囲が a < x < a+1 になるのは、上に凸で x 軸との交点が a, a+1 のとき。"
        }
    },
    14: {
        answer: {
            svg: svg(520, 760, "a<0 では上に凸でつねに正にならず、a>0 では下に凸で x 軸と共有点をもたなければよい。", figureBody([
                panelXY(0, 0, 520, 380, -2.2, 2.2, -3.2, 1.6, P => figureBody([
                    curve(P, x => -x * x + 1, -2, 2),
                    labels([
                        [P.X(0), 30, "(ア) a < 0", { size: 14 }],
                        [P.X(0), P.Y(-1.9), "つねに正とはならない", { size: 12 }]
                    ])
                ]), 40),
                panelXY(0, 380, 520, 380, -2.2, 2.2, -0.6, 4.2, P => figureBody([
                    curve(P, x => x * x + 0.8, -1.7, 1.7),
                    labels([
                        [P.X(0), 30, "(ウ) a > 0", { size: 14 }],
                        [P.X(0), P.Y(2.1), "x 軸と共有点なし", { size: 12 }]
                    ])
                ]), 40)
            ])),
            caption: "a < 0 は上に凸で不適、a = 0 は直線で不適。a > 0 かつ判別式 D < 0 が条件。"
        }
    },
    15: {
        answer: {
            svg: svg(520, 960, "区間 -1≦x≦1 に対する放物線の軸の位置3通り。", figureBody([
                ...[0, 1, 2].map(i => panelXY(0, i * 320, 520, 320, -2.4, 2.4, -1.2, 3.4, P => {
                    const ax = [-1.9, 0, 1.9][i];
                    return figureBody([
                        `<rect x="${P.X(-1)}" y="${P.Y(3.3)}" width="${P.X(1) - P.X(-1)}" height="${P.Y(-1.1) - P.Y(3.3)}" fill="${ACCENT}" fill-opacity="0.08" stroke="none"/>`,
                        line(P.X(-1), P.Y(-1.2), P.X(-1), P.Y(3.4), S_DASH),
                        line(P.X(1), P.Y(-1.2), P.X(1), P.Y(3.4), S_DASH),
                        line(P.X(ax), P.Y(-1.2), P.X(ax), P.Y(3.4), S_THIN),
                        curve(P, x => (x - ax) ** 2 - 0.6, Math.max(-2.4, ax - 1.9), Math.min(2.4, ax + 1.9)),
                        labels([
                            [P.X(0), 24, ["(ア) 軸 < −1", "(イ) 軸は区間内", "(ウ) 軸 > 1"][i], { size: 13 }],
                            [P.X(-1), P.Y(-1.1) + 18, "−1", { size: 11 }],
                            [P.X(1), P.Y(-1.1) + 18, "1", { size: 11 }]
                        ])
                    ]);
                }, 34))
            ])),
            caption: "区間の左端・頂点・右端のどこで最小になるかで場合分けする。"
        }
    },
    16: {
        answer: {
            svg: graph(520, 380, -2.7, 2.7, -2, 15, P => figureBody([
                line(P.X(-2), P.Y(-2), P.X(-2), P.Y(14), S_DASH),
                line(P.X(2), P.Y(-2), P.X(2), P.Y(14), S_DASH),
                curve(P, x => x * x - 2.4 * x + 1.2, -2.6, 2.6),
                dots([[P.X(0.71), P.Y(0)], [P.X(1.69), P.Y(0)], [P.X(1.2), P.Y(-0.24)]]),
                labels([
                    [P.X(-2), P.Y(-1.8) + 18, "−2", { size: 12 }],
                    [P.X(2), P.Y(-1.8) + 18, "2", { size: 12 }],
                    [P.X(1.2), P.Y(-0.24) + 22, "頂点", { size: 12 }],
                    [P.X(-2.5), P.Y(8), "y = f(x)", { size: 12, anchor: "start" }]
                ])
            ]), "放物線が -2<x<2 で x 軸と2点で交わる図。"),
            caption: "−2 < x < 2 で異なる2実数解をもつ条件は、判別式・軸の位置・両端の値の符号。"
        }
    },
    35: {
        answer: {
            svg: svg(680, 340, "感染と検査結果の確率木。感染0.2、非感染0.8から陽性・陰性に分かれる。", figureBody([
                `<g ${S_THIN}>` + [
                    line(70, 170, 220, 85), line(70, 170, 220, 255),
                    line(220, 85, 430, 45), line(220, 85, 430, 125),
                    line(220, 255, 430, 215), line(220, 255, 430, 295)
                ].join("") + `</g>`,
                dots([[70, 170], [220, 85], [220, 255]]),
                labels([
                    [140, 112, "0.20", { size: 15 }],
                    [140, 228, "0.80", { size: 15 }],
                    [320, 52, "0.99", { size: 15 }],
                    [320, 118, "0.01", { size: 15 }],
                    [320, 222, "0.05", { size: 15 }],
                    [320, 288, "0.95", { size: 15 }],
                    [220, 70, "感染", { size: 17 }],
                    [220, 300, "非感染", { size: 17 }],
                    [445, 45, "陽性 0.198", { size: 15, anchor: "start" }],
                    [445, 125, "陰性 0.002", { size: 15, anchor: "start" }],
                    [445, 215, "陽性 0.040", { size: 15, anchor: "start" }],
                    [445, 295, "陰性 0.760", { size: 15, anchor: "start" }]
                ])
            ])),
            caption: "陽性全体は 0.198 + 0.040 = 0.238。このうち非感染は 0.040 なので 0.040/0.238 = 20/119。"
        }
    },
    49: {
        answer: {
            svg: svg(480, 360, "直線 y=x/2 と点 A(7,1)、対称点 B(5,5)。線分 AB は直線に垂直で中点は直線上。", (() => {
                const P = plane(480, 360, -1, 9, -1, 7, 44);
                return figureBody([
                    axes(P),
                    line(P.X(-0.6), P.Y(-0.3), P.X(8.6), P.Y(4.3), S_THIN),
                    line(P.X(7), P.Y(1), P.X(5), P.Y(5), S_MAIN),
                    dots([[P.X(7), P.Y(1)], [P.X(5), P.Y(5)], [P.X(6), P.Y(3)]]),
                    path(`M${P.X(6)},${P.Y(3)} l8.9,-4.5 l-4.5,8.9 l-8.9,4.5 Z`, S_THIN),
                    labels([
                        [P.X(7) + 6, P.Y(1) + 20, "A(7, 1)", { size: 15, anchor: "start" }],
                        [P.X(5) - 6, P.Y(5) - 8, "B(5, 5)", { size: 15, anchor: "end" }],
                        [P.X(6) + 10, P.Y(3) + 20, "中点 (6, 3)", { size: 11, anchor: "start" }],
                        [P.X(8.6), P.Y(4.85), "l : y = x/2", { size: 15, anchor: "end" }]
                    ])
                ]);
            })()),
            caption: "AB の中点が l 上にあり、AB ⊥ l。この2条件から B(5, 5) が求まる。"
        }
    },
    51: {
        answer: {
            svg: svg(560, 380, "円 x²+(y-1)²=1 と直線 y=x+2 の交点 P, Q、弦の中点 M、中心 A。", (() => {
                const P = plane(560, 380, -2.2, 2.2, -0.8, 3.2, 46);
                const cx = P.X(0), cy = P.Y(1);
                const r = P.X(1) - P.X(0);
                return figureBody([
                    axes(P),
                    circle(cx, cy, r, S_THIN),
                    line(P.X(-1.7), P.Y(0.3), P.X(0.5), P.Y(2.5), S_MAIN),
                    line(cx, cy, P.X(-0.5), P.Y(1.5), S_DASH),
                    dots([[cx, cy], [P.X(-1), P.Y(1)], [P.X(0), P.Y(2)], [P.X(-0.5), P.Y(1.5)]]),
                    path(`M${P.X(-0.5)},${P.Y(1.5)} l6.4,-6.4 l6.4,6.4 l-6.4,6.4 Z`, S_THIN),
                    labels([
                        [cx - 10, cy + 4, "A", { size: 13, anchor: "end" }],
                        [P.X(-1) - 6, P.Y(1) - 8, "P", { size: 13, anchor: "end" }],
                        [P.X(-0.2), P.Y(2.38), "Q", { size: 13 }],
                        [P.X(-0.5) - 8, P.Y(1.5) + 16, "M", { size: 15, anchor: "end" }],
                        [P.X(0.35), P.Y(2.72), "y = x + 2", { size: 15, anchor: "start" }]
                    ])
                ]);
            })()),
            caption: "中心 A(0,1)、半径 1。弦 PQ の中点 M では AM ⊥ PQ が成り立つ。"
        }
    },
    52: {
        answer: {
            svg: svg(520, 780, "2円の外接（上）と内接（下）の図。中心間距離は5。", figureBody([
                `<g transform="translate(20,0)">${(() => {
                    const A = [190, 260], B = [250, 180], r1 = 40, r2 = 60;
                    return figureBody([
                        circle(A[0], A[1], r1, S_MAIN),
                        circle(B[0], B[1], r2, S_THIN),
                        line(A[0], A[1], B[0], B[1], S_DASH),
                        dots([[...A], [...B]]),
                        labels([
                            [80, 40, "外接：d = r₁ + r₂", { size: 13 }],
                            [A[0] - 6, A[1] + 22, "A", { size: 13, anchor: "end" }],
                            [B[0] + 8, B[1] - 6, "B", { size: 13, anchor: "start" }],
                            [A[0] - 46, A[1] - 8, "r₁ = 2", { size: 11, anchor: "end" }],
                            [B[0] + 70, B[1] - 30, "r₂ = 3", { size: 11, anchor: "start" }],
                            [A[0] + 48, A[1] - 26, "d = 5", { size: 11, anchor: "start" }]
                        ])
                    ]);
                })()}</g>`,
                `<g transform="translate(-480,400)">${(() => {
                    const A = [600, 260], B = [660, 180], r1 = 40, r2 = 140;
                    return figureBody([
                        circle(B[0], B[1], r2, S_THIN),
                        circle(A[0], A[1], r1, S_MAIN),
                        line(A[0], A[1], B[0], B[1], S_DASH),
                        dots([[...A], [...B]]),
                        labels([
                            [700, 20, "内接：d = r₂ − r₁", { size: 13 }],
                            [A[0] - 6, A[1] + 22, "A", { size: 13, anchor: "end" }],
                            [B[0] + 8, B[1] - 6, "B", { size: 13, anchor: "start" }],
                            [A[0] - 52, A[1] + 28, "r₁ = 2", { size: 11, anchor: "end" }],
                            [B[0] + 30, B[1] + 62, "r₂ = 7", { size: 11, anchor: "start" }],
                            [A[0] + 50, A[1] - 34, "d = 5", { size: 11, anchor: "start" }]
                        ])
                    ]);
                })()}</g>`
            ])),
            caption: "中心間距離 d = 5。外接のとき r₂ = 3（k=1）、C₁ が C₂ に内接するとき r₂ = 7（k=41）。"
        }
    },
    54: {
        answer: {
            svg: graph(520, 380, -3, 3, -1, 18, P => figureBody([
                line(P.X(-1), P.Y(0), P.X(-1), P.Y(2.4), S_DASH),
                line(P.X(1), P.Y(0), P.X(1), P.Y(2.4), S_DASH),
                curve(P, x => 2 * x * x, -3, -1),
                curve(P, x => 2 * x * x, -1, 1, S_DASH),
                curve(P, x => 2 * x * x, 1, 3),
                openDot(P.X(-1), P.Y(2)),
                openDot(P.X(1), P.Y(2)),
                labels([
                    [P.X(-1) - 6, P.Y(0) + 24, "−1", { size: 15, anchor: "end" }],
                    [P.X(1) + 6, P.Y(0) + 24, "1", { size: 15, anchor: "start" }],
                    [P.X(2.2), P.Y(11), "y = 2x²", { size: 13, anchor: "start" }],
                    [P.X(0), P.Y(2) + 24, "この部分は除く", { size: 11 }]
                ])
            ]), "y=2x² の x<-1, 1<x の部分。"),
            caption: "中点 M の軌跡は y = 2x² のうち x < −1 または 1 < x の部分（端点は除く）。"
        }
    },
    59: {
        answer: {
            svg: graphN(520, 380, -1.4, 1.9, -5, 4.5, P => {
                const f = t => -2 * t * t - 2 * t + 3;
                return figureBody([
                    line(P.X(-1), P.Y(-5), P.X(-1), P.Y(3), S_DASH),
                    line(P.X(Math.SQRT2), P.Y(-5), P.X(Math.SQRT2), P.Y(3), S_DASH),
                    curve(P, f, -1, Math.SQRT2),
                    dots([[P.X(-1), P.Y(3)], [P.X(-0.5), P.Y(3.5)], [P.X(Math.SQRT2), P.Y(f(Math.SQRT2))]]),
                    labels([
                        [P.X(-0.5) - 8, P.Y(3.5) - 10, "最大 7/2", { size: 15, anchor: "end" }],
                        [P.X(Math.SQRT2) + 8, P.Y(-3.8) + 4, "最小 −1−2√2", { size: 15, anchor: "start" }],
                        [P.X(-1) - 6, P.Y(-4.6) + 16, "−1", { size: 15, anchor: "end" }],
                        [P.X(Math.SQRT2) + 6, P.Y(-4.6) + 16, "√2", { size: 15, anchor: "start" }],
                        [P.X(0.7), P.Y(1.2), "y = −2t² − 2t + 3", { size: 15, anchor: "start" }]
                    ])
                ]);
            }, "y=-2t²-2t+3 の -1≦t≦√2 におけるグラフ。", "t", "y"),
            caption: "t = −1/2 で最大値 7/2、t = √2 で最小値 −1−2√2。"
        }
    },
    64: {
        answer: {
            svg: graphN(520, 380, 0, 4, -20, 10, P => figureBody([
                line(P.X(2), P.Y(-20), P.X(2), P.Y(-6), S_DASH),
                curve(P, t => -4 * t * t + t + 8, 2, 4),
                dots([[P.X(2), P.Y(-6)]]),
                labels([
                    [P.X(2) + 8, P.Y(-6) - 8, "t = 2 で最大 −6", { size: 15, anchor: "start" }],
                    [P.X(3.2), P.Y(-14), "g(t) = −4t² + t + 8", { size: 15, anchor: "start" }],
                    [P.X(2) - 6, P.Y(-19) + 16, "2", { size: 15, anchor: "end" }]
                ])
            ]), "g(t)=-4t²+t+8 の t≧2 におけるグラフ。", "t", "u"),
            caption: "軸 t = 1/8 は範囲 t ≧ 2 より左。t ≧ 2 では単調減少で、t = 2 のとき最大値 −6。"
        }
    },
    67: {
        answer: {
            svg: graph(520, 380, -2.2, 2.2, -4, 4, P => figureBody([
                curve(P, x => x ** 3 - x, -1.9, 1.9),
                curve(P, x => 2 * x - 2, -0.9, 1.9),
                curve(P, x => 2 * x + 2, -1.9, 0.9),
                dots([[P.X(1), P.Y(0)], [P.X(-1), P.Y(0)]]),
                txtRot(P.X(1.75) - 9, P.Y(1.5) - 5, "y = 2x − 2", -63.43, { size: 15, anchor: "start" }),
                txtRot(P.X(-1.75) - 9, P.Y(-1.5) - 5, "y = 2x + 2", -63.43, { size: 15, anchor: "start" }),
                labels([
                    [P.X(1) + 8, P.Y(0) + 18, "接点 (1, 0)", { size: 15, anchor: "start" }],
                    [P.X(-1.15), P.Y(0.75), "接点 (−1, 0)", { size: 15, anchor: "end" }],
                    [P.X(-1.6), P.Y(3.2), "y = x³ − x", { size: 15, anchor: "start" }]
                ])
            ]), "y=x³-x と、傾き2の2本の接線。"),
            caption: "接点は (1, 0) と (−1, 0)。接線は y = 2x − 2 と y = 2x + 2。"
        }
    },
    70: {
        answer: {
            svg: graphN(520, 380, -1, 3.2, -8, 4, P => {
                const g = t => -2 * (t ** 3) + 6 * t * t - 6;
                return figureBody([
                    line(P.X(-1), P.Y(-6), P.X(3.2), P.Y(-6), S_DASH),
                    line(P.X(-1), P.Y(2), P.X(3.2), P.Y(2), S_DASH),
                    curve(P, g, -0.8, 3.1),
                    dots([[P.X(0), P.Y(-6)], [P.X(2), P.Y(2)]]),
                    labels([
                        [P.X(0) - 8, P.Y(-6) - 8, "極小 −6", { size: 15, anchor: "end" }],
                        [P.X(1.9), P.Y(2.62), "極大 2", { size: 15, anchor: "end" }],
                        [P.X(-0.9), P.Y(2.7), "u = a（3個の共有点）", { size: 15, anchor: "start" }],
                        [P.X(2.7), P.Y(-6.6), "u = g(t)", { size: 15, anchor: "end" }]
                    ])
                ]);
            }, "g(t)=-2t³+6t²-6 と直線 u=a が3点で交わる図。", "t", "u"),
            caption: "u = a が極小値 −6 と極大値 2 の間にあるとき、接線が3本引ける。"
        }
    },
    73: {
        answer: {
            svg: graphN(520, 380, 0, 2.4, 0, 3, P => {
                const F = t => (t < 1 ? (4 / 3) * t ** 3 - t * t + 1 / 3 : t * t - 1 / 3);
                return figureBody([
                    line(P.X(0.5), P.Y(0), P.X(0.5), P.Y(0.25), S_DASH),
                    curve(P, F, 0, 2.3),
                    dots([[P.X(0.5), P.Y(0.25)], [P.X(1), P.Y(2 / 3)]]),
                    labels([
                        [P.X(0.5) + 8, P.Y(0.25) + 18, "最小 1/4 (t = 1/2)", { size: 15, anchor: "start" }],
                        [P.X(1) + 8, P.Y(2 / 3) - 8, "2/3", { size: 15, anchor: "start" }],
                        [P.X(0.4), P.Y(2.55), "F(t)", { size: 15, anchor: "start" }]
                    ])
                ]);
            }, "F(t) のグラフ。t=1/2 で最小値 1/4。", "t", "F"),
            caption: "F(t) は t = 1/2 で最小値 1/4 をとる。"
        }
    },
    74: {
        answer: {
            svg: graph(520, 400, -1, 4, -2, 10, P => {
                const f1 = x => x * x, f2 = x => -x * x + 6 * x;
                return figureBody([
                    shadeBetween(P, f2, f1, 0, 3),
                    curve(P, f1, -1, 4),
                    curve(P, f2, -1, 4),
                    dots([[P.X(0), P.Y(0)], [P.X(3), P.Y(9)]]),
                    labels([
                        [P.X(2.0), P.Y(9.4), "y = −x² + 6x", { size: 15, anchor: "end" }],
                        [P.X(3.4), P.Y(6.2), "y = x²", { size: 15, anchor: "start" }],
                        [P.X(3) + 8, P.Y(9) - 8, "(3, 9)", { size: 15, anchor: "start" }]
                    ])
                ]);
            }, "2つの放物線 y=x² と y=-x²+6x で囲まれた部分。"),
            caption: "交点は x = 0, 3。囲まれる部分の面積は 1/6 公式で 9 になる。"
        }
    },
    75: {
        answer: {
            svg: graph(560, 420, -1, 5, -6, 7, P => {
                const c1 = x => -x * x + 2 * x + 4, c2 = x => (x - 3) ** 2 - 5;
                return figureBody([
                    shadeBetween(P, c1, c2, 0, 4),
                    curve(P, c1, -0.8, 4.8),
                    curve(P, c2, -0.8, 4.8),
                    dots([[P.X(0), P.Y(4)], [P.X(4), P.Y(-4)], [P.X(1), P.Y(5)], [P.X(3), P.Y(-5)]]),
                    labels([
                        [P.X(1) + 10, P.Y(5) - 10, "C₁ の頂点 (1, 5)", { size: 11, anchor: "start" }],
                        [P.X(3) + 8, P.Y(-5) + 16, "C₂ の頂点 (3, −5)", { size: 11, anchor: "start" }],
                        [P.X(2), P.Y(2.2), "S", { size: 13 }]
                    ])
                ]);
            }, "C1: y=-x²+2x+4 と C2: y=(x-3)²-5 で囲まれた部分。"),
            caption: "p = 3 のとき C₂ : y = (x−3)² − 5。交点は x = 0, 4 で、面積の最大値は 64/3。"
        }
    },
    76: {
        answer: {
            svg: graph(560, 400, -0.5, 4.2, -1, 7, P => {
                const c1 = x => x * x, c2 = x => x * x - 4 * x + 8, l = x => 2 * x - 1;
                return figureBody([
                    shadeBetween(P, c1, l, 1, 2),
                    shadeBetween(P, c2, l, 2, 3),
                    curve(P, c1, -0.4, 3.2),
                    curve(P, c2, 0.8, 4.1),
                    curve(P, l, -0.3, 4.1),
                    dots([[P.X(1), P.Y(1)], [P.X(2), P.Y(4)], [P.X(3), P.Y(5)]]),
                    labels([
                        [P.X(1) - 8, P.Y(1) - 8, "接点 (1,1)", { size: 11, anchor: "end" }],
                        [P.X(1.6), P.Y(3.0), "交点 (2,4)", { size: 11, anchor: "end" }],
                        [P.X(3) + 8, P.Y(5) - 8, "接点 (3,5)", { size: 11, anchor: "start" }],
                        [P.X(3.9), P.Y(2.6), "l : y = 2x − 1", { size: 11, anchor: "end" }],
                        [P.X(2.9), P.Y(1.2), "C₁", { size: 15 }],
                        [P.X(0.8), P.Y(6.3), "C₂", { size: 15 }]
                    ])
                ]);
            }, "C1: y=x²、C2: y=x²-4x+8、共通接線 l で囲まれた部分。"),
            caption: "共通接線 l : y = 2x − 1。接点は x = 1, 3、交点は x = 2。面積は 2/3。"
        }
    }
};

// ===========================================================================
// 演習（図形・ベクトル）
// ===========================================================================
const EX_FIG = {
    17: {
        question: {
            svg: svg(440, 380, "三角形ABC。AB=7、BC=5、CA=9。", figureBody([
                poly([[95, 70], [120, 320], [300, 320]]),
                dots([[95, 70], [120, 320], [300, 320]]),
                labels([
                    [86, 62, "A", { size: 15 }], [112, 342, "B", { size: 15 }], [314, 342, "C", { size: 15 }],
                    [96, 198, "7", { size: 17, anchor: "end" }],
                    [210, 342, "5", { size: 17 }],
                    [208, 190, "9", { size: 17, anchor: "start" }]
                ])
            ])),
            caption: "AB = 7, BC = 5, CA = 9 の三角形 ABC。"
        }
    },
    18: {
        answer: {
            svg: svg(520, 380, "三角形ABC。AB=14、BC=10、CA=12 で、角Bの二等分線BDがACと交わる。", figureBody([
                poly([[60, 310], [360, 44], [420, 310]]),
                seg([360, 44], [270, 310], S_THIN),
                dots([[60, 310], [360, 44], [420, 310], [270, 310]]),
                labels([
                    [48, 328, "A", { size: 15 }], [356, 34, "B", { size: 15 }], [434, 328, "C", { size: 15 }],
                    [270, 332, "D", { size: 17 }],
                    [196, 152, "14", { size: 17, anchor: "end" }],
                    [404, 158, "10", { size: 17, anchor: "start" }],
                    [240, 296, "12", { size: 17 }],
                    [164, 332, "7", { size: 13 }],
                    [346, 332, "5", { size: 13 }]
                ])
            ])),
            caption: "AB : BC : CA = 7 : 6 : 5。AC = 12 より 3辺は 14, 10, 12。BD は ∠B の二等分線。"
        }
    },
    19: {
        answer: {
            svg: svg(480, 360, "三角形ABC。AB=3、AC=2、角A=60度で、角Aの二等分線ADがBCと交わる。", figureBody([
                poly([[100, 300], [370, 300], [190, 144]]),
                seg([100, 300], [262, 207], S_THIN),
                dots([[100, 300], [370, 300], [190, 144], [262, 207]]),
                path("M 136 300 A 36 36 0 0 0 118 269", S_THIN),
                labels([
                    [88, 318, "A", { size: 15 }], [370, 318, "B", { size: 15 }], [184, 130, "C", { size: 15 }],
                    [268, 224, "D", { size: 17, anchor: "start" }],
                    [236, 322, "3", { size: 17 }],
                    [128, 214, "2", { size: 17, anchor: "end" }],
                    [122, 284, "60°", { size: 15, anchor: "start" }],
                    [172, 240, "AD", { size: 15, anchor: "end" }]
                ])
            ])),
            caption: "△ABD と △ACD の面積の和が △ABC に等しいことを利用して AD を求める。"
        }
    },
    20: {
        answer: {
            svg: svg(480, 380, "円に内接する四角形ABCD。AB=2、BC=3、CD=1、DA=2。対角線ACとBDの交点E。", figureBody([
                circle(226, 239, 137, S_THIN),
                poly([[226, 102], [90, 220], [345, 308], [362, 220]]),
                seg([226, 102], [345, 308], S_THIN),
                seg([90, 220], [362, 220], S_THIN),
                dots([[226, 102], [90, 220], [345, 308], [362, 220], [294, 220]]),
                labels([
                    [226, 86, "A", { size: 15 }], [76, 238, "B", { size: 15 }],
                    [352, 332, "C", { size: 15 }], [376, 224, "D", { size: 15 }],
                    [300, 208, "E", { size: 13, anchor: "start" }],
                    [150, 148, "2", { size: 13 }],
                    [202, 280, "3", { size: 13 }],
                    [368, 268, "1", { size: 13, anchor: "start" }],
                    [304, 148, "2", { size: 13, anchor: "start" }]
                ])
            ])),
            caption: "四角形 ABCD は円に内接。対角の和が 180° であることを使って BD を求める。"
        }
    },
    27: {
        question: {
            svg: svg(500, 500, "碁盤の目状の道路。O(0,0)、P(5,6)、A(3,2)、B(4,1)、通行止めのC(5,2)。", figureBody([
                `<g ${S_GRID}>` + [80, 140, 200, 260, 320, 380].map(x => line(x, 80, x, 440)).join("") + [80, 140, 200, 260, 320, 380, 440].map(y => line(80, y, 380, y)).join("") + `</g>`,
                dots([[80, 440], [380, 80], [260, 320], [320, 380]]),
                `<path d="M370,310 L390,330 M390,310 L370,330" stroke="${ACCENT}" stroke-width="3.5" fill="none"/>`,
                labels([
                    [66, 458, "O", { size: 16 }], [394, 74, "P", { size: 16, anchor: "start" }],
                    [248, 310, "A", { size: 15, anchor: "end" }], [330, 398, "B", { size: 15, anchor: "start" }],
                    [394, 314, "C", { size: 15, anchor: "start" }]
                ])
            ])),
            caption: "O を原点とすると P(5,6)、A(3,2)、B(4,1)、C(5,2)。C は通行止め。"
        }
    },
    37: {
        question: {
            svg: svg(500, 390, "三角形ABC。DはBCを5対3に内分、EはADを2対1に内分、FはABとCEの交点。", figureBody([
                poly([[170, 70], [80, 340], [440, 340]]),
                seg([170, 70], [305, 340], S_THIN),
                seg([440, 340], [131, 186], S_THIN),
                dots([[170, 70], [80, 340], [440, 340], [305, 340], [260, 250], [131, 186]]),
                labels([
                    [170, 54, "A", { size: 15 }], [64, 358, "B", { size: 15 }], [456, 358, "C", { size: 15 }],
                    [305, 362, "D", { size: 14 }], [274, 244, "E", { size: 14, anchor: "start" }],
                    [120, 178, "F", { size: 14, anchor: "end" }]
                ])
            ])),
            caption: "BD : DC = 5 : 3、AE : ED = 2 : 1、F = AB ∩ CE。"
        }
    },
    38: {
        answer: {
            svg: svg(560, 340, "PQを直径とする円。Qにおける接線と直線PRの交点S。PR=9、RS=7。", figureBody([
                circle(260, 270, 120, S_THIN),
                seg([140, 270], [380, 270], S_MAIN),
                seg([380, 270], [380, 58], S_MAIN),
                seg([140, 270], [380, 58], S_MAIN),
                path("M 368 270 L 368 258 L 380 258", S_THIN),
                dots([[140, 270], [380, 270], [380, 58], [275, 151], [260, 270]]),
                labels([
                    [126, 288, "P", { size: 15, anchor: "end" }], [394, 286, "Q", { size: 15, anchor: "start" }],
                    [394, 52, "S", { size: 15, anchor: "start" }], [286, 144, "R", { size: 14, anchor: "start" }],
                    [206, 202, "9", { size: 13, anchor: "end" }], [330, 96, "7", { size: 13, anchor: "start" }],
                    [260, 292, "6", { size: 12 }]
                ])
            ])),
            caption: "PQ は直径、SQ は接線なので ∠PQS = 90°。SP = 9 + 7 = 16。"
        }
    },
    56: {
        answer: {
            svg: svg(520, 1060, "三角方程式・不等式を単位円で解く3つの図。", figureBody([
                [0, 340, 680].map((oy, i) => {
                    const cx = 260, cy = oy + 195, r = 100;
                    const title = ["(1) sinθ = 1/2", "(2) cosθ(2sinθ−1) > 0", "(3) sin t < 0"][i];
                    const head = txt(260, oy + 26, title, { size: 14 });
                    const p30 = polar(cx, cy, r, 30), p150 = polar(cx, cy, r, 150);
                    if (i === 0) {
                        return head + figureBody([
                            unitCircle(cx, cy, r),
                            line(cx - r - 22, cy - 50, cx + r + 22, cy - 50, S_DASH),
                            dots([[p30[0], p30[1]], [p150[0], p150[1]]]),
                            labels([
                                [p30[0] + 10, p30[1] - 10, "π/6", { size: 12, anchor: "start" }],
                                [p150[0] - 10, p150[1] - 10, "5π/6", { size: 12, anchor: "end" }],
                                [cx - r - 28, cy - 44, "1/2", { size: 12, anchor: "end" }]
                            ])
                        ]);
                    }
                    if (i === 1) {
                        return head + figureBody([
                            unitCircle(cx, cy, r),
                            line(cx - r - 22, cy - 50, cx + r + 22, cy - 50, S_DASH),
                            line(cx, cy - r - 22, cx, cy + r + 22, S_DASH),
                            arcStroke(cx, cy, r, 30 * Math.PI / 180, 90 * Math.PI / 180),
                            arcStroke(cx, cy, r, 150 * Math.PI / 180, 270 * Math.PI / 180),
                            labels([
                                [cx + 112.6, cy - 65, "π/6", { size: 12 }],
                                [cx, cy - r - 28, "π/2", { size: 12 }],
                                [cx - 112.6, cy - 65, "5π/6", { size: 12 }],
                                [cx, cy + r + 30, "3π/2", { size: 12 }]
                            ])
                        ]);
                    }
                    return head + figureBody([
                        unitCircle(cx, cy, r),
                        arcStroke(cx, cy, r, 180 * Math.PI / 180, 360 * Math.PI / 180),
                        labels([
                            [cx - r - 26, cy - 8, "π", { size: 12, anchor: "end" }],
                            [cx + r + 24, cy - 8, "0", { size: 12, anchor: "start" }],
                            [cx + 62, cy + r + 20, "5π/3 = −π/3", { size: 11, anchor: "start" }],
                            [cx - 4, cy + 66, "sin t < 0", { size: 11, anchor: "end" }]
                        ])
                    ]);
                })
            ])),
            caption: "(1) 高さ 1/2 の点は π/6 と 5π/6。(2) 緑の弧が解の範囲。(3) 下半円が sin t < 0 で、t の範囲 −π/3≦t<0, π<t<5π/3 に対応する。"
        }
    },
    57: {
        answer: {
            svg: svg(500, 400, "単位円と sin(x+α) のとり得る範囲。α から π+α まで。", (() => {
                const cx = 240, cy = 200, r = 120;
                const al = Math.atan2(Math.sqrt(3), 2);
                const s = polar(cx, cy, r, al * 180 / Math.PI);
                const e = polar(cx, cy, r, 180 + al * 180 / Math.PI);
                const sy = cy + r * Math.sqrt(3) / Math.sqrt(7);
                return figureBody([
                    unitCircle(cx, cy, r),
                    arcStroke(cx, cy, r, al, Math.PI + al),
                    line(cx - r - 20, cy - r, cx + r + 20, cy - r, S_DASH),
                    line(cx - r - 20, sy, cx + r + 20, sy, S_DASH),
                    dots([[cx, cy - r], [e[0], e[1]]]),
                    labels([
                        [cx + r + 26, cy - r + 6, "1", { size: 12, anchor: "start" }],
                        [cx - r - 26, sy + 6, "−√3/√7", { size: 12, anchor: "end" }],
                        [s[0] + 14, s[1] - 10, "α", { size: 13, anchor: "start" }],
                        [cx - 12, cy - r - 12, "π/2", { size: 12, anchor: "end" }],
                        [e[0] - 14, e[1] + 18, "π+α", { size: 13, anchor: "end" }]
                    ])
                ]);
            })()),
            caption: "x+α は α から π+α まで動く。この範囲で sin の最大は 1（x+α=π/2）、最小は −√3/√7（x+α=π+α）。"
        }
    },
    58: {
        answer: {
            svg: svg(500, 400, "単位円と sin(2θ+π/3) のとり得る範囲。π/3 から 4π/3 まで。", (() => {
                const cx = 240, cy = 200, r = 120;
                const s = polar(cx, cy, r, 60), e = polar(cx, cy, r, 240);
                const sy = cy + r * Math.sqrt(3) / 2;
                return figureBody([
                    unitCircle(cx, cy, r),
                    arcStroke(cx, cy, r, Math.PI / 3, 4 * Math.PI / 3),
                    line(cx - r - 20, cy - r, cx + r + 20, cy - r, S_DASH),
                    line(cx - r - 20, sy, cx + r + 20, sy, S_DASH),
                    dots([[cx, cy - r], [e[0], e[1]]]),
                    labels([
                        [cx + r + 26, cy - r + 6, "1", { size: 12, anchor: "start" }],
                        [cx - r - 26, sy + 6, "−√3/2", { size: 12, anchor: "end" }],
                        [s[0] + 16, s[1] + 18, "π/3", { size: 12, anchor: "start" }],
                        [cx + 10, cy - r - 12, "π/2", { size: 12, anchor: "start" }],
                        [e[0], e[1] + 24, "4π/3", { size: 12 }]
                    ])
                ]);
            })()),
            caption: "2θ+π/3 は π/3 から 4π/3 まで動く。最大は 1（2θ+π/3=π/2）、最小は −√3/2（2θ+π/3=4π/3）。"
        }
    },
    69: {
        answer: {
            svg: svg(700, 340, "1辺10cmの正方形の四隅から1辺xの正方形を切り取り、直方体の箱を作る。", figureBody([
                `<rect x="50" y="50" width="200" height="200" fill="none" stroke="currentColor" stroke-width="2"/>`,
                `<g fill="${ACCENT}" fill-opacity="0.22" stroke="currentColor" stroke-width="1.4">` + [
                    `<rect x="50" y="50" width="45" height="45"/>`,
                    `<rect x="205" y="50" width="45" height="45"/>`,
                    `<rect x="50" y="205" width="45" height="45"/>`,
                    `<rect x="205" y="205" width="45" height="45"/>`
                ].join("") + `</g>`,
                labels([
                    [150, 38, "10", { size: 18 }],
                    [72, 78, "x", { size: 16 }],
                    [150, 276, "四隅を切り取る", { size: 15 }]
                ]),
                `<g stroke="currentColor" stroke-width="2" fill="none">` + [
                    `<path d="M400,210 L520,210 L520,270 L400,270 Z"/>`,
                    `<path d="M400,210 L440,170 L560,170 L520,210"/>`,
                    `<path d="M520,210 L560,170 L560,230 L520,270"/>`
                ].join("") + `</g>`,
                labels([
                    [460, 296, "10 − 2x", { size: 16 }],
                    [536, 248, "x", { size: 16, anchor: "start" }],
                    [470, 158, "箱", { size: 16 }]
                ])
            ])),
            caption: "底面は 1辺 10 − 2x の正方形、高さは x。容積 V = x(10 − 2x)²（0 < x < 5）。"
        }
    },
    93: {
        question: {
            svg: svg(540, 360, "平行四辺形ABCD。EはABを2対1に内分、FはBCの中点、GはCDの中点、HはCEとFGの交点。", figureBody([
                poly([[70, 300], [400, 300], [482, 80], [152, 80]]),
                seg([482, 80], [290, 300], S_THIN),
                seg([441, 190], [317, 80], S_THIN),
                dots([[70, 300], [400, 300], [482, 80], [152, 80], [290, 300], [441, 190], [317, 80], [410, 163]]),
                labels([
                    [70, 322, "A", { size: 15 }], [400, 322, "B", { size: 15 }],
                    [496, 86, "C", { size: 15, anchor: "start" }], [140, 70, "D", { size: 15, anchor: "end" }],
                    [290, 322, "E", { size: 14 }], [452, 196, "F", { size: 14, anchor: "start" }],
                    [317, 66, "G", { size: 14 }], [420, 158, "H", { size: 14, anchor: "start" }]
                ])
            ])),
            caption: "E は AB を 2 : 1 に内分、F・G はそれぞれ BC・CD の中点、H = CE ∩ FG。"
        }
    },
    94: {
        answer: {
            svg: svg(580, 380, "三角形ABCの内部の点P。直線APとBCの交点D。BD対DCが3対5。", figureBody([
                poly([[80, 60], [80, 330], [520, 330]]),
                seg([80, 60], [245, 330], S_THIN),
                dots([[80, 60], [80, 330], [520, 330], [245, 330], [168, 214]]),
                labels([
                    [80, 44, "A", { size: 15 }], [64, 348, "B", { size: 15 }], [536, 348, "C", { size: 15 }],
                    [245, 352, "D", { size: 14 }], [180, 208, "P", { size: 14, anchor: "start" }],
                    [152, 344, "3", { size: 12 }], [392, 344, "5", { size: 12 }]
                ])
            ])),
            caption: "7PA + 5PB + 3PC = 0 を満たす P。AP と BC の交点が D で、BD : DC = 3 : 5。"
        }
    },
    95: {
        answer: {
            svg: svg(520, 380, "三角形OAB。OA=2、OB=3、OAとOBのなす角は鈍角。", figureBody([
                poly([[240, 320], [400, 320], [180, 88]]),
                path("M 280 320 A 40 40 0 0 0 230 281", S_THIN),
                dots([[240, 320], [400, 320], [180, 88]]),
                labels([
                    [226, 338, "O", { size: 15, anchor: "end" }], [414, 338, "A", { size: 15, anchor: "start" }],
                    [166, 76, "B", { size: 15, anchor: "end" }],
                    [320, 342, "2", { size: 14 }], [196, 198, "3", { size: 14, anchor: "end" }],
                    [262, 300, "θ", { size: 13 }]
                ])
            ])),
            caption: "|OA| = 2、|OB| = 3、OA·OB = −3/2。なす角は鈍角で cos θ = −1/4。"
        }
    },
    97: {
        question: {
            svg: svg(480, 360, "三角形OAB。PはABを2対1に内分、QはPからOAに下ろした垂線の足。", figureBody([
                poly([[90, 320], [415, 320], [122, 62]]),
                seg([220, 148], [220, 320], S_THIN),
                path("M 220 320 L 220 308 L 232 308", S_THIN),
                dots([[90, 320], [415, 320], [122, 62], [220, 148], [220, 320]]),
                labels([
                    [76, 338, "O", { size: 15, anchor: "end" }], [428, 338, "A", { size: 15, anchor: "start" }],
                    [108, 50, "B", { size: 15, anchor: "end" }],
                    [232, 142, "P", { size: 14, anchor: "start" }], [220, 342, "Q", { size: 14 }],
                    [252, 342, "5", { size: 14 }], [100, 190, "4", { size: 14, anchor: "end" }],
                    [290, 176, "6", { size: 14, anchor: "start" }]
                ])
            ])),
            caption: "OA = 5、OB = 4、AB = 6。P は AB を 2 : 1 に内分し、PQ ⊥ OA。"
        }
    },
    98: {
        answer: {
            svg: svg(520, 380, "半径1の円周上の3点A,B,C。7OA+5OB+3OC=0。直線COとABの交点H。", figureBody([
                circle(260, 210, 130, S_THIN),
                seg([260, 210], [139, 258], S_THIN),
                seg([260, 210], [390, 210], S_THIN),
                seg([260, 210], [325, 97], S_THIN),
                seg([139, 258], [390, 210], S_MAIN),
                seg([325, 97], [244, 238], S_DASH),
                path("M 300 210 A 40 40 0 0 0 280 175", S_THIN),
                dots([[260, 210], [139, 258], [390, 210], [325, 97], [244, 238]]),
                labels([
                    [124, 268, "A", { size: 15, anchor: "end" }], [404, 214, "B", { size: 15, anchor: "start" }],
                    [332, 84, "C", { size: 15 }], [238, 256, "H", { size: 14, anchor: "end" }],
                    [250, 194, "O", { size: 13, anchor: "end" }], [298, 190, "60°", { size: 12 }]
                ])
            ])),
            caption: "OA = OB = OC = 1、∠BOC = 60°。H は直線 CO と直線 AB の交点。"
        }
    },
    99: {
        question: {
            svg: svg(640, 520, "四面体OABC。PはABを2対1に内分、QはPCの中点、RはOQを4対1に内分、SはARと平面OBCの交点。", figureBody([
                seg([280, 50], [70, 410], S_MAIN),
                seg([280, 50], [520, 360], S_MAIN),
                seg([280, 50], [310, 470], S_MAIN),
                poly([[70, 410], [520, 360], [310, 470]]),
                seg([280, 50], [340, 423], S_THIN),
                seg([370, 377], [310, 470], S_THIN),
                seg([70, 410], [367, 339], S_DASH),
                dots([[280, 50], [70, 410], [520, 360], [310, 470], [370, 377], [340, 423], [328, 349], [368, 339]]),
                labels([
                    [270, 36, "O", { size: 15 }], [56, 428, "A", { size: 15 }], [534, 368, "B", { size: 15 }],
                    [300, 492, "C", { size: 15 }], [382, 382, "P", { size: 13, anchor: "start" }],
                    [350, 440, "Q", { size: 13, anchor: "start" }], [316, 344, "R", { size: 13, anchor: "end" }],
                    [380, 330, "S", { size: 13, anchor: "start" }]
                ])
            ])),
            caption: "P は AB を 2 : 1、Q は PC の中点、R は OQ を 4 : 1 に内分。S = AR ∩ 平面OBC。"
        }
    },
    100: {
        question: {
            svg: svg(620, 400, "座標空間の3点A,B,Cが定める平面αと、原点Oからαへ下ろした垂線OH。", figureBody([
                poly([[60, 300], [420, 330], [520, 180], [160, 150]], S_THIN),
                poly([[200, 290], [400, 300], [330, 190]]),
                seg([300, 70], [200, 290], S_MAIN),
                seg([300, 70], [400, 300], S_MAIN),
                seg([300, 70], [330, 190], S_MAIN),
                seg([300, 70], [132, 244], S_DASH),
                dots([[300, 70], [200, 290], [400, 300], [330, 190], [132, 244]]),
                labels([
                    [300, 54, "O", { size: 15 }], [190, 312, "A", { size: 15 }], [410, 318, "B", { size: 15 }],
                    [336, 176, "C", { size: 15 }], [118, 236, "H", { size: 14, anchor: "end" }],
                    [450, 265, "α", { size: 15 }]
                ])
            ])),
            caption: "A(0,−1,2), B(−1,0,5), C(1,1,3) が定める平面 α。OH ⊥ α。"
        }
    }
};

const EX_REGION = {
    55: {
        answer: {
            svg: svg(560, 420, "円(x-1)²+y²=25の内部で直線y=-x/2+3/2より上側の領域D。", figureBody([
                arcShade(240, 220, 120, -0.2838, 2.4981),
                circle(240, 220, 120, S_THIN),
                line(120, 136, 390, 271, S_MAIN),
                line(108, 100, 204, 228, S_DASH),
                line(252, 36, 372, 212, S_DASH),
                dots([[144, 148], [355, 254], [336, 148], [240, 220]]),
                labels([
                    [240, 60, "D", { size: 16 }],
                    [122, 176, "P(−3, 3)", { size: 11, anchor: "end" }],
                    [368, 262, "Q(29/5, −7/5)", { size: 11, anchor: "start" }],
                    [346, 142, "接点 (5, 3)", { size: 11, anchor: "start" }],
                    [252, 232, "O′", { size: 12, anchor: "start" }],
                    [104, 92, "4x+3y=−3", { size: 11, anchor: "end" }],
                    [366, 30, "4x+3y=29", { size: 11, anchor: "end" }]
                ])
            ])),
            caption: "領域 D は円の内部で直線の上側。4x+3y は (−3,3) で最小 −3、(5,3) で最大 29。"
        }
    }
};

const EXERCISE = { ...EX_GRAPH, ...EX_FIG, ...EX_REGION };

export const BUNKEI_MATH_FIGURES = {
    reidai: REIDAI,
    exercise: EXERCISE
};
