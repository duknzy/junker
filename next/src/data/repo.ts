import { db } from './db';
import { INITIAL_SRS, isDue, scheduleReview } from './srs';
import type {
  BunkeiProgress,
  DrillKind,
  DrillLevel,
  DrillQuestionRecord,
  DrillResult,
  DrillSession,
  Flashcard,
  Lesson,
  NewFlashcardInput,
  NewProblemInput,
  Problem,
  ProblemImage,
  QnaLog,
  QnaMessage,
  ReviewLog,
  SprintAnswerLog,
  SprintPresetId,
  SprintRecord,
} from './types';
import {
  BUNKEI_MATH_EXERCISES,
  BUNKEI_MATH_PROBLEMS,
  getBunkeiProblemDbId,
  getBunkeiProgressKey,
  type BunkeiMode,
  type BunkeiStatus,
} from './bunkei';
import type { LessonPlanPart } from '@shared/ai-core';
import { blobToDataUrl, dataUrlToBlob } from '../lib/image';
import { localDayKey } from '../core/lib/date';
import { notifyLocalChange } from '../sync/events';

export function newId(prefix: string): string {
  const uuid =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  return `${prefix}_${uuid}`;
}

const PROBLEMS_CACHE_KEY = 'flora-fast-problems-v1';
const STATS_CACHE_KEY = 'flora-fast-stats-v1';

let memoryProblemsCache: Problem[] | undefined;
let memoryInsightsCache: Problem[] | undefined;
let memoryStatsCache: Stats | undefined;
let memoryQnaCache: QnaLog[] | undefined;

export function getCachedQnaLogs(): QnaLog[] | undefined {
  return memoryQnaCache;
}

