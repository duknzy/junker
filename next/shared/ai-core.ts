/**
 * AIプロキシの共通コア。
 * ローカル開発（vite.config.ts）と Cloudflare Pages Functions の両方から呼ばれる。
 * ここには Node / Workers 固有のAPIを書かないこと。
 */

export type AIFeature =
  | 'problem_analysis'
  | 'explanation'
  | 'lesson_plan'
  | 'daily_drill'
  | 'qna_chat';

export interface AIImage {
  mimeType: string;
  /** base64（data URLの接頭辞なし） */
  data: string;
}

export interface AIChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIRequest {
  feature: AIFeature;
  text?: string;
  subject?: string;
  unit?: string;
  answer?: string;
  trap?: string;
  strategy?: string;
  /** AI質問チャットの会話履歴 */
  messages?: AIChatMessage[];
  /** 出題数など、機能ごとの補助パラメータ */
  count?: number;
  /** 難易度（基礎 / 標準 / 応用） */
  level?: string;
  images?: AIImage[];
  model?: string;
  thinkingLevel?: string;
  allowMock?: boolean;
}

export interface AIUsage {
  promptTokens?: number;
  candidatesTokens?: number;
  totalTokens?: number;
}

export interface AIResult<T = unknown> {
  ok: boolean;
  data?: T;
  model?: string;
  mock?: boolean;
  usage?: AIUsage;
  error?: string;
}

export interface ProblemAnalysis {
  subject: string;
  unit: string;
  shortTitle: string;
  title: string;
  answer: string;
  trap: string;
  strategy: string;
  mnemonic: string;
}

export interface ExplanationSection {
  title: string;
  body: string;
}

export interface Explanation {
  summary: string;
  sections: ExplanationSection[];
  keyPoints: string[];
  pitfalls: string[];
}

export interface LessonCheck {
  question: string;
  choices: string[];
  answerIndex: number;
  explanation: string;
}

export interface LessonPlanPart {
  title: string;
  body: string;
  keyPoints: string[];
  check: LessonCheck;
}

export interface LessonPlan {
  title: string;
  subject: string;
  unit: string;
  overview: string;
  parts: LessonPlanPart[];
}

export interface DrillQuestion {
  unit: string;
  question: string;
  answer: string;
  explanation: string;
}

export interface DrillPlan {
  title: string;
  questions: DrillQuestion[];
}

export interface QnaChatReply {
  reply: string;
}

const ALLOWED_MODELS = [
  'gemini-4-hydrogen',
  'gemini-3.8-flash',
  'gemini-3.6-flash',
  'gemini-3.5-flash-lite',
];

const DEFAULT_MODEL = 'gemini-4-hydrogen';

const ANALYSIS_SCHEMA = {
  type: 'OBJECT',
  properties: {
    subject: { type: 'STRING' },
    unit: { type: 'STRING' },
    shortTitle: { type: 'STRING' },
    title: { type: 'STRING' },
    answer: { type: 'STRING' },
    trap: { type: 'STRING' },
    strategy: { type: 'STRING' },
    mnemonic: { type: 'STRING' },
  },
  required: ['subject', 'unit', 'shortTitle', 'title', 'answer', 'trap', 'strategy', 'mnemonic'],
};

const EXPLANATION_SCHEMA = {
  type: 'OBJECT',
  properties: {
    summary: { type: 'STRING' },
    sections: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          title: { type: 'STRING' },
          body: { type: 'STRING' },
        },
        required: ['title', 'body'],
      },
    },
    keyPoints: { type: 'ARRAY', items: { type: 'STRING' } },
    pitfalls: { type: 'ARRAY', items: { type: 'STRING' } },
  },
  required: ['summary', 'sections', 'keyPoints', 'pitfalls'],
};

const LESSON_SCHEMA = {
  type: 'OBJECT',
  properties: {
    title: { type: 'STRING' },
    subject: { type: 'STRING' },
    unit: { type: 'STRING' },
    overview: { type: 'STRING' },
    parts: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          title: { type: 'STRING' },
          body: { type: 'STRING' },
          keyPoints: { type: 'ARRAY', items: { type: 'STRING' } },
          check: {
            type: 'OBJECT',
            properties: {
              question: { type: 'STRING' },
              choices: { type: 'ARRAY', items: { type: 'STRING' } },
              answerIndex: { type: 'INTEGER' },
              explanation: { type: 'STRING' },
            },
            required: ['question', 'choices', 'answerIndex', 'explanation'],
          },
        },
        required: ['title', 'body', 'keyPoints', 'check'],
      },
    },
  },
  required: ['title', 'subject', 'unit', 'overview', 'parts'],
};

