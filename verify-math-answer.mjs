/**
 * 数式レンダリング & 模範解答表示のモバイル検証スクリプト
 */

import { chromium } from 'playwright';
import path from 'path';
import http from 'http';
import fs from 'fs';

const PORT = 8095;
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

    console.log("📱 数式 & 模範解答 モバイル検証開始...");
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true
    });
    const page = await context.newPage();

    try {
        // 1. ダッシュボードの数式レンダリング検証
        console.log("📱 [1/2] m/index.html 数式レンダリング検証...");
        await page.goto(`http://127.0.0.1:${PORT}/m/index.html?autologin=tester`, { waitUntil: 'networkidle' });
        // MathJaxの描画完了を待つ
        await page.waitForTimeout(3000);
        const shot1 = path.join(artifactDir, 'verify_mobile_math_dashboard.png');
        await page.screenshot({ path: shot1 });
        console.log("📸 ダッシュボード数式スクリーンショット:", shot1);

        // 2. 問題画面（問題を選択して模範解答・定石を開く）
        console.log("📱 [2/2] m/problem.html 模範解答・定石検証...");
        // 最初の問題行をクリック
        const firstRow = await page.$('.p-row');
        if (firstRow) {
            await firstRow.click();
            await page.waitForTimeout(2500);

            // 「⚠️ 罠＆定石パターンを見る」を開く
            const trapBtn = await page.$('#trap-reveal-btn');
            if (trapBtn) await trapBtn.click();

            // 「📖 模範解答を見る」を開く
            const answerBtn = await page.$('#answer-reveal-btn');
            if (answerBtn) await answerBtn.click();

            await page.waitForTimeout(1500);

            const shot2 = path.join(artifactDir, 'verify_mobile_math_problem.png');
            await page.screenshot({ path: shot2 });
            console.log("📸 問題演習画面（模範解答展開）:", shot2);
        }

        console.log("🎉 検証完了！");
    } finally {
        await browser.close();
        server.close();
    }
})();
