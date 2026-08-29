/**
 * Flora デバッグ環境セットアップ & 全画面検証スイート
 * 
 * テスターアカウントのFirebase Realtime Databaseにモック問題（5件）とモック授業（2件）を
 * 実際に保存し、全画面（ダッシュボード・問題演習・授業モード）の連携を完全検証します。
 */

import { chromium } from 'playwright';
import path from 'path';

const GEMINI_API_KEY = "AIzaSyAQ.Ab8RN6K6YOIylSci9RtSJogqe2o3PgyLMWF67sXD67jyoIldtQ";

// ============================================================
// 🧪 テストデータ定義
// ============================================================
const NOW = new Date().toISOString();

const MOCK_PROBLEMS = {
    "CUSTOM_001": {
        id: "CUSTOM_001",
        title: "公開鍵暗号方式において、AさんがBさんに暗号文を送るとき、暗号化に使う鍵は何か？",
        short_title: "公開鍵暗号方式",
        subject: "情報",
        field: "セキュリティ・暗号化",
        trap_description: "「公開」という言葉から送信者側（Aさん）の公開鍵を使うと勘違いしやすい。受信者（Bさん）の公開鍵で暗号化し、Bさんの秘密鍵で復号するのが正しい流れ。",
        strategyPattern: "受取人（受信者）の公開鍵で暗号化 → 受取人の秘密鍵で復号。送信者は関係ない。",
        errorCount: 3,
        lastAttemptAt: new Date(Date.now() - 3600000).toISOString(),
        lastResult: false,
        thumb: null,
        imageCount: 0,
        answerFormula: "Bさんの公開鍵",
        mnemonic: "ポストのイメージ：公開ポスト（Bの公開鍵）に入れたら、Bだけが鍵（秘密鍵）で開けられる",
        events: [],
        createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    "CUSTOM_002": {
        id: "CUSTOM_002",
        title: "次の関数 $f(x) = x^3 - 3x^2 + 2$ の極値を求めよ。",
        short_title: "3次関数の極値",
        subject: "数学",
        field: "微分・積分",
        trap_description: "f'(x) = 0 の解が必ずしも極値とは限らない。増減表で符号変化を確認することが必須。",
        strategyPattern: "① f'(x) を計算 ② f'(x) = 0 の解を求める ③ 増減表で符号変化を確認 ④ 極大・極小を判定",
        errorCount: 2,
        lastAttemptAt: new Date(Date.now() - 7200000).toISOString(),
        lastResult: false,
        thumb: null,
        imageCount: 0,
        answerFormula: "x=0 で極大値 2、x=2 で極小値 -2",
        mnemonic: "f'(x) = 3x²-6x = 3x(x-2) → x=0, x=2 が候補",
        events: [],
        createdAt: new Date(Date.now() - 172800000).toISOString()
    },
    "CUSTOM_003": {
        id: "CUSTOM_003",
        title: "酸化還元反応において、電子を失う変化を何というか。また、その物質は酸化剤・還元剤のどちらか。",
        short_title: "酸化還元：電子を失う",
        subject: "化学",
        field: "酸化還元反応",
        trap_description: "「酸化」と「酸化剤」を混同しやすい。酸化（電子を失う）された物質自身は還元剤として働く。",
        strategyPattern: "酸化＝電子を失う＝酸化数が増加。酸化された物質 → 還元剤。",
        errorCount: 1,
        lastAttemptAt: new Date(Date.now() - 10800000).toISOString(),
        lastResult: true,
        thumb: null,
        imageCount: 0,
        answerFormula: "酸化（電子を失う変化）・還元剤",
        mnemonic: "俺（還元剤）が電子を渡して酸化、相手（酸化剤）が電子をもらって還元",
        events: [],
        createdAt: new Date(Date.now() - 259200000).toISOString()
    },
    "CUSTOM_004": {
        id: "CUSTOM_004",
        title: "世界史：ウィーン会議（1814-1815年）の基本原則「正統主義」を唱えたのは誰か。",
        short_title: "ウィーン会議・正統主義",
        subject: "世界史",
        field: "近代ヨーロッパ史",
        trap_description: "「正統主義」はメッテルニヒが唱えたと誤解されがち。実際はフランス代表タレーランが提唱し、メッテルニヒは会議全体を主導した議長役。",
        strategyPattern: "タレーラン＝正統主義を提唱（フランスの革命前の王朝を守るため）。メッテルニヒ＝会議の議長・オーストリア代表。",
        errorCount: 4,
        lastAttemptAt: new Date(Date.now() - 1800000).toISOString(),
        lastResult: false,
        thumb: null,
        imageCount: 0,
        answerFormula: "タレーラン（フランス代表）",
        mnemonic: "「正統」のタレーラン。メテ（メッテルニヒ）は「議長」。",
        events: [{ year: 1814, region: "ヨーロッパ", event: "ウィーン会議開始" }],
        createdAt: new Date(Date.now() - 432000000).toISOString()
    },
    "CUSTOM_005": {
        id: "CUSTOM_005",
        title: "力学的エネルギー保存の法則が成り立つのはどのような条件か。",
        short_title: "力学的エネルギー保存則",
        subject: "物理",
        field: "力学",
        trap_description: "「保存力のみが仕事をする」という条件を曖昧に覚えていると、摩擦力があっても成立すると勘違いする。非保存力（摩擦・空気抵抗等）が仕事をする場合は成立しない。",
        strategyPattern: "保存力（重力・弾性力）のみが仕事をし、非保存力（摩擦・空気抵抗）が仕事をしない場合のみ成立。",
        errorCount: 2,
        lastAttemptAt: new Date(Date.now() - 5400000).toISOString(),
        lastResult: false,
        thumb: null,
        imageCount: 0,
        answerFormula: "非保存力が仕事をしないとき（重力・弾性力のみが仕事をするとき）",
        mnemonic: "「摩擦ゼロ・空気抵抗ゼロ」の理想空間でのみ成立",
        events: [],
        createdAt: new Date(Date.now() - 518400000).toISOString()
    }
};

const LESSON_ID_1 = "LESSON_001";
const LESSON_ID_2 = "LESSON_002";

const MOCK_LESSONS = {
    [LESSON_ID_1]: {
        id: LESSON_ID_1,
        title: "【情報】情報社会の問題解決とセキュリティ・暗号化技術",
        subject: "情報",
        extractedText: `第5章 情報セキュリティの基礎\n\n5.1 暗号化の目的と必要性\n5.2 共通鍵暗号方式\n5.3 公開鍵暗号方式（RSA等）\n5.4 デジタル署名`,
        sourceMode: "topic",
        teachingStyle: "standard",
        parts: [
            { title: "情報セキュリティの目的と暗号化の基礎", summary: "なぜ暗号化が必要か、共通鍵と公開鍵の違い" },
            { title: "公開鍵暗号方式の仕組み", summary: "RSAの原理、公開鍵と秘密鍵の役割分担" },
            { title: "デジタル署名と認証", summary: "なりすまし防止・改ざん検知の仕組み" },
            { title: "まとめと演習問題", summary: "全体の整理と典型問題の解法" }
        ],
        currentPartIndex: 3,
        status: "completed",
        chatHistory: [
            { role: "user", content: "公開鍵暗号方式を教えてください" },
            { role: "model", content: "公開鍵暗号方式ではね、まずBさんが「公開鍵」と「秘密鍵」のペアを作るよ！\n\nAさんがBさんに秘密のメッセージを送りたい場合：\n① AさんはBさんの**公開鍵**でメッセージを暗号化\n② 暗号化されたデータを送信\n③ Bさんだけが持つ**秘密鍵**で復号できる！\n\nつまり、暗号化→受信者の公開鍵、復号→受信者の秘密鍵！これが基本の流れだよ✨" }
        ],
        keyTerms: [
            { name: "公開鍵暗号方式", desc: "暗号化と復号に異なる鍵を使う方式（非対称暗号）" },
            { name: "RSA", desc: "素因数分解の困難性を利用した公開鍵暗号アルゴリズム" },
            { name: "デジタル署名", desc: "送信者の秘密鍵で署名し、公開鍵で検証する認証技術" }
        ],
        inheritedKeyTerms: [],
        accumulatedKeyTerms: [],
        historicalEvents: [],
        topicKey: "情報社会の問題解決とセキュリティ・暗号化技術",
        level: "定期テストレベル",
        levelIndex: 1,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: NOW
    },
    [LESSON_ID_2]: {
        id: LESSON_ID_2,
        title: "【数学】3次関数の微分と極値・増減表",
        subject: "数学",
        extractedText: `§3 微分の応用\n\n3.1 増減表と極値\n3.2 例題: f(x) = x³ - 3x² + 2 の極値`,
        sourceMode: "topic",
        teachingStyle: "gal",
        parts: [
            { title: "微分の基本復習", summary: "f'(x)の求め方・べき乗の微分" },
            { title: "増減表の書き方", summary: "f'(x)=0を解いて増減表を完成させる" },
            { title: "極大・極小の判定", summary: "符号変化から極値を読み取る" }
        ],
        currentPartIndex: 1,
        status: "teaching",
        chatHistory: [
            { role: "user", content: "増減表の書き方がよくわかりません" },
            { role: "model", content: "増減表、秒でわかるように教えるね！\n\nまず f'(x) = 3x² - 6x = 3x(x-2) だから、x=0 と x=2 が「候補」！\n\n増減表はこんな感じ↓\n```\nx    | ... | 0  | ... | 2  | ...\nf'(x)|  +  | 0  |  -  | 0  |  +\nf(x) |  ↗  |極大 |  ↘  |極小 |  ↗\n```\n\nf'(x) の符号が + → - → 極大（山の頂点）\nf'(x) の符号が - → + → 極小（谷の底）！\n\nｷｬﾜ✨ これだけ覚えれば完璧だよ！" }
        ],
        keyTerms: [
            { name: "微分", desc: "関数の変化率を求める操作 f'(x) = lim[h→0] (f(x+h)-f(x))/h" },
            { name: "増減表", desc: "f'(x)の符号変化を表にまとめて極値を判定する表" },
            { name: "極大・極小", desc: "f'(x)が正→負で極大、負→正で極小" }
        ],
        inheritedKeyTerms: [],
        accumulatedKeyTerms: [],
        historicalEvents: [],
        topicKey: "3次関数の微分と極値",
        level: "教科書レベル（基礎の基礎から）",
        levelIndex: 0,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: NOW
    }
};

(async () => {
    const artifactDir = 'C:\\Users\\kokih\\.gemini\\antigravity-ide\\brain\\4020f001-9413-483b-80a3-7ad0f27f0c81';

    console.log("🚀 Flora 全画面検証 & Firebaseシードデータ注入開始...");
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    // 1. index.html にアクセスしてテスターログイン & APIキー注入
    console.log("🌐 [1/4] index.html にテスターログイン...");
    await page.goto('http://127.0.0.1:8000/index.html?autologin=tester');
    await page.waitForTimeout(2000);

    // APIキー設定 & Firebaseにテストデータを書き込む
    await page.evaluate(async (data) => {
        localStorage.setItem('RE_MIND_GEMINI_KEYS', JSON.stringify([data.apiKey]));
        localStorage.setItem('RE_MIND_DEEPSEEK_KEYS', JSON.stringify(['sk-dummy-deepseek']));

        // モーダルを閉じる
        const modal = document.getElementById('api-key-modal');
        if (modal) modal.style.display = 'none';

        // Firebaseが初期化されているか確認し、DBにテストデータをシード
        const fbBase = "https://www.gstatic.com/firebasejs/10.12.0/";
        const { getAuth } = await import(fbBase + "firebase-auth.js");
        const { getDatabase, ref, set } = await import(fbBase + "firebase-database.js");
        
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            const db = getDatabase();
            console.log("Seeding test data for user:", user.uid);
            await set(ref(db, `users/${user.uid}/problems`), data.problems);
            await set(ref(db, `users/${user.uid}/lessons`), data.lessons);
            console.log("Seeding complete!");
        }
    }, { apiKey: GEMINI_API_KEY, problems: MOCK_PROBLEMS, lessons: MOCK_LESSONS });

    await page.waitForTimeout(2500);

    // ダッシュボード撮影
    const dashScreenshot = path.join(artifactDir, 'debug_dashboard_seeded.png');
    await page.screenshot({ path: dashScreenshot });
    console.log("📸 ダッシュボード（問題5件表示）キャプチャ保存:", dashScreenshot);

    // 2. 授業一覧ページ
    console.log("🌐 [2/4] lesson.html 授業一覧...");
    await page.goto('http://127.0.0.1:8000/lesson.html?autologin=tester');
    await page.waitForTimeout(2500);
    const lessonListScreenshot = path.join(artifactDir, 'debug_lesson_list_seeded.png');
    await page.screenshot({ path: lessonListScreenshot });
    console.log("📸 授業一覧（授業2件表示）キャプチャ保存:", lessonListScreenshot);

    // 3. 授業受講画面（LESSON_002: 数学）
    console.log("🌐 [3/4] lesson.html 受講画面（数学）...");
    await page.goto(`http://127.0.0.1:8000/lesson.html?autologin=tester&id=${LESSON_ID_2}`);
    await page.waitForTimeout(2500);
    const lessonActiveScreenshot = path.join(artifactDir, 'debug_lesson_active_seeded.png');
    await page.screenshot({ path: lessonActiveScreenshot });
    console.log("📸 授業受講画面キャプチャ保存:", lessonActiveScreenshot);

    // 4. 問題演習画面（CUSTOM_001: 情報）
    console.log("🌐 [4/4] problem.html 問題演習画面（情報）...");
    await page.goto(`http://127.0.0.1:8000/problem.html?autologin=tester&id=CUSTOM_001`);
    await page.waitForTimeout(2500);
    const problemScreenshot = path.join(artifactDir, 'debug_problem_seeded.png');
    await page.screenshot({ path: problemScreenshot });
    console.log("📸 問題演習画面キャプチャ保存:", problemScreenshot);

    await browser.close();
    console.log("\n🎉 全画面のデータシード & 検証キャプチャが完了しました！");
})();
