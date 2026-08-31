import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  signInAnonymously,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getDatabase,
  ref,
  set,
  get,
  onValue,
  Unsubscribe,
} from 'firebase/database';
import {
  MacroPlan,
  StudyCloudData,
  StudySessionLog,
  TaskItem,
  TodoItem,
  UserProfile,
} from '../types';

export const firebaseConfig = {
  apiKey: "AIzaSyB55MdhpjJizQaLEdRu-XhBVJ4PqrHsAyY",
  authDomain: "buturi-2449e.firebaseapp.com",
  databaseURL: "https://buturi-2449e-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "buturi-2449e",
  storageBucket: "buturi-2449e.appspot.com",
  messagingSenderId: "976306696124",
  appId: "1:976306696124:web:e455c1953544bff5c345b9",
};

// Initialize Firebase once
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const googleProvider = new GoogleAuthProvider();

const FALLBACK_UID_KEY = 'studyclock_persistent_cloud_uid';

export function getFallbackCloudUid(): string {
  try {
    let uid = localStorage.getItem(FALLBACK_UID_KEY);
    if (!uid) {
      uid = 'operator_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now();
      localStorage.setItem(FALLBACK_UID_KEY, uid);
    }
    return uid;
  } catch {
    return 'operator_flora_default';
  }
}

// Ensure Auth or Anonymous sign-in
export async function ensureFirebaseAuth(): Promise<User | null> {
  if (auth.currentUser) return auth.currentUser;
  try {
    const cred = await signInAnonymously(auth);
    return cred.user;
  } catch (err) {
    console.warn('Anonymous auth unavailable, using persistent fallback cloud UID:', err);
    return null;
  }
}

// Google Sign In
export async function loginWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
}

// Sign Out
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign-Out Error:', error);
    throw error;
  }
}

// Subscribe to Auth State
export function onUserAuthStateChanged(callback: (user: User | null) => void): Unsubscribe {
  return onAuthStateChanged(auth, callback);
}

// Helper to sanitize payload for Firebase (removes undefined)
function sanitizePayload<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

// Save Full Study State to Firebase Cloud
export async function saveStudyDataToCloud(uid: string, data: Partial<StudyCloudData>): Promise<void> {
  const targetUid = uid || getFallbackCloudUid();
  try {
    const dataRef = ref(database, `users/${targetUid}/studyclock_data`);
    const payload = sanitizePayload({
      ...data,
      lastUpdated: Date.now(),
    });
    await set(dataRef, payload);
  } catch (error) {
    console.error('Failed to save study data to Firebase:', error);
    throw error;
  }
}

// Load Full Study State from Firebase Cloud
export async function loadStudyDataFromCloud(uid: string): Promise<StudyCloudData | null> {
  const targetUid = uid || getFallbackCloudUid();
  try {
    const dataRef = ref(database, `users/${targetUid}/studyclock_data`);
    const snapshot = await get(dataRef);
    if (snapshot.exists()) {
      const val = snapshot.val();
      return val as StudyCloudData;
    }
    return null;
  } catch (error) {
    console.error('Failed to load study data from Firebase:', error);
    return null;
  }
}

// Real-time Subscribe to Full Study State in Firebase Cloud
export function subscribeToCloudStudyData(
  uid: string,
  callback: (data: StudyCloudData, exists: boolean) => void
): Unsubscribe {
  const targetUid = uid || getFallbackCloudUid();
  const dataRef = ref(database, `users/${targetUid}/studyclock_data`);
  return onValue(
    dataRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        callback(val as StudyCloudData, true);
      } else {
        callback({}, false);
      }
    },
    (error) => {
      console.error('Realtime StudyCloud listener error:', error);
    }
  );
}

// Save Todos to Firebase Cloud
export async function saveTodosToCloud(uid: string, todos: TodoItem[]): Promise<void> {
  const targetUid = uid || getFallbackCloudUid();
  try {
    const todosRef = ref(database, `users/${targetUid}/studyclock_data/todos`);
    const sanitized = sanitizePayload(todos);
    await set(todosRef, sanitized);
  } catch (error) {
    console.error('Failed to save todos to Firebase:', error);
  }
}

// Save Daily Tasks to Firebase Cloud
export async function saveDailyTasksToCloud(
  uid: string,
  dateStr: string,
  tasks: TaskItem[]
): Promise<void> {
  const targetUid = uid || getFallbackCloudUid();
  try {
    const taskRef = ref(database, `users/${targetUid}/studyclock_data/dailyTasks/${dateStr}`);
    const sanitized = sanitizePayload(tasks);
    await set(taskRef, sanitized);
  } catch (error) {
    console.error('Failed to save daily tasks to Firebase:', error);
  }
}

// Save MacroPlan to Firebase Cloud
export async function saveMacroPlanToCloud(uid: string, plan: MacroPlan): Promise<void> {
  const targetUid = uid || getFallbackCloudUid();
  try {
    const planRef = ref(database, `users/${targetUid}/studyclock_data/macroPlan`);
    const sanitized = sanitizePayload(plan);
    await set(planRef, sanitized);
  } catch (error) {
    console.error('Failed to save macro plan to Firebase:', error);
  }
}

// Save UserProfile to Firebase Cloud
export async function saveUserProfileToCloud(uid: string, profile: UserProfile): Promise<void> {
  const targetUid = uid || getFallbackCloudUid();
  try {
    const profileRef = ref(database, `users/${targetUid}/studyclock_data/userProfile`);
    const sanitized = sanitizePayload(profile);
    await set(profileRef, sanitized);
  } catch (error) {
    console.error('Failed to save profile to Firebase:', error);
  }
}

// Save SessionLogs to Firebase Cloud
export async function saveSessionLogsToCloud(uid: string, logs: StudySessionLog[]): Promise<void> {
  const targetUid = uid || getFallbackCloudUid();
  try {
    const logsRef = ref(database, `users/${targetUid}/studyclock_data/sessionLogs`);
    const sanitized = sanitizePayload(logs);
    await set(logsRef, sanitized);
  } catch (error) {
    console.error('Failed to save session logs to Firebase:', error);
  }
}

// Save Onboarding Status to Firebase Cloud
export async function saveOnboardingStatusToCloud(uid: string, completed: boolean): Promise<void> {
  const targetUid = uid || getFallbackCloudUid();
  try {
    const statusRef = ref(database, `users/${targetUid}/studyclock_data/onboardingCompleted`);
    await set(statusRef, completed);
  } catch (error) {
    console.error('Failed to save onboarding status to Firebase:', error);
  }
}

