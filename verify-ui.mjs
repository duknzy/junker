/**
 * Flora 新機能 総合検証スクリプト (クリーンキャプチャ版)
 */

import { chromium } from 'playwright';
import path from 'path';
import http from 'http';
import fs from 'fs';

const GEMINI_API_KEY = "AIzaSyAQ.Ab8RN6K6YOIylSci9RtSJogqe2o3PgyLMWF67sXD67jyoIldtQ";
const PORT = 8086;
const BASE_DIR = 'c:\\Users\\kokih\\OneDrive\\デスクトップ\\大改造計画';

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.ico': 'image/x-icon',
    '.svg': 'image/svg+xml'
};

function startServer() {
    const server = http.createServer((req, res) => {
        let reqPath = req.url.split('?')[0];
        if (reqPath === '/') reqPath = '/index.html';
        const filePath = path.join(BASE_DIR, decodeURIComponent(reqPath));

        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('Not Found');
                return;
            }
            const ext = path.extname(filePath).toLowerCase();
            const contentType = MIME_TYPES[ext] || 'application/octet-stream';
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        });
    });

    return new Promise(resolve => {
        server.listen(PORT, '127.0.0.1', () => {
            console.log(`🌐 組み込みHTTPサーバー起動: http://127.0.0.1:${PORT}`);
            resolve(server);
        });
    });
}

(async () => {
    const artifactDir = 'C:\\Users\\kokih\\.gemini\\antigravity-ide\\brain\\4020f001-9413-483b-80a3-7ad0f27f0c81';
    const server = await startServer();

    console.log("🚀 Flora 新機能総合検証開始...");
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    try {
        // 先にキーを入れておく
        await page.goto(`http://127.0.0.1:${PORT}/index.html?autologin=tester`, { waitUntil: 'networkidle' });
        await page.evaluate((key) => {
            localStorage.setItem('RE_MIND_GEMINI_KEYS', JSON.stringify([key]));
        }, GEMINI_API_KEY);

        // 1. answer-check.html（11教科ボタン・ヘッダークリーン化）
        console.log("🌐 [1/3] answer-check.html...");
        await page.goto(`http://127.0.0.1:${PORT}/answer-check.html?autologin=tester`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(1500);
        await page.evaluate(() => {
            const modal = document.getElementById('api-key-modal');
            if (modal) modal.style.display = 'none';
        });
        await page.waitForTimeout(500);
        const answerCheckShot = path.join(artifactDir, 'verify_answer_check_clean.png');
        await page.screenshot({ path: answerCheckShot });
        console.log("📸 クイック答え合わせ(11教科)キャプチャ:", answerCheckShot);

        // 2. refbook.html（ヘッダークリーン化確認）
        console.log("🌐 [2/3] refbook.html...");
        await page.goto(`http://127.0.0.1:${PORT}/refbook.html?autologin=tester`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(1500);
        await page.evaluate(() => {
            const modal = document.getElementById('api-key-modal');
            if (modal) modal.style.display = 'none';
        });
        await page.waitForTimeout(500);
        const refbookShot = path.join(artifactDir, 'verify_refbook_clean.png');
        await page.screenshot({ path: refbookShot });
        console.log("📸 参考書一問一答(クリーンヘッダー)キャプチャ:", refbookShot);

        // 3. ai-settings.html（機能カードスクロール撮影）
        console.log("🌐 [3/3] ai-settings.html (編集カード優先順位)...");
        await page.goto(`http://127.0.0.1:${PORT}/ai-settings.html`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(1500);

        // テスト用にモデルチップをクリックして優先順位リストを作成
        await page.evaluate(() => {
            const chip1 = document.querySelector('[data-chip-model="subject_analysis:gemini-3.7-flash"]');
            const chip2 = document.querySelector('[data-chip-model="subject_analysis:gemini-2.5-flash"]');
            const chip3 = document.querySelector('[data-chip-model="subject_analysis:gemini-3.5-flash-lite"]');
            if (chip1) chip1.click();
            if (chip2) chip2.click();
            if (chip3) chip3.click();

            // カードが見える位置までスクロール
            const card = document.getElementById('feature-card-subject_analysis');
            if (card) card.scrollIntoView();
        });
        await page.waitForTimeout(600);

        const aiSettingsCardShot = path.join(artifactDir, 'verify_ai_settings_card.png');
        await page.screenshot({ path: aiSettingsCardShot });
        console.log("📸 AI設定(編集カード優先順位UI)キャプチャ:", aiSettingsCardShot);

        console.log("🎉 すべてのクリーンキャプチャが完了しました！");
    } finally {
        await browser.close();
        server.close();
    }
})();
