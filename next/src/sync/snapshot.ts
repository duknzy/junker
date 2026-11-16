import { db } from '../data/db';
import { SYNC_VERSION, type SyncSnapshot } from './merge';

export async function readLocalSnapshot(
  deviceId: string,
): Promise<SyncSnapshot> {
  const [
    problems,
    reviewLogs,
    lessons,
    drills,
    sprints,
    cards,
    bunkeiProgress,
  ] = await Promise.all([
    db.problems.toArray(),
    db.reviewLogs.toArray(),
    db.lessons.toArray(),
    db.drills.toArray(),
    db.sprints.toArray(),
    db.cards.toArray(),
    db.bunkeiProgress.toArray(),
  ]);

  return {
    version: SYNC_VERSION,
    updatedAt: new Date().toISOString(),
    deviceId,
    problems,
    reviewLogs,
    lessons,
    drills,
    sprints,
    cards,
    bunkeiProgress,
  };
}

function diffByIdAndTimestamp<T extends { id: string }>(
  nextList: T[],
  prevList: T[] | undefined,
  getTime: (item: T) => string,
): T[] {
  if (!prevList || prevList.length === 0) return nextList;
  const prevMap = new Map<string, string>();
  for (const item of prevList) {
    prevMap.set(item.id, getTime(item));
  }
  return nextList.filter((item) => prevMap.get(item.id) !== getTime(item));
}

/**
 * マージ結果のうち、ローカルと差分があるレコードだけをローカルへ書き戻す。
 * 未変更のレコードを毎回 bulkPut しないことで IndexedDB 書き込みと再描画負荷を最小化する。
 */
export async function applySnapshot(
  snapshot: SyncSnapshot,
  localBefore?: SyncSnapshot,
): Promise<void> {
  const changedProblems = diffByIdAndTimestamp(
    snapshot.problems,
    localBefore?.problems,
    (p) => `${p.updatedAt}|${p.insightUpdatedAt ?? ''}|${p.errorCount}|${p.pinned ? 1 : 0}`,
  );
  const changedLogs = diffByIdAndTimestamp(
    snapshot.reviewLogs,
    localBefore?.reviewLogs,
    (l) => l.reviewedAt,
  );
  const changedLessons = diffByIdAndTimestamp(
    snapshot.lessons,
    localBefore?.lessons,
    (l) => l.updatedAt,
  );
  const changedDrills = diffByIdAndTimestamp(
    snapshot.drills,
    localBefore?.drills,
    (d) => d.updatedAt ?? d.createdAt,
  );
  const changedSprints = diffByIdAndTimestamp(
    snapshot.sprints,
    localBefore?.sprints,
    (s) => s.createdAt,
  );
  const changedCards = diffByIdAndTimestamp(
    snapshot.cards,
    localBefore?.cards,
    (c) => c.updatedAt,
  );
  const changedBunkei = diffByIdAndTimestamp(
    snapshot.bunkeiProgress ?? [],
    localBefore?.bunkeiProgress,
    (b) => `${b.status}|${b.updatedAt}`,
  );

  if (
    changedProblems.length === 0 &&
    changedLogs.length === 0 &&
    changedLessons.length === 0 &&
    changedDrills.length === 0 &&
    changedSprints.length === 0 &&
    changedCards.length === 0 &&
    changedBunkei.length === 0
  ) {
    return;
  }

  await db.transaction(
    'rw',
    [
      db.problems,
      db.reviewLogs,
      db.lessons,
      db.drills,
      db.sprints,
      db.cards,
      db.bunkeiProgress,
    ],
    async () => {
      if (changedProblems.length > 0) await db.problems.bulkPut(changedProblems);
      if (changedLogs.length > 0) await db.reviewLogs.bulkPut(changedLogs);
      if (changedLessons.length > 0) await db.lessons.bulkPut(changedLessons);
      if (changedDrills.length > 0) await db.drills.bulkPut(changedDrills);
      if (changedSprints.length > 0) await db.sprints.bulkPut(changedSprints);
      if (changedCards.length > 0) await db.cards.bulkPut(changedCards);
      if (changedBunkei.length > 0) {
        await db.bunkeiProgress.bulkPut(changedBunkei);
      }
    },
  );
}
