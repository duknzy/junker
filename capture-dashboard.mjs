import { chromium } from 'playwright';
import path from 'path';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

(async () => {
    const artifactDir = 'C:\\Users\\kokih\\.gemini\\antigravity-ide\\brain\\4020f001-9413-483b-80a3-7ad0f27f0c81';
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    // 最初にキーを入れておく
    await page.goto('http://127.0.0.1:8000/index.html?autologin=tester');
    await page.evaluate((key) => {
        localStorage.setItem('RE_MIND_GEMINI_KEYS', JSON.stringify([key]));
    }, GEMINI_API_KEY);

    await page.goto('http://127.0.0.1:8000/index.html?autologin=tester', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const dashCleanScreenshot = path.join(artifactDir, 'debug_dashboard_clean_seeded.png');
    await page.screenshot({ path: dashCleanScreenshot });
    console.log("📸 ダッシュボード完全キャプチャ保存:", dashCleanScreenshot);

    await browser.close();
})();
