# Flora リビルド計画（2026-11）

> 既存アプリを段階的に置き換える、Web一本化の新アプリ計画。
> 旧版は参照用に残し、新版を並行構築してから切り替える。

---

## 0. 決定事項サマリー

| 項目 | 決定 |
|---|---|
| 利用者 | 自分だけ |
| アプリ名 | **Flora** を継続 |
| 進め方 | 段階的リプレイス（同一リポジトリに併設） |
| 端末 | Web中心。モバイル専用版（`m/`）は作らない |
| UI | 完全に新しい、ミニマル学習ツール |
| ナビ | 今日 / 問題 / 演習 / ノート / 設定 |
| 授業の置き場所 | **問題タブ内**（誤答ノート / 授業） |
| 技術 | React + TypeScript + Vite + Tailwind（おまかせ） |
| 配信 | Cloudflare Pages + Functions |
| データ | ローカル主（IndexedDB）＋ Firebase 自動バックアップ |
| ログイン | **Google任意ログイン**（バックアップ時のみ） |
| AIキー | 管理者キーのみ（サーバー側で秘匿） |
| 画像 | **端末のみ保存＋ZIP Export**（クラウド対象外） |
| 新規/移行 | 学習履歴は新規。**誤答データだけ**旧版から取り込む |
| 削除 | 参考書 / 過去問 / 年表クイズ / `m/` 配下 |
| MVP | 今日＋問題登録＋AI解説＋簡易SRS復習 |
| テーマ | ライト＋ダーク |

### 作らないもの

- モバイル専用ページ（`m/`）
- 参考書モード（`refbook.html`）
- 過去問演習（`past-exam.html`）
- 年表クイズ（`timeline.html` のクイズ機能）
- 複数ユーザー向けの課金・権限管理
- ゲーミフィケーション（XP・バッジ・ランキング）

---

## 1. コンセプト

> **「今日、間違えた1問を登録して、AIの解説を読んで、復習を終える」**
> それを毎日迷わず回せるアプリ。

現行版は機能が多く、1画面に情報が集中しすぎている。
新版は「今日やること」を常に1つに絞り、学習の1周（登録 → 理解 → 復習）を最短にする。

### 設計原則

1. **1画面1目的** — 画面ごとに主役の操作を1つだけ置く
2. **3タップ以内** — 主要操作（復習開始・問題登録・解説を読む）は3タップ以内
3. **今日が常に見える** — アプリを開いた瞬間に「次にやること」が分かる
4. **保存は即時、同期は裏で** — 通信を待たせない
5. **AIは待たせない** — ストリーミング、下書き、キャッシュ、失敗時の再試行
6. **壊れても戻れる** — ローカル保存、エクスポート、旧版参照

---

## 2. スコープ

### 残す機能（内部は刷新）

| 機能 | 新版での扱い |
|---|---|
| 誤答ダッシュボード | 「今日」画面として再設計 |
| 問題登録・AI解説 | 「問題」の中核。写真＋テキスト、解説、チャット |
| 授業モード | Phase 4 で刷新。問題タブ内の「授業」として統合 |
| 計算スプリント | 「演習」内の1モード |
| デイリー演習 | 「演習」内の1モード |
| カスタム演習 | 「演習」内の1モード |
| 暗記・Insights | 「ノート」として再設計 |
| AI設定 | 「設定」内。キー管理は不要、モデルと接続確認のみ |

### 削除する機能

- 参考書モード
- 過去問演習
- 年表クイズ
- PC/モバイルの二重管理
- 旧来の巨大な1ファイル構成

### 統合の考え方

- 過去問 → カスタム演習の「出題元」オプションとして将来必要なら復活
- 参考書 → 問題登録の「出題元」フィールドとして最小限だけ吸収
- 年表 → 授業モードの補助資料として必要なら後日

---

## 3. 情報設計（IA）

### ナビゲーション

```
[今日]  [問題]  [演習]  [ノート]  [設定]
```

