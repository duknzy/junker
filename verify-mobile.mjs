/**
 * Flora モバイル版 (/m/) 総合検証スクリプト (APIキー注入・クリーン版)
 */

import { chromium } from 'playwright';
import path from 'path';
import http from 'http';
import fs from 'fs';

const PORT = 8091;
const BASE_DIR = 'c:\\Users\\kokih\\OneDrive\\デスクトップ\\大改造計画';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

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

    console.log("📱 Flora モバイル版 (/m/) 検証開始...");
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true
    });
    const page = await context.newPage();

    try {
        // 先に localStorage にキーを注入
        await page.goto(`http://127.0.0.1:${PORT}/index.html?autologin=tester`, { waitUntil: 'networkidle' });
        await page.evaluate((key) => {
            localStorage.setItem('RE_MIND_GEMINI_KEYS', JSON.stringify([key]));
        }, GEMINI_API_KEY);

        // 1. m/index.html (ダッシュボード)
        console.log("📱 [1/6] m/index.html...");
        await page.goto(`http://127.0.0.1:${PORT}/m/index.html?autologin=tester`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);
        await page.evaluate(() => {
            const m = document.getElementById('api-key-modal');
            if (m) m.style.display = 'none';
        });
        const shot1 = path.join(artifactDir, 'verify_mobile_dashboard_clean.png');
        await page.screenshot({ path: shot1 });
        console.log("📸 ダッシュボード:", shot1);

        // 2. m/problem.html (問題演習)
        console.log("📱 [2/6] m/problem.html...");
        await page.goto(`http://127.0.0.1:${PORT}/m/problem.html?id=CUSTOM_1787993800000&autologin=tester`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);
        await page.evaluate(() => {
            const m = document.getElementById('api-key-modal');
            if (m) m.style.display = 'none';
        });
        const shot2 = path.join(artifactDir, 'verify_mobile_problem_clean.png');
        await page.screenshot({ path: shot2 });
        console.log("📸 問題演習:", shot2);

        // 3. m/refbook.html (参考書一問一答)
        console.log("📱 [3/6] m/refbook.html...");
        await page.goto(`http://127.0.0.1:${PORT}/m/refbook.html?autologin=tester`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);
        await page.evaluate(() => {
            const m = document.getElementById('api-key-modal');
            if (m) m.style.display = 'none';
        });
        const shot3 = path.join(artifactDir, 'verify_mobile_refbook_clean.png');
        await page.screenshot({ path: shot3 });
        console.log("📸 参考書一問一答:", shot3);

        // 4. m/lesson.html (授業モード)
        console.log("📱 [4/6] m/lesson.html...");
        await page.goto(`http://127.0.0.1:${PORT}/m/lesson.html?autologin=tester`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);
        await page.evaluate(() => {
            const m = document.getElementById('api-key-modal');
            if (m) m.style.display = 'none';
        });
        const shot4 = path.join(artifactDir, 'verify_mobile_lesson_clean.png');
        await page.screenshot({ path: shot4 });
        console.log("📸 授業モード:", shot4);

        // 5. m/answer-check.html (クイック答え合わせ)
        console.log("📱 [5/6] m/answer-check.html...");
        await page.goto(`http://127.0.0.1:${PORT}/m/answer-check.html?autologin=tester`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(1500);
        await page.evaluate(() => {
            const m = document.getElementById('api-key-modal');
            if (m) m.style.display = 'none';
        });
        const shot5 = path.join(artifactDir, 'verify_mobile_answer_check_clean.png');
        await page.screenshot({ path: shot5 });
        console.log("📸 クイック答え合わせ:", shot5);

        // 6. m/timeline.html (歴史年表)
        console.log("📱 [6/6] m/timeline.html...");
        await page.goto(`http://127.0.0.1:${PORT}/m/timeline.html?autologin=tester`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(1500);
        await page.evaluate(() => {
            const m = document.getElementById('api-key-modal');
            if (m) m.style.display = 'none';
        });
        const shot6 = path.join(artifactDir, 'verify_mobile_timeline_clean.png');
        await page.screenshot({ path: shot6 });
        console.log("📸 歴史年表:", shot6);

        console.log("🎉 モバイル版の全画面クリーンキャプチャが完了しました！");
    } finally {
        await browser.close();
        server.close();
    }
})();
