/* ==========================================================================
   🔑 RE:MIND 共通APIキー管理モジュール
   - Gemini / DeepSeek それぞれ「複数キー」を配列でlocalStorageに保存
   - 旧・単一キー保存("RE_MIND_GEMINI_KEY"等)は自動的に新形式へ移行
   - 追加/削除できる管理モーダルUIをその場で注入
   - fetchWithKeyRotation() で「1つのキーが失敗(429やエラー)したら次のキーへ」を共通化
   - 429（クォータ上限）時は「モデル × キー」単位で日次リセットまでお休みに設定
   ========================================================================== */

const STORAGE = {
    gemini: "RE_MIND_GEMINI_KEYS",
    deepseek: "RE_MIND_DEEPSEEK_KEYS",
};
const LEGACY_STORAGE = {
    gemini: "RE_MIND_GEMINI_KEY",
    deepseek: "RE_MIND_DEEPSEEK_KEY",
};
const LABEL = {
    gemini: "✨ Gemini",
    deepseek: "🐋 DeepSeek",
};

// --------------------------------------------------------------------------
// キーの読み書き（配列形式）＋ 旧形式からの自動移行
// --------------------------------------------------------------------------
function loadKeys(engine) {
    let keys = [];
    try {
        const raw = localStorage.getItem(STORAGE[engine]);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) keys = parsed.filter(k => typeof k === "string" && k.trim());
        }
    } catch (e) {
        keys = [];
    }

    // 旧・単一キー形式が残っていれば配列に取り込んで移行し、旧キーは削除する
    const legacy = localStorage.getItem(LEGACY_STORAGE[engine]);
    if (legacy && legacy.trim() && !keys.includes(legacy.trim())) {
        keys.push(legacy.trim());
        localStorage.setItem(STORAGE[engine], JSON.stringify(keys));
        localStorage.removeItem(LEGACY_STORAGE[engine]);
    }
    return keys;
}

function saveKeys(engine, keys) {
    localStorage.setItem(STORAGE[engine], JSON.stringify(keys));
}

export function getGeminiKeys() { return loadKeys("gemini"); }
export function getDeepseekKeys() { return loadKeys("deepseek"); }

export function addKey(engine, key) {
    const trimmed = (key || "").trim();
    if (!trimmed) return loadKeys(engine);
    const keys = loadKeys(engine);
    if (!keys.includes(trimmed)) keys.push(trimmed);
    saveKeys(engine, keys);
    return keys;
}

export function removeKey(engine, index) {
    const keys = loadKeys(engine);
    keys.splice(index, 1);
    saveKeys(engine, keys);
    return keys;
}

export function clearAllKeys() {
    localStorage.removeItem(STORAGE.gemini);
    localStorage.removeItem(STORAGE.deepseek);
    localStorage.removeItem(LEGACY_STORAGE.gemini);
    localStorage.removeItem(LEGACY_STORAGE.deepseek);
}

// --------------------------------------------------------------------------
// 🏷️ キーのニックネーム（表示名）
// --------------------------------------------------------------------------
const KEY_LABELS_STORAGE = "RE_MIND_KEY_LABELS";

function loadKeyLabels() {
    try {
        const raw = localStorage.getItem(KEY_LABELS_STORAGE);
        const parsed = raw ? JSON.parse(raw) : {};
        return (parsed && typeof parsed === "object") ? parsed : {};
    } catch (e) {
        return {};
    }
}

function saveKeyLabels(labels) {
    localStorage.setItem(KEY_LABELS_STORAGE, JSON.stringify(labels));
}

export function getKeyLabel(engine, key) {
    const labels = loadKeyLabels();
    return labels[`${engine}:${key}`] || "";
}

export function setKeyLabel(engine, key, label) {
    const labels = loadKeyLabels();
    const trimmed = (label || "").trim();
    if (trimmed) labels[`${engine}:${key}`] = trimmed;
    else delete labels[`${engine}:${key}`];
    saveKeyLabels(labels);
}

// --------------------------------------------------------------------------
// 🩺「モデル × キー」単位の429（一時お休み）管理
// Geminiの無料枠クォータは「モデルごと」に独立してカウントされるため、
// キー単位ではなく「モデル名:キー」でクールダウンを管理する。
// 429が返ってきた場合は、日次リセット（太平洋時間深夜0時＝日本時間16:00/17:00）までお休みさせる。
// --------------------------------------------------------------------------
const KEY_COOLDOWN_STORAGE = "RE_MIND_KEY_COOLDOWN"; // { [modelName:key]: お休み終了時刻(ms, epoch) }

function getCooldownStorageKey(modelName, key) {
    return modelName ? `${modelName}:${key}` : key;
}

function loadCooldowns() {
    let map = {};
    try {
        const raw = localStorage.getItem(KEY_COOLDOWN_STORAGE);
        const parsed = raw ? JSON.parse(raw) : {};
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) map = parsed;
    } catch (e) {
        map = {};
    }
    // 期限切れのエントリを間引く
    const now = Date.now();
    let changed = false;
    for (const k of Object.keys(map)) {
        if (typeof map[k] !== "number" || map[k] <= now) {
            delete map[k];
            changed = true;
        }
    }
    if (changed) {
        try { localStorage.setItem(KEY_COOLDOWN_STORAGE, JSON.stringify(map)); } catch (e) { /* noop */ }
    }
    return map;
}

export function isKeyCoolingDown(key, modelName = "") {
    const map = loadCooldowns();
    const cKey = getCooldownStorageKey(modelName, key);
    const until = map[cKey];
    return typeof until === "number" && Date.now() < until;
}

export function setKeyCooldown(key, modelName = "", ms = null) {
    const map = loadCooldowns();
    const cKey = getCooldownStorageKey(modelName, key);
    const duration = (typeof ms === "number" && ms > 0) ? ms : Math.max(0, nextGeminiQuotaResetAt() - Date.now());
    map[cKey] = Date.now() + duration;
    try { localStorage.setItem(KEY_COOLDOWN_STORAGE, JSON.stringify(map)); } catch (e) { /* noop */ }
}

export function getKeyCooldownRemainingMs(key, modelName = "") {
    const map = loadCooldowns();
    const cKey = getCooldownStorageKey(modelName, key);
    const until = map[cKey];
    if (typeof until !== "number") return null;
    const remaining = until - Date.now();
    return remaining > 0 ? remaining : null;
}

// Gemini(Google AI Studio)無料枠の日次クォータがリセットされる「次のタイミング」を返す。
// 太平洋時間(America/Los_Angeles)の深夜0時にリセット（日本時間の16:00または17:00）。
function nextGeminiQuotaResetAt() {
    const now = new Date();
    const laParts = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Los_Angeles",
        year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
    }).formatToParts(now).reduce((acc, p) => { acc[p.type] = p.value; return acc; }, {});

    const laNowAsLocal = new Date(`${laParts.year}-${laParts.month}-${laParts.day}T${laParts.hour}:${laParts.minute}:${laParts.second}`);
    const laOffsetMs = laNowAsLocal.getTime() - now.getTime();

    const laMidnightAsLocal = new Date(`${laParts.year}-${laParts.month}-${laParts.day}T00:00:00`);
    laMidnightAsLocal.setDate(laMidnightAsLocal.getDate() + 1); // 翌日0時
    return laMidnightAsLocal.getTime() - laOffsetMs;
}

