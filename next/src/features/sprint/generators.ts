import type { SprintPresetId } from '@/data/types';

export interface SprintQuestion {
  prompt: string;
  answer: string;
  kind: 'number' | 'fraction' | 'factor';
  validate: (raw: string) => boolean;
}

export interface SprintPreset {
  id: SprintPresetId;
  label: string;
  description: string;
  inputMode: 'numeric' | 'text';
  placeholder: string;
  generate: () => SprintQuestion;
}

export const SPRINT_DURATIONS = [60, 120, 180] as const;

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/** 全角数字・記号を半角に直し、空白とカンマを落とす。 */
function normalize(raw: string): string {
  return raw
    .replace(/[０-９]/g, (char) =>
      String.fromCharCode(char.charCodeAt(0) - 0xfee0),
    )
    .replace(/[／]/g, '/')
    .replace(/[（]/g, '(')
    .replace(/[）]/g, ')')
    .replace(/[＋]/g, '+')
    .replace(/[−－]/g, '-')
    .replace(/[，,]/g, '')
    .replace(/\s/g, '');
}

function toNumber(raw: string): number | null {
  const value = normalize(raw);
  if (!value) return null;
  if (!/^[+-]?(\d+(\.\d+)?|\.\d+)$/.test(value)) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function numberQuestion(prompt: string, answer: number): SprintQuestion {
  return {
    prompt,
    answer: String(answer),
    kind: 'number',
    validate: (raw) => toNumber(raw) === answer,
  };
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const next = x % y;
    x = y;
    y = next;
  }
  return x || 1;
}

function reduce(n: number, d: number): { n: number; d: number } {
  if (d < 0) {
    n = -n;
    d = -d;
  }
  const divisor = gcd(n, d);
  return { n: n / divisor, d: d / divisor };
}

function fractionText(n: number, d: number): string {
  const reduced = reduce(n, d);
  return reduced.d === 1 ? String(reduced.n) : `${reduced.n}/${reduced.d}`;
}

function parseFraction(raw: string): { n: number; d: number } | null {
  const value = normalize(raw);
  const match = value.match(/^([+-]?\d+)(?:\/([+-]?\d+))?$/);
  if (!match) return null;
  const n = Number(match[1]);
  const d = match[2] === undefined ? 1 : Number(match[2]);
  if (!Number.isFinite(n) || !Number.isFinite(d) || d === 0) return null;
  return reduce(n, d);
}

function fractionQuestion(
  prompt: string,
  n: number,
  d: number,
): SprintQuestion {
  const target = reduce(n, d);
  return {
    prompt,
    answer: fractionText(n, d),
    kind: 'fraction',
    validate: (raw) => {
      const given = parseFraction(raw);
      return !!given && given.n === target.n && given.d === target.d;
    },
  };
}

function factorTerm(value: number): string {
  if (value === 0) return 'x';
  return value > 0 ? `x+${value}` : `x-${Math.abs(value)}`;
}

function factorText(a: number, b: number): string {
  return `(${factorTerm(a)})(${factorTerm(b)})`;
}

function parseFactor(raw: string): number[] | null {
  const value = normalize(raw);
  const match = value.match(/^\(x([+-]\d+)?\)\(x([+-]\d+)?\)$/);
  if (!match) return null;
  const first = match[1] === undefined ? 0 : Number(match[1]);
  const second = match[2] === undefined ? 0 : Number(match[2]);
  if (!Number.isFinite(first) || !Number.isFinite(second)) return null;
  return [first, second].sort((x, y) => x - y);
}

function quadraticText(b: number, c: number): string {
  let text = 'x²';
  if (b === 1) text += ' + x';
  else if (b === -1) text += ' - x';
  else if (b > 0) text += ` + ${b}x`;
  else if (b < 0) text += ` - ${Math.abs(b)}x`;

  if (c > 0) text += ` + ${c}`;
  else if (c < 0) text += ` - ${Math.abs(c)}`;
  return text;
}

function factorQuestion(a: number, b: number): SprintQuestion {
  const target = [a, b].sort((x, y) => x - y);
  return {
    prompt: quadraticText(a + b, a * b),
    answer: factorText(a, b),
    kind: 'factor',
    validate: (raw) => {
      const given = parseFactor(raw);
      return (
        !!given && given[0] === target[0] && given[1] === target[1]
      );
    },
  };
}

