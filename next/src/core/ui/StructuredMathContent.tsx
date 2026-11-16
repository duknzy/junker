import { useMemo } from 'react';
import { cn } from '../lib/cn';
import { Markdown } from './Markdown';

/**
 * インライン数式 $...$ の中にトップレベルの `=` や `\implies` が複数連なっている場合、
 * 1行に詰め込まずにステップごとの行に分割して縦に揃える。
 */
function splitTopLevelMathSteps(mathInner: string, prefixText: string): string[] | null {
  const trimmed = mathInner.trim();
  if (trimmed.length < 36) return null;
  if (trimmed.includes('\\begin{') || trimmed.includes('\\end{')) return null;

  // トップレベル（波括弧 depth === 0）での `=` および `\implies` / `\Longrightarrow` の位置を収集
  const eqPositions: number[] = [];
  const impliesPositions: Array<{ index: number; len: number; token: string }> = [];

  let depth = 0;
  for (let i = 0; i < trimmed.length; i += 1) {
    const ch = trimmed[i];
    if (ch === '\\') {
      const rest = trimmed.slice(i);
      const impMatch = /^\\(implies|Longrightarrow|iff|Longleftrightarrow)(?![a-zA-Z])/.exec(rest);
      if (impMatch && depth === 0) {
        impliesPositions.push({
          index: i,
          len: impMatch[0].length,
          token: impMatch[0],
        });
        i += impMatch[0].length - 1;
        continue;
      }
      // エスケープ文字 \{ \} 等をスキップ
      if (i + 1 < trimmed.length && (trimmed[i + 1] === '{' || trimmed[i + 1] === '}')) {
        i += 1;
        continue;
      }
      continue;
    }
    if (ch === '{') {
      depth += 1;
    } else if (ch === '}') {
      depth = Math.max(0, depth - 1);
    } else if (ch === '=' && depth === 0) {
      const prev = i > 0 ? trimmed[i - 1] : '';
      const next = i + 1 < trimmed.length ? trimmed[i + 1] : '';
      if (prev !== '!' && prev !== '<' && prev !== '>' && next !== '=') {
        eqPositions.push(i);
      }
    }
  }

  // パターンA: `\implies` が2個以上連なる長い変形
  if (impliesPositions.length >= 2) {
    const parts: string[] = [];
    const first = impliesPositions[0];
    const head = trimmed.slice(0, first.index).trim();
    if (head) {
      parts.push(`${prefixText}$${head}$`);
    }
    for (let idx = 0; idx < impliesPositions.length; idx += 1) {
      const curr = impliesPositions[idx];
      const nextIndex =
        idx + 1 < impliesPositions.length
          ? impliesPositions[idx + 1].index
          : trimmed.length;
      const body = trimmed.slice(curr.index + curr.len, nextIndex).trim();
      if (body) {
        parts.push(`$\\quad ${curr.token} \\; ${body}$`);
      }
    }
    if (parts.length >= 2) return parts;
  }

  // パターンB: トップレベルの `=` が2個以上連なる式変形
  if (eqPositions.length >= 2 && impliesPositions.length === 0) {
    const startsWithEq = eqPositions[0] === 0;
    const isYoshiki = /与式\s*$/.test(prefixText.trim());

    if (startsWithEq) {
      const parts: string[] = [];
      for (let idx = 0; idx < eqPositions.length; idx += 1) {
        const pos = eqPositions[idx];
        const nextPos =
          idx + 1 < eqPositions.length ? eqPositions[idx + 1] : trimmed.length;
        const rhs = trimmed.slice(pos + 1, nextPos).trim();
        if (rhs) {
          parts.push(
            idx === 0 && prefixText.trim()
              ? `${prefixText}$= ${rhs}$`
              : `$\\quad = ${rhs}$`,
          );
        }
      }
      if (parts.length >= 2) return parts;
    } else if (isYoshiki) {
      // `与式 $= A = B = C$`
      const parts: string[] = [];
      for (let idx = 0; idx < eqPositions.length; idx += 1) {
        const pos = eqPositions[idx];
        const nextPos =
          idx + 1 < eqPositions.length ? eqPositions[idx + 1] : trimmed.length;
        const rhs = trimmed.slice(pos + 1, nextPos).trim();
        if (rhs) {
          parts.push(
            idx === 0 ? `${prefixText}$= ${rhs}$` : `$\\quad = ${rhs}$`,
          );
        }
      }
      if (parts.length >= 2) return parts;
    } else {
      // `$LHS = RHS1 = RHS2 = RHS3$` -> 最初の `=` までを1行目、以降の `=` を改行して縦揃え
      const firstEq = eqPositions[0];
      const secondEq = eqPositions[1];
      const firstChunk = trimmed.slice(0, secondEq).trim();
      const parts: string[] = [`${prefixText}$${firstChunk}$`];
      for (let idx = 1; idx < eqPositions.length; idx += 1) {
        const pos = eqPositions[idx];
        const nextPos =
          idx + 1 < eqPositions.length ? eqPositions[idx + 1] : trimmed.length;
        const rhs = trimmed.slice(pos + 1, nextPos).trim();
        if (rhs) {
          parts.push(`$\\quad = ${rhs}$`);
        }
      }
      if (parts.length >= 2) return parts;
    }
  }

  return null;
}