// --------------------------------------------------------------------------
// 🔁 アクティブリクエスト追跡 & ユーザー主導のタイムアウト制御
// --------------------------------------------------------------------------
let activeRequestRegistry = new Map(); // id -> { id, controller, modelName, featureId, startTime, abortReason }
let activeRequestCounter = 0;
let requestUiUpdateTimer = null;
let requestUiInjected = false;

function injectActiveRequestUI() {
    if (requestUiInjected || typeof document === "undefined") return;
    requestUiInjected = true;

    const style = document.createElement("style");
    style.id = "apikm-active-request-styles";
    style.textContent = `
        #apikm-active-request-bar {
            position: fixed;
            top: max(10px, env(safe-area-inset-top, 10px));
            left: 50%;
            transform: translateX(-50%);
            z-index: 100075;
            width: min(calc(100vw - 20px), 500px);
            background: rgba(13, 17, 23, 0.96);
            border: 1px solid var(--accent-cyan, #00f3ff);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 243, 255, 0.2);
            backdrop-filter: blur(14px);
            -webkit-backdrop-filter: blur(14px);
            border-radius: 14px;
            padding: 0.65rem 0.85rem;
            color: #fff;
            display: none;
            align-items: center;
            justify-content: space-between;
            gap: 0.55rem;
            font-family: system-ui, -apple-system, sans-serif;
            animation: apikm-bar-slide-down 0.25s cubic-bezier(0.16, 1, 0.3, 1);
            -webkit-tap-highlight-color: transparent;
            box-sizing: border-box;
        }
        @keyframes apikm-bar-slide-down {
            from { opacity: 0; transform: translate(-50%, -14px); }
            to { opacity: 1; transform: translate(-50%, 0); }
        }
        .apikm-req-info {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            flex: 1;
            min-width: 0;
        }
        .apikm-req-spinner {
            width: 18px;
            height: 18px;
            border: 2.5px solid rgba(0,243,255,0.25);
            border-top-color: var(--accent-cyan, #00f3ff);
            border-radius: 50%;
            animation: apikm-spin 0.75s linear infinite;
            flex-shrink: 0;
        }
        @keyframes apikm-spin { to { transform: rotate(360deg); } }
        .apikm-req-text-wrap {
            display: flex;
            flex-direction: column;
            min-width: 0;
        }
        .apikm-req-title {
            font-size: 0.82rem;
            font-weight: 700;
            color: #fff;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: flex;
            align-items: center;
            gap: 0.35rem;
        }
        .apikm-req-time {
            font-family: ui-monospace, SFMono-Regular, monospace;
            font-size: 0.75rem;
            color: var(--accent-cyan, #00f3ff);
            font-weight: 700;
            background: rgba(0, 243, 255, 0.12);
            padding: 0.1rem 0.35rem;
            border-radius: 4px;
        }
        .apikm-req-sub {
            font-size: 0.68rem;
            color: #94a3b8;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-top: 1px;
        }
        .apikm-req-actions {
            display: flex;
            align-items: center;
            gap: 0.35rem;
            flex-shrink: 0;
        }
        .apikm-btn-timeout {
            background: rgba(245, 158, 11, 0.18);
            border: 1px solid #f59e0b;
            color: #fbbf24;
            padding: 0.45rem 0.7rem;
            border-radius: 8px;
            font-size: 0.76rem;
            font-weight: 800;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.25rem;
            transition: all 0.15s ease;
            white-space: nowrap;
            min-height: 38px;
            touch-action: manipulation;
        }
        .apikm-btn-timeout:hover {
            background: rgba(245, 158, 11, 0.35);
            box-shadow: 0 0 12px rgba(245, 158, 11, 0.45);
        }
        .apikm-btn-timeout:active {
            transform: scale(0.95);
            background: rgba(245, 158, 11, 0.45);
        }
        .apikm-btn-cancel {
            background: rgba(239, 68, 68, 0.15);
            border: 1px solid rgba(239, 68, 68, 0.6);
            color: #f87171;
            padding: 0.45rem 0.55rem;
            border-radius: 8px;
            font-size: 0.75rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.15s ease;
            white-space: nowrap;
            min-height: 38px;
            touch-action: manipulation;
        }
        .apikm-btn-cancel:hover {
            background: rgba(239, 68, 68, 0.3);
            border-color: #ef4444;
        }
        .apikm-btn-cancel:active {
            transform: scale(0.95);
            background: rgba(239, 68, 68, 0.4);
        }

        /* 📱 モバイル画面向け最適化 (480px以下) */
        @media (max-width: 480px) {
            #apikm-active-request-bar {
                padding: 0.55rem 0.65rem;
                gap: 0.4rem;
                border-radius: 12px;
            }
            .apikm-req-title {
                font-size: 0.76rem;
            }
            .apikm-req-time {
                font-size: 0.7rem;
                padding: 0.05rem 0.25rem;
            }
            .apikm-req-sub {
                font-size: 0.62rem;
            }
            .apikm-btn-timeout {
                padding: 0.38rem 0.55rem;
                font-size: 0.72rem;
                min-height: 36px;
            }
            .apikm-btn-cancel {
                padding: 0.38rem 0.45rem;
                font-size: 0.72rem;
                min-height: 36px;
            }
        }
    `;
    document.head.appendChild(style);

    const bar = document.createElement("div");
    bar.id = "apikm-active-request-bar";
    bar.innerHTML = `
        <div class="apikm-req-info">
            <div class="apikm-req-spinner"></div>
            <div class="apikm-req-text-wrap">
                <div class="apikm-req-title">
                    <span>⚡ AI応答待機中</span>
                    <span class="apikm-req-time" id="apikm-req-elapsed">00:00</span>
                </div>
                <div class="apikm-req-sub" id="apikm-req-detail">返信がない場合はタイムアウトできます</div>
            </div>
        </div>
        <div class="apikm-req-actions">
            <button type="button" class="apikm-btn-timeout" id="apikm-btn-timeout" title="待機を打ち切って次のキー/モデルへスキップします">
                ⏱️ タイムアウト
            </button>
            <button type="button" class="apikm-btn-cancel" id="apikm-btn-cancel" title="AIリクエストを完全に中止します">
                ✕ 中断
            </button>
        </div>
    `;
    document.body.appendChild(bar);

    bar.querySelector("#apikm-btn-timeout").addEventListener("click", () => {
        if (typeof navigator !== "undefined" && navigator.vibrate) {
            try { navigator.vibrate(20); } catch(e) {}
        }
        manualTimeoutAllRequests();
    });

    bar.querySelector("#apikm-btn-cancel").addEventListener("click", () => {
        if (typeof navigator !== "undefined" && navigator.vibrate) {
            try { navigator.vibrate(20); } catch(e) {}
        }
        manualAbortAllRequests();
    });
}

