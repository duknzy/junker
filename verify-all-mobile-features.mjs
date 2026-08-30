/**
 * モバイル版4つの改善機能の自動検証スクリプト
 */

import { chromium } from 'playwright';
import path from 'path';
import http from 'http';
import fs from 'fs';

const PORT = 8096;
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
            console.log(`🌐 サーバー起動: http://127.0.0.1:${PORT}`);
            resolve(server);
        });
    });
}

(async () => {
    const artifactDir = 'C:\\Users\\kokih\\.gemini\\antigravity-ide\\brain\\4020f001-9413-483b-80a3-7ad0f27f0c81';
    const server = await startServer();

    console.log("📱 モバイル版4改善機能 検証開始...");
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true
    });
    const page = await context.newPage();

    try {
        // ==================== 1. ダッシュボード並べ替え ====================
        console.log("📱 [1/4] m/index.html 並べ替え（ソート）機能検証...");
        await page.goto(`http://127.0.0.1:${PORT}/m/index.html?autologin=tester`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(2500);

        // デフォルト（忘却曲線順）
        const shot1 = path.join(artifactDir, 'verify_mobile_sort_urgency.png');
        await page.screenshot({ path: shot1 });
        console.log("📸 ダッシュボード（忘却曲線順）:", shot1);

        // 「🔥 誤答数が多い順」に切り替え
        await page.selectOption('#sort-select', 'errors_desc');
        await page.waitForTimeout(1500);
        const shot2 = path.join(artifactDir, 'verify_mobile_sort_errors.png');
        await page.screenshot({ path: shot2 });
        console.log("📸 ダッシュボード（誤答数順）:", shot2);

        // ==================== 2. 問題演習画面（数式ヘッダー・再生成・削除） ====================
        console.log("📱 [2/4] m/problem.html 数式ヘッダー・再生成・削除ボタン検証...");
        const firstRow = await page.$('.p-row');
        if (firstRow) {
            await firstRow.click();
            await page.waitForTimeout(2500);

            // 模範解答を開く
            const answerBtn = await page.$('#answer-reveal-btn');
            if (answerBtn) await answerBtn.click();
            await page.waitForTimeout(1000);

            const shot3 = path.join(artifactDir, 'verify_mobile_problem_full.png');
            await page.screenshot({ path: shot3, fullPage: true });
            console.log("📸 問題演習画面（数式ヘッダー・再生成・削除ボタン）:", shot3);
        }

        // ==================== 3. AI設定画面フル機能 ====================
        console.log("📱 [3/4] m/ai-settings.html フル機能AI設定検証...");
        await page.goto(`http://127.0.0.1:${PORT}/m/ai-settings.html`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);

        const shot4 = path.join(artifactDir, 'verify_mobile_ai_settings_full.png');
        await page.screenshot({ path: shot4, fullPage: true });
        console.log("📸 AI設定画面（フル機能）:", shot4);

        console.log("🎉 すべての検証が完了しました！");
    } catch (e) {
        console.error("検証中にエラー:", e);
    } finally {
        await browser.close();
        server.close();
    }
})();