/**
 * 1行の中で「リード文 + 長い数式」や「連続する式変形」がある場合に読みやすく行分割する。
 */
function expandMathLine(line: string): string[] {
  const trimmed = line.trim();
  if (!trimmed) return [''];

  // 行全体が `prefix $...$` で終わるパターンを検査
  const singleMathMatch = /^([^$]*)\$([^$]+)\$\s*([。．，、]?)$/.exec(trimmed);
  if (singleMathMatch) {
    const [, prefix, mathInner, trailingPunct] = singleMathMatch;
    const splitSteps = splitTopLevelMathSteps(mathInner, prefix);
    if (splitSteps && splitSteps.length > 1) {
      if (trailingPunct) {
        splitSteps[splitSteps.length - 1] += trailingPunct;
      }
      return splitSteps;
    }
  }

  return [trimmed];
}

/**
 * 解説文の長い段落を接続詞（また、ただし、つまり、ここで等）の位置で適度に段落分けする。
 */
function splitLongProseParagraph(line: string): string[] {
  if (line.length < 95) return [line];
  // 数式ブロックを一時保護
  const mathTokens: string[] = [];
  const masked = line.replace(/(\$\$[\s\S]*?\$\$|\$[^\$\n]+?\$)/g, (m) => {
    mathTokens.push(m);
    return `%%%M_${mathTokens.length - 1}%%%`;
  });

  const broken = masked.replace(
    /([。．])\s*(?=(また|ただし|つまり|ここで|なお|さらに|たとえば|特に|一方|したがって|よって|ゆえに|ちなみに|要するに)[、，])/g,
    '$1\n',
  );

  return broken.split('\n').map((part) =>
    part
      .replace(/%%%M_(\d+)%%%/g, (_, idx: string) => mathTokens[Number(idx)] ?? '')
      .trim(),
  );
}

interface CaseGroup {
  type: 'case';
  badge: string;
  condition: string;
  lines: string[];
}

interface StepItem {
  type: 'step';
  badge: string;
  lines: string[];
}

interface HeadingBlock {
  type: 'heading';
  title: string;
  lines: string[];
}

interface ConclusionBlock {
  type: 'conclusion';
  lines: string[];
}

interface ProseBlock {
  type: 'prose';
  lines: string[];
}

type ContentBlock =
  | CaseGroup
  | StepItem
  | HeadingBlock
  | ConclusionBlock
  | ProseBlock;

interface SubSection {
  badge?: string;
  blocks: ContentBlock[];
}

interface MajorSection {
  badge?: string;
  lead?: string;
  subSections: SubSection[];
}

/**
 * テキストを行単位で解析し、大問 [1]・小問 (1)・場合分け (ア)・見出し【...】・結論行に構造化する。
 */