function updateActiveRequestUI() {
    if (typeof document === "undefined") return;
    injectActiveRequestUI();
    const bar = document.getElementById("apikm-active-request-bar");
    if (!bar) return;

    const count = activeRequestRegistry.size;
    if (count === 0) {
        bar.style.display = "none";
        if (requestUiUpdateTimer) {
            clearInterval(requestUiUpdateTimer);
            requestUiUpdateTimer = null;
        }
        return;
    }

    bar.style.display = "flex";

    // 最初の（最古の）リクエストの経過時間を基準にする
    let earliestTime = Date.now();
    let details = [];
    activeRequestRegistry.forEach(req => {
        if (req.startTime < earliestTime) earliestTime = req.startTime;
        if (req.modelName) details.push(req.modelName);
    });

    const elapsedSec = Math.max(0, Math.floor((Date.now() - earliestTime) / 1000));
    const mins = String(Math.floor(elapsedSec / 60)).padStart(2, '0');
    const secs = String(elapsedSec % 60).padStart(2, '0');

    const elapsedEl = bar.querySelector("#apikm-req-elapsed");
    if (elapsedEl) elapsedEl.textContent = `${mins}:${secs}`;

    const detailEl = bar.querySelector("#apikm-req-detail");
    if (detailEl) {
        const uniqueModels = Array.from(new Set(details));
        const modelStr = uniqueModels.length > 0 ? `[${uniqueModels.join(", ")}] ` : "";
        const countStr = count > 1 ? ` (${count}件並行通信中)` : "";
        detailEl.textContent = `${modelStr}返信待機中${countStr}・任意のタイミングでタイムアウト可`;
    }

    if (!requestUiUpdateTimer) {
        requestUiUpdateTimer = setInterval(updateActiveRequestUI, 1000);
    }
}

export function manualTimeoutAllRequests() {
    if (activeRequestRegistry.size === 0) {
        showToast("現在待機中のAIリクエストはありません", "info", 3000);
        return;
    }
    const count = activeRequestRegistry.size;
    console.info(`⏱️ ユーザーによる手動タイムアウト実行 (${count}件)`);
    activeRequestRegistry.forEach((req) => {
        req.abortReason = "user_timeout";
        try {
            req.controller.abort("user_timeout");
        } catch (e) { /* noop */ }
    });
    showToast(`⏱️ タイムアウトを実行しました（次のキー/モデルへ切り替えます）`, "info", 4000);
}

export function manualAbortAllRequests() {
    if (activeRequestRegistry.size === 0) {
        showToast("現在待機中のAIリクエストはありません", "info", 3000);
        return;
    }
    const count = activeRequestRegistry.size;
    console.info(`🛑 ユーザーによる手動中断実行 (${count}件)`);
    activeRequestRegistry.forEach((req) => {
        req.abortReason = "user_cancel";
        try {
            req.controller.abort("user_cancel");
        } catch (e) { /* noop */ }
    });
    showToast(`⏹️ AIリクエストを中断しました`, "info", 4000);
}

// グローバルスコープにも公開（UIやコンソールから即時実行可能）
if (typeof window !== "undefined") {
    window.__apikmTimeout = manualTimeoutAllRequests;
    window.__apikmAbort = manualAbortAllRequests;
}

// --------------------------------------------------------------------------
// 🔁 キー・ローテーション付きfetch
// - 自動タイムアウト（60秒など）はデフォルトで無効化
// - ユーザーがタイムアウトボタンを押すか、APIから返信があるまで待機
// - ユーザーがタイムアウトを押した場合は次のキーへ切り替え
// - ユーザーが中止を押した場合は即座に例外を送出して終了
// --------------------------------------------------------------------------
export async function fetchWithKeyRotation(keys, buildRequest, { requestTimeoutMs = null, startIndex = 0, modelName = "", featureId = null } = {}) {
    if (!keys || keys.length === 0) {
        throw new Error("APIキーが1件も登録されていません。右下の🔑ボタンから登録してください。");
    }

    // 💡 先に「お休み中でない生きているキー」のインデックスだけを抽出する
    const availableIndices = keys
        .map((k, idx) => ({ key: k, originalIndex: idx }))
        .filter(item => !isKeyCoolingDown(item.key, modelName));

    if (availableIndices.length === 0) {
        const tag = modelName ? `[${modelName}] ` : "";
        throw new Error(`${tag}全キーが日次利用上限のためお休み中です`);
    }

    // 💡 生きているキーの配列に対して startIndex のオフセットを適用する
    const activeCount = availableIndices.length;
    const offset = ((startIndex % activeCount) + activeCount) % activeCount;
    const order = Array.from({ length: activeCount }, (_, step) => availableIndices[(offset + step) % activeCount]);

    let lastError = null;
    for (const item of order) {
        const key = item.key;
        const i = item.originalIndex; // 元のキー番号（ログ用）

        const controller = new AbortController();
        const reqId = ++activeRequestCounter;
        const reqEntry = {
            id: reqId,
            controller,
            modelName,
            featureId,
            startTime: Date.now(),
            abortReason: null
        };
        activeRequestRegistry.set(reqId, reqEntry);
        updateActiveRequestUI();

        let timeoutId = null;
        if (typeof requestTimeoutMs === "number" && requestTimeoutMs > 0 && Number.isFinite(requestTimeoutMs)) {
            timeoutId = setTimeout(() => {
                reqEntry.abortReason = "auto_timeout";
                controller.abort("auto_timeout");
            }, requestTimeoutMs);
        }

        try {
            const { url, options } = buildRequest(key);
            const response = await fetch(url, { ...options, signal: controller.signal });
            if (timeoutId) clearTimeout(timeoutId);
            activeRequestRegistry.delete(reqId);
            updateActiveRequestUI();

            if (response.status === 429) {
                const cooldownMs = Math.max(0, nextGeminiQuotaResetAt() - Date.now());
                setKeyCooldown(key, modelName, cooldownMs);
                const hoursLeft = Math.max(1, Math.round(cooldownMs / 3600000));
                const tag = modelName ? `[${modelName}] ` : "";
                console.warn(`⚠️ ${tag}キー#${i + 1} が上限（429）に達しました → 日次リセット（あと約${hoursLeft}時間）までお休みに設定し、次のキーへ`);
                lastError = new Error(`レート制限(429): ${tag}キー#${i + 1}`);
                continue;
            }
            if (response.status === 503) {
                console.warn(`⚠️ モデルが過負荷（503） → 残りのキーは試さず次のモデルへフォールバック`);
                lastError = new Error(`モデル過負荷(503)`);
                break;
            }
            if (!response.ok) {
                const errBody = await response.json().catch(() => ({}));
                console.warn(`⚠️ キー#${i + 1} でエラー(${response.status}) → 次のキーへフォールバック`, errBody);
                lastError = new Error(errBody.error?.message || `HTTPエラー: ${response.status}（キー#${i + 1}）`);
                continue;
            }
            return response;
        } catch (networkErr) {
            if (timeoutId) clearTimeout(timeoutId);
            activeRequestRegistry.delete(reqId);
            updateActiveRequestUI();

            const reason = reqEntry.abortReason;
            if (reason === "user_cancel") {
                console.warn(`⏹️ ユーザーによりAIリクエストが完全に中断されました`);
                throw new Error("ユーザーによりAIリクエストが中断されました。");
            }

            if (reason === "user_timeout") {
                console.warn(`⏱️ ユーザーの指示によりキー#${i + 1}をタイムアウト → 次のキー/モデルへフォールバック`);
                lastError = new Error(`手動タイムアウト: キー#${i + 1}`);
                continue;
            }

            if (networkErr?.name === "AbortError" || reason === "auto_timeout") {
                console.warn(`⚠️ キー#${i + 1} がタイムアウトしました → 次のキーへフォールバック`);
                lastError = new Error(`タイムアウト: キー#${i + 1}`);
                continue;
            }
            console.warn(`⚠️ キー#${i + 1} で通信エラー → 次のキーへフォールバック`, networkErr);
            lastError = networkErr;
            continue;
        }
    }
    throw lastError || new Error("登録済みの全APIキーで失敗しました。");
}