const DRILL_SCHEMA = {
  type: 'OBJECT',
  properties: {
    title: { type: 'STRING' },
    questions: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          unit: { type: 'STRING' },
          question: { type: 'STRING' },
          answer: { type: 'STRING' },
          explanation: { type: 'STRING' },
        },
        required: ['unit', 'question', 'answer', 'explanation'],
      },
    },
  },
  required: ['title', 'questions'],
};

const QNA_SCHEMA = {
  type: 'OBJECT',
  properties: {
    reply: { type: 'STRING' },
  },
  required: ['reply'],
};

const ANALYSIS_PROMPT = `あなたは高校生の「誤答から学ぶ」学習を支援する、経験豊富な受験指導の専門家です。
与えられた問題文と画像（あれば）を読み取り、生徒が復習で使える形に整理してください。

必ず次のJSONだけを出力してください（前後の説明文やMarkdownのコードフェンスは禁止）。

- subject: 教科（数学 / 物理 / 化学 / 生物 / 英語 / 国語 / 日本史 / 世界史 / 地理 / 公民 / 情報 / その他）
- unit: 単元・分野（例: 二次関数、力学、化学平衡）
- shortTitle: 一覧に表示する24文字以内の短いタイトル
- title: 問題文の全文。画像の場合は読み取った問題文をできるだけ正確に再現する。数式は必ず $...$ で囲む
- answer: 模範解答。数式は $...$ で囲む
- trap: この問題で生徒が最もハマりやすい罠・間違いポイント。数式は $...$ で囲む
- strategy: この問題の「型」を見抜くための定石。具体的な数値には触れず、一般化して説明する。数式は $...$ で囲む
- mnemonic: 覚えておくべき一言（不要なら空文字）

数式はLaTeXで書き、必ず $...$ で囲むこと（例: $x^2 - 5x + 6 = 0$）。\`\\times\` などのコマンドは正しく書くこと（例: $7 \\times 3$）。

問題文:
`;

const EXPLANATION_PROMPT = `あなたは高校生の誤答復習を支援する、経験豊富な受験指導の専門家です。
以下の問題について、生徒が「なぜ間違えたのか」「次にどう考えればよいか」を理解できる解説を作成してください。

必ず次のJSONだけを出力してください（前後の説明文やMarkdownのコードフェンスは禁止）。

- summary: 解説の要点を2〜3文で
- sections: 3〜5個の解説セクション。各セクションは title と body。bodyはMarkdownで、数式は $...$ で囲む
- keyPoints: この問題で押さえるべきポイントを3〜5個
- pitfalls: 間違えやすいポイントを2〜4個

`;

const LESSON_PROMPT = `あなたは高校生に単元の基礎から応用までを教える、経験豊富な塾講師です。
指定された単元について、生徒が1人で読み進められる「授業」を作成してください。

必ず次のJSONだけを出力してください（前後の説明文やMarkdownのコードフェンスは禁止）。

- title: 授業タイトル（例: 二次関数の最大・最小）
- subject: 教科
- unit: 単元
- overview: この授業で学ぶこと（2〜3文）
- parts: 3〜4個のパート。各パートは次を持つ
  - title: パートタイトル（例: 1. 平方完成の手順）
  - body: 講義本文。Markdown。300〜500字。具体例を1つ以上入れ、数式は $...$ で囲む。見出し記号は使わない
  - keyPoints: このパートで押さえるポイント（2〜3個）。数式は $...$ で囲む
  - check: 理解確認の4択問題
    - question: 問題文。数式は $...$ で囲む
    - choices: 4つの選択肢（文字列のみ。記号や番号は付けない）
    - answerIndex: 正解の添字（0〜3）
    - explanation: なぜそれが正解かを1〜2文で

数式はLaTeXで書き、必ず $...$ で囲むこと。\\times などのコマンドは正しく書くこと。
`;

