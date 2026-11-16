import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { enableSyncForDev } from './engine';
import { getFirebase } from './firebase';

type DevWindow = Window & {
  __floraDevSignIn?: (
    email?: string,
    password?: string,
  ) => Promise<string | null>;
  __floraDevToken?: () => Promise<string | null>;
  __floraDevSeedLegacy?: () => Promise<number>;
};

const TINY_PNG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAEklEQVR42mNk+M9QzwAEjDAGACCDAv8cI7IoAAAAAElFTkSuQmCC';

/**
 * Firebase Emulator での動作確認用。DEV かつ
 * VITE_FIREBASE_USE_EMULATOR=1 のときだけ main.tsx から読み込む。
 */
export function installDevAuth(): void {
  const devWindow = window as DevWindow;

  devWindow.__floraDevSignIn = async (
    email = 'test@flora.local',
    password = 'flora-test',
  ) => {
    await enableSyncForDev();
    const { auth } = await getFirebase();
    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      return credential.user.uid;
    } catch {
      const credential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      return credential.user.uid;
    }
  };

  devWindow.__floraDevToken = async () => {
    const { auth } = await getFirebase();
    return auth.currentUser ? auth.currentUser.getIdToken() : null;
  };

  devWindow.__floraDevSeedLegacy = async () => {
    const { auth, database } = await getFirebase();
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error('先にログインしてください。');

    const now = new Date().toISOString();
    await set(ref(database, `users/${uid}/problems`), {
      LEGACY_1: {
        id: 'LEGACY_1',
        title: '放物線 y = x^2 - 4x + 5 の頂点の座標を求めよ。',
        short_title: '二次関数の平方完成',
        subject: '数学',
        field: '二次関数',
        answerFormula: '(2, 1)',
        trap_description: '定数項の符号ミスに注意',
        strategyPattern: 'xの係数の半分で平方完成する',
        mnemonic: '半分にして二乗を引く',
        insight: '軸 x=2 を先に確認すると検算が速い',
        isPinned: true,
        errorCount: 2,
        imageCount: 1,
        createdAt: now,
        lastAttemptAt: now,
      },
      LEGACY_2: {
        id: 'LEGACY_2',
        title: '質量 2.0 kg の物体に 6.0 N の力を加えたときの加速度を求めよ。',
        short_title: '運動方程式の基礎',
        subject: '物理',
        field: '力学',
        answerFormula: '3.0 m/s^2',
        trap_description: '単位換算の忘れ',
        strategyPattern: 'ma = F に代入する',
        mnemonic: '',
        errorCount: 1,
        imageCount: 0,
        images: [TINY_PNG],
        createdAt: now,
      },
    });

    await set(ref(database, `users/${uid}/problemImages/LEGACY_1`), {
      images: [TINY_PNG],
    });

    await set(ref(database, `users/${uid}/lessons/LESSON_1`), {
      title: '微積分の極意',
      subject: '数学',
      topicKey: '微分・積分',
      lessonMemos: [
        {
          id: 'memo_1',
          text: '3次関数の接線の本数は「接点の個数」に言い換える！',
          subject: '数学',
          pinned: true,
          createdAt: now,
          updatedAt: now,
        },
      ],
    });

    await set(ref(database, `users/${uid}/bunkeiMathProgress`), {
      1: { status: 'cleared', timestamp: now },
      2: { status: 'mistake', timestamp: now },
    });

    await set(ref(database, `users/${uid}/bunkeiMathInsights`), {
      reidai_2: {
        memo: '絶対値の中の符号変化で場合分けし、境界値の含め方を統一する。',
        updatedAt: now,
        problemId: 2,
        mode: 'reidai',
      },
    });

    return 5;
  };
}