// --------------------------------------------------------------------------
// 🧠 Geminiモデル一覧・機能割り当て
// --------------------------------------------------------------------------
export const GEMINI_MODEL_FALLBACK_LIST = [
    'gemini-3.7-flash',
    'gemini-3.6-flash',
    'gemini-3.5-flash',
    'gemini-3-flash-preview',
    'gemini-2.5-flash',
    'gemini-3.5-flash-lite',
    'gemini-3.1-flash-lite',
    'gemini-2.5-flash-lite'
];

export const GEMINI_FEATURES = [
    { id: "subject_analysis", label: "問題登録：科目/単元 自動分析", page: "index.html" },
    { id: "explanation",      label: "問題解説の生成（初回）",        page: "problem.html" },
    { id: "regenerate",       label: "解説の再生成（間違い指摘対応）", page: "problem.html" },
    { id: "chat",             label: "問題についてのAIチャット",      page: "problem.html" },
    { id: "stuck_topic",      label: "前提単元の分析→授業引き継ぎ",   page: "problem.html" },
    { id: "quick_answer",     label: "解答の即時チェック",           page: "answer-check.html" },
    { id: "custom_sprint",    label: "カスタム演習の問題生成",       page: "custom-sprint.html" },
    { id: "daily",            label: "デイリー演習の問題生成",       page: "daily.html" },
    { id: "lesson_counseling", label: "授業作成：AI事前ヒアリング・要件定義", page: "lesson.html" },
    { id: "lesson_plan",      label: "授業プランの生成",             page: "lesson.html" },
    { id: "lesson_drill",     label: "授業の類題作成",               page: "lesson.html" },
    { id: "lesson_teach",     label: "授業内AIチャット",             page: "lesson.html" },
    { id: "memorization_points", label: "単元の暗記事項リスト生成（授業プランとは別リクエスト）", page: "lesson.html" },
    { id: "refbook_extract",  label: "参考書の写真からの問題読み取り",  page: "refbook.html" },
    { id: "refbook_answer_generate", label: "参考書問題のAIによる解答・解説生成", page: "refbook.html" },
];

// サブ機能IDや旧機能IDを親の管理IDへ自動マッピングする辞書
const FEATURE_ALIASES = {
    "lesson_parallel_structure": "lesson_plan",
    "lesson_parallel_lecture": "lesson_plan",
    "lesson_parallel_memorize": "lesson_plan",
    "lesson_plan_photo": "lesson_plan",
    "answer_check": "quick_answer",
    "problem_chat": "chat",
    "lesson_chat": "lesson_teach"
};

function resolveFeatureId(featureId) {
    if (!featureId) return null;
    if (FEATURE_ALIASES[featureId]) return FEATURE_ALIASES[featureId];
    if (featureId.startsWith("lesson_plan_") || featureId.startsWith("lesson_parallel_")) return "lesson_plan";
    return featureId;
}

const FEATURE_CONFIG_STORAGE = "RE_MIND_FEATURE_CONFIG";

function loadFeatureConfig() {
    try {
        const raw = localStorage.getItem(FEATURE_CONFIG_STORAGE);
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        return (parsed && typeof parsed === "object") ? parsed : {};
    } catch (e) {
        return {};
    }
}

function saveFeatureConfig(cfg) {
    localStorage.setItem(FEATURE_CONFIG_STORAGE, JSON.stringify(cfg));
}

const AI_SETTINGS_EXPORT_TYPE = "lolz-ai-settings-export";
const AI_SETTINGS_EXPORT_VERSION = 1;

export function exportAISettings() {
    return {
        app: "LOLZ",
        type: AI_SETTINGS_EXPORT_TYPE,
        version: AI_SETTINGS_EXPORT_VERSION,
        exportedAt: new Date().toISOString(),
        geminiKeys: loadKeys("gemini"),
        deepseekKeys: loadKeys("deepseek"),
        keyLabels: loadKeyLabels(),
        featureConfig: loadFeatureConfig(),
    };
}

export function importAISettings(data) {
    if (!data || typeof data !== "object") {
        throw new Error("ファイルの中身を読み取れませんでした。");
    }
    if (data.type !== AI_SETTINGS_EXPORT_TYPE) {
        throw new Error("このアプリのエクスポートファイルではないようです。");
    }

    const summary = { geminiKeys: 0, deepseekKeys: 0, featureConfig: 0 };

    if (Array.isArray(data.geminiKeys)) {
        const keys = data.geminiKeys.filter(k => typeof k === "string" && k.trim());
        saveKeys("gemini", keys);
        summary.geminiKeys = keys.length;
    }
    if (Array.isArray(data.deepseekKeys)) {
        const keys = data.deepseekKeys.filter(k => typeof k === "string" && k.trim());
        saveKeys("deepseek", keys);
        summary.deepseekKeys = keys.length;
    }
    if (data.keyLabels && typeof data.keyLabels === "object" && !Array.isArray(data.keyLabels)) {
        saveKeyLabels(data.keyLabels);
    }
    if (data.featureConfig && typeof data.featureConfig === "object" && !Array.isArray(data.featureConfig)) {
        saveFeatureConfig(data.featureConfig);
        summary.featureConfig = Object.keys(data.featureConfig).length;
    }

    return summary;
}

function getFeatureEntry(featureId) {
    const cfg = loadFeatureConfig();
    if (featureId && cfg[featureId]) return cfg[featureId];
    const resolvedId = resolveFeatureId(featureId);
    if (resolvedId && cfg[resolvedId]) return cfg[resolvedId];
    return { models: null, keys: null };
}

function setFeatureEntry(featureId, entry) {
    const cfg = loadFeatureConfig();
    cfg[featureId] = entry;
    saveFeatureConfig(cfg);
}

export function getFeatureAssignment(featureId) { return getFeatureEntry(featureId); }
export function setFeatureAssignment(featureId, { models, keys }) {
    setFeatureEntry(featureId, {
        models: (models && models.length > 0) ? models : null,
        keys: (keys && keys.length > 0) ? keys : null,
    });
}
export function resetFeatureAssignment(featureId) {
    setFeatureEntry(featureId, { models: null, keys: null });
}