const DRILL_PROMPT = `あなたは高校生の毎日の演習を作る、経験豊富な受験指導の専門家です。
指定された条件で、5分程度で解ける短い問題を出題してください。

必ず次のJSONだけを出力してください（前後の説明文やMarkdownのコードフェンスは禁止）。

- title: 演習タイトル（例: 二次関数の演習）
- questions: 問題の配列（指定された問題数）
  - unit: 単元
  - question: 問題文。数式は $...$ で囲む。1問1答で解ける短い問題にする
  - answer: 模範解答。数式は $...$ で囲む
  - explanation: 解法の要点を1〜2文で。数式は $...$ で囲む

数式はLaTeXで書き、必ず $...$ で囲むこと。\\times などのコマンドは正しく書くこと。
`;

function buildPrompt(request: AIRequest): string {
  if (request.feature === 'problem_analysis') {
    const subjectHint = request.subject ? `\n生徒が選択した教科: ${request.subject}` : '';
    const text = request.text?.trim() || '（画像を参照してください）';
    return `${ANALYSIS_PROMPT}${text}${subjectHint}`;
  }

  if (request.feature === 'lesson_plan') {
    const unit = request.unit?.trim() || request.text?.trim() || '指定なし';
    const extra = request.text?.trim() && request.unit?.trim()
      ? `\n【補足・つまずき】\n${request.text.trim()}\n`
      : '';
    return `${LESSON_PROMPT}
【教科】${request.subject?.trim() || '指定なし'}
【単元・テーマ】${unit}
${extra}`;
  }

  if (request.feature === 'daily_drill') {
    const count = Math.min(10, Math.max(1, request.count ?? 5));
    const level = request.level?.trim();
    return `${DRILL_PROMPT}
【教科】${request.subject?.trim() || '指定なし'}
【出題する単元】${request.unit?.trim() || '基礎から標準をバランスよく'}
【難易度】${level || '基礎から標準'}
【問題数】${count}問
【補足】${request.text?.trim() || 'なし'}
`;
  }

  if (request.feature === 'qna_chat') {
    const history = (request.messages || [])
      .map((m) => `${m.role === 'user' ? '生徒' : '講師'}: ${m.content}`)
      .join('\n\n');
    return `あなたは高校生の質問にわかりやすく丁寧に答える受験指導のプロ講師です。
以下の問題に関する生徒からの質問に答えてください。
必ず JSON 形式 {"reply": "..."} のみを出力してください。
reply は Markdown 形式で記述し、数式は必ず $...$ または $$...$$ で囲んでください。重要な結論や着眼点は太字で強調し、段階的に噛み砕いて説明してください。

【教科・単元】${request.subject || '不明'} / ${request.unit || '不明'}
【問題文】
${request.text?.trim() || '（問題文なし）'}
【模範解答】
${request.answer?.trim() || '（なし）'}
【定石・補足】
${request.strategy?.trim() || '（なし）'}

【これまでの会話・質問】
${history || '生徒: この問題の解き方のポイントを教えてください。'}
`;
  }

  return `${EXPLANATION_PROMPT}
【問題文】
${request.text?.trim() || '（問題文なし）'}

【教科・単元】
${request.subject || '不明'} / ${request.unit || '不明'}

【模範解答】
${request.answer?.trim() || '（なし）'}

【定石】
${request.strategy?.trim() || '（なし）'}

【罠】
${request.trap?.trim() || '（なし）'}
`;
}

function stripCodeFence(text: string): string {
  let t = text.trim();
  if (t.startsWith('```json')) t = t.slice(7);
  else if (t.startsWith('```')) t = t.slice(3);
  if (t.endsWith('```')) t = t.slice(0, -3);
  return t.trim();
}

function extractText(json: any): string {
  const parts = json?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return '';
  return parts
    .map((part: any) => (typeof part?.text === 'string' ? part.text : ''))
    .join('');
}

function normalizeLevel(model: string, level?: string): string | undefined {
  if (!level || level === 'default' || level === 'auto') return undefined;
  const clean = String(level).toLowerCase();
  if (model.includes('lite')) return 'high';
  if (clean === 'xhigh') return model.includes('gemini-4') ? 'xhigh' : 'high';
  if (clean === 'minimal') return 'low';
  if (['low', 'medium', 'high'].includes(clean)) return clean;
  return undefined;
}

