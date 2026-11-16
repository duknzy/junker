import { db } from './db';
import { INITIAL_SRS } from './srs';
import type { Flashcard, Problem } from './types';
import { notifyLocalChange } from '../sync/events';

function daysFromNow(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

function demoProblem(overrides: Partial<Problem> & Pick<Problem, 'id' | 'shortTitle' | 'title'>): Problem {
  const now = new Date().toISOString();
  return {
    subject: '数学',
    unit: '未分類',
    answer: '',
    trap: '',
    strategy: '',
    mnemonic: '',
    source: 'manual',
    imageIds: [],
    errorCount: 0,
    nextReviewAt: now,
    srs: { ...INITIAL_SRS },
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export const SEED_PROBLEMS: Problem[] = [
  demoProblem({
    id: 'seed_quadratic',
    shortTitle: '二次関数の最大値',
    title:
      '関数 $y = x^2 - 4x + 1$ の $0 \\le x \\le 3$ における最大値と最小値を求めよ。',
    subject: '数学',
    unit: '二次関数',
    answer:
      '平方完成すると $y = (x-2)^2 - 3$。頂点は $x=2$。\n\n- 最小値: $x=2$ のとき $-3$\n- 最大値: 軸から遠い $x=0$ のとき $1$（$x=3$ のときも $1$）',
    trap:
      '頂点が定義域の外にある場合に、頂点の値をそのまま最小値・最大値にしてしまう。まず軸の位置を定義域と比べる。',
    strategy:
      '二次関数の最大最小は「平方完成 → 軸の位置 → 定義域との位置関係」の順で確認する。軸が定義域の内側か外側かで場合分けする。',
    mnemonic: '平方完成したら、まず軸と定義域を比べる。',
    errorCount: 2,
    nextReviewAt: daysFromNow(-1),
    srs: { state: 'learning', intervalDays: 1, ease: 2.3, streak: 1, lapses: 1 },
    explanation: {
      summary:
        '二次関数の最大・最小は、頂点だけで決まりません。定義域のどこで軸が通るかを確認し、端点も必ず比べます。',
      sections: [
        {
          title: '1. 平方完成で軸と頂点を出す',
          body:
            '$y = x^2 - 4x + 1 = (x-2)^2 - 3$ と変形します。これで軸が $x=2$、頂点が $(2, -3)$ だと分かります。',
        },
        {
          title: '2. 定義域と軸の位置を比べる',
          body:
            '定義域は $0 \\le x \\le 3$ で、軸 $x=2$ はこの中にあります。したがって頂点が最小値の候補になります。',
        },
        {
          title: '3. 端点も比べて最大値を決める',
          body:
            '最大値は軸から遠い端点で起こります。$x=0$ と $x=3$ の値を計算すると、どちらも $1$ です。頂点の $-3$ と比べて最大値は $1$ と分かります。',
        },
      ],
      keyPoints: [
        '平方完成して軸と頂点を求める',
        '軸が定義域の内側か外側かを確認する',
        '最大・最小は頂点と端点の両方を比べる',
      ],
      pitfalls: [
        '頂点の値をそのまま最大値にしてしまう',
        '端点の確認を忘れる',
        '定義域が書かれているのに無視する',
      ],
    },
  }),
  demoProblem({
    id: 'seed_newton',
    shortTitle: '動摩擦力と加速度',
    title:
      '水平な床の上に質量 $2.0\\,\\mathrm{kg}$ の物体を置き、右向きに $10\\,\\mathrm{N}$ の力を加える。物体と床の動摩擦係数を $0.20$、重力加速度を $9.8\\,\\mathrm{m/s^2}$ とする。物体の加速度を求めよ。',
    subject: '物理',
    unit: '力学',
    answer:
      '動摩擦力は $f = \\mu N = 0.20 \\times 2.0 \\times 9.8 = 3.92\\,\\mathrm{N}$。\n運動方程式 $2.0a = 10 - 3.92$ より $a \\approx 3.0\\,\\mathrm{m/s^2}$（右向き）。',
    trap:
      '動摩擦力の向きを加えた力と同じ向きにしてしまう。摩擦力は必ず運動を妨げる向きに働く。',
    strategy:
      '力学の問題は「物体にはたらく力をすべて図に書き出す → 運動方向を正に決める → 運動方程式を立てる」の順で進める。',
    mnemonic: '摩擦力は、いつも運動の逆向き。',
    errorCount: 1,
    nextReviewAt: daysFromNow(2),
    srs: { state: 'review', intervalDays: 7, ease: 2.6, streak: 3, lapses: 1 },
  }),
  demoProblem({
    id: 'seed_equilibrium',
    shortTitle: '平衡移動の方向',
    title:
      '窒素と水素からアンモニアが生成される反応 $\\mathrm{N_2 + 3H_2 \\rightleftharpoons 2NH_3}$ は発熱反応である。この平衡状態で温度を上げると、平衡はどちらに移動するか。',
    subject: '化学',
    unit: '化学平衡',
    answer: '吸熱方向、すなわち左（アンモニアの分解方向）へ移動する。',
    trap:
      '「温度を上げると反応速度が上がる」ことと「平衡がどちらに移動するか」を混同する。ルシャトリエの原理では、温度上昇は吸熱方向への移動を促す。',
    strategy:
      '平衡移動は「濃度・圧力・温度」の3つに分けて考える。温度の場合は反応熱の符号を必ず確認する。',
    mnemonic: '温度を上げたら、吸熱の向きへ逃げる。',
    errorCount: 0,
    nextReviewAt: daysFromNow(-2),
    srs: { ...INITIAL_SRS },
  }),
];

export async function seedDemoData(): Promise<number> {
  const existing = await db.problems.filter((problem) => !problem.deletedAt).count();
  if (existing > 0) return 0;

  const now = new Date().toISOString();
  const seedCards: Flashcard[] = SEED_PROBLEMS.filter((p) => p.mnemonic).map(
    (p) => ({
      id: `card_${p.id}`,
      front: `${p.shortTitle}の定石・暗記ポイントは？`,
      back: [p.mnemonic, p.strategy].filter(Boolean).join('\n\n'),
      subject: p.subject,
      unit: p.unit,
      problemId: p.id,
      problemTitle: p.shortTitle,
      srs: { ...INITIAL_SRS },
      nextReviewAt: now,
      createdAt: now,
      updatedAt: now,
    }),
  );

  await db.transaction('rw', db.problems, db.cards, async () => {
    await db.problems.bulkAdd(SEED_PROBLEMS);
    const cardCount = await db.cards.filter((c) => !c.deletedAt).count();
    if (cardCount === 0 && seedCards.length > 0) {
      await db.cards.bulkPut(seedCards);
    }
  });
  notifyLocalChange();
  return SEED_PROBLEMS.length;
}
