/**
 * Flora モバイル版 (/m/) 総合インタラクティブ検証スクリプト
 */

import { chromium } from 'playwright';
import path from 'path';
import http from 'http';
import fs from 'fs';

const PORT = 8093;
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

    console.log("📱 Flora モバイル版 インタラクティブ検証開始...");
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true
    });
    const page = await context.newPage();

    try {
        // 1. ダッシュボード ＋ 問題登録モーダル
        console.log("📱 [1/4] m/index.html & 写真登録モーダル...");
        await page.goto(`http://127.0.0.1:${PORT}/m/index.html?autologin=tester`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(2500);
        // モーダルを直接開く
        await page.evaluate(() => {
            const m = document.getElementById('add-prob-modal');
            if (m) m.style.display = 'flex';
        });
        await page.waitForTimeout(500);
        const shot1 = path.join(artifactDir, 'verify_mobile_add_prob_modal.png');
        await page.screenshot({ path: shot1 });
        console.log("📸 問題登録モーダル:", shot1);

        // 2. 授業一覧 ＋ 授業作成ウィザード
        console.log("📱 [2/4] m/lesson.html & 授業作成ウィザード...");
        await page.goto(`http://127.0.0.1:${PORT}/m/lesson.html?autologin=tester`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(2500);
        await page.evaluate(() => {
            const m = document.getElementById('create-modal');
            if (m) m.style.display = 'flex';
        });
        await page.waitForTimeout(500);
        const shot2 = path.join(artifactDir, 'verify_mobile_create_lesson_modal.png');
        await page.screenshot({ path: shot2 });
        console.log("📸 授業作成ウィザード:", shot2);

        // 3. 参考書 ＋ 単元登録モーダル
        console.log("📱 [3/4] m/refbook.html & 参考書登録モーダル...");
        await page.goto(`http://127.0.0.1:${PORT}/m/refbook.html?autologin=tester`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(2500);
        await page.evaluate(() => {
            const m = document.getElementById('rb-register-modal');
            if (m) m.style.display = 'flex';
        });
        await page.waitForTimeout(500);
        const shot3 = path.join(artifactDir, 'verify_mobile_add_refbook_modal.png');
        await page.screenshot({ path: shot3 });
        console.log("📸 参考書登録モーダル:", shot3);

        // 4. 設定画面（ボトムナビから）
        console.log("📱 [4/4] m/ai-settings.html...");
        await page.goto(`http://127.0.0.1:${PORT}/m/ai-settings.html?autologin=tester`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);
        const shot4 = path.join(artifactDir, 'verify_mobile_settings_tab.png');
        await page.screenshot({ path: shot4 });
        console.log("📸 設定タブ:", shot4);

        console.log("🎉 全インタラクティブ検証が正常終了しました！");
    } finally {
        await browser.close();
        server.close();
    }
})();