export function getCachedProblems(): Problem[] | undefined {
  if (memoryProblemsCache) return memoryProblemsCache;
  if (typeof window === 'undefined') return undefined;
  try {
    const raw = window.localStorage.getItem(PROBLEMS_CACHE_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as Problem[];
    if (Array.isArray(parsed) && parsed.length > 0) {
      memoryProblemsCache = parsed;
      return parsed;
    }
  } catch {
    // ignore
  }
  return undefined;
}

export function getCachedInsights(): Problem[] | undefined {
  return memoryInsightsCache;
}

export function getCachedStats(): Stats | undefined {
  if (memoryStatsCache) return memoryStatsCache;
  if (typeof window === 'undefined') return undefined;
  try {
    const raw = window.localStorage.getItem(STATS_CACHE_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as Stats;
    if (parsed && typeof parsed.total === 'number') {
      memoryStatsCache = parsed;
      return parsed;
    }
  } catch {
    // ignore
  }
  return undefined;
}

function saveFastProblemsCache(problems: Problem[]): void {
  memoryProblemsCache = problems;
  if (typeof window === 'undefined') return;
  try {
    // 初回描画が 0ms で完了するよう、巨大サムネイルを除いた軽量スナップショットを保存
    const slim = problems.map((p) =>
      p.thumbDataUrl && p.thumbDataUrl.length > 4000
        ? { ...p, thumbDataUrl: undefined }
        : p,
    );
    window.localStorage.setItem(PROBLEMS_CACHE_KEY, JSON.stringify(slim));
  } catch {
    // localStorage 容量上限時はメモリキャッシュのみ利用
  }
}

export async function listProblems(): Promise<Problem[]> {
  const all = await db.problems.toArray();
  const result = all
    .filter((problem) => !problem.deletedAt && problem.kind !== 'insight')
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  saveFastProblemsCache(result);
  return result;
}

export async function listInsightRecords(): Promise<Problem[]> {
  const all = await db.problems.toArray();
  const result = all
    .filter(
      (problem) =>
        !problem.deletedAt &&
        Boolean(
          problem.insight?.trim() ||
            problem.mnemonic?.trim() ||
            problem.strategy?.trim() ||
            problem.trap?.trim(),
        ),
    )
    .sort((a, b) => {
      if (Boolean(a.pinned) !== Boolean(b.pinned)) {
        return a.pinned ? -1 : 1;
      }
      return b.updatedAt.localeCompare(a.updatedAt);
    });
  memoryInsightsCache = result;
  return result;
}

export async function createInsightMemo(input: {
  title: string;
  subject: string;
  unit?: string;
  insight: string;
  pinned?: boolean;
}): Promise<Problem> {
  const now = new Date().toISOString();
  const id = newId('insight');
  const title = input.title.trim() || '気づきメモ';
  const record: Problem = {
    id,
    title,
    shortTitle: title,
    subject: input.subject || 'その他',
    unit: input.unit?.trim() || '未分類',
    answer: '',
    trap: '',
    strategy: '',
    mnemonic: '',
    insight: input.insight.trim(),
    pinned: Boolean(input.pinned),
    kind: 'insight',
    source: 'manual',
    imageIds: [],
    errorCount: 0,
    nextReviewAt: now,
    srs: { ...INITIAL_SRS },
    createdAt: now,
    updatedAt: now,
  };
  await db.problems.add(record);
  notifyLocalChange();
  return record;
}

export async function toggleProblemPin(id: string): Promise<boolean> {
  const problem = await db.problems.get(id);
  if (!problem) return false;
  const nextPinned = !problem.pinned;
  await db.problems.update(id, {
    pinned: nextPinned,
    updatedAt: new Date().toISOString(),
  });
  notifyLocalChange();
  return nextPinned;
}

export async function getProblem(id: string): Promise<Problem | undefined> {
  const problem = await db.problems.get(id);
  if (!problem || problem.deletedAt) return undefined;
  return problem;
}

export async function getProblemImages(problemId: string): Promise<ProblemImage[]> {
  return db.images.where('problemId').equals(problemId).toArray();
}

export async function getProblemImage(imageId: string): Promise<ProblemImage | undefined> {
  return db.images.get(imageId);
}

export async function createProblem(input: NewProblemInput): Promise<Problem> {
  const now = new Date().toISOString();
  const id = newId('prob');

  const images: ProblemImage[] = input.images.map((image) => ({
    id: newId('img'),
    problemId: id,
    blob: image.blob,
    mimeType: image.mimeType,
    width: image.width,
    height: image.height,
    createdAt: now,
  }));

  const problem: Problem = {
    id,
    title: input.title,
    shortTitle: input.shortTitle || input.title.slice(0, 24),
    subject: input.subject,
    unit: input.unit,
    answer: input.answer,
    trap: input.trap,
    strategy: input.strategy,
    mnemonic: input.mnemonic,
    source: input.source,
    imageIds: images.map((image) => image.id),
    errorCount: 0,
    nextReviewAt: now,
    srs: { ...INITIAL_SRS },
    explanation: input.explanation,
    demo: input.demo,
    createdAt: now,
    updatedAt: now,
  };

  await db.transaction('rw', db.problems, db.images, async () => {
    await db.problems.add(problem);
    if (images.length > 0) await db.images.bulkAdd(images);
  });

  notifyLocalChange();
  return problem;
}

export async function updateProblem(
  id: string,
  patch: Partial<Omit<Problem, 'id' | 'createdAt'>>,
): Promise<void> {
  await db.problems.update(id, {
    ...patch,
    updatedAt: new Date().toISOString(),
  });
  notifyLocalChange();
}

export async function deleteProblem(id: string): Promise<void> {
  const now = new Date().toISOString();
  await db.problems.update(id, { deletedAt: now, updatedAt: now });
  notifyLocalChange();
}

export async function dueProblems(now = new Date()): Promise<Problem[]> {
  const all = await listProblems();
  return all
    .filter((problem) => isDue(problem.nextReviewAt, now))
    .sort((a, b) => a.nextReviewAt.localeCompare(b.nextReviewAt));
}

export interface ReviewResult {
  srs: Problem['srs'];
  nextReviewAt: string;
}

export async function recordReview(
  problemId: string,
  correct: boolean,
  mode: ReviewLog['mode'] = 'review',
  durationMs = 0,
): Promise<ReviewResult> {
  const problem = await db.problems.get(problemId);
  if (!problem) throw new Error('問題が見つかりませんでした。');

  const now = new Date();
  const { srs, nextReviewAt } = scheduleReview(problem.srs, correct, now);
  const nowIso = now.toISOString();

  await db.transaction('rw', db.problems, db.reviewLogs, async () => {
    await db.problems.update(problemId, {
      srs,
      nextReviewAt,
      lastReviewedAt: nowIso,
      updatedAt: nowIso,
      errorCount: problem.errorCount + (correct ? 0 : 1),
    });
    await db.reviewLogs.add({
      id: newId('rev'),
      problemId,
      result: correct ? 'correct' : 'wrong',
      mode,
      durationMs,
      reviewedAt: nowIso,
    });
  });

  notifyLocalChange();
  return { srs, nextReviewAt };
}

export interface Stats {
  total: number;
  due: number;
  reviewedToday: number;
  reviewedThisWeek: number;
  streak: number;
}

export async function getStats(now = new Date()): Promise<Stats> {
  const [problems, logs] = await Promise.all([
    listProblems(),
    db.reviewLogs.toArray(),
  ]);

  const todayKey = localDayKey(now);
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 6);
  weekAgo.setHours(0, 0, 0, 0);

  const reviewedToday = logs.filter(
    (log) => localDayKey(new Date(log.reviewedAt)) === todayKey,
  ).length;

  const reviewedThisWeek = logs.filter(
    (log) => new Date(log.reviewedAt).getTime() >= weekAgo.getTime(),
  ).length;

  const dayKeys = new Set(logs.map((log) => localDayKey(new Date(log.reviewedAt))));
  let streak = 0;
  const cursor = new Date(now);
  for (let i = 0; i < 365; i += 1) {
    if (dayKeys.has(localDayKey(cursor))) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  const statsResult: Stats = {
    total: problems.length,
    due: problems.filter((problem) => isDue(problem.nextReviewAt, now)).length,
    reviewedToday,
    reviewedThisWeek,
    streak,
  };
  memoryStatsCache = statsResult;
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STATS_CACHE_KEY, JSON.stringify(statsResult));
    } catch {
      // ignore
    }
  }
  return statsResult;
}