- デスクトップ: 左サイドバー（幅 220px）
- モバイル: 下部タブバー（5項目）
- 画面遷移はすべて同一シェル内。ページ全体の再読み込みをしない

### 画面一覧

#### 今日
- 今日の復習枚数（最優先CTA「復習を始める」）
- 直近の誤答3件
- クイック追加（写真 / テキスト）
- 今週の学習サマリー（最小限）
- 続きから（前回の授業・演習があれば）

#### 問題
- タブ: `誤答ノート` / `授業`
- 一覧: 検索、教科フィルタ、並び替え、仮想スクロール
- 問題詳細:
  - 問題文・画像
  - AI解説（セクション表示、数式、図）
  - AIチャット
  - 定石・罠・暗記事項
  - 復習履歴
  - 編集・削除
- 新規登録:
  - 写真（複数枚）またはテキスト
  - 教科・単元
  - AI解析 → プレビュー → 保存
  - 解析中も画面を閉じない／下書き保存

#### 演習
- 復習（簡易SRS）
- デイリー
- 計算スプリント
- カスタム演習
- セッション画面:
  - 1問ずつ、集中できるレイアウト
  - 回答 → 正誤 → 解説 → 次へ
  - 進捗バー、中断保存、再開

#### ノート
- 気づき（Insight）
- 暗記カード（SRS）
- AI質問ログ
- 問題へのリンク

#### 設定
- アカウント／同期状態
- AI: 接続テスト、機能別モデル、思考レベル、使用量
- 表示: テーマ、文字サイズ、数式表示
- データ: エクスポート、インポート、旧データ取り込み
- 旧版へのリンク
- アプリ情報

---

## 4. 主要UXフロー

### A. 問題を登録して解説を読む

1. 「今日」または「問題」から `＋ 登録`
2. 写真を撮る／選ぶ、またはテキスト入力
3. 教科を選ぶ（AIが自動判定、あとから修正可）
4. `解析する`
5. AIが問題文・模範解答・定石・罠を抽出（ストリーミング表示）
6. プレビューを確認して `保存`
7. 問題詳細へ。解説を読む／チャットで質問
8. `復習に追加`（自動でSRSに登録）

**目標**: テキスト登録は30秒以内、写真登録は60秒以内に解説まで到達。

### B. 今日の復習

1. アプリを開く
2. 「今日の復習 12問」→ `始める`
3. 1問ずつ回答
4. 正誤に応じて次回間隔を更新
5. 完了画面 → 今日の学習を終える

**目標**: 復習開始まで1タップ。1セッションは5〜15分。

### C. 授業（Phase 4）

1. 問題タブ → 授業 → `新しい授業`
2. 単元名または写真からプラン作成
3. 講義・類題・暗記事項を順に進む
4. 終了時に気づきをノートへ

---

## 5. デザインシステム

### 方向性

- ミニマル、静か、余白を活かす
- 学習内容が主役。装飾は最小限
- 影より境界線。色数は絞る
- 数式・日本語が読みやすいこと最優先

### トークン

```ts
// 色（ライト）
bg:        #FAFAF9  // 温かいオフホワイト
surface:   #FFFFFF
ink:       #18181B
muted:     #71717A
border:    #E4E4E7
accent:    #047857  // 深いエメラルド
accentSoft:#ECFDF5
danger:    #DC2626
warning:   #D97706

// 色（ダーク）
bg:        #0C0C0D
surface:   #161618
ink:       #F4F4F5
muted:     #A1A1AA
border:    #27272A
accent:    #34D399
```

- フォント: `Inter` + `Noto Sans JP`。見出しは字間を少し詰める
- 数値: `tabular-nums`
- 角丸: カード12px、ボタン10px、入力10px
- 影: ほとんど使わない。モーダルのみ
- アニメーション: 150〜200ms、`prefers-reduced-motion` 対応
- アイコン: Lucide

### コンポーネント

