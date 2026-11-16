# Flora (next)

Flora のリビルド版・縦切りプロトタイプ。今日の復習 → 問題登録 → AI解析・解説 → 簡易SRS → 授業・演習 → クラウド同期までを実装しています。

## 開発

```powershell
cd next
npm install
npm run dev
```

`http://localhost:5174` で開きます。

AIプロキシは Vite の開発サーバーが `/api/ai` に生やします。ルートの `.env` にある `GEMINI_API_KEY` を読みます。未設定の場合はデモデータで動作します。

## ビルド

```powershell
npm run typecheck
npm run build
```

## Cloudflare Pages

- ビルドコマンド: `npm run build`
- 出力ディレクトリ: `dist`
- Functions: `functions/` が自動で検出されます
- 環境変数: `GEMINI_API_KEY`（シークレット）
- クラウド同期を使う場合: `VITE_FIREBASE_API_KEY`、`VITE_FIREBASE_AUTH_DOMAIN`、`VITE_FIREBASE_DATABASE_URL`、`VITE_FIREBASE_PROJECT_ID`、`VITE_FIREBASE_STORAGE_BUCKET`、`VITE_FIREBASE_MESSAGING_SENDER_ID`、`VITE_FIREBASE_APP_ID`

`public/_redirects` で SPA フォールバック、`public/_headers` で Firebase のポップアップ用 COOP ヘッダーを設定しています。

## 構成

```
src/
├─ app/          画面（today / problems / practice / notes / settings）
├─ core/         シェル、テーマ、デザインシステム
├─ data/         Dexie (IndexedDB)、SRS、リポジトリ
├─ features/     機能単位の部品
├─ sync/         Firebase Auth / Realtime Database 同期
├─ ai/           AIプロキシのクライアント
└─ lib/          画像圧縮などのユーティリティ
shared/ai-core.ts   ローカルとCloudflareで共通のAIコア
functions/api/ai.ts Cloudflare Pages Function
```

## 現時点のスコープ

- 今日 / 問題 / 演習 / ノート / 設定 の5タブ
- 問題登録（テキスト＋写真、最大6枚）
- AI解析（gemini-4-hydrogen）と解説生成
- 簡易SRS（1 / 3 / 7 / 14 / 30 / 60日）
- 授業モード（単元からAIが3〜4パートの講義＋4択チェックを作成、進捗保存）
- デイリー演習（弱点単元からAIが出題、自己採点、結果保存）
- 計算スプリント（四則・正負・分数・平方根・因数分解を時間内に反復、自己ベストと履歴を保存）
- カスタム演習（教科・単元・難易度・問題数を指定してAIが出題、履歴から再開）
- 『文系の数学』重要事項 完全習得編 改訂版（例題158題＋演習115題＋SVG図版、例題⇄演習リンク、誤答ノート・気づきメモ連携）
- 気づき一覧・暗記カード（問題・授業・『文系の数学』の気づきメモ管理、★ピン留め、ワンタップでカード化、SRSによる反復復習）
- ローカル保存（IndexedDB）とJSONバックアップ
- Firebase同期（Google任意ログイン、構造化データのみ）
- 旧データ取り込み（旧Floraの `problems`・`problemImages`・`mistakes`・`lessons`内の授業気づきメモ・`bunkeiMathProgress`・`bunkeiMathExProgress`・`bunkeiMathInsights` を一括取り込み）
- ライト / ダークテーマ

## クラウド同期

### 方針

- **ローカルが正**。画面は常に IndexedDB を読み、同期は裏で動く
- Google ログインは任意。ログインした端末だけが同期する
- 同期対象: 問題、復習履歴、授業、デイリー/カスタム演習、計算スプリント
- 同期しないもの: 画像（端末ローカルのみ）、テーマなどの端末設定
- 保存先: Firebase Realtime Database の `users/{uid}/floraNext`
- 競合解決: レコード単位の last-write-wins（問題・授業は `updatedAt`、演習は `updatedAt` / `completedAt` / `createdAt`、復習履歴とスプリントは作成時刻）
- 削除は `deletedAt` の tombstone を同期する
- 同期中に別端末が更新してもよいよう、RTDB の transaction 内でマージする

### 初回設定

既存の `buturi2` プロジェクトを既定値として使います。別プロジェクトにする場合は、リポジトリ直下の `.env.local` に `VITE_FIREBASE_*` を設定してください（`VITE_` 接頭辞の変数だけがクライアントに公開されます）。

1. Firebase Console → Authentication → Sign-in method で **Google** を有効にする
2. Authentication → Settings → 承認済みドメインに `localhost` と本番ドメインを追加する
3. Realtime Database の Rules で、自分の `users/{uid}` 配下だけを許可する

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid == $uid",
        ".write": "auth != null && auth.uid == $uid"
      }
    }
  }
}
```

既存の旧アプリが `users/{uid}/problems` などを使っている場合も、このルールなら `users/{uid}/floraNext` は別領域として共存します。

### 使い方

1. 設定 → クラウド同期 → 「Google でログイン」
2. ログイン直後にローカルとクラウドがマージされ、以後は変更から約2.5秒後に自動同期
3. 別端末でも同じ Google アカウントでログインすると、同じデータがマージされる
4. 「今すぐ同期」で手動同期、「ログアウト」でこの端末の同期を停止（ローカルデータは残る）

ログイン中に「すべて削除」またはバックアップからの復元を行うと、クラウド上の `floraNext` も削除してから置き換えます。同期していない状態で削除した場合、クラウド側のバックアップは残ります。

### 動作確認の目安

- 2つのブラウザプロファイル（または通常ウィンドウとシークレットウィンドウ）で同じ Google アカウントにログイン
- 片方で問題を登録 → もう片方で「今すぐ同期」→ 問題が現れる
- 両方で同じ問題を編集 → 新しい `updatedAt` の変更が残る
- 片方で問題を削除 → 同期後、もう片方でも一覧から消える
- 画像は同期されないため、別端末では写真だけ表示されない

### Emulator での確認（開発用）

Google アカウントなしで push / pull / 競合解決を確認できます。

```powershell
# ターミナル1
npm run emulators

# ターミナル2（リポジトリ直下の .env.local を作る）
"VITE_FIREBASE_USE_EMULATOR=1" | Set-Content ..\.env.local
npm run dev
```

`firebase.json` と `database.rules.json` はローカル確認用です。エミュレータ起動中はブラウザのコンソールから次を実行すると、テスト用アカウントでログインできます。

```js
await window.__floraDevSignIn('test@flora.local', 'flora-test');
```

確認が終わったら `.env.local` を削除してください。残したままにすると、開発サーバーが起動中のエミュレータへ接続しようとします。
