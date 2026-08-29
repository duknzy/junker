import { chromium } from 'playwright';
import path from 'path';

(async () => {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    const artifactDir = 'C:\\Users\\kokih\\.gemini\\antigravity-ide\\brain\\4020f001-9413-483b-80a3-7ad0f27f0c81';

    // 事前にダミーキーを入れてモーダルが出ないようにする
    await page.goto('http://127.0.0.1:8000/lesson.html?autologin=tester');
    await page.evaluate(() => {
        localStorage.setItem('RE_MIND_GEMINI_KEYS', JSON.stringify(['AIzaSyDummyKeyForTestingOnly']));
        localStorage.setItem('RE_MIND_DEEPSEEK_KEYS', JSON.stringify(['sk-dummyKeyForTestingOnly']));
    });

    console.log("🌐 Reloading lesson.html and setting up mock lesson session...");
    await page.goto('http://127.0.0.1:8000/lesson.html?autologin=tester', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // テスト用の授業受講画面を強制表示してレイアウトを検証
    await page.evaluate(() => {
        // 授業受講ビューを表示
        document.getElementById('view-list').classList.add('hidden');
        const viewLesson = document.getElementById('view-lesson');
        viewLesson.classList.remove('hidden');

        document.getElementById('lesson-title-display').textContent = '情報社会の問題解決とセキュリティ・暗号化技術';
        document.getElementById('part-progress-display').textContent = '4/4';

        const transcript = document.getElementById('chat-transcript');
        transcript.innerHTML = `
            <div class="chat-bubble bubble-ai">
                <b>🧑‍🏫 AI講師：</b><br>
                正解はね、暗号化に使うのは【Bさんの公開鍵】一択だよ！<br><br>
                「なんで受取人（Bさん）の公開鍵を使うのか」、イメージで考えたら秒で納得できるから整理するね！<br><br>
                ■ なぜ「Bさんの公開鍵」で暗号化するの？<br>
                今回の目的に「Bさんだけに読んでもらえる秘密の手紙を送ること」じゃん？<br>
                だから、手紙を入れる鍵付きポストは「Bさん専用のポスト」じゃなきゃダメなんだよ！<br><br>
                ①【暗号化（鍵をかける）】<br>
                Aさんは、誰でも使える「Bさんの公開鍵」を使ってデータに鍵をかける！（Bさん宛のポストに入れるイメージ）<br><br>
                ②【復号（鍵を開ける）】<br>
                届いたデータを開けられるのは、世界で唯一「Bさん自身の秘密鍵」を持っているBさんだけ！！<br><br>
                ★超重要な見抜き方の定石！<br>
                「送りたい相手（受取人）の公開鍵でロックして、相手が自分の秘密鍵で解除する！」<br>
                コレさえ頭に入れておけば、誰のどの鍵を使うか迷うことは一切なくなるよ！最高〜！
            </div>
            <div class="chat-bubble bubble-user">
                なるほど！相手の公開鍵でロックして、相手の秘密鍵で開けるんですね！
            </div>
            <div class="chat-bubble bubble-ai">
                <b>🧑‍🏫 AI講師：</b><br>
                その通り！完璧な理解だよ！これで公開鍵暗号方式はバッチリマスターだね✨
            </div>
        `;

        document.getElementById('completed-banner').classList.remove('hidden');
    });

    await page.waitForTimeout(600);

    const activeLessonScreenshot = path.join(artifactDir, 'screenshot_lesson_active_perfect.png');
    await page.screenshot({ path: activeLessonScreenshot, fullPage: false });
    console.log("📸 Active Lesson Layout screenshot saved:", activeLessonScreenshot);

    await browser.close();
    console.log("✅ Verified!");
})();