export function getEffectiveModelList(featureId) {
    if (!featureId) return GEMINI_MODEL_FALLBACK_LIST;
    const entry = getFeatureEntry(featureId);
    if (!entry.models || entry.models.length === 0) return GEMINI_MODEL_FALLBACK_LIST;
    // 💡 ユーザーが設定した配列の順序（優先順位）をそのまま採用する
    const validModels = entry.models.filter(m => GEMINI_MODEL_FALLBACK_LIST.includes(m));
    return validModels.length > 0 ? validModels : GEMINI_MODEL_FALLBACK_LIST;
}

export function getEffectiveGeminiKeys(featureId) {
    const allKeys = getGeminiKeys();
    if (!featureId) return allKeys;
    const entry = getFeatureEntry(featureId);
    if (!entry.keys || entry.keys.length === 0) return allKeys;
    const allowed = new Set(entry.keys);
    const filtered = allKeys.filter(k => allowed.has(k));
    return filtered.length > 0 ? filtered : allKeys;
}

export function buildGeminiUrl(modelName, apiKey) {
    return `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
}

export function stripCodeFence(text) {
    let t = text.trim();
    if (t.startsWith("```json")) t = t.substring(7);
    else if (t.startsWith("```")) t = t.substring(3);
    if (t.endsWith("```")) t = t.substring(0, t.length - 3);
    return t.trim();
}

export function fixJsonEscapes(str) {
    let inString = false; let result = "";
    for (let i = 0; i < str.length; i++) {
        let c = str[i];
        if (c === '"' && (i === 0 || str[i-1] !== '\\')) { inString = !inString; result += c; }
        else if (c === '\\' && inString) {
            let next = str[i+1];
            if (next === '"') { result += '\\"'; i++; }
            else if (next === '\\') { result += '\\\\'; i++; }
            else if (next === 'n' && (str[i+2] === ' ' || str[i+2] === '"' || str[i+2] === '\\' || !/[a-zA-Z]/.test(str[i+2]))) { result += '\\n'; i++; }
            else { result += '\\\\'; }
        } else if (inString && c.charCodeAt(0) < 0x20) {
            if (c === '\n') result += '\\n';
            else if (c === '\r') result += '\\r';
            else if (c === '\t') result += '\\t';
            else result += '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0');
        } else { result += c; }
    }
    return result;
}

export function extractJsonObject(text) {
    const start = text.indexOf('{');
    if (start === -1) return text;
    let depth = 0; let inString = false;
    for (let i = start; i < text.length; i++) {
        const c = text[i];
        if (c === '"' && text[i - 1] !== '\\') inString = !inString;
        if (!inString) {
            if (c === '{') depth++;
            else if (c === '}') { depth--; if (depth === 0) return text.substring(start, i + 1); }
        }
    }
    return text.substring(start);
}

export function extractJsonArray(text) {
    const start = text.indexOf('[');
    if (start === -1) return text;
    let depth = 0; let inString = false;
    for (let i = start; i < text.length; i++) {
        const c = text[i];
        if (c === '"' && text[i - 1] !== '\\') inString = !inString;
        if (!inString) {
            if (c === '[') depth++;
            else if (c === ']') { depth--; if (depth === 0) return text.substring(start, i + 1); }
        }
    }
    return text.substring(start);
}

// --------------------------------------------------------------------------
// 🧠 Gemini フォールバック実行ループ
// --------------------------------------------------------------------------
async function runGeminiFallbackLoop(contents, systemInstruction, options = {}) {
    const { temperature = 0.1, arrayMode = false, silentFallback = false, responseSchema = null, featureId = null, requestTimeoutMs = null, keyOffset = 0 } = options;
    const keys = getEffectiveGeminiKeys(featureId);
    const modelList = getEffectiveModelList(featureId);

    const strictJsonReminder = "\n\n❗最重要ルール: 出力は指定されたJSON形式のみとすること。挨拶・前置き・説明文・Markdownのコードブロック(```)など、JSON以外の文字列は一切含めないこと。";

    let lastError = null;
    const fallbackAttempts = [];

    async function attemptOnce(modelName, systemInstructionText) {
        const generationConfig = { "responseMimeType": "application/json", "temperature": temperature };
        if (responseSchema) generationConfig.responseSchema = responseSchema;

        const requestBody = JSON.stringify({
            "contents": contents,
            "systemInstruction": { "parts": [{ "text": systemInstructionText }] },
            "generationConfig": generationConfig
        });

        let response;
        try {
            response = await fetchWithKeyRotation(keys, (key) => ({
                url: buildGeminiUrl(modelName, key),
                options: { method: "POST", headers: { "Content-Type": "application/json" }, body: requestBody }
            }), { requestTimeoutMs, startIndex: keyOffset, modelName, featureId });
        } catch (err) {
            return { ok: false, isFormatError: false, reason: err?.message || "不明な通信エラー", error: err };
        }

        const candidateJson = await response.json();
        const candidateText = candidateJson?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!candidateText) {
            return { ok: false, isFormatError: false, reason: "空応答（finishReason等が原因の可能性）", error: new Error(`Empty response: ${modelName}`) };
        }

        try {
            const extractor = arrayMode ? extractJsonArray : extractJsonObject;
            const parsed = JSON.parse(fixJsonEscapes(extractor(stripCodeFence(candidateText.trim()))));
            return { ok: true, parsed };
        } catch (parseErr) {
            return { ok: false, isFormatError: true, reason: "JSON解析エラー（応答の形式が崩れていた）", error: parseErr, rawText: candidateText };
        }
    }

    for (const modelName of modelList) {
        let result = await attemptOnce(modelName, systemInstruction);

        if (!result.ok && result.isFormatError) {
            console.warn(`⚠️ ${modelName} の応答が不正なJSONでした → フォーマット厳守の指示を追加して同じモデルに再挑戦`, result.error, result.rawText);
            result = await attemptOnce(modelName, systemInstruction + strictJsonReminder);
        }

        if (result.ok) {
            if (!silentFallback) notifyModelFallback(fallbackAttempts, modelName);
            return result.parsed;
        }

        console.warn(`⚠️ ${modelName} が失敗しました（${result.reason}） → 次のモデルへフォールバック`, result.error);
        lastError = result.error;
        fallbackAttempts.push({ model: modelName, reason: result.isFormatError ? "JSON解析エラー（再指示後も形式が崩れていた）" : result.reason });
    }

    if (!silentFallback) notifyModelFallback(fallbackAttempts, null);
    throw new Error(`全モデルが利用できませんでした（レート制限または不正な応答）。時間を置いて再度お試しください。\n最終エラー: ${lastError?.message || "不明"}`);
}

export async function callGeminiJSON(parts, systemInstruction, options = {}) {
    return runGeminiFallbackLoop([{ "role": "user", "parts": parts }], systemInstruction, options);
}

export async function callGeminiChat(contents, systemInstruction, options = {}) {
    return runGeminiFallbackLoop(contents, systemInstruction, options);
}

// --------------------------------------------------------------------------
// 🖼 画像の正規化 & サムネイル生成
// --------------------------------------------------------------------------
export const GEMINI_SUPPORTED_IMAGE_MIME = ["image/png", "image/jpeg", "image/webp"];