`Button` / `IconButton` / `Card` / `Dialog` / `Sheet` / `Tabs` / `Input` / `Textarea` / `Select` / `Toast` / `Progress` / `Skeleton` / `EmptyState` / `Markdown` / `Math` / `ImageUploader` / `SubjectPicker` / `ReviewCard`

すべて shadcn/ui（Radix）をベースに、見た目は独自トークンで上書きする。

### アクセシビリティ

- キーボード操作・フォーカスリング
- コントラスト比 4.5:1 以上
- 画像には alt
- モーダルはフォーカストラップ
- 文字サイズ変更に対応

---

## 6. 技術構成

### フロントエンド

```
next/                       # 新アプリ（同一リポジトリ内）
├─ src/
│  ├─ app/                   # ルーティング、シェル
│  │  ├─ today/
│  │  ├─ problems/
│  │  ├─ practice/
│  │  ├─ notes/
│  │  └─ settings/
│  ├─ features/              # 機能単位のUI・hooks
│  │  ├─ today/
│  │  ├─ problem/
│  │  ├─ review/
│  │  ├─ lesson/
│  │  ├─ insights/
│  │  └─ settings/
│  ├─ core/
│  │  ├─ ui/                 # デザインシステム
│  │  ├─ layout/             # シェル、ナビ
│  │  ├─ lib/                # 汎用ユーティリティ
│  │  └─ config/
│  ├─ data/
│  │  ├─ db.ts               # Dexie スキーマ
│  │  ├─ repositories/       # 読み書きの入口
│  │  ├─ sync/               # Firebase 同期
│  │  └─ migrations/         # 旧データ取り込み
│  ├─ ai/
│  │  ├─ client.ts           # Functions 呼び出し
│  │  ├─ prompts/            # 機能別プロンプト
│  │  └─ schemas/            # Structured Outputs
│  └─ main.tsx
├─ functions/                # Cloudflare Functions
│  └─ api/ai.ts
├─ public/
├─ tests/
└─ package.json
```

- React 19 + TypeScript（strict）
- Vite 7
- Tailwind CSS v4
- React Router v7
- Zustand（UI状態）
- TanStack Query（サーバー状態）
- Dexie（IndexedDB）
- React Hook Form + Zod
- react-markdown + remark-math + KaTeX
- TanStack Virtual（一覧）
- vite-plugin-pwa
- Vitest + Playwright
- ESLint + Prettier

### 配信

- Cloudflare Pages（`next/` をビルド）
- Cloudflare Functions（AIプロキシ）
- カスタムドメイン or `next.` サブドメインで先行公開
- 旧版は現行URLに残す
- 完成後にルートを新版へ切り替え、旧版は `/legacy` または旧ブランチで保管

> 注: 同一オリジンの `/next` 配下で動かすより、`next.` サブドメインの方がViteのbase設定・PWA・Service Workerの競合を避けられる。CSS/JSのパス問題も起きにくい。

### 環境変数（Cloudflare）

```
GEMINI_API_KEY=...        # サーバー側のみ
ALLOWED_ORIGINS=https://next.example.com,https://example.com
```

クライアントにはキーを一切渡さない。

---

## 7. データ設計

### IndexedDB（Dexie）

```ts
// 主要テーブル
problems:      id, subject, updatedAt, nextReviewAt, deletedAt
problemImages: id, problemId, blob, width, height, createdAt
reviews:       id, problemId, reviewedAt
reviewLogs:    id, problemId, result, mode, durationMs, reviewedAt
insights:      id, problemId, updatedAt, deletedAt
cards:         id, problemId, nextReviewAt, updatedAt, deletedAt
lessons:       id, updatedAt, deletedAt        // Phase 4
settings:      key
syncQueue:     id, entity, entityId, op, createdAt
meta:          key, value
```

### 型（抜粋）