export interface NewLessonInput {
  title: string;
  subject: string;
  unit: string;
  overview: string;
  parts: LessonPlanPart[];
  demo?: boolean;
}

export async function listLessons(): Promise<Lesson[]> {
  const all = await db.lessons.toArray();
  return all
    .filter((lesson) => !lesson.deletedAt)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getLesson(id: string): Promise<Lesson | undefined> {
  const lesson = await db.lessons.get(id);
  if (!lesson || lesson.deletedAt) return undefined;
  return lesson;
}

export async function createLesson(input: NewLessonInput): Promise<Lesson> {
  const now = new Date().toISOString();
  const lesson: Lesson = {
    id: newId('lesson'),
    title: input.title,
    subject: input.subject,
    unit: input.unit,
    overview: input.overview,
    parts: input.parts.map((part, index) => ({
      id: `part_${index + 1}`,
      title: part.title.replace(/^\s*\d+\s*[.．、)]\s*/, '').trim() || part.title,
      body: part.body,
      keyPoints: part.keyPoints ?? [],
      check: part.check,
    })),
    completedPartIds: [],
    demo: input.demo,
    createdAt: now,
    updatedAt: now,
  };
  await db.lessons.add(lesson);
  notifyLocalChange();
  return lesson;
}

export async function updateLesson(
  id: string,
  patch: Partial<Omit<Lesson, 'id' | 'createdAt'>>,
): Promise<void> {
  await db.lessons.update(id, {
    ...patch,
    updatedAt: new Date().toISOString(),
  });
  notifyLocalChange();
}

export async function deleteLesson(id: string): Promise<void> {
  const now = new Date().toISOString();
  await db.lessons.update(id, { deletedAt: now, updatedAt: now });
  notifyLocalChange();
}

export async function toggleLessonPart(
  lessonId: string,
  partId: string,
): Promise<string[]> {
  const lesson = await db.lessons.get(lessonId);
  if (!lesson) throw new Error('授業が見つかりませんでした。');

  const completedPartIds = lesson.completedPartIds.includes(partId)
    ? lesson.completedPartIds.filter((id) => id !== partId)
    : [...lesson.completedPartIds, partId];

  await db.lessons.update(lessonId, {
    completedPartIds,
    updatedAt: new Date().toISOString(),
  });
  notifyLocalChange();
  return completedPartIds;
}

export async function setLessonLastPart(
  lessonId: string,
  partId: string,
): Promise<void> {
  await db.lessons.update(lessonId, {
    lastPartId: partId,
    updatedAt: new Date().toISOString(),
  });
  notifyLocalChange();
}

