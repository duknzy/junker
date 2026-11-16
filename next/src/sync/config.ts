/**
 * Firebase の Web 設定。
 *
 * Firebase の Web API キーはクライアントに公開される前提で、
 * Realtime Database の Security Rules と Authentication の
 * 許可ドメインで保護する。
 *
 * `VITE_FIREBASE_*` を設定すると上書きできる。未設定の場合は
 * 既存の buturi2 プロジェクトを使う（旧アプリと同じ Google アカウント）。
 */
const env = import.meta.env;

export const FIREBASE_CONFIG = {
  apiKey: env.VITE_FIREBASE_API_KEY || 'AIzaSyA7JuY44CleWYIxuqlF11ibHn_ml5nH69Q',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || 'buturi2.firebaseapp.com',
  databaseURL:
    env.VITE_FIREBASE_DATABASE_URL ||
    'https://buturi2-default-rtdb.asia-southeast1.firebasedatabase.app/',
  projectId: env.VITE_FIREBASE_PROJECT_ID || 'buturi2',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || 'buturi2.firebasestorage.app',
  messagingSenderId:
    env.VITE_FIREBASE_MESSAGING_SENDER_ID || '203866225339',
  appId:
    env.VITE_FIREBASE_APP_ID ||
    '1:203866225339:web:ae84420cfd2f4c2ec0079e',
};

export function isFirebaseConfigured(): boolean {
  return Boolean(
    FIREBASE_CONFIG.apiKey &&
      FIREBASE_CONFIG.authDomain &&
      FIREBASE_CONFIG.databaseURL &&
      FIREBASE_CONFIG.projectId &&
      FIREBASE_CONFIG.appId,
  );
}
