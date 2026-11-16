import type {
  BunkeiProgress,
  DrillSession,
  Flashcard,
  Lesson,
  Problem,
  ReviewLog,
  SprintRecord,
} from '../data/types';

export const SYNC_VERSION = 1;

/**
 * クラウドへ保存する構造化データ。
 * 画像（ProblemImage）は端末ローカルに留めるため含めない。
 */
export interface SyncSnapshot {
  version: number;
  updatedAt: string;
  deviceId: string;
  problems: Problem[];
  reviewLogs: ReviewLog[];
  lessons: Lesson[];
  drills: DrillSession[];
  sprints: SprintRecord[];
  cards: Flashcard[];
  bunkeiProgress: BunkeiProgress[];
}

function parseTime(iso?: string): number {
  if (!iso) return 0;
  const time = Date.parse(iso);
  return Number.isFinite(time) ? time : 0;
}

const problemStamp = (problem: Problem) =>
  parseTime(problem.updatedAt || problem.createdAt);
const lessonStamp = (lesson: Lesson) =>
  parseTime(lesson.updatedAt || lesson.createdAt);
const drillStamp = (drill: DrillSession) =>
  parseTime(drill.updatedAt || drill.completedAt || drill.createdAt);
const reviewLogStamp = (log: ReviewLog) => parseTime(log.reviewedAt);
const sprintStamp = (sprint: SprintRecord) => parseTime(sprint.createdAt);
const cardStamp = (card: Flashcard) =>
  parseTime(card.updatedAt || card.createdAt);
const bunkeiStamp = (prog: BunkeiProgress) => parseTime(prog.updatedAt);

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function hasId(value: unknown): value is { id: string } {
  return Boolean(
    value &&
      typeof value === 'object' &&
      typeof (value as { id?: unknown }).id === 'string',
  );
}

function validRecords<T>(value: unknown): T[] {
  return asArray<T>(value).filter(hasId);
}

export function emptySnapshot(deviceId: string): SyncSnapshot {
  return {
    version: SYNC_VERSION,
    updatedAt: new Date(0).toISOString(),
    deviceId,
    problems: [],
    reviewLogs: [],
    lessons: [],
    drills: [],
    sprints: [],
    cards: [],
    bunkeiProgress: [],
  };
}

/**
 * Firebase から読んだ値（配列が null になっている場合がある）を
 * 安全なスナップショットへ正規化する。
 */
export function normalizeSnapshot(value: unknown): SyncSnapshot | null {
  if (!value || typeof value !== 'object') return null;
  const record = value as Record<string, unknown>;

  return {
    version:
      typeof record.version === 'number' ? record.version : SYNC_VERSION,
    updatedAt:
      typeof record.updatedAt === 'string'
        ? record.updatedAt
        : new Date(0).toISOString(),
    deviceId: typeof record.deviceId === 'string' ? record.deviceId : '',
    problems: validRecords<Problem>(record.problems),
    reviewLogs: validRecords<ReviewLog>(record.reviewLogs),
    lessons: validRecords<Lesson>(record.lessons),
    drills: validRecords<DrillSession>(record.drills),
    sprints: validRecords<SprintRecord>(record.sprints),
    cards: validRecords<Flashcard>(record.cards),
    bunkeiProgress: validRecords<BunkeiProgress>(record.bunkeiProgress),
  };
}

function mergeTable<T extends { id: string }>(
  local: T[],
  remote: T[],
  stamp: (item: T) => number,
): T[] {
  const byId = new Map<string, T>();
  for (const item of remote) byId.set(item.id, item);

  for (const item of local) {
    const current = byId.get(item.id);
    // 同時刻ならローカルを優先（端末間で内容が違う場合の決定的な解決）
    if (!current || stamp(item) >= stamp(current)) {
      byId.set(item.id, item);
    }
  }

  return [...byId.values()];
}

/**
 * ローカルとリモートを ID 単位でマージする。
 * 削除は deletedAt の tombstone を通常のレコードとして比較する。
 */
export function mergeSnapshots(
  local: SyncSnapshot,
  remote: SyncSnapshot | null,
  now = new Date().toISOString(),
): SyncSnapshot {
  if (!remote) {
    return { ...local, version: SYNC_VERSION, updatedAt: now };
  }

  return {
    version: SYNC_VERSION,
    updatedAt: now,
    deviceId: local.deviceId || remote.deviceId,
    problems: mergeTable(local.problems, remote.problems, problemStamp),
    reviewLogs: mergeTable(
      local.reviewLogs,
      remote.reviewLogs,
      reviewLogStamp,
    ),
    lessons: mergeTable(local.lessons, remote.lessons, lessonStamp),
    drills: mergeTable(local.drills, remote.drills, drillStamp),
    sprints: mergeTable(local.sprints, remote.sprints, sprintStamp),
    cards: mergeTable(local.cards, remote.cards, cardStamp),
    bunkeiProgress: mergeTable(
      local.bunkeiProgress,
      remote.bunkeiProgress,
      bunkeiStamp,
    ),
  };
}

/**
 * Realtime Database は undefined を含む値を拒否するため、
 * JSON 経由で取り除いてから書き込む。
 */
export function toFirebaseValue(snapshot: SyncSnapshot): SyncSnapshot {
  return JSON.parse(JSON.stringify(snapshot)) as SyncSnapshot;
}