```ts
type UUID = string;
type ISODate = string;

interface Problem {
  id: UUID;
  legacyId?: string;
  title: string;              // 問題本文
  shortTitle: string;
  subject: string;
  unit: string;
  answer: string;
  trap?: string;
  strategy?: string;
  mnemonic?: string;
  source: "manual" | "photo" | "lesson";
  sourceLessonId?: UUID;
  imageIds: UUID[];
  tags: string[];
  errorCount: number;
  lastReviewedAt?: ISODate;
  nextReviewAt?: ISODate;
  srs: SrsState;
  createdAt: ISODate;
  updatedAt: ISODate;
  deletedAt?: ISODate;
}

interface SrsState {
  state: "new" | "learning" | "review" | "relearning";
  intervalDays: number;
  ease: number;       // 2.3〜2.8
  streak: number;
  lapses: number;
}

interface ReviewLog {
  id: UUID;
  problemId: UUID;
  result: "correct" | "wrong" | "skip";
  mode: "review" | "daily" | "calculation" | "custom";
  durationMs: number;
  reviewedAt: ISODate;
}
```

### 簡易SRS

- 初回: `new`
- 正解: 1日 → 3日 → 7日 → 14日 → 30日（streakに応じて）
- 不正解: `relearning` に戻し、翌日再出題。easeを少し下げる
- 「もう一度」「難しい」「普通」「簡単」の4段階は Phase 3 以降
- MVPは「正解 / 不正解」の2段階で十分

### 画像

- MVP: IndexedDB に Blob 保存。クライアント側で最大1600px・JPEG/WebP 0.8に圧縮
- クラウドバックアップ対象外（構造化データのみ）
- 設定から「画像を含む全データをZIPエクスポート」可能にする
- Phase 3 以降で Firebase Storage / R2 への画像同期を検討

---

## 8. AI設計

### 構成

```
Client → POST /api/ai → Cloudflare Function → Gemini API
```

- キーは Functions のシークレットのみ
- モデルの許可リストをサーバー側で検証
- 機能IDごとにプロンプトとスキーマを固定
- ストリーミング（SSE）対応
- レート制限・リトライ・タイムアウト
- `usageMetadata` をクライアントへ返し、使用量を記録

### 機能別モデル（初期値）

| 機能 | モデル | 思考 |
|---|---|---|
| 問題解析（写真） | `gemini-4-hydrogen` | high |
| 問題解析（テキスト） | `gemini-4-hydrogen` | medium |
| 解説生成 | `gemini-4-hydrogen` | high |
| チャット | `gemini-4-hydrogen` | medium |
| 類題生成 | `gemini-4-hydrogen` | high |
| 軽量抽出・分類 | `gemini-3.5-flash-lite` | low |
| 失敗時フォールバック | `gemini-3.8-flash` → `gemini-3.6-flash` |

設定画面で変更可能。ただしサーバーの許可リスト内に限る。

### コスト対策

- 同じ画像・同じ問題文の解析結果をキャッシュ（ハッシュ + 教科）
- 写真は解析前に縮小
- 解説はセクション単位で保存し、再生成は明示操作のみ
- 月間トークン・概算コストを設定画面に表示
- 長いチャット履歴は直近N件に制限

### プロンプト管理

- `ai/prompts/{feature}.ts` に集約
- バージョン番号を持ち、解析結果に `promptVersion` を保存
- 変更時はA/Bではなく、問題詳細から再生成できるようにする

---

## 9. 同期・バックアップ

### 方針

- **ローカルが正**。UIは常にIndexedDBを読む
- クラウドはバックアップと端末間同期
- オフラインでも全機能が動く（AIを除く）

### 同期の仕組み

1. 書き込み時に `updatedAt` と `rev` を更新し、`syncQueue` に積む
2. オンライン時にキューを順に Firebase RTDB へ push
3. 起動時・復帰時に差分を pull
4. 競合は `updatedAt` の新しい方（last-write-wins）。削除は `deletedAt` の tombstone
5. 失敗時は指数バックオフ。UIには「未同期N件」を表示

### 認証

- 通常利用はログイン不要（ローカルのみ）
- クラウドバックアップを有効にした時だけ Google ログイン
- 新端末では同じGoogleアカウントでログイン → 復元
- Firebase Security Rules は `users/{uid}` 配下のみ許可

