import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Database } from 'firebase/database';
import { FIREBASE_CONFIG, isFirebaseConfigured } from './config';

export interface FirebaseBundle {
  app: FirebaseApp;
  auth: Auth;
  database: Database;
}

let bundlePromise: Promise<FirebaseBundle> | null = null;

async function createBundle(): Promise<FirebaseBundle> {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase の設定がありません。');
  }

  const [{ getApp, getApps, initializeApp }, authModule, databaseModule] =
    await Promise.all([
      import('firebase/app'),
      import('firebase/auth'),
      import('firebase/database'),
    ]);

  const app = getApps().length > 0 ? getApp() : initializeApp(FIREBASE_CONFIG);
  const auth = authModule.getAuth(app);
  const database = databaseModule.getDatabase(app);

  if (
    import.meta.env.DEV &&
    import.meta.env.VITE_FIREBASE_USE_EMULATOR === '1'
  ) {
    authModule.connectAuthEmulator(auth, 'http://127.0.0.1:9099', {
      disableWarnings: true,
    });
    databaseModule.connectDatabaseEmulator(database, '127.0.0.1', 9000);
  }

  return { app, auth, database };
}

/** Firebase SDK は初回利用時だけ読み込む。 */
export function getFirebase(): Promise<FirebaseBundle> {
  bundlePromise ??= createBundle().catch((error) => {
    bundlePromise = null;
    throw error;
  });
  return bundlePromise;
}