function genArithmetic(): SprintQuestion {
  const op = pick(['+', '-', '×', '÷'] as const);
  if (op === '+') {
    const a = randInt(12, 89);
    const b = randInt(12, 89);
    return numberQuestion(`${a} + ${b}`, a + b);
  }
  if (op === '-') {
    const a = randInt(30, 99);
    const b = randInt(11, a - 1);
    return numberQuestion(`${a} − ${b}`, a - b);
  }
  if (op === '×') {
    const a = randInt(3, 12);
    const b = randInt(3, 12);
    return numberQuestion(`${a} × ${b}`, a * b);
  }
  const b = randInt(3, 12);
  const q = randInt(3, 12);
  return numberQuestion(`${b * q} ÷ ${b}`, q);
}

function genSigned(): SprintQuestion {
  const form = randInt(0, 3);
  if (form === 0) {
    const a = randInt(2, 15);
    const b = randInt(2, 15);
    return numberQuestion(`−${a} + ${b}`, -a + b);
  }
  if (form === 1) {
    const a = randInt(2, 15);
    const b = randInt(2, 15);
    return numberQuestion(`−${a} − (−${b})`, -a + b);
  }
  if (form === 2) {
    const a = randInt(2, 9);
    const b = randInt(2, 9);
    return numberQuestion(`(−${a}) × (−${b})`, a * b);
  }
  const a = randInt(2, 9);
  const b = randInt(2, 9);
  return numberQuestion(`(−${a}) × ${b}`, -a * b);
}

function genFraction(): SprintQuestion {
  const op = pick(['+', '-', '×', '÷'] as const);
  const b = randInt(2, 9);
  const d = randInt(2, 9);
  const a = randInt(1, b - 1);
  const c = randInt(1, d - 1);
  const left = `${a}/${b}`;
  const right = `${c}/${d}`;

  if (op === '+') return fractionQuestion(`${left} + ${right}`, a * d + c * b, b * d);
  if (op === '-') return fractionQuestion(`${left} − ${right}`, a * d - c * b, b * d);
  if (op === '×') return fractionQuestion(`${left} × ${right}`, a * c, b * d);
  return fractionQuestion(`${left} ÷ ${right}`, a * d, b * c);
}

function genSqrt(): SprintQuestion {
  const form = randInt(0, 2);
  const k = randInt(2, 7);
  const m = randInt(2, 6);
  const n = randInt(2, 6);

  if (form === 0) {
    return numberQuestion(`√${m * m * k} × √${n * n * k}`, m * n * k);
  }
  if (form === 1) {
    const divisor = randInt(2, 4);
    const multiple = randInt(1, 4);
    const bigger = divisor * multiple;
    return numberQuestion(
      `√${bigger * bigger * k} ÷ √${divisor * divisor * k}`,
      multiple,
    );
  }
  return numberQuestion(`(√${m * m * k})²`, m * m * k);
}

function genFactor(): SprintQuestion {
  let a = 0;
  let b = 0;
  do {
    a = randInt(-9, 9);
    b = randInt(-9, 9);
  } while (a === 0 || b === 0 || a === b);
  return factorQuestion(a, b);
}

export const SPRINT_PRESETS: SprintPreset[] = [
  {
    id: 'arithmetic',
    label: '四則演算',
    description: '整数のたし算・ひき算・かけ算・わり算',
    inputMode: 'numeric',
    placeholder: '答え',
    generate: genArithmetic,
  },
  {
    id: 'signed',
    label: '正負の数',
    description: '符号と括弧の扱い',
    inputMode: 'numeric',
    placeholder: '答え',
    generate: genSigned,
  },
  {
    id: 'fraction',
    label: '分数',
    description: '分数の四則。a/b の形で入力',
    inputMode: 'text',
    placeholder: '例: 3/4',
    generate: genFraction,
  },
  {
    id: 'sqrt',
    label: '平方根',
    description: '√の積・商・2乗',
    inputMode: 'numeric',
    placeholder: '答え',
    generate: genSqrt,
  },
  {
    id: 'factor',
    label: '因数分解',
    description: '(x+a)(x+b) の形で入力',
    inputMode: 'text',
    placeholder: '例: (x+2)(x+3)',
    generate: genFactor,
  },
];

export function getSprintPreset(id: SprintPresetId): SprintPreset {
  return SPRINT_PRESETS.find((preset) => preset.id === id) ?? SPRINT_PRESETS[0];
}
