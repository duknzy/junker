import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { cn } from '../lib/cn';

/**
 * 1行の $$...$$ や複数行の $$\begin{aligned}...\end{aligned}$$ を確実に
 * ディスプレイ数式ブロックとして認識させ、さらに通常の単一改行(\n)が
 * 空白に潰れて文字が敷き詰められるのを防ぐプリプロセッサ。
 */
export function normalizeMathMarkdown(raw: string): string {
  if (!raw) return '';

  // 1. コードブロックを保護
  const codeBlocks: string[] = [];
  let text = raw.replace(/```[\s\S]*?```/g, (match) => {
    codeBlocks.push(match);
    return `%%%CODE_BLOCK_${codeBlocks.length - 1}%%%`;
  });

  // 2. $$...$$ を独立した行のディスプレイ数式ブロックに正規化し退避
  const displayMathBlocks: string[] = [];
  text = text.replace(/\$\$([\s\S]*?)\$\$/g, (_, inner: string) => {
    const cleaned = inner.trim();
    const block = `\n\n$$\n${cleaned}\n$$\n\n`;
    displayMathBlocks.push(block);
    return `\n\n%%%DISPLAY_MATH_${displayMathBlocks.length - 1}%%%\n\n`;
  });

  // 3. 単一改行を保持しつつ、箇条書きの直前には空行を補う
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const out: string[] = [];

  const isListLine = (line: string) =>
    /^\s*([-*+]|\d+\.)\s+/.test(line);
  const isBlockSyntax = (line: string) =>
    /^\s*(#{1,6}\s|>|\|)/.test(line) ||
    /^%%%(DISPLAY_MATH|CODE_BLOCK)_\d+%%%$/.test(line.trim());

  for (let i = 0; i < lines.length; i += 1) {
    const curr = lines[i];
    const next = i + 1 < lines.length ? lines[i + 1] : undefined;

    if (curr.trim() === '') {
      out.push('');
      continue;
    }

    if (next !== undefined && next.trim() !== '') {
      // 非リスト行の直後にリストが来る場合は空行を挿入して <ul>/<ol> を確実に開始させる
      if (!isListLine(curr) && isListLine(next)) {
        out.push(curr);
        out.push('');
        continue;
      }
      // 通常のテキスト行同士の単一改行は Markdown の強制改行 (末尾スペース2個) に変換
      if (!isListLine(curr) && !isBlockSyntax(curr) && !isBlockSyntax(next)) {
        out.push(`${curr.replace(/\s+$/, '')}  `);
        continue;
      }
    }

    out.push(curr);
  }

  let result = out.join('\n').replace(/\n{3,}/g, '\n\n');

  // 4. 退避したディスプレイ数式とコードブロックを復元
  result = result.replace(
    /%%%DISPLAY_MATH_(\d+)%%%/g,
    (_, idx: string) => displayMathBlocks[Number(idx)] ?? '',
  );
  result = result.replace(
    /%%%CODE_BLOCK_(\d+)%%%/g,
    (_, idx: string) => codeBlocks[Number(idx)] ?? '',
  );

  return result.trim();
}

export function Markdown({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <div className={cn('markdown', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {normalizeMathMarkdown(children)}
      </ReactMarkdown>
    </div>
  );
}

export function InlineMarkdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{ p: 'span' }}
    >
      {children}
    </ReactMarkdown>
  );
}