function parseStructuredMath(
  raw: string,
  variant: 'answer' | 'explanation' | 'keypoint',
): MajorSection[] {
  if (!raw?.trim()) return [];

  // 1. ディスプレイ数式 $$...$$ が行の途中にある場合も前後に改行を入れて独立させる
  const normalizedRaw = raw
    .replace(/\r\n/g, '\n')
    .replace(/([^\n])\s*(\$\$[\s\S]*?\$\$)/g, '$1\n$2')
    .replace(/(\$\$[\s\S]*?\$\$)\s*([^\n])/g, '$1\n$2');

  // 2. $$...$$ ブロックを1つの塊として保持しながら行リストへ変換
  const rawTokens: string[] = [];
  let cursor = 0;
  const displayRegex = /\$\$[\s\S]*?\$\$/g;
  let match: RegExpExecArray | null;

  while ((match = displayRegex.exec(normalizedRaw)) !== null) {
    const before = normalizedRaw.slice(cursor, match.index);
    for (const l of before.split('\n')) {
      rawTokens.push(l);
    }
    rawTokens.push(match[0]);
    cursor = match.index + match[0].length;
  }
  for (const l of normalizedRaw.slice(cursor).split('\n')) {
    rawTokens.push(l);
  }

  // 3. 長い数式チェーンや長文解説を展開
  const lines: string[] = [];
  for (const token of rawTokens) {
    const t = token.trim();
    if (!t) {
      lines.push('');
      continue;
    }
    if (t.startsWith('$$') && t.endsWith('$$')) {
      lines.push(t);
      continue;
    }

    // 行途中に ` [2] ` や ` (ア) ` が埋め込まれている場合は分割（数式外のみ）
    const mathProtected: string[] = [];
    let masked = t.replace(/\$[^\$\n]+?\$/g, (m) => {
      mathProtected.push(m);
      return `%%%INM_${mathProtected.length - 1}%%%`;
    });
    masked = masked
      .replace(/\s+(\[[1-9]\])\s+/g, '\n$1 ')
      .replace(/(?<![,，、・])\s+(\([アイウエオカキクケコ]\))(?![,，、・]|より)\s+/g, '\n$1 ');
    const restoredSubLines = masked
      .split('\n')
      .map((s) =>
        s
          .replace(
            /%%%INM_(\d+)%%%/g,
            (_, idx: string) => mathProtected[Number(idx)] ?? '',
          )
          .trim(),
      );

    for (const subLine of restoredSubLines) {
      if (variant === 'explanation') {
        for (const pLine of splitLongProseParagraph(subLine)) {
          for (const expLine of expandMathLine(pLine)) {
            lines.push(expLine);
          }
        }
      } else {
        for (const expLine of expandMathLine(subLine)) {
          lines.push(expLine);
        }
      }
    }
  }

  // 4. 大問 [1], [2], [3] で分割
  const majorSections: MajorSection[] = [];
  let currentMajor: MajorSection = { subSections: [] };

  const majorHeaderRegex = /^\[([1-9]|10)\](?:\s+(.*))?$/;
  // 小問 (1), (2)... ただし解説文中の「(1) は」「(1) では」「(1) の」「(1) も」「(1), (2) は」は除外
  const subProblemRegex =
    variant === 'answer'
      ? /^\(([1-9]|10|i{1,3}|iv)\)\s+(.*)$/i
      : /^\(([1-9]|10|i{1,3}|iv)\)\s+(?!(は|では|の|も|で|より|から|と|を|において|について|[,，、]))(.*)$/i;

  const caseRegex =
    /^(\([アイウエオカキクケコ]\)|\[[ivx]+\])(?![,，、・]|より)\s*(.*)$/i;
  const bracketHeadingRegex = /^(?:【([^】]+)】|＜([^＞]+)＞)\s*(.*)$/;
  const stepBadgeRegex =
    /^([①②③④⑤⑥⑦⑧]|\(I{1,3}V?\))\s*(?!(より|から|を|に|の|と|が|\s*[+＋\-－]))(.*)$/;
  const conclusionRegex =
    /^(?:(?:\([アイウエオカキクケコ]\)\s*[,，、・]?\s*)+より|以上より|したがって|よって|ゆえに)[、，\s]*(.*)$/;

  let currentSub: SubSection = { blocks: [] };

  function pushCurrentSub() {
    if (currentSub.badge || currentSub.blocks.length > 0) {
      currentMajor.subSections.push(currentSub);
      currentSub = { blocks: [] };
    }
  }

  function pushCurrentMajor() {
    pushCurrentSub();
    if (currentMajor.badge || currentMajor.subSections.length > 0) {
      majorSections.push(currentMajor);
      currentMajor = { subSections: [] };
    }
  }

  function appendLineToBlocks(blocks: ContentBlock[], line: string) {
    if (!line) return;

    // 1) 見出し【...】 / ＜...＞
    const headingMatch = bracketHeadingRegex.exec(line);
    if (headingMatch) {
      const title = (headingMatch[1] || headingMatch[2] || '').trim();
      const rest = (headingMatch[3] || '').trim();
      blocks.push({
        type: 'heading',
        title,
        lines: rest ? [rest] : [],
      });
      return;
    }

    // 2) 結論・まとめ行 ((ア), (イ) より... / 以上より...)
    const concMatch = conclusionRegex.exec(line);
    const lastBlock = blocks[blocks.length - 1];
    if (
      concMatch &&
      (lastBlock?.type === 'case' ||
        line.includes('\\mathbf') ||
        /^\([アイウエオ]/.test(line))
    ) {
      blocks.push({
        type: 'conclusion',
        lines: [line],
      });
      return;
    }

    // 3) 場合分け (ア), (イ), (ウ)...
    const caseMatch = caseRegex.exec(line);
    if (caseMatch) {
      blocks.push({
        type: 'case',
        badge: caseMatch[1],
        condition: caseMatch[2].trim(),
        lines: [],
      });
      return;
    }

    // 4) ポイント番号 ①, ②, ③ / (I), (II), (III)
    const stepMatch = stepBadgeRegex.exec(line);
    if (stepMatch && stepMatch[3].trim()) {
      blocks.push({
        type: 'step',
        badge: stepMatch[1],
        lines: [stepMatch[3].trim()],
      });
      return;
    }

    // 直前が conclusion で、この行が $$...$$ のみ（結論の数式）なら conclusion に吸収
    if (lastBlock?.type === 'conclusion' && line.startsWith('$$')) {
      lastBlock.lines.push(line);
      return;
    }

    // 直前が case なら case 内に追加
    if (lastBlock?.type === 'case') {
      lastBlock.lines.push(line);
      return;
    }

    // 直前が heading で箇条書き・補足行なら heading 内に追加
    if (lastBlock?.type === 'heading') {
      lastBlock.lines.push(line);
      return;
    }

    // 通常の prose ブロック
    if (lastBlock?.type === 'prose') {
      lastBlock.lines.push(line);
    } else {
      blocks.push({
        type: 'prose',
        lines: [line],
      });
    }
  }

  for (const line of lines) {
    if (!line) {
      // 空行が来たら、case や heading の継続を区切るためにダミー境界を入れるか判定
      const lastBlock = currentSub.blocks[currentSub.blocks.length - 1];
      if (lastBlock && lastBlock.type === 'prose') {
        lastBlock.lines.push('');
      }
      continue;
    }

    // 大問 [1], [2] チェック
    const majorMatch = majorHeaderRegex.exec(line);
    if (majorMatch) {
      pushCurrentMajor();
      currentMajor.badge = `[${majorMatch[1]}]`;
      const rest = (majorMatch[2] ?? '').trim();
      if (rest) {
        // `[1] (1) ...` のように大問の直後に小問が続く場合
        const subInMajor = subProblemRegex.exec(rest);
        if (subInMajor) {
          currentSub = { badge: `(${subInMajor[1]})`, blocks: [] };
          const subRest = (subInMajor[subInMajor.length - 1] ?? '').trim();
          if (subRest) {
            for (const exp of expandMathLine(subRest)) {
              appendLineToBlocks(currentSub.blocks, exp);
            }
          }
        } else {
          for (const exp of expandMathLine(rest)) {
            appendLineToBlocks(currentSub.blocks, exp);
          }
        }
      }
      continue;
    }

    // 小問 (1), (2) チェック
    const subMatch = subProblemRegex.exec(line);
    if (subMatch) {
      pushCurrentSub();
      currentSub = { badge: `(${subMatch[1]})`, blocks: [] };
      const subRest = (subMatch[subMatch.length - 1] ?? '').trim();
      if (subRest) {
        for (const exp of expandMathLine(subRest)) {
          appendLineToBlocks(currentSub.blocks, exp);
        }
      }
      continue;
    }

    appendLineToBlocks(currentSub.blocks, line);
  }

  pushCurrentMajor();
  return majorSections;
}

export function StructuredMathContent({
  children,
  variant = 'answer',
  className,
}: {
  children: string;
  variant?: 'answer' | 'explanation' | 'keypoint';
  className?: string;
}) {
  const sections = useMemo(
    () => parseStructuredMath(children, variant),
    [children, variant],
  );

  if (sections.length === 0) return null;

  return (
    <div className={cn('space-y-4', className)}>
      {sections.map((major, majorIdx) => (
        <div
          key={majorIdx}
          className={cn(
            'space-y-3',
            major.badge &&
              sections.length > 1 &&
              'rounded-[11px] border border-border bg-surface-2 p-4',
          )}
        >
          {major.badge ? (
            <div className="flex items-center gap-2 border-b border-border pb-2">
              <span className="inline-flex items-center rounded-[6px] bg-accent px-2 py-0.5 text-xs font-bold tracking-wide text-white">
                大問 {major.badge}
              </span>
            </div>
          ) : null}

          <div className="space-y-3">
            {major.subSections.map((sub, subIdx) => (
              <div
                key={subIdx}
                className={cn(
                  sub.badge &&
                    'rounded-[10px] border border-border bg-surface-2 p-3.5 sm:p-4',
                )}
              >
                <div
                  className={cn(
                    sub.badge && 'flex items-start gap-2.5 sm:gap-3',
                  )}
                >
                  {sub.badge ? (
                    <span className="mt-0.5 inline-flex h-6 min-w-7 shrink-0 items-center justify-center rounded-[6px] border border-accent/35 bg-accent-soft px-1.5 text-xs font-semibold tabular-nums text-accent-ink">
                      {sub.badge}
                    </span>
                  ) : null}

                  <div className="min-w-0 flex-1 space-y-2.5">
                    {sub.blocks.map((block, bIdx) => {
                      if (block.type === 'heading') {
                        return (
                          <div
                            key={bIdx}
                            className="rounded-[9px] border border-accent/25 bg-accent-soft/30 px-3.5 py-2.5"
                          >
                            <p className="text-xs font-semibold tracking-wide text-accent-ink">
                              ◆ {block.title}
                            </p>
                            {block.lines.length > 0 ? (
                              <div className="mt-1.5 text-sm leading-relaxed">
                                <Markdown>{block.lines.join('\n')}</Markdown>
                              </div>
                            ) : null}
                          </div>
                        );
                      }

                      if (block.type === 'case') {
                        return (
                          <div
                            key={bIdx}
                            className="rounded-r-[9px] border-l-[3px] border-accent/65 bg-surface-2/55 py-2.5 pl-3.5 pr-3"
                          >
                            <div className="flex flex-wrap items-baseline gap-2">
                              <span className="inline-flex items-center rounded-[5px] bg-accent-soft px-1.5 py-0.5 text-xs font-semibold text-accent-ink">
                                場合分け {block.badge}
                              </span>
                              {block.condition ? (
                                <div className="text-sm font-semibold text-ink">
                                  <Markdown>{block.condition}</Markdown>
                                </div>
                              ) : null}
                            </div>
                            {block.lines.length > 0 ? (
                              <div className="mt-1.5 space-y-1 pl-1 text-sm leading-relaxed">
                                <Markdown>{block.lines.join('\n')}</Markdown>
                              </div>
                            ) : null}
                          </div>
                        );
                      }

                      if (block.type === 'conclusion') {
                        return (
                          <div
                            key={bIdx}
                            className="rounded-[9px] border border-accent/30 bg-accent-soft/35 px-3.5 py-2.5 text-sm leading-relaxed"
                          >
                            <Markdown>{block.lines.join('\n')}</Markdown>
                          </div>
                        );
                      }

                      if (block.type === 'step') {
                        return (
                          <div
                            key={bIdx}
                            className="flex items-start gap-2.5 rounded-[8px] border border-border bg-surface-2 px-3 py-2"
                          >
                            <span className="mt-0.5 inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft px-1.5 text-xs font-bold text-accent-ink">
                              {block.badge}
                            </span>
                            <div className="min-w-0 flex-1 text-sm leading-relaxed">
                              <Markdown>{block.lines.join('\n')}</Markdown>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={bIdx}
                          className="text-[0.94rem] leading-[1.95]"
                        >
                          <Markdown>{block.lines.join('\n')}</Markdown>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