function mockAnalysis(request: AIRequest): ProblemAnalysis {
  const text = request.text?.trim();
  const title = text || '画像から登録した問題';
  const short = title.replace(/\s+/g, ' ').slice(0, 24) || '登録した問題';

  return {
    subject: request.subject || '数学',
    unit: request.unit || '未分類',
    shortTitle: short,
    title,
    answer:
      '（デモ表示）この問題の模範解答は、与えられた条件を整理し、定義に沿って順に立式することで得られます。実際のAIキーを設定すると、ここに正確な解答が入ります。',
    trap:
      '（デモ表示）条件の読み落としや、場合分けの漏れが典型的な罠です。まず「何が与えられていて、何を求めるか」を書き出しましょう。',
    strategy:
      '（デモ表示）問題文のキーワードから「型」を判定し、その型に対応する定石を最初に選ぶと迷いません。数値に飛びつく前に、使うべき原理を一言で決めます。',
    mnemonic: 'まず条件を書き出す。次に型を決める。',
  };
}

function mockExplanation(request: AIRequest): Explanation {
  const title = request.text?.slice(0, 40) || 'この問題';
  return {
    summary: `（デモ表示）${title} の解説です。実際のAIキーを設定すると、問題に即した解説が生成されます。`,
    sections: [
      {
        title: '1. 何を求める問題か',
        body: 'まずは問題文を読み、与えられた条件と求めるものを分けて書き出します。条件を図や表にすると、使うべき公式が見えやすくなります。',
      },
      {
        title: '2. 型を見抜く',
        body: 'この問題は「条件を整理して立式する」タイプです。似た問題で使った定石を思い出し、最初の一手を決めます。',
      },
      {
        title: '3. 計算と確認',
        body: '立式したら、単位・符号・場合分けを確認しながら計算します。最後に、求めた値が条件を満たすかを必ず検算します。',
      },
    ],
    keyPoints: ['条件を書き出す', '型を決めてから計算する', '最後に検算する'],
    pitfalls: ['条件の読み落とし', '場合分けの漏れ', '符号ミス'],
  };
}

function mockLesson(request: AIRequest): LessonPlan {
  const unit = request.unit?.trim() || request.text?.trim() || '二次関数';
  return {
    title: `${unit}の基礎（デモ）`,
    subject: request.subject || '数学',
    unit,
    overview:
      '（デモ表示）この授業では、単元の考え方から典型的な解法までを3つのパートで確認します。実際のAIキーを設定すると、単元に即した講義が生成されます。',
    parts: [
      {
        title: '1. まず何を見るか',
        body:
          '問題を見たら、最初に「与えられている条件」と「聞かれていること」を分けて書き出します。条件が式で与えられているなら、その式が何を表しているかを日本語で言い直すと、使うべき公式が見えてきます。',
        keyPoints: ['条件と問いを分けて書く', '式を日本語に直す'],
        check: {
          question: '問題を読み始めた直後に最初にすべきことはどれか。',
          choices: [
            'とりあえず計算を始める',
            '条件と問いを分けて書き出す',
            '答えを予想する',
            '公式をすべて思い出す',
          ],
          answerIndex: 1,
          explanation: '条件と問いを分けることで、使うべき知識が絞り込めます。',
        },
      },
      {
        title: '2. 型を決める',
        body:
          '条件を整理したら、似た問題の「型」を思い出します。型が決まれば、最初の一手で迷いません。数値に飛びつく前に、使う原理を一言で決めるのがコツです。',
        keyPoints: ['型を先に決める', '最初の一手を言語化する'],
        check: {
          question: '計算に入る前に決めておくべきことはどれか。',
          choices: ['使う原理・型', '答えの桁数', '解く順番', '筆算の書き方'],
          answerIndex: 0,
          explanation: '型が決まると、計算の道筋がぶれません。',
        },
      },
      {
        title: '3. 計算と確認',
        body:
          '方針が決まったら計算します。符号・単位・場合分けを確認し、最後に求めた値が条件を満たすかを検算します。検算の習慣が、ケアレスミスを大きく減らします。',
        keyPoints: ['符号と場合分けを確認', '最後に検算する'],
        check: {
          question: '計算後に必ず行うべきことはどれか。',
          choices: ['次の問題へ進む', '答えを暗記する', '条件を満たすか検算する', '別の解法を探す'],
          answerIndex: 2,
          explanation: '検算でケアレスミスの多くを防げます。',
        },
      },
    ],
  };
}