### バックアップ

- 自動: RTDBへ構造化データ
- 手動: 全データJSON / 画像込みZIP
- 復元: JSONインポート、旧データ取り込み
- インポート前に自動スナップショットを作成（取り消し可能）

### 実装メモ（next）

- 保存先は `users/{uid}/floraNext`。旧アプリの `users/{uid}/problems` とは分離する
- 同期するのは problems / reviewLogs / lessons / drills / sprints。画像は端末ローカルのみ
- `updatedAt`（演習は `completedAt` / `createdAt` もフォールバック）によるレコード単位の last-write-wins
- RTDB の transaction 内でローカルとリモートをマージするため、同時更新でもスナップショット全体を上書きしない
- 削除は `deletedAt` の tombstone を同期する
- 「すべて削除」「バックアップから復元」は、ログイン中ならクラウド側も削除してから置き換える

---

## 10. 旧データ移行

### 対象

**誤答データのみ**。

- `users/{uid}/problems`
- `users/{uid}/problemImages`（画像）

移行しないもの:

- `lessons`
- `qna_logs`
- `bible` / 暗記カード
- `daily_sprint`
- `refBook*`
- `past_exams`
- `timeline*`
- `bunkeiMath*`

### 手順

1. 設定 → データ → `旧版から誤答を取り込む`
2. Googleでログイン（旧データの読み取りのみ）
3. 件数をプレビュー
4. 取り込み実行
5. 結果レポート（成功 / スキップ / エラー）

### マッピング

| 旧 | 新 |
|---|---|
| `title` | `title` |
| `short_title` | `shortTitle` |
| `subject` | `subject` |
| `field` | `unit` |
| `answerFormula` | `answer` |
| `trap_description` | `trap` |
| `strategyPattern` | `strategy` |
| `mnemonic` | `mnemonic` |
| `errorCount` | `errorCount` |
| `createdAt` | `createdAt` |
| `lastAttemptAt` | `lastReviewedAt` |
| `problemImages[id].images` | `problemImages`（DataURL → Blob） |
| `id` | `legacyId`（新IDはUUID） |

- 取り込み後、`nextReviewAt` は「今日」に設定（復習キューに入れる）
- 画像は圧縮して保存
- 失敗した問題はスキップし、レポートに残す

---

## 11. 旧版の扱い

- 既存ファイルは削除しない（参照用）
- 新版は `next/` に構築
- Cloudflare Pages のプレビューURLで先行公開
- 旧版は現行URLでそのまま動作
- 新版が安定したらルートを切り替え
- 切り替え後も1ヶ月は旧版にアクセス可能にする
- `m/` は新版では使わない。旧版の一部としてのみ残す

---

## 12. フェーズ計画

### Phase 0: 土台とデザイン（2〜3日）

- `next/`  scaffold
- Tailwindトークン、テーマ、基本コンポーネント
- ルーティング、アプリシェル、5タブ
- Cloudflare Pages プレビュー疎通
- Firebase / AI Functions の疎通確認
- 1画面だけ静的モック（今日）

**完了条件**: `next.` URLで今日画面が見られる。

### Phase 1: 基盤（1週間）

- Dexieスキーマ、リポジトリ層
- 設定、テーマ、トースト、エラー境界
- AIクライアント、ストリーミング、使用量ログ
- 画像圧縮、アップローダー
- 同期キュー、Firebase接続（任意ログイン）
- CI（型チェック、Lint、テスト）

**完了条件**: ローカルに問題を1件保存・再起動後も残る。

### Phase 2: MVP中核（1.5〜2週間）

- 今日画面
- 問題一覧・検索・詳細
- 問題登録（写真＋テキスト）
- AI解析・解説生成・チャット
- 簡易SRS復習
- 設定（AI接続、テーマ、エクスポート）
- 旧誤答データ取り込み
- E2Eテスト（登録→解説→復習）

**完了条件**: 毎日の学習ループを新版だけで完結できる。

### Phase 3: 演習（1〜1.5週間）