export async function normalizeImageFile(file) {
    const lowerName = (file.name || "").toLowerCase();
    const isHeic = file.type === "image/heic" || file.type === "image/heif"
        || lowerName.endsWith(".heic") || lowerName.endsWith(".heif");

    if (!isHeic && GEMINI_SUPPORTED_IMAGE_MIME.includes(file.type)) {
        const dataUrl = await new Promise((res, rej) => {
            const r = new FileReader();
            r.onload = () => res(r.result);
            r.onerror = rej;
            r.readAsDataURL(file);
        });
        return { mimeType: file.type, data: dataUrl.split(",")[1], previewUrl: dataUrl };
    }

    console.warn(`⚠️ ${isHeic ? "HEIC/HEIF画像" : `未対応/未判定のMIMEタイプ(${file.type || "不明"})`}を検出 → image/jpegへ再エンコードします`);
    const objectUrl = URL.createObjectURL(file);
    try {
        const img = await new Promise((res, rej) => {
            const im = new Image();
            im.onload = () => res(im);
            im.onerror = () => rej(new Error("画像の読み込みに失敗しました"));
            im.src = objectUrl;
        });
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.getContext("2d").drawImage(img, 0, 0);
        const jpegUrl = canvas.toDataURL("image/jpeg", 0.92);
        return { mimeType: "image/jpeg", data: jpegUrl.split(",")[1], previewUrl: jpegUrl };
    } catch (e) {
        console.error("画像の再エンコードに失敗しました", e);
        throw new Error(`「${file.name}」を変換できませんでした。`);
    } finally {
        URL.revokeObjectURL(objectUrl);
    }
}

export function generateTinyThumbnail(dataUrl, maxSize = 90, quality = 0.35) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            let width = img.naturalWidth, height = img.naturalHeight;
            if (width > height) {
                if (width > maxSize) { height = Math.round(height * maxSize / width); width = maxSize; }
            } else {
                if (height > maxSize) { width = Math.round(width * maxSize / height); height = maxSize; }
            }
            const canvas = document.createElement("canvas");
            canvas.width = width || 1;
            canvas.height = height || 1;
            canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL("image/jpeg", quality));
        };
        img.onerror = () => reject(new Error("サムネイル生成用の画像読み込みに失敗しました"));
        img.src = dataUrl;
    });
}

// --------------------------------------------------------------------------
// 🖥 管理モーダルUI
// --------------------------------------------------------------------------
let uiInjected = false;