function mockDrill(request: AIRequest): DrillPlan {
  const unit = request.unit?.trim() || '基礎計算';
  const count = Math.min(5, Math.max(1, request.count ?? 3));
  const questions: DrillQuestion[] = Array.from({ length: count }, (_, index) => ({
    unit,
    question: `（デモ ${index + 1}）$x + ${index + 1} = ${index + 3}$ を解け。`,
    answer: `$x = ${2}$`,
    explanation: '左辺の定数を移項して、両辺から同じ数を引きます。',
  }));
  return { title: `${unit}の演習（デモ）`, questions };
}

function getMock(request: AIRequest): unknown {
  switch (request.feature) {
    case 'problem_analysis':
      return mockAnalysis(request);
    case 'lesson_plan':
      return mockLesson(request);
    case 'daily_drill':
      return mockDrill(request);
    case 'qna_chat': {
      const lastQ =
        request.messages?.[request.messages.length - 1]?.content || '質問';
      return {
        reply: `**ご質問ありがとうございます**（「${lastQ.slice(0, 40)}」について）\n\n1. **着眼点の整理**: まず与えられた条件と求めるものを確認しましょう。\n2. **式変形・原理の適用**: ${request.strategy || '模範解答の最初の一手（置き換えや条件式の立式）に注目すると見通しが良くなります。'}\n\n※サーバー環境変数に \`GEMINI_API_KEY\` を設定すると、問題文と数式に応じた詳細なAI回答が生成されます。`,
      } satisfies QnaChatReply;
    }
    default:
      return mockExplanation(request);
  }
}

export async function runAI<T = unknown>(
  request: AIRequest,
  apiKey: string,
): Promise<AIResult<T>> {
  if (!request || !request.feature) {
    return { ok: false, error: 'feature が指定されていません。' };
  }

  if (!apiKey) {
    return {
      ok: true,
      mock: true,
      model: 'demo',
      data: getMock(request) as T,
    };
  }

  const requested = ALLOWED_MODELS.includes(request.model || '')
    ? (request.model as string)
    : DEFAULT_MODEL;

  const models = [requested, ...ALLOWED_MODELS.filter((m) => m !== requested)];
  const schemaByFeature: Record<AIFeature, unknown> = {
    problem_analysis: ANALYSIS_SCHEMA,
    explanation: EXPLANATION_SCHEMA,
    lesson_plan: LESSON_SCHEMA,
    daily_drill: DRILL_SCHEMA,
    qna_chat: QNA_SCHEMA,
  };
  const schema = schemaByFeature[request.feature];
  const prompt = buildPrompt(request);

  const parts: Array<Record<string, unknown>> = [{ text: prompt }];
  for (const image of request.images || []) {
    if (image?.data) {
      parts.push({
        inlineData: {
          mimeType: image.mimeType || 'image/jpeg',
          data: image.data,
        },
      });
    }
  }

  let lastError = '';

  for (const model of models) {
    try {
      const body: Record<string, unknown> = {
        contents: [{ role: 'user', parts }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: schema,
        },
      };

      const thinkingLevel = normalizeLevel(model, request.thinkingLevel || 'high');
      if (thinkingLevel) {
        (body.generationConfig as Record<string, unknown>).thinkingConfig = {
          thinkingLevel,
        };
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        lastError = `${model}: HTTP ${response.status} ${errorText.slice(0, 240)}`;
        continue;
      }

      const json: any = await response.json();
      const text = extractText(json);
      if (!text) {
        lastError = `${model}: 応答テキストが空でした。`;
        continue;
      }

      const data = JSON.parse(stripCodeFence(text)) as T;
      const usage = json?.usageMetadata
        ? {
            promptTokens: json.usageMetadata.promptTokenCount,
            candidatesTokens: json.usageMetadata.candidatesTokenCount,
            totalTokens: json.usageMetadata.totalTokenCount,
          }
        : undefined;

      return { ok: true, data, model, usage };
    } catch (error) {
      lastError = `${model}: ${error instanceof Error ? error.message : String(error)}`;
    }
  }

  if (request.allowMock !== false) {
    return {
      ok: true,
      mock: true,
      model: 'demo',
      data: getMock(request) as T,
      error: lastError,
    };
  }

  return { ok: false, error: lastError || 'AI生成に失敗しました。' };
}