- デイリー演習
- 計算スプリント
- カスタム演習（簡易版）
- セッション中断・再開
- 復習統計

**完了条件**: 演習3種が新UIで動作する。

### Phase 4: 授業・ノート（2〜3週間）

- 授業プラン、講義、類題、暗記事項
- ノート（気づき、暗記カード、AI質問ログ）
- 問題との相互リンク

**完了条件**: 旧版の主要学習機能が新版に揃う。

### Phase 5: 仕上げと切替（1週間）

- パフォーマンス改善（初期表示、コード分割）
- PWA、オフライン
- アクセシビリティ
- データ移行リハーサル
- 旧版からの切替
- ドキュメント整備

**合計**: 6〜8週間（個人開発・並行利用前提）

---

## 13. 品質基準

### パフォーマンス

- 初期表示: 4Gで1.5秒以内
- 初回JS: 250KB gzip以下
- 画面遷移: 200ms以内
- 一覧1000件でもスクロールが滑らか（仮想化）

### 品質

- TypeScript strict、`any` 原則禁止
- 主要ロジック（SRS、同期、移行）はユニットテスト
- 中核フローはPlaywrightでE2E
- エラーはユーザーに日本語で説明し、再試行導線を出す
- データ破損を防ぐため、書き込みはリポジトリ層に集約

### 運用

- CloudflareのログでAIエラーを確認
- 月1回、エクスポートからの復元テスト
- 依存関係の更新は月1回

---

## 14. リスクと対策

| リスク | 対策 |
|---|---|
| 機能欲張りで完成しない | MVPを固定。Phase 2完了まで他機能を追加しない |
| AIが遅い・高い | ストリーミング、画像縮小、キャッシュ、軽量モデル |
| 画像でストレージが膨らむ | 圧縮、ローカル保存、クラウド対象外 |
| 同期でデータが壊れる | ローカル正、tombstone、last-write-wins、自動スナップショット |
| 旧データ移行の失敗 | プレビュー、ドライラン、スキップレポート、取り消し |
| Cloudflare Workers の制約 | Phase 0 でストリーミングと画像サイズを検証 |
| デザインに時間をかけすぎる | トークンと基本コンポーネントを先に固定 |
| 旧版との二重保守 | 新機能は新版のみ。旧版はバグ修正だけ |

---

## 15. 未決事項

1. **アプリ名**: `Flora` を継続するか、新名称にするか
2. **授業の置き場所**: 問題タブ内 / 演習タブ内 / 独立タブ
3. **クラウド同期のログイン**: Google任意ログイン / 匿名認証 / なし
4. **画像のバックアップ**: 端末のみ / Firebase Storage / R2
5. **AI解説の保存**: 生成結果を保存するか、毎回生成するか
6. **カスタム演習の範囲**: 旧版のどこまで残すか
7. **最初に作るプロトタイプ**: 今日画面か、問題登録か

---

## 16. 直近のNext Action

1. 未決事項1〜4を決める
2. `next/` の scaffold を作る
3. デザイントークンと今日画面のモックを実装
4. Cloudflare Pages + Functions の疎通を確認
5. 問題1件を保存→解説→復習する縦切りプロトタイプを作る
6. 触って違和感を洗い出す

---

## 付録: 旧版の主要ファイルと新版での扱い

| 旧ファイル | 行数目安 | 新版 |
|---|---:|---|
| `lesson.html` | 30,300 | `features/lesson` に分割 |
| `insights.html` | 15,900 | `features/notes` に分割 |
| `custom-sprint.html` | 6,400 | `features/practice/custom` |
| `problem.html` | 5,200 | `features/problem` |
| `index.html` | 3,400 | `features/today` + `problem` |
| `timeline.html` | 3,300 | 削除（授業の補助が必要なら後日） |
| `past-exam.html` | 3,200 | 削除 |
| `api-key-manager.js` | 2,600 | `ai/client.ts` + `settings` |
| `refbook.html` | 1,400 | 削除 |
| `m/*` | - | 削除 |