function injectStylesAndModal() {
    if (uiInjected) return;
    uiInjected = true;

    const style = document.createElement("style");
    style.textContent = `
        #apikm-fab {
            position: fixed; right: 1.2rem; bottom: 1.2rem; z-index: 100050;
            width: 52px; height: 52px; border-radius: 16px;
            background: var(--card-bg, #050508); border: 1px solid var(--accent-cyan, #00f3ff);
            color: var(--accent-cyan, #00f3ff); font-size: 1.3rem;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; box-shadow: 3px 3px 0px rgba(0,243,255,0.2);
        }
        #apikm-fab:hover { background: rgba(0,243,255,0.08); }
        @media (max-width: 600px) {
            #apikm-fab { display: none !important; }
        }
        #apikm-overlay {
            display: none; position: fixed; inset: 0; z-index: 100060;
            background: rgba(0,0,0,0.8); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
            align-items: center; justify-content: center; padding: 1rem;
        }
        #apikm-modal {
            width: 100%; max-width: 560px; max-height: 85vh; overflow-y: auto;
            background: rgba(10,10,18,0.97); border: 1px solid var(--accent-cyan, #00f3ff);
            box-shadow: 0 0 30px rgba(0,243,255,0.25); border-radius: 20px; padding: 1.6rem;
            color: var(--text-main, #fff); font-family: inherit;
        }
        .apikm-title { font-size: 1.2rem; font-weight: 900; margin-bottom: 0.3rem; }
        .apikm-sub { font-size: 0.8rem; color: var(--text-muted, #708590); margin-bottom: 1.2rem; line-height: 1.5; }
        .apikm-section { margin-bottom: 1.4rem; }
        .apikm-section-label { font-size: 0.9rem; font-weight: 800; margin-bottom: 0.6rem; display:flex; align-items:center; gap:0.4rem; }
        .apikm-key-row {
            display: flex; align-items: center; gap: 0.6rem; background: rgba(255,255,255,0.03);
            border: 1px solid #22222a; border-radius: 10px; padding: 0.5rem 0.8rem; margin-bottom: 0.5rem;
        }
        .apikm-key-text { flex-grow: 1; font-family: monospace; font-size: 0.85rem; color: var(--text-bright-muted, #a0b5c0); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .apikm-key-badge { font-size: 0.65rem; font-weight: 800; color: #000; background: var(--accent-cyan,#00f3ff); border-radius: 6px; padding: 0.1rem 0.4rem; flex-shrink:0; }
        .apikm-remove-btn {
            background: transparent; border: 1px solid #ff4545; color: #ff4545; border-radius: 8px;
            width: 28px; height: 28px; flex-shrink: 0; cursor: pointer; font-weight: 900;
        }
        .apikm-remove-btn:hover { background: rgba(255,69,69,0.1); }
        .apikm-empty { font-size: 0.8rem; color: var(--text-muted,#708590); padding: 0.4rem 0.1rem 0.8rem; }
        .apikm-add-row { display: flex; gap: 0.5rem; }
        .apikm-add-input {
            flex-grow: 1; background: #000; border: 1px solid #22222a; color: #fff;
            padding: 0.6rem 0.8rem; border-radius: 10px; font-size: 0.85rem; font-family: monospace;
        }
        .apikm-add-btn {
            background: var(--accent-cyan,#00f3ff); color: #000; border: none; border-radius: 10px;
            padding: 0.6rem 1rem; font-weight: 900; cursor: pointer; flex-shrink: 0;
        }
        .apikm-settings-link-row { margin: 0.4rem 0 1.4rem; }
        .apikm-settings-link-btn {
            display: block; width: 100%; text-align: center; text-decoration: none;
            background: rgba(0,243,255,0.08); border: 1px solid var(--accent-cyan,#00f3ff); color: var(--accent-cyan,#00f3ff);
            border-radius: 12px; padding: 0.7rem 1rem; font-weight: 900; font-size: 0.85rem;
        }
        .apikm-settings-link-btn:hover { background: rgba(0,243,255,0.16); }
        .apikm-io-row { display: flex; gap: 0.5rem; margin: 0 0 0.4rem; }
        .apikm-io-btn {
            flex: 1; background: rgba(255,255,255,0.04); border: 1px solid #333; color: #fff;
            border-radius: 10px; padding: 0.6rem 0.6rem; font-weight: 800; font-size: 0.78rem; cursor: pointer;
        }
        .apikm-io-btn:hover { background: rgba(255,255,255,0.09); border-color: #555; }
        .apikm-io-note { font-size: 0.68rem; color: var(--text-muted,#708590); margin-bottom: 1rem; line-height: 1.5; }
        .apikm-close-row { display: flex; justify-content: flex-end; margin-top: 0.8rem; }
        .apikm-close-btn {
            background: #111; border: 1px solid #333; color: #fff; border-radius: 10px;
            padding: 0.6rem 1.2rem; cursor: pointer; font-weight: 800;
        }
    `;
    document.head.appendChild(style);

    const fab = document.createElement("button");
    fab.id = "apikm-fab";
    fab.type = "button";
    fab.title = "APIキー管理";
    fab.textContent = "🔑";
    document.body.appendChild(fab);

    const overlay = document.createElement("div");
    overlay.id = "apikm-overlay";
    overlay.innerHTML = `
        <div id="apikm-modal">
            <div class="apikm-title">🔑 APIキー管理</div>
            <div class="apikm-sub">
                各AIにつき複数のAPIキーを登録できます。1つが利用上限（429）や無効エラーになった場合、
                自動で次のキーに切り替えて再試行します。キーはこの端末のブラウザ内だけに保存され、サーバーには送信・保存されません。
            </div>
            <div class="apikm-section" data-engine-section="gemini">
                <div class="apikm-section-label">✨ Gemini キー</div>
                <div class="apikm-key-list" data-list="gemini"></div>
                <form class="apikm-add-row" autocomplete="off" onsubmit="return false;">
                    <input type="password" class="apikm-add-input" data-input="gemini" name="apikm-gemini-field" placeholder="Geminiの新しいAPIキーを貼り付け" autocomplete="new-password" data-lpignore="true" data-1p-ignore="true">
                    <button type="button" class="apikm-add-btn" data-add="gemini">＋ 追加</button>
                </form>
            </div>
            <div class="apikm-section" data-engine-section="deepseek">
                <div class="apikm-section-label">🐋 DeepSeek キー</div>
                <div class="apikm-key-list" data-list="deepseek"></div>
                <form class="apikm-add-row" autocomplete="off" onsubmit="return false;">
                    <input type="password" class="apikm-add-input" data-input="deepseek" name="apikm-deepseek-field" placeholder="DeepSeekの新しいAPIキーを貼り付け" autocomplete="new-password" data-lpignore="true" data-1p-ignore="true">
                    <button type="button" class="apikm-add-btn" data-add="deepseek">＋ 追加</button>
                </form>
            </div>
            <div class="apikm-settings-link-row">
                <a class="apikm-settings-link-btn" href="ai-settings.html">⚙️ 機能ごとのモデル／キー割り当てを管理画面で設定 →</a>
            </div>
            <div class="apikm-io-row">
                <button type="button" class="apikm-io-btn" id="apikm-export-btn">📤 設定をエクスポート</button>
                <button type="button" class="apikm-io-btn" id="apikm-import-btn">📥 設定をインポート</button>
                <input type="file" id="apikm-import-file" accept="application/json,.json" style="display:none;">
            </div>
            <div class="apikm-io-note">APIキー・キーのニックネーム・機能ごとの割り当てをこの端末内でJSONファイルに書き出し／読み込みします（他サービスへの送信はありません）。</div>
            <div class="apikm-close-row">
                <button type="button" class="apikm-close-btn" id="apikm-close-btn">閉じる</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    function maskKey(key) {
        if (key.length <= 8) return key[0] + "•••" + key.slice(-2);
        return key.slice(0, 4) + "••••••••" + key.slice(-4);
    }

    function renderList(engine) {
        const listEl = overlay.querySelector(`[data-list="${engine}"]`);
        const keys = loadKeys(engine);
        if (keys.length === 0) {
            listEl.innerHTML = `<div class="apikm-empty">まだ${LABEL[engine]}のキーが登録されていません。</div>`;
            return;
        }
        listEl.innerHTML = keys.map((k, i) => `
            <div class="apikm-key-row">
                <span class="apikm-key-badge">${i === 0 ? "優先" : `#${i + 1}`}</span>
                <span class="apikm-key-text">${maskKey(k)}</span>
                <button type="button" class="apikm-remove-btn" data-remove="${engine}:${i}" title="削除">×</button>
            </div>
        `).join("");
    }

    function renderAll() {
        renderList("gemini");
        renderList("deepseek");
    }

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeModal();

        const removeTarget = e.target.closest("[data-remove]");
        if (removeTarget) {
            const [engine, idxStr] = removeTarget.getAttribute("data-remove").split(":");
            removeKey(engine, parseInt(idxStr, 10));
            renderAll();
            return;
        }

        const addTarget = e.target.closest("[data-add]");
        if (addTarget) {
            const engine = addTarget.getAttribute("data-add");
            const input = overlay.querySelector(`[data-input="${engine}"]`);
            if (input.value.trim()) {
                addKey(engine, input.value);
                input.value = "";
                renderAll();
            }
            return;
        }

        if (e.target.id === "apikm-close-btn") closeModal();

        if (e.target.id === "apikm-export-btn") {
            const data = exportAISettings();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const dateStr = new Date().toISOString().slice(0, 10);
            const a = document.createElement("a");
            a.href = url;
            a.download = `lolz-ai-settings-${dateStr}.json`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            showToast("⚙️ AI設定をエクスポートしました", "success");
        }

        if (e.target.id === "apikm-import-btn") {
            overlay.querySelector("#apikm-import-file").click();
        }
    });

    overlay.querySelector("#apikm-import-file").addEventListener("change", async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        try {
            const text = await file.text();
            const data = JSON.parse(text);
            const before = `既存のAPIキー・割り当て設定は上書きされます。\n「${file.name}」の内容をインポートしますか？`;
            if (!window.confirm(before)) { e.target.value = ""; return; }
            const summary = importAISettings(data);
            renderAll();
            showToast(`📥 インポートしました（Gemini:${summary.geminiKeys}件 / DeepSeek:${summary.deepseekKeys}件 / 機能割り当て:${summary.featureConfig}件）`, "success", 8000);
        } catch (err) {
            showToast(`⚠️ インポートに失敗しました：${err.message || err}`, "error", 8000);
        } finally {
            e.target.value = "";
        }
    });

    overlay.querySelectorAll(".apikm-add-input").forEach((input) => {
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                const engine = input.getAttribute("data-input");
                if (input.value.trim()) {
                    addKey(engine, input.value);
                    input.value = "";
                    renderAll();
                }
            }
        });
    });

    fab.addEventListener("click", () => openModal());

    function openModal() {
        renderAll();
        overlay.style.display = "flex";
    }
    function closeModal() {
        overlay.style.display = "none";
    }

    window.__apikmOpen = openModal;
}

export function initApiKeyManager({ needGemini = false, needDeepseek = false, autoOpen = true } = {}) {
    injectStylesAndModal();

    // 📱 モバイル画面（/m/）または明示的な autoOpen=false の時は初回自動オープンを抑制
    const isMobile = typeof window !== 'undefined' && (window.location.pathname.includes('/m/') || window.innerWidth <= 600);
    if (!autoOpen || isMobile) return;

    const missingGemini = needGemini && getGeminiKeys().length === 0;
    const missingDeepseek = needDeepseek && getDeepseekKeys().length === 0;

    if (missingGemini || missingDeepseek) {
        setTimeout(() => {
            if (window.__apikmOpen) window.__apikmOpen();
        }, 200);
    }
}

export function openApiKeyManager() {
    injectStylesAndModal();
    if (window.__apikmOpen) window.__apikmOpen();
}

// --------------------------------------------------------------------------
// 🩺 トースト通知ヘルパー
// --------------------------------------------------------------------------
let fallbackToastStyleInjected = false;

function injectFallbackToastStyles() {
    if (fallbackToastStyleInjected || typeof document === "undefined") return;
    fallbackToastStyleInjected = true;
    const style = document.createElement("style");
    style.textContent = `
        #apikm-fallback-toast-wrap {
            position: fixed; right: 1.2rem; bottom: 5.2rem; z-index: 100055;
            display: flex; flex-direction: column; gap: 0.6rem; max-width: 340px;
        }
        .apikm-fallback-toast {
            background: rgba(10,10,18,0.97); border: 1px solid var(--accent-magenta, #ff007f);
            box-shadow: 0 0 18px rgba(255,0,127,0.25); border-radius: 14px; padding: 0.9rem 1rem;
            color: var(--text-main, #fff); font-size: 0.78rem; line-height: 1.5;
            animation: apikm-toast-in 0.2s ease;
        }
        @keyframes apikm-toast-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .apikm-fallback-toast-title { font-weight: 900; font-size: 0.82rem; margin-bottom: 0.5rem; color: var(--accent-magenta, #ff007f); display:flex; justify-content:space-between; align-items:center; gap:0.5rem; }
        .apikm-fallback-toast-close { cursor: pointer; color: var(--text-muted,#708590); font-weight: 900; flex-shrink:0; }
        .apikm-fallback-row { display:flex; justify-content: space-between; gap: 0.6rem; padding: 0.2rem 0; border-bottom: 1px dashed #22222a; }
        .apikm-fallback-row:last-of-type { border-bottom: none; }
        .apikm-fallback-model { font-family: monospace; color: var(--text-bright-muted, #a0b5c0); }
        .apikm-fallback-reason { color: #ff8080; flex-shrink: 0; text-align: right; }
        .apikm-fallback-final { margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px solid #22222a; font-weight: 800; color: var(--accent-cyan, #00f3ff); }
    `;
    document.head.appendChild(style);
}

function getFallbackToastWrap() {
    if (typeof document === "undefined") return null;
    let wrap = document.getElementById("apikm-fallback-toast-wrap");
    if (!wrap) {
        wrap = document.createElement("div");
        wrap.id = "apikm-fallback-toast-wrap";
        document.body.appendChild(wrap);
    }
    return wrap;
}

export function notifyModelFallback(attempts, usedModel) {
    if (!attempts || attempts.length === 0) return;

    console.group(`🩺 モデル・フォールバック診断（${attempts.length}件失敗 → ${usedModel || "全滅"}）`);
    attempts.forEach(a => console.warn(`❌ ${a.model} : ${a.reason}`));
    if (usedModel) console.info(`✅ 最終的に使用: ${usedModel}`);
    else console.error("⛔ 登録済みの全モデル・全キーで失敗しました");
    console.groupEnd();

    if (typeof document === "undefined") return;
    injectFallbackToastStyles();
    const wrap = getFallbackToastWrap();
    if (!wrap) return;

    const toast = document.createElement("div");
    toast.className = "apikm-fallback-toast";
    const rows = attempts.map(a => `
        <div class="apikm-fallback-row">
            <span class="apikm-fallback-model">${a.model}</span>
            <span class="apikm-fallback-reason">${a.reason}</span>
        </div>
    `).join("");
    const finalLine = usedModel
        ? `<div class="apikm-fallback-final">→ ${usedModel} で成功</div>`
        : `<div class="apikm-fallback-final" style="color:#ff4545;">→ 全モデル失敗しました</div>`;

    toast.innerHTML = `
        <div class="apikm-fallback-toast-title">
            <span>⚠️ モデル・フォールバック発生</span>
            <span class="apikm-fallback-toast-close">×</span>
        </div>
        ${rows}
        ${finalLine}
    `;
    wrap.appendChild(toast);

    const remove = () => { if (toast.parentNode) toast.parentNode.removeChild(toast); };
    toast.querySelector(".apikm-fallback-toast-close").addEventListener("click", remove);
    setTimeout(remove, 8000);
}

let genericToastStyleInjected = false;

function injectGenericToastStyles() {
    if (genericToastStyleInjected || typeof document === "undefined") return;
    genericToastStyleInjected = true;
    const style = document.createElement("style");
    style.textContent = `
        #apikm-toast-wrap {
            position: fixed; left: 50%; top: 1.2rem; transform: translateX(-50%);
            z-index: 100070; display: flex; flex-direction: column; gap: 0.6rem;
            width: calc(100% - 2.4rem); max-width: 420px; pointer-events: none;
        }
        .apikm-toast {
            pointer-events: auto;
            background: rgba(10,10,18,0.97); border-radius: 14px; padding: 0.85rem 1rem;
            color: var(--text-main, #fff); font-size: 0.85rem; line-height: 1.5; font-weight: 700;
            display: flex; align-items: flex-start; gap: 0.6rem;
            box-shadow: 0 6px 22px rgba(0,0,0,0.45);
            animation: apikm-toast-slide-in 0.2s ease;
            border: 1px solid var(--border-color, #22222a);
        }
        .apikm-toast[data-type="error"] { border-color: #ff4545; box-shadow: 0 0 18px rgba(255,69,69,0.2); }
        .apikm-toast[data-type="success"] { border-color: #00ff9d; box-shadow: 0 0 18px rgba(0,255,157,0.18); }
        .apikm-toast[data-type="info"] { border-color: var(--accent-cyan, #00f3ff); box-shadow: 0 0 18px rgba(0,243,255,0.18); }
        .apikm-toast-icon { flex-shrink: 0; font-size: 1rem; line-height: 1.4; }
        .apikm-toast-msg { flex-grow: 1; white-space: pre-wrap; }
        .apikm-toast-x { cursor: pointer; color: var(--text-muted,#708590); font-weight: 900; flex-shrink: 0; }
        @keyframes apikm-toast-slide-in { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
    `;
    document.head.appendChild(style);
}

function getGenericToastWrap() {
    if (typeof document === "undefined") return null;
    let wrap = document.getElementById("apikm-toast-wrap");
    if (!wrap) {
        wrap = document.createElement("div");
        wrap.id = "apikm-toast-wrap";
        document.body.appendChild(wrap);
    }
    return wrap;
}

export function showToast(message, type = "info", duration = 6000) {
    if (typeof document === "undefined") return () => {};
    injectGenericToastStyles();
    const wrap = getGenericToastWrap();
    if (!wrap) return () => {};

    const icon = type === "error" ? "⚠️" : type === "success" ? "✅" : "💡";
    const toast = document.createElement("div");
    toast.className = "apikm-toast";
    toast.dataset.type = type;
    toast.innerHTML = `
        <span class="apikm-toast-icon">${icon}</span>
        <span class="apikm-toast-msg"></span>
        <span class="apikm-toast-x">×</span>
    `;
    toast.querySelector(".apikm-toast-msg").textContent = message;
    wrap.appendChild(toast);

    const remove = () => { if (toast.parentNode) toast.parentNode.removeChild(toast); };
    toast.querySelector(".apikm-toast-x").addEventListener("click", remove);
    if (duration > 0) setTimeout(remove, duration);
    return remove;
}