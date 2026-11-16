import {
  BUNKEI_MATH_CATALOG as RAW_CATALOG,
  BUNKEI_MATH_CHAPTERS as RAW_CHAPTERS,
  BUNKEI_MATH_PROBLEMS as RAW_PROBLEMS,
  // @ts-expect-error JS data file
} from './bunkei-math-data.js';
import {
  BUNKEI_MATH_EXERCISES as RAW_EXERCISES,
  BUNKEI_MATH_EXERCISES_CATALOG as RAW_EXERCISES_CATALOG,
  // @ts-expect-error JS data file
} from './bunkei-math-exercises-data.js';
// @ts-expect-error JS data file
import { BUNKEI_MATH_FIGURES as RAW_FIGURES } from './bunkei-math-figures.js';

export type BunkeiMode = 'reidai' | 'exercise';
export type BunkeiStatus = 'cleared' | 'mistake';

export interface BunkeiChapter {
  id: string;
  title: string;
  range: [number, number];
}

export interface BunkeiCatalogItem {
  id: number;
  chapter: string;
  title: string;
  sources?: string[];
  target_reidai?: number;
}

export interface BunkeiFigure {
  svg: string;
  caption?: string;
}

export interface BunkeiFigureSet {
  question?: BunkeiFigure;
  answer?: BunkeiFigure;
}

export interface BunkeiProblemData {
  id: number;
  chapter: string;
  title: string;
  sources?: string[];
  question: string;
  answer: string;
  explanation?: string;
  commentary?: string;
  key_point?: string;
  target_reidai?: number;
  figure?: BunkeiFigure;
}

export const BUNKEI_MATH_CHAPTERS = RAW_CHAPTERS as BunkeiChapter[];
export const BUNKEI_MATH_CATALOG = RAW_CATALOG as BunkeiCatalogItem[];
export const BUNKEI_MATH_PROBLEMS = RAW_PROBLEMS as Record<
  number,
  BunkeiProblemData | undefined
>;

export const BUNKEI_MATH_EXERCISES_CATALOG =
  RAW_EXERCISES_CATALOG as BunkeiCatalogItem[];
export const BUNKEI_MATH_EXERCISES = RAW_EXERCISES as Record<
  number,
  BunkeiProblemData | undefined
>;

export const BUNKEI_MATH_FIGURES = RAW_FIGURES as {
  reidai: Record<number, BunkeiFigureSet | undefined>;
  exercise: Record<number, BunkeiFigureSet | undefined>;
};

export const REIDAI_TOTAL = 158;
export const EXERCISE_TOTAL = 115;

export const REIDAI_TO_EXERCISES: Record<number, number[]> = (() => {
  const map: Record<number, number[]> = {};
  for (const ex of BUNKEI_MATH_EXERCISES_CATALOG) {
    if (ex.target_reidai) {
      if (!map[ex.target_reidai]) map[ex.target_reidai] = [];
      map[ex.target_reidai].push(ex.id);
    }
  }
  return map;
})();

export const EXERCISE_CHAPTERS: string[] = (() => {
  const list: string[] = [];
  for (const ex of BUNKEI_MATH_EXERCISES_CATALOG) {
    if (ex.chapter && !list.includes(ex.chapter)) {
      list.push(ex.chapter);
    }
  }
  return list;
})();

export function getBunkeiProgressKey(mode: BunkeiMode, id: number): string {
  return `${mode}_${id}`;
}

export function getBunkeiProblemDbId(mode: BunkeiMode, id: number): string {
  return mode === 'reidai' ? `BUNKEI_MATH_${id}` : `BUNKEI_MATH_EX_${id}`;
}

/**
 * 制御文字崩れやKaTeXでの空ボックス表記を正規化する
 */
export function sanitizeBunkeiMath(raw?: string): string {
  if (!raw) return '';
  let t = String(raw);
  t = t.replace(/\x0cbox/g, '\\boxed');
  t = t.replace(/\x08eta/g, '\\beta');
  t = t.replace(/\x08egin/g, '\\begin');
  t = t.replace(/\x08mathbf/g, '\\mathbf');
  t = t.replace(/\\text\{\s*\\(fbox|boxed)\{([^}]*)\}\s*\}/g, '\\boxed{$2}');
  t = t.replace(/\\(fbox|boxed)\{\s*[　\s]*\}/g, '\\boxed{\\quad}');
  t = t.replace(/\$([^$]+)\$/g, (_, inner: string) => {
    return '$' + inner.replace(/　/g, ' \\quad ') + '$';
  });
  return t.trim();
}

/**
 * 問題文の小問番号 (1), (2), (i), (ii) の前後で読みやすく段落を分ける
 */
export function formatBunkeiQuestion(raw?: string): string {
  if (!raw) return '';
  let t = sanitizeBunkeiMath(raw);

  const mathBlocks: string[] = [];
  t = t.replace(/(\$\$[\s\S]*?\$\$|\$[^\$\n]+?\$)/g, (match) => {
    mathBlocks.push(match);
    return `%%%MATH_BLOCK_${mathBlocks.length - 1}%%%`;
  });

  t = t.replace(
    /([。．；])\s*(\(\s*([1-9]|10|[ivx]+)\s*\)|\[\s*([1-9]|10)\s*\])(?!\s*(で|より|を|に|の|から|と|が|を利用|の結果))/gi,
    '$1\n\n$2',
  );

  const lines = t.split(/\r?\n/);
  const formattedLines: string[] = [];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i].trim();
    if (!line) {
      formattedLines.push('');
      continue;
    }
    const isSubquestionHeader =
      /^\s*(\(\s*([1-9]|10|[ivx]+)\s*\)|\[\s*([1-9]|10)\s*\])/i.test(line);
    if (
      isSubquestionHeader &&
      formattedLines.length > 0 &&
      formattedLines[formattedLines.length - 1] !== ''
    ) {
      formattedLines.push('');
    }
    formattedLines.push(line);
  }

  let result = formattedLines
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  result = result.replace(
    /%%%MATH_BLOCK_(\d+)%%%/g,
    (_, idx: string) => mathBlocks[Number(idx)] ?? '',
  );
  return result;
}
