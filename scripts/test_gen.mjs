import fs from 'fs';

const key = process.env.GEMINI_API_KEY;

const KYOTSU_SPRINT_SCHEMA = {
  type: 'OBJECT',
  properties: {
    title: { type: 'STRING', description: '大問の題名（例: 数学II：加法定理の応用と三角関数の合成波形）' },
    subject: { type: 'STRING', description: '数学I・A または 数学II・B・C' },
    field: { type: 'STRING', description: '単元名' },
    total_points: { type: 'INTEGER', description: '配点合計（通常20点〜25点）' },
    context_text: { type: 'STRING', description: '大問全体の前提条件・リード文（数式は$ $で囲む）' },
    sections: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          section_id: { type: 'STRING', description: '(1), (2), (3) など' },
          section_title: { type: 'STRING', description: '小問の小見出し（例: 固定区間での最大・最小）' },
          section_text: { type: 'STRING', description: '小問の問題文・誘導文。空欄マークは [ア], [イウ] などの形式で明記' },
          choices_groups: {
            type: 'ARRAY',
            description: '解答群がある場合のみ定義。なければ空配列',
            items: {
              type: 'OBJECT',
              properties: {
                target_marks: { type: 'STRING', description: '対応するマーク記号（例: カ）' },
                options: { type: 'ARRAY', items: { type: 'STRING' } }
              },
              required: ['target_marks', 'options']
            }
          },
          marks: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                id: { type: 'STRING', description: 'マーク記号（例: ア, イ, ウエ, カ）' },
                label: { type: 'STRING', description: '表示ラベル' },
                type: { type: 'STRING', enum: ['numeric', 'choice'] },
                answer: { type: 'STRING', description: '正解の値（例: 3, -2, 0）' },
                points: { type: 'INTEGER', description: '配点（例: 2〜4点）' }
              },
              required: ['id', 'type', 'answer', 'points']
            }
          },
          explanation: { type: 'STRING', description: 'この小問のステップ別詳細解説（改行\\nを含む）' }
        },
        required: ['section_id', 'section_text', 'marks', 'explanation']
      }
    },
    overall_review: { type: 'STRING', description: 'この大問のポイント・思考の要点' }
  },
  required: ['title', 'subject', 'field', 'context_text', 'sections']
};

const prompt = `あなたは日本の大学入学共通テスト数学（数I・A、数II・B・C）の作問責任者です。
生徒が集中特訓できるように、本番の共通テスト大問【厳密に1題（6〜8マーク（小問2〜3ステップ））】を作成してください。

【出題設定】
・対象科目: 数学I・A
・単元・テーマ: 2次関数の最大・最小とグラフの考察
・難易度: 共通テスト標準
・重点要望: 過去問に準拠した段階的な誘導思考問題

【⚠️ 最重要：共通テスト大問の作問ルール】
1. 誘導の論理構造（過去問の再現）：
   - 小問 (1): 基本公式・定理の確認や、具体的な数値による計算で取っ掛かりを与える（マーク [ア], [イ] など）。
   - 小問 (2): (1)の結果を活用し、文字定数や新たな発想・設定へ展開する応用計算（マーク [ウ], [エオ] など）。
   - 小問 (3): グラフの概形、領域、極値、命題の正誤などを考察させる発展的問い。必要に応じて解答群（⓪〜⑤などから選択）を配置。
2. 数式（LaTeX）とマーク枠の厳格な記法【絶対厳守】：
   - 数式は必ず $ ... $ で囲み、日本語の説明（「のとき」「において」「となる」「より」など）や箇条書きの記号（・）を決して $ ... $ の中に含めないこと。
   - 場合分けや箇条書きを書くときは、必ず行ごとに $...$ を独立して完結させること（例: 「・$a < 0$ のとき、$M(a) = -a^2 + [キ]a$」）。
   - 分数や根号の空欄マークも、$a = \\frac{[シ]}{[ス]}$ や $a = [セ] + \\sqrt{[ソ]}$ のように必ず数式全体を $...$ で正しく囲むこと。
   - 問題文中の空欄マーク記号は必ず [ア], [イ], [ウエ], [オ], [カ] などのように大括弧で囲み、各マークの id は問題文中の記号（"ア", "イ", "ウエ"など）と1対1で完全一致させること。
3. 数値整合性の絶対厳守：
   - AIの計算ミスは厳禁。(1)で求めた値が(2)(3)で矛盾なく綺麗に成立するよう、確実に整合性を保つこと。
4. 解答群（choices_groups）のルール：
   - 選択式のマーク（グラフ概形、不等号、選択肢など）には、choices_groups に選択肢一覧（"⓪ ...", "① ..."）を含め、マークの type を "choice" にすること。正解 answer は選択肢の番号（"0", "1" など）にすること。
   - 通常の数字マークは type を "numeric" にし、answer は "3", "-2", "15" などの半角文字列にすること。
5. 解説（explanation）の充実：
   - 各小問の解説には、公式・着眼点・式変形のステップを \\n で改行を挟んで丁寧に記述すること。

指定されたJSONオブジェクトのみを返してください。`;

async function run() {
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=' + key;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      systemInstruction: { parts: [{ text: 'あなたは優秀な大学入試共通テスト数学の作問責任者です。指定されたJSONオブジェクトのみを返してください。' }] },
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: KYOTSU_SPRINT_SCHEMA,
        temperature: 0.3
      }
    })
  });
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  console.log('OUTPUT:', JSON.stringify(data, null, 2));
}
run();