export interface NewDrillInput {
  title: string;
  subject: string;
  questions: DrillQuestionRecord[];
  kind?: DrillKind;
  level?: DrillLevel;
  demo?: boolean;
}

export async function saveDrill(input: NewDrillInput): Promise<DrillSession> {
  const now = new Date();
  const session: DrillSession = {
    id: newId('drill'),
    dateKey: localDayKey(now),
    kind: input.kind ?? 'daily',
    level: input.level,
    title: input.title,
    subject: input.subject,
    questions: input.questions,
    results: [],
    demo: input.demo,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
  await db.drills.add(session);
  notifyLocalChange();
  return session;
}

export async function updateDrillResults(
  id: string,
  results: DrillResult[],
  completedAt?: string,
): Promise<void> {
  await db.drills.update(id, {
    results,
    completedAt,
    updatedAt: new Date().toISOString(),
  });
  notifyLocalChange();
}

export async function listDrills(): Promise<DrillSession[]> {
  const all = await db.drills.toArray();
  return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getTodayDrill(
  dateKey = localDayKey(),
): Promise<DrillSession | undefined> {
  const drills = await db.drills.where('dateKey').equals(dateKey).toArray();
  return drills
    .filter((drill) => (drill.kind ?? 'daily') === 'daily')
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
}

export async function listCustomDrills(limit?: number): Promise<DrillSession[]> {
  const all = await db.drills.toArray();
  const custom = all
    .filter((drill) => drill.kind === 'custom')
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return typeof limit === 'number' ? custom.slice(0, limit) : custom;
}

export interface NewSprintInput {
  preset: SprintPresetId;
  presetLabel: string;
  durationSec: number;
  answers: SprintAnswerLog[];
}

export async function saveSprintRecord(
  input: NewSprintInput,
): Promise<SprintRecord> {
  const record: SprintRecord = {
    id: newId('sprint'),
    preset: input.preset,
    presetLabel: input.presetLabel,
    durationSec: input.durationSec,
    total: input.answers.length,
    correct: input.answers.filter((answer) => answer.correct).length,
    answers: input.answers,
    createdAt: new Date().toISOString(),
  };
  await db.sprints.add(record);
  notifyLocalChange();
  return record;
}

export async function listSprintRecords(limit?: number): Promise<SprintRecord[]> {
  const all = await db.sprints.orderBy('createdAt').reverse().toArray();
  return typeof limit === 'number' ? all.slice(0, limit) : all;
}

export async function getLatestSprint(): Promise<SprintRecord | undefined> {
  const records = await listSprintRecords(1);
  return records[0];
}

export async function getSprintBest(
  preset: SprintPresetId,
  durationSec: number,
): Promise<SprintRecord | undefined> {
  const records = await db.sprints.where('preset').equals(preset).toArray();
  return records
    .filter((record) => record.durationSec === durationSec)
    .sort(
      (a, b) =>
        b.correct - a.correct || a.createdAt.localeCompare(b.createdAt),
    )[0];
}

export async function listFlashcards(): Promise<Flashcard[]> {
  const all = await db.cards.toArray();
  return all
    .filter((card) => !card.deletedAt)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function dueFlashcards(now = new Date()): Promise<Flashcard[]> {
  const all = await listFlashcards();
  return all
    .filter((card) => isDue(card.nextReviewAt, now))
    .sort((a, b) => a.nextReviewAt.localeCompare(b.nextReviewAt));
}

export async function createFlashcard(
  input: NewFlashcardInput,
): Promise<Flashcard> {
  const now = new Date().toISOString();
  const card: Flashcard = {
    id: newId('card'),
    front: input.front.trim(),
    back: input.back.trim(),
    subject: input.subject || 'その他',
    unit: input.unit?.trim() || '未分類',
    ...(input.problemId ? { problemId: input.problemId } : {}),
    ...(input.problemTitle ? { problemTitle: input.problemTitle } : {}),
    srs: { ...INITIAL_SRS },
    nextReviewAt: now,
    createdAt: now,
    updatedAt: now,
  };
  await db.cards.add(card);
  notifyLocalChange();
  return card;
}

export async function updateFlashcard(
  id: string,
  patch: Partial<Omit<Flashcard, 'id' | 'createdAt'>>,
): Promise<void> {
  await db.cards.update(id, {
    ...patch,
    updatedAt: new Date().toISOString(),
  });
  notifyLocalChange();
}

export async function deleteFlashcard(id: string): Promise<void> {
  const now = new Date().toISOString();
  await db.cards.update(id, { deletedAt: now, updatedAt: now });
  notifyLocalChange();
}

export async function recordFlashcardReview(
  cardId: string,
  correct: boolean,
): Promise<ReviewResult> {
  const card = await db.cards.get(cardId);
  if (!card) throw new Error('暗記カードが見つかりませんでした。');

  const now = new Date();
  const { srs, nextReviewAt } = scheduleReview(card.srs, correct, now);
  const nowIso = now.toISOString();

  await db.cards.update(cardId, {
    srs,
    nextReviewAt,
    lastReviewedAt: nowIso,
    updatedAt: nowIso,
  });

  notifyLocalChange();
  return { srs, nextReviewAt };
}

export async function listBunkeiProgress(): Promise<BunkeiProgress[]> {
  return db.bunkeiProgress.toArray();
}

function buildBunkeiProblemPayload(
  mode: BunkeiMode,
  problemId: number,
  now: string,
  existing?: Problem,
): Problem | null {
  const data =
    mode === 'reidai'
      ? BUNKEI_MATH_PROBLEMS[problemId]
      : BUNKEI_MATH_EXERCISES[problemId];
  if (!data) return null;

  const fixedId = getBunkeiProblemDbId(mode, problemId);
  const label = mode === 'reidai' ? `例題${problemId}` : `演習${problemId}`;
  const combinedAnswer =
    mode === 'reidai'
      ? `【解答】\n${data.answer || ''}\n\n【解説講義】\n${data.explanation || ''}`
      : `【解答】\n${data.answer || ''}\n\n【解説・研究】\n${data.commentary || ''}`;

  return {
    id: fixedId,
    title: data.question || `文系の数学 ${label} ${data.title}`,
    shortTitle: `文系の数学 ${label} ${data.title}`,
    subject: '数学',
    unit:
      mode === 'reidai'
        ? `文系の数学（${data.chapter}）`
        : `文系の数学・演習（${data.chapter}）`,
    answer: existing?.answer || combinedAnswer,
    trap: existing?.trap || '解法の着眼点、または計算プロセスの見落とし',
    strategy:
      existing?.strategy ||
      (mode === 'reidai' ? data.key_point || '' : data.commentary || ''),
    mnemonic: existing?.mnemonic || '',
    insight: existing?.insight,
    pinned: existing?.pinned,
    kind: existing?.kind ?? 'problem',
    bunkeiMode: mode,
    bunkeiId: problemId,
    source: 'manual',
    imageIds: existing?.imageIds ?? [],
    errorCount: existing?.errorCount ?? 0,
    lastReviewedAt: existing?.lastReviewedAt,
    nextReviewAt: existing?.nextReviewAt ?? now,
    srs: existing?.srs ?? { ...INITIAL_SRS },
    explanation: existing?.explanation,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
}

export async function recordBunkeiStatus(
  mode: BunkeiMode,
  problemId: number,
  status: BunkeiStatus,
): Promise<void> {
  const now = new Date().toISOString();
  const progId = getBunkeiProgressKey(mode, problemId);
  const existingProg = await db.bunkeiProgress.get(progId);

  await db.bunkeiProgress.put({
    id: progId,
    mode,
    problemId,
    status,
    insight: existingProg?.insight,
    updatedAt: now,
  });

  if (status === 'mistake') {
    const fixedId = getBunkeiProblemDbId(mode, problemId);
    const existingProb = await db.problems.get(fixedId);
    const payload = buildBunkeiProblemPayload(mode, problemId, now, existingProb);
    if (payload) {
      payload.kind = 'problem';
      payload.deletedAt = undefined;
      payload.errorCount = (existingProb?.errorCount ?? 0) + 1;
      payload.lastReviewedAt = now;
      payload.nextReviewAt = now;
      payload.srs = {
        state: 'relearning',
        intervalDays: 1,
        ease: existingProb?.srs?.ease ?? INITIAL_SRS.ease,
        streak: 0,
        lapses: (existingProb?.srs?.lapses ?? 0) + 1,
      };
      if (existingProg?.insight && !payload.insight) {
        payload.insight = existingProg.insight;
      }
      await db.problems.put(payload);
    }
  }

  notifyLocalChange();
}

export async function saveBunkeiInsight(
  mode: BunkeiMode,
  problemId: number,
  insight: string,
): Promise<void> {
  const now = new Date().toISOString();
  const trimmed = insight.trim();
  const progId = getBunkeiProgressKey(mode, problemId);
  const existingProg = await db.bunkeiProgress.get(progId);

  await db.bunkeiProgress.put({
    id: progId,
    mode,
    problemId,
    status: existingProg?.status,
    insight: trimmed,
    updatedAt: now,
  });

  const fixedId = getBunkeiProblemDbId(mode, problemId);
  const existingProb = await db.problems.get(fixedId);
  const payload = buildBunkeiProblemPayload(mode, problemId, now, existingProb);
  if (payload) {
    payload.insight = trimmed;
    payload.deletedAt = undefined;
    // まだ誤答として登録されていなければ、気づき一覧専用レコード('insight')として保持
    if (!existingProb || existingProb.deletedAt) {
      payload.kind = existingProg?.status === 'mistake' ? 'problem' : 'insight';
    }
    await db.problems.put(payload);
  }

  notifyLocalChange();
}

export interface ExportBundle {
  app: 'flora';
  version: 1;
  exportedAt: string;
  problems: Problem[];
  images: Array<Omit<ProblemImage, 'blob'> & { dataUrl: string }>;
  reviewLogs: ReviewLog[];
  lessons: Lesson[];
  drills: DrillSession[];
  sprints: SprintRecord[];
  cards?: Flashcard[];
  bunkeiProgress?: BunkeiProgress[];
}

export async function exportData(): Promise<ExportBundle> {
  const [
    problems,
    images,
    reviewLogs,
    lessons,
    drills,
    sprints,
    cards,
    bunkeiProgress,
  ] = await Promise.all([
    db.problems.toArray(),
    db.images.toArray(),
    db.reviewLogs.toArray(),
    db.lessons.toArray(),
    db.drills.toArray(),
    db.sprints.toArray(),
    db.cards.toArray(),
    db.bunkeiProgress.toArray(),
  ]);

  const encodedImages = await Promise.all(
    images.map(async (image) => {
      const { blob, ...rest } = image;
      return { ...rest, dataUrl: await blobToDataUrl(blob) };
    }),
  );

  return {
    app: 'flora',
    version: 1,
    exportedAt: new Date().toISOString(),
    problems,
    images: encodedImages,
    reviewLogs,
    lessons,
    drills,
    sprints,
    cards,
    bunkeiProgress,
  };
}

export async function importData(
  bundle: ExportBundle,
  options: { replace?: boolean } = {},
): Promise<{
  problems: number;
  images: number;
  reviewLogs: number;
  lessons: number;
  drills: number;
  sprints: number;
  cards: number;
}> {
  if (!bundle || bundle.app !== 'flora' || !Array.isArray(bundle.problems)) {
    throw new Error('Floraのバックアップファイルではありません。');
  }

  const images: ProblemImage[] = (bundle.images ?? []).map((image) => {
    const { dataUrl, ...rest } = image;
    return { ...rest, blob: dataUrlToBlob(dataUrl) };
  });

  await db.transaction(
    'rw',
    [
      db.problems,
      db.images,
      db.reviewLogs,
      db.lessons,
      db.drills,
      db.sprints,
      db.cards,
      db.bunkeiProgress,
    ],
    async () => {
      if (options.replace) {
        await Promise.all([
          db.problems.clear(),
          db.images.clear(),
          db.reviewLogs.clear(),
          db.lessons.clear(),
          db.drills.clear(),
          db.sprints.clear(),
          db.cards.clear(),
          db.bunkeiProgress.clear(),
        ]);
      }
      await db.problems.bulkPut(bundle.problems);
      if (images.length > 0) await db.images.bulkPut(images);
      if (bundle.reviewLogs?.length) await db.reviewLogs.bulkPut(bundle.reviewLogs);
      if (bundle.lessons?.length) await db.lessons.bulkPut(bundle.lessons);
      if (bundle.drills?.length) await db.drills.bulkPut(bundle.drills);
      if (bundle.sprints?.length) await db.sprints.bulkPut(bundle.sprints);
      if (bundle.cards?.length) await db.cards.bulkPut(bundle.cards);
      if (bundle.bunkeiProgress?.length) {
        await db.bunkeiProgress.bulkPut(bundle.bunkeiProgress);
      }
    },
  );

  notifyLocalChange();
  return {
    problems: bundle.problems.length,
    images: images.length,
    reviewLogs: bundle.reviewLogs?.length ?? 0,
    lessons: bundle.lessons?.length ?? 0,
    drills: bundle.drills?.length ?? 0,
    sprints: bundle.sprints?.length ?? 0,
    cards: bundle.cards?.length ?? 0,
  };
}

export async function clearAllData(): Promise<void> {
  await db.transaction(
    'rw',
    [
      db.problems,
      db.images,
      db.reviewLogs,
      db.lessons,
      db.drills,
      db.sprints,
      db.cards,
      db.bunkeiProgress,
    ],
    async () => {
      await Promise.all([
        db.problems.clear(),
        db.images.clear(),
        db.reviewLogs.clear(),
        db.lessons.clear(),
        db.drills.clear(),
        db.sprints.clear(),
        db.cards.clear(),
        db.bunkeiProgress.clear(),
      ]);
    },
  );
  notifyLocalChange();
}

export async function countProblems(): Promise<number> {
  return db.problems
    .filter((problem) => !problem.deletedAt && problem.kind !== 'insight')
    .count();
}

export async function bulkDeleteProblems(ids: string[]): Promise<number> {
  if (!ids.length) return 0;
  const now = new Date().toISOString();
  const existing = await db.problems.bulkGet(ids);
  const toUpdate: Problem[] = [];
  for (const item of existing) {
    if (item && !item.deletedAt) {
      toUpdate.push({ ...item, deletedAt: now, updatedAt: now });
    }
  }
  if (toUpdate.length > 0) {
    await db.problems.bulkPut(toUpdate);
    notifyLocalChange();
  }
  return toUpdate.length;
}

export async function bulkUpdateProblems(
  ids: string[],
  patch: Partial<Pick<Problem, 'subject' | 'unit' | 'pinned' | 'errorCount'>>,
): Promise<number> {
  if (!ids.length) return 0;
  const now = new Date().toISOString();
  const existing = await db.problems.bulkGet(ids);
  const toUpdate: Problem[] = [];
  for (const item of existing) {
    if (item && !item.deletedAt) {
      toUpdate.push({
        ...item,
        ...patch,
        updatedAt: now,
      });
    }
  }
  if (toUpdate.length > 0) {
    await db.problems.bulkPut(toUpdate);
    notifyLocalChange();
  }
  return toUpdate.length;
}

export async function listQnaLogs(): Promise<QnaLog[]> {
  const all = await db.qnaLogs.toArray();
  const list = all
    .filter((item) => !item.deletedAt && Array.isArray(item.messages) && item.messages.length > 0)
    .sort((a, b) => b.savedAt.localeCompare(a.savedAt));
  memoryQnaCache = list;
  return list;
}

export async function getQnaLogsByProblem(problemId: string): Promise<QnaLog[]> {
  if (!problemId) return [];
  const all = await db.qnaLogs.where('problemId').equals(problemId).toArray();
  return all
    .filter((item) => !item.deletedAt && Array.isArray(item.messages) && item.messages.length > 0)
    .sort((a, b) => a.savedAt.localeCompare(b.savedAt));
}

export async function saveQnaLog(input: {
  id?: string;
  problemId?: string;
  shortTitle: string;
  subject: string;
  unit: string;
  messages: QnaMessage[];
}): Promise<QnaLog> {
  const now = new Date().toISOString();
  const id = input.id || newId('qna');
  const existing = await db.qnaLogs.get(id);
  const record: QnaLog = {
    id,
    problemId: input.problemId,
    shortTitle: input.shortTitle.trim() || '問題への質問',
    subject: input.subject || 'その他',
    unit: input.unit || '未分類',
    messages: input.messages,
    savedAt: existing?.savedAt ?? now,
    updatedAt: now,
  };
  await db.qnaLogs.put(record);
  notifyLocalChange();
  return record;
}

export async function deleteQnaLog(id: string): Promise<void> {
  const now = new Date().toISOString();
  await db.qnaLogs.update(id, { deletedAt: now, updatedAt: now });
  notifyLocalChange();
}

