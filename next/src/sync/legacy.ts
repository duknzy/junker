import {
  BUNKEI_MATH_CATALOG,
  BUNKEI_MATH_EXERCISES,
  BUNKEI_MATH_EXERCISES_CATALOG,
  BUNKEI_MATH_PROBLEMS,
  formatBunkeiQuestion,
  getBunkeiProblemDbId,
  getBunkeiProgressKey,
  sanitizeBunkeiMath,
  type BunkeiMode,
  type BunkeiStatus,
} from '../data/bunkei';
import { db } from '../data/db';
import { newId } from '../data/repo';
import { INITIAL_SRS } from '../data/srs';
import type {
  BunkeiProgress,
  Flashcard,
  Problem,
  ProblemImage,
  QnaLog,
  QnaMessage,
} from '../data/types';
import { dataUrlToBlob } from '../lib/image';
import { notifyLocalChange } from './events';
import { getFirebase } from './firebase';

type LegacyRecord = Record<string, unknown>;

export interface LegacyPreview {
  total: number;
  pending: number;
  alreadyImported: number;
  problemCount: number;
  insightCount: number;
  bunkeiCount: number;
  flashcardCount: number;
  imageCount: number;
  sampleTitles: string[];
}

export interface LegacyProgress {
  done: number;
  total: number;
  images: number;
}

export interface LegacyImportResult {
  imported: number;
  insightsImported: number;
  bunkeiImported: number;
  flashcardsImported: number;
  skipped: number;
  images: number;
  missingImages: number;
  failed: number;
}

interface LegacyLessonMemo {
  id: string;
  lessonId: string;
  lessonTitle: string;
  subject: string;
  unit: string;
  partTitle: string;
  text: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

interface LegacyFlashcardItem {
  id: string;
  front: string;
  back: string;
  subject: string;
  unit: string;
  createdAt: string;
  updatedAt: string;
}

interface LegacyBundle {
  problems: Array<{ id: string; record: LegacyRecord }>;
  mistakes: Array<{ id: string; record: LegacyRecord }>;
  lessonMemos: LegacyLessonMemo[];
  flashcards: LegacyFlashcardItem[];
  bunkeiProgress: BunkeiProgress[];
}

const MIN_PLAUSIBLE_TS = Date.UTC(2020, 0, 1);

function asString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function asNumber(value: unknown): number {
  const number = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(number) ? number : 0;
}

function validIso(value: unknown, fallback: string): string {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
    return new Date(value).toISOString();
  }
  if (typeof value === 'string' && value.trim()) {
    const asNum = Number(value);
    if (Number.isFinite(asNum) && asNum >= MIN_PLAUSIBLE_TS) {
      return new Date(asNum).toISOString();
    }
    const time = Date.parse(value);
    if (Number.isFinite(time)) return new Date(time).toISOString();
  }
  return fallback;
}

/**
 * 旧Flora (index.html resolveCreatedAt) と同じロジックで追加日を復元する:
 * 1. record.createdAt があれば使用
 * 2. IDが "CUSTOM_<ミリ秒タイムスタンプ>" 等なら2020年以降のタイムスタンプを抽出
 * 3. record.lastAttemptAt があれば使用
 */
function resolveLegacyCreatedAt(
  id: string,
  record: LegacyRecord,
  fallback: string,
): string {
  const explicit = validIso(record.createdAt, '');
  if (explicit) return explicit;

  const parts = id.split('_');
  const maxPlausible = Date.now() + 86400000 * 365 * 10;
  const ts = parts
    .map(Number)
    .find(
      (n) => Number.isFinite(n) && n >= MIN_PLAUSIBLE_TS && n <= maxPlausible,
    );
  if (ts) {
    return new Date(ts).toISOString();
  }

  const attempt = validIso(record.lastAttemptAt, '');
  if (attempt) return attempt;

  return fallback;
}

function titleOf(record: LegacyRecord): string {
  return (
    asString(record.short_title) ||
    asString(record.title) ||
    '（タイトルなし）'
  );
}

function inlineImageUrls(record: LegacyRecord): string[] {
  const urls: string[] = [];
  if (Array.isArray(record.images)) {
    for (const image of record.images) {
      if (typeof image === 'string' && image.startsWith('data:')) {
        urls.push(image);
      }
    }
  }
  if (
    typeof record.imageData === 'string' &&
    record.imageData.startsWith('data:')
  ) {
    urls.push(record.imageData);
  }
  return urls;
}

function thumbUrl(record: LegacyRecord): string | null {
  return typeof record.thumb === 'string' && record.thumb.startsWith('data:')
    ? record.thumb
    : null;
}

function declaredImageCount(record: LegacyRecord): number {
  return Math.max(
    Math.round(asNumber(record.imageCount)),
    inlineImageUrls(record).length,
    thumbUrl(record) ? 1 : 0,
  );
}

function parseBunkeiRef(
  id: string,
  record: LegacyRecord,
): { mode: BunkeiMode; problemId: number } | null {
  const exMatch = /^BUNKEI_MATH_EX_(\d+)$/.exec(id);
  if (exMatch) {
    return { mode: 'exercise', problemId: Number(exMatch[1]) };
  }
  const reidaiMatch = /^BUNKEI_MATH_(\d+)$/.exec(id);
  if (reidaiMatch) {
    return { mode: 'reidai', problemId: Number(reidaiMatch[1]) };
  }
  const sourceId = Math.round(asNumber(record.sourceBookProblemId));
  if (sourceId > 0) {
    const mode: BunkeiMode =
      asString(record.mode) === 'exercise' ? 'exercise' : 'reidai';
    return { mode, problemId: sourceId };
  }
  return null;
}

function buildChoiceDrillProblem(
  rawKey: string,
  record: LegacyRecord,
  now: string,
): Problem {
  const id = rawKey.startsWith('mistake_') ? rawKey : `mistake_${rawKey}`;
  const subject = asString(record.subject) || '未分類';
  const lessonTitle = asString(record.lessonTitle) || '2択・正誤ドリル';
  const lead = asString(record.lead_text) || asString(record.lead);

  const lines: string[] = [];
  if (lead) lines.push(lead);
  const stA = asString(record.statement_a);
  const stB = asString(record.statement_b);
  if (stA || stB) {
    if (stA) lines.push(`- **a.** ${stA}`);
    if (stB) lines.push(`- **b.** ${stB}`);
  }
  if (Array.isArray(record.statements)) {
    for (const st of record.statements) {
      if (typeof st === 'string' && st.trim()) {
        lines.push(`- ${st.trim()}`);
      }
    }
  }
  if (Array.isArray(record.options)) {
    lines.push(
      record.options
        .map((opt, idx) => `(${idx + 1}) ${String(opt)}`)
        .join(' / '),
    );
  }

  const questionText = lines.join('\n\n') || lessonTitle;
  const correctOpt = asNumber(record.correct_option);
  const userAns = asString(record.userAnswer);
  const answerText =
    correctOpt > 0
      ? `正解: (${correctOpt})${userAns ? `（当時の選択: ${userAns}）` : ''}`
      : asString(record.explanation) || '解説を参照';

  const trapParts = [
    asString(record.trap_type),
    asString(record.trap_explanation),
  ].filter(Boolean);

  const createdAt = resolveLegacyCreatedAt(id, record, now);

  return {
    id,
    title: questionText,
    shortTitle: `${lessonTitle}（正誤ドリル）`,
    subject,
    unit: lessonTitle,
    answer: answerText,
    trap: trapParts.join(' — '),
    strategy: asString(record.explanation),
    mnemonic: '',
    source: 'lesson',
    imageIds: [],
    errorCount: 1,
    nextReviewAt: now,
    srs: { ...INITIAL_SRS },
    createdAt,
    updatedAt: now,
    kind: 'problem',
  };
}

function buildBunkeiFallbackProblem(
  item: BunkeiProgress,
  now: string,
): Problem | null {
  const mode = item.mode;
  const problemId = item.problemId;
  const raw =
    mode === 'reidai'
      ? BUNKEI_MATH_PROBLEMS[problemId]
      : BUNKEI_MATH_EXERCISES[problemId];
  const cat =
    mode === 'reidai'
      ? BUNKEI_MATH_CATALOG.find((c) => c.id === problemId)
      : BUNKEI_MATH_EXERCISES_CATALOG.find((c) => c.id === problemId);

  if (!raw && !cat) return null;

  const label = mode === 'reidai' ? `例題${problemId}` : `演習${problemId}`;
  const titleText = raw?.title ?? cat?.title ?? label;
  const chapter = raw?.chapter ?? cat?.chapter ?? '文系の数学';
  const question = formatBunkeiQuestion(raw?.question ?? titleText);
  const answer = sanitizeBunkeiMath(raw?.answer ?? '');
  const keyPoint = sanitizeBunkeiMath(raw?.key_point ?? '');
  const commentary = sanitizeBunkeiMath(
    raw?.commentary ?? raw?.explanation ?? '',
  );
  const isMistake = item.status === 'mistake';

  return {
    id: getBunkeiProblemDbId(mode, problemId),
    title: question || `【文系の数学 ${label}】${titleText}`,
    shortTitle: `【文系の数学 ${label}】${titleText}`,
    subject: '数学',
    unit: chapter,
    answer: answer || '（『文系の数学』画面で解答を確認）',
    trap: keyPoint ? `【必勝ポイント】\n${keyPoint}` : '',
    strategy: commentary,
    mnemonic: keyPoint,
    insight: item.insight,
    insightUpdatedAt: item.insight ? item.updatedAt : undefined,
    source: 'manual',
    imageIds: [],
    errorCount: isMistake ? 1 : 0,
    nextReviewAt: now,
    srs: { ...INITIAL_SRS },
    createdAt: item.updatedAt || now,
    updatedAt: item.updatedAt || now,
    kind: isMistake ? 'problem' : 'insight',
    bunkeiMode: mode,
    bunkeiId: problemId,
  };
}

function parseLessonsNode(
  lessonsVal: unknown,
  now: string,
): { lessonMemos: LegacyLessonMemo[]; flashcards: LegacyFlashcardItem[] } {
  const lessonMemos: LegacyLessonMemo[] = [];
  const flashcards: LegacyFlashcardItem[] = [];

  if (!lessonsVal || typeof lessonsVal !== 'object') {
    return { lessonMemos, flashcards };
  }

  for (const [lessonId, rawLesson] of Object.entries(
    lessonsVal as Record<string, unknown>,
  )) {
    if (!rawLesson || typeof rawLesson !== 'object') continue;
    const lesson = rawLesson as LegacyRecord;
    const lessonTitle = asString(lesson.title) || '授業メモ';
    const lessonSubject = asString(lesson.subject) || '未分類';
    const lessonUnit = asString(lesson.topicKey) || lessonTitle;
    const parts = Array.isArray(lesson.parts) ? lesson.parts : [];
    const lessonCreatedAt = validIso(lesson.createdAt, now);

    // 1) lessonMemos -> 気づき一覧
    if (Array.isArray(lesson.lessonMemos)) {
      lesson.lessonMemos.forEach((rawMemo, index) => {
        if (!rawMemo || typeof rawMemo !== 'object') return;
        const m = rawMemo as LegacyRecord;
        const text = asString(m.text).trim();
        if (!text) return;
        const memoId = asString(m.id) || String(index + 1);
        const partIdx =
          typeof m.partIndex === 'number' ? m.partIndex : Number(m.partIndex);
        let partTitle = '';
        if (
          Number.isFinite(partIdx) &&
          partIdx >= 0 &&
          parts[partIdx] &&
          typeof parts[partIdx] === 'object'
        ) {
          partTitle = asString((parts[partIdx] as LegacyRecord).title);
        }
        const createdAt = validIso(m.createdAt, lessonCreatedAt);
        const updatedAt = validIso(m.updatedAt, createdAt);
        lessonMemos.push({
          id: `lessonmemo_${lessonId}_${memoId}`,
          lessonId,
          lessonTitle,
          subject: asString(m.subject) || lessonSubject,
          unit: lessonUnit,
          partTitle: partTitle
            ? `${lessonTitle} / ${partTitle}`
            : lessonTitle,
          text,
          pinned: Boolean(m.pinned),
          createdAt,
          updatedAt,
        });
      });
    }

    // 2) memorizationPoints -> 暗記カード
    if (Array.isArray(lesson.memorizationPoints)) {
      lesson.memorizationPoints.forEach((rawMp, index) => {
        if (!rawMp || typeof rawMp !== 'object') return;
        const mp = rawMp as LegacyRecord;
        const front = (
          asString(mp.question) ||
          asString(mp.term) ||
          asString(mp.front)
        ).trim();
        const back = (
          asString(mp.answer) ||
          asString(mp.definition) ||
          asString(mp.description) ||
          asString(mp.back)
        ).trim();
        if (!front || !back) return;
        const mpId = asString(mp.id) || String(index + 1);
        const createdAt = validIso(mp.createdAt, lessonCreatedAt);
        const updatedAt = validIso(mp.updatedAt, createdAt);
        flashcards.push({
          id: `legacycard_${lessonId}_${mpId}`,
          front,
          back,
          subject: asString(mp.subject) || lessonSubject,
          unit: lessonTitle,
          createdAt,
          updatedAt,
        });
      });
    }
  }

  return { lessonMemos, flashcards };
}

async function readLegacyBundle(
  uid: string,
  includeLessons = true,
): Promise<LegacyBundle> {
  const [{ database }, { get, ref }] = await Promise.all([
    getFirebase(),
    import('firebase/database'),
  ]);

  const now = new Date().toISOString();

  async function safeGet(path: string): Promise<unknown> {
    try {
      const snap = await get(ref(database, path));
      return snap.val();
    } catch {
      return null;
    }
  }

  const [
    problemsVal,
    mistakesVal,
    lessonsVal,
    reidaiProgVal,
    exProgVal,
    bunkeiInsightsVal,
  ] = await Promise.all([
    safeGet(`users/${uid}/problems`),
    safeGet(`users/${uid}/mistakes`),
    includeLessons ? safeGet(`users/${uid}/lessons`) : Promise.resolve(null),
    safeGet(`users/${uid}/bunkeiMathProgress`),
    safeGet(`users/${uid}/bunkeiMathExProgress`),
    safeGet(`users/${uid}/bunkeiMathInsights`),
  ]);

  const problems: Array<{ id: string; record: LegacyRecord }> = [];
  if (problemsVal && typeof problemsVal === 'object') {
    for (const [key, raw] of Object.entries(
      problemsVal as Record<string, unknown>,
    )) {
      if (!raw || typeof raw !== 'object') continue;
      problems.push({ id: key, record: raw as LegacyRecord });
    }
  }

  const mistakes: Array<{ id: string; record: LegacyRecord }> = [];
  if (mistakesVal && typeof mistakesVal === 'object') {
    for (const [key, raw] of Object.entries(
      mistakesVal as Record<string, unknown>,
    )) {
      if (!raw || typeof raw !== 'object') continue;
      mistakes.push({ id: `mistake_${key}`, record: raw as LegacyRecord });
    }
  }

  const { lessonMemos, flashcards } = parseLessonsNode(lessonsVal, now);

  const bunkeiMap = new Map<string, BunkeiProgress>();

  function applyProgressObj(mode: BunkeiMode, rawObj: unknown) {
    if (!rawObj || typeof rawObj !== 'object') return;
    for (const [key, raw] of Object.entries(
      rawObj as Record<string, unknown>,
    )) {
      const problemId = Number(key);
      if (!Number.isFinite(problemId) || problemId <= 0) continue;
      if (!raw || typeof raw !== 'object') continue;
      const rec = raw as LegacyRecord;
      const statusRaw = asString(rec.status);
      const status: BunkeiStatus | undefined =
        statusRaw === 'cleared' || statusRaw === 'mistake'
          ? statusRaw
          : undefined;
      if (!status) continue;
      const progId = getBunkeiProgressKey(mode, problemId);
      bunkeiMap.set(progId, {
        id: progId,
        mode,
        problemId,
        status,
        updatedAt: validIso(rec.timestamp, now),
      });
    }
  }

  applyProgressObj('reidai', reidaiProgVal);
  applyProgressObj('exercise', exProgVal);

  if (bunkeiInsightsVal && typeof bunkeiInsightsVal === 'object') {
    for (const [key, raw] of Object.entries(
      bunkeiInsightsVal as Record<string, unknown>,
    )) {
      if (!raw || typeof raw !== 'object') continue;
      const rec = raw as LegacyRecord;
      const memo = asString(rec.memo).trim();
      if (!memo) continue;

      let mode: BunkeiMode =
        asString(rec.mode) === 'exercise' ? 'exercise' : 'reidai';
      let problemId = Math.round(asNumber(rec.problemId));

      if (!problemId) {
        const m = /^(reidai|exercise)_(\d+)$/.exec(key);
        if (m) {
          mode = m[1] as BunkeiMode;
          problemId = Number(m[2]);
        }
      }
      if (!problemId) continue;

      const progId = getBunkeiProgressKey(mode, problemId);
      const prev = bunkeiMap.get(progId);
      const updatedAt = validIso(rec.updatedAt, prev?.updatedAt ?? now);
      bunkeiMap.set(progId, {
        id: progId,
        mode,
        problemId,
        status: prev?.status,
        insight: memo,
        updatedAt,
      });
    }
  }

  for (const { id, record } of problems) {
    const refInfo = parseBunkeiRef(id, record);
    if (!refInfo) continue;
    const insight = asString(record.insight).trim();
    if (!insight) continue;
    const progId = getBunkeiProgressKey(refInfo.mode, refInfo.problemId);
    const prev = bunkeiMap.get(progId);
    bunkeiMap.set(progId, {
      id: progId,
      mode: refInfo.mode,
      problemId: refInfo.problemId,
      status: prev?.status,
      insight: prev?.insight || insight,
      updatedAt: validIso(record.insightUpdatedAt, prev?.updatedAt ?? now),
    });
  }

  return {
    problems,
    mistakes,
    lessonMemos,
    flashcards,
    bunkeiProgress: Array.from(bunkeiMap.values()),
  };
}

async function measureBlob(
  blob: Blob,
): Promise<{ width: number; height: number }> {
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(blob);
      const size = { width: bitmap.width, height: bitmap.height };
      bitmap.close();
      return size;
    } catch {
      // 寸法が取れなくても画像自体は保存する
    }
  }
  return { width: 0, height: 0 };
}

/**
 * 取り込む前に件数だけ確認する。
 */
export async function fetchLegacyPreview(uid: string): Promise<LegacyPreview> {
  const bundle = await readLegacyBundle(uid, true);
  const localProblems = (await db.problems.toArray()).filter(
    (p) => !p.deletedAt,
  );
  const localProblemMap = new Map(localProblems.map((p) => [p.id, p]));
  const localBunkeiMap = new Map(
    (await db.bunkeiProgress.toArray()).map((b) => [b.id, b]),
  );
  const localCardMap = new Map(
    (await db.cards.toArray()).map((c) => [c.id, c]),
  );

  let alreadyImported = 0;
  let pending = 0;
  let problemCount = 0;
  let insightCount = 0;
  let imageCount = 0;
  const sampleTitles: string[] = [];

  for (const { id, record } of bundle.problems) {
    const hasInsight = Boolean(asString(record.insight).trim());
    if (hasInsight) insightCount += 1;
    problemCount += 1;

    const existing = localProblemMap.get(id);
    if (existing) {
      if (hasInsight && !existing.insight) {
        pending += 1;
      } else {
        alreadyImported += 1;
      }
      continue;
    }
    pending += 1;
    imageCount += declaredImageCount(record);
    if (sampleTitles.length < 4) sampleTitles.push(titleOf(record));
  }

  for (const { id, record } of bundle.mistakes) {
    problemCount += 1;
    if (localProblemMap.has(id)) {
      alreadyImported += 1;
    } else {
      pending += 1;
      if (sampleTitles.length < 4) {
        sampleTitles.push(
          `${asString(record.lessonTitle) || '正誤ドリル'}（誤答）`,
        );
      }
    }
  }

  for (const memo of bundle.lessonMemos) {
    insightCount += 1;
    if (localProblemMap.has(memo.id)) {
      alreadyImported += 1;
    } else {
      pending += 1;
      if (sampleTitles.length < 5) {
        sampleTitles.push(`🧠 ${memo.partTitle}: ${memo.text.slice(0, 28)}`);
      }
    }
  }

  for (const card of bundle.flashcards) {
    if (localCardMap.has(card.id)) {
      alreadyImported += 1;
    } else {
      pending += 1;
    }
  }

  for (const bp of bundle.bunkeiProgress) {
    if (bp.insight?.trim()) {
      const dbId = getBunkeiProblemDbId(bp.mode, bp.problemId);
      const inProblems = bundle.problems.some((p) => p.id === dbId);
      if (!inProblems) insightCount += 1;
    }
    const existingBp = localBunkeiMap.get(bp.id);
    if (
      existingBp &&
      existingBp.status === bp.status &&
      (existingBp.insight ?? '') === (bp.insight ?? '')
    ) {
      alreadyImported += 1;
    } else {
      pending += 1;
    }
  }

  const total =
    bundle.problems.length +
    bundle.mistakes.length +
    bundle.lessonMemos.length +
    bundle.flashcards.length +
    bundle.bunkeiProgress.length;

  return {
    total,
    pending,
    alreadyImported,
    problemCount,
    insightCount,
    bunkeiCount: bundle.bunkeiProgress.length,
    flashcardCount: bundle.flashcards.length,
    imageCount,
    sampleTitles,
  };
}

/**
 * 旧Floraの誤答データ（problems / mistakes / problemImages）、
 * 気づきメモ（problems.insight / lessons.lessonMemos / bunkeiMathInsights）、
 * 暗記カード（lessons.memorizationPoints）、
 * 『文系の数学』進捗（bunkeiMathProgress / bunkeiMathExProgress）を高速一括取り込みする。
 *
 * Stage 1: 問題メタデータ・気づき・サムネイル・文系の数学進捗を即座に一括保存（< 1秒で画面に全件反映）
 * Stage 2: 授業メモ・暗記カード・フル解像度画像を並列バッチで取得して保存
 */
export async function importLegacyProblems(
  uid: string,
  onProgress?: (progress: LegacyProgress) => void,
  options?: { skipFullImages?: boolean },
): Promise<LegacyImportResult> {
  // まず高速なコアデータ（problems / mistakes / bunkei）を取得
  const coreBundle = await readLegacyBundle(uid, false);
  const allLocalProblems = await db.problems.toArray();

  // 実データが存在する場合は初期デモ問題（demo: true）を自動的に除去して一覧をクリーンにする
  if (coreBundle.problems.length > 0 || coreBundle.mistakes.length > 0) {
    const demoIds = allLocalProblems.filter((p) => p.demo).map((p) => p.id);
    if (demoIds.length > 0) {
      await db.problems.bulkDelete(demoIds);
    }
  }

  const localProblems = allLocalProblems.filter((p) => !p.deletedAt && !p.demo);
  const localProblemMap = new Map(localProblems.map((p) => [p.id, p]));
  const bunkeiByProblemDbId = new Map<string, BunkeiProgress>();
  for (const bp of coreBundle.bunkeiProgress) {
    bunkeiByProblemDbId.set(getBunkeiProblemDbId(bp.mode, bp.problemId), bp);
  }

  const result: LegacyImportResult = {
    imported: 0,
    insightsImported: 0,
    bunkeiImported: 0,
    flashcardsImported: 0,
    skipped: 0,
    images: 0,
    missingImages: 0,
    failed: 0,
  };

  const now = new Date().toISOString();
  const stage1Problems: Problem[] = [];
  const imageJobs: Array<{ id: string; record: LegacyRecord }> = [];

  // Stage 1A: 全誤答問題 & 問題内の気づきメモを即座に構築
  for (const { id, record } of coreBundle.problems) {
    const existing = localProblemMap.get(id);
    const bunkeiRef = parseBunkeiRef(id, record);
    const bp = bunkeiByProblemDbId.get(id);
    const insightText =
      asString(record.insight).trim() || bp?.insight?.trim() || '';
    const insightUpdatedAt = validIso(
      record.insightUpdatedAt,
      bp?.updatedAt || '',
    );
    const pinned = Boolean(record.isPinned);
    const thumb = thumbUrl(record);
    const resolvedCreatedAt = resolveLegacyCreatedAt(id, record, now);
    const errCount = Math.max(0, Math.round(asNumber(record.errorCount)));

    if (existing) {
      const needsUpdate =
        (insightText && existing.insight !== insightText) ||
        (insightUpdatedAt && existing.insightUpdatedAt !== insightUpdatedAt) ||
        (thumb && !existing.thumbDataUrl) ||
        existing.createdAt !== resolvedCreatedAt ||
        existing.errorCount !== errCount;

      if (needsUpdate) {
        const updated: Problem = {
          ...existing,
          insight: insightText || existing.insight,
          insightUpdatedAt: insightUpdatedAt || existing.insightUpdatedAt,
          pinned: existing.pinned ?? pinned,
          thumbDataUrl: existing.thumbDataUrl || thumb || undefined,
          errorCount: errCount,
          createdAt: resolvedCreatedAt,
          ...(bunkeiRef
            ? {
                bunkeiMode: bunkeiRef.mode,
                bunkeiId: bunkeiRef.problemId,
              }
            : {}),
          updatedAt: existing.updatedAt || now,
        };
        stage1Problems.push(updated);
        localProblemMap.set(id, updated);
        if (insightText && !existing.insight) result.insightsImported += 1;
        result.imported += 1;
      } else {
        result.skipped += 1;
      }

      if (
        !options?.skipFullImages &&
        existing.imageIds.length === 0 &&
        declaredImageCount(record) > 0
      ) {
        imageJobs.push({ id, record });
      }
      continue;
    }

    const lastAttempt = validIso(record.lastAttemptAt, '');
    const isBunkeiInsightOnly =
      Boolean(bunkeiRef) &&
      errCount === 0 &&
      Boolean(insightText) &&
      bp?.status !== 'mistake';

    const problemRecord: Problem = {
      id,
      title:
        asString(record.title) ||
        asString(record.short_title) ||
        '（タイトルなし）',
      shortTitle: titleOf(record),
      subject: asString(record.subject) || '未分類',
      unit: asString(record.field) || '未分類',
      answer: asString(record.answerFormula),
      trap: asString(record.trap_description),
      strategy: asString(record.strategyPattern),
      mnemonic: asString(record.mnemonic),
      ...(insightText ? { insight: insightText } : {}),
      ...(insightUpdatedAt ? { insightUpdatedAt } : {}),
      ...(pinned ? { pinned: true } : {}),
      ...(thumb ? { thumbDataUrl: thumb } : {}),
      kind: isBunkeiInsightOnly ? 'insight' : 'problem',
      ...(bunkeiRef
        ? {
            bunkeiMode: bunkeiRef.mode,
            bunkeiId: bunkeiRef.problemId,
          }
        : {}),
      source:
        declaredImageCount(record) > 0
          ? 'photo'
          : record.sourceLessonId
            ? 'lesson'
            : 'manual',
      imageIds: [],
      errorCount: errCount,
      ...(lastAttempt ? { lastReviewedAt: lastAttempt } : {}),
      nextReviewAt: now,
      srs: { ...INITIAL_SRS },
      createdAt: resolvedCreatedAt,
      updatedAt: lastAttempt || insightUpdatedAt || resolvedCreatedAt,
    };

    stage1Problems.push(problemRecord);
    localProblemMap.set(id, problemRecord);
    result.imported += 1;
    if (insightText) result.insightsImported += 1;

    if (!options?.skipFullImages && declaredImageCount(record) > 0) {
      imageJobs.push({ id, record });
    }
  }

  // Stage 1B: 正誤ドリルの誤答 (`users/{uid}/mistakes`)
  for (const { id, record } of coreBundle.mistakes) {
    if (localProblemMap.has(id)) {
      result.skipped += 1;
      continue;
    }
    try {
      const built = buildChoiceDrillProblem(id, record, now);
      stage1Problems.push(built);
      localProblemMap.set(built.id, built);
      result.imported += 1;
    } catch {
      result.failed += 1;
    }
  }

  // Stage 1C: 『文系の数学』進捗 & 気づきメモ
  if (coreBundle.bunkeiProgress.length > 0) {
    await db.bunkeiProgress.bulkPut(coreBundle.bunkeiProgress);
    result.bunkeiImported = coreBundle.bunkeiProgress.length;

    for (const bp of coreBundle.bunkeiProgress) {
      const dbId = getBunkeiProblemDbId(bp.mode, bp.problemId);
      const existing = localProblemMap.get(dbId);
      if (existing) {
        if (bp.insight && !existing.insight) {
          const updated: Problem = {
            ...existing,
            insight: bp.insight,
            insightUpdatedAt: bp.updatedAt,
            bunkeiMode: bp.mode,
            bunkeiId: bp.problemId,
            updatedAt: now,
          };
          stage1Problems.push(updated);
          localProblemMap.set(dbId, updated);
          result.insightsImported += 1;
        }
        continue;
      }

      if (bp.status === 'mistake' || Boolean(bp.insight?.trim())) {
        const fallback = buildBunkeiFallbackProblem(bp, now);
        if (fallback) {
          stage1Problems.push(fallback);
          localProblemMap.set(fallback.id, fallback);
          if (bp.status === 'mistake') result.imported += 1;
          if (bp.insight?.trim()) result.insightsImported += 1;
        }
      }
    }
  }

  // Stage 1 を即座に IndexedDB へ反映！これで画面に全299問＋気づきが即表示される
  if (stage1Problems.length > 0) {
    await db.problems.bulkPut(stage1Problems);
  }

  onProgress?.({
    done: stage1Problems.length,
    total: Math.max(1, stage1Problems.length + imageJobs.length + 1),
    images: 0,
  });

  // Stage 2A: `users/{uid}/lessons` から授業メモ（気づき）＆暗記カードを取り込む
  const [{ database }, { get, ref }] = await Promise.all([
    getFirebase(),
    import('firebase/database'),
  ]);

  try {
    const lessonsSnap = await get(ref(database, `users/${uid}/lessons`));
    if (lessonsSnap.exists()) {
      const { lessonMemos, flashcards } = parseLessonsNode(
        lessonsSnap.val(),
        now,
      );
      const memoProblems: Problem[] = [];
      for (const memo of lessonMemos) {
        if (localProblemMap.has(memo.id)) continue;
        const built: Problem = {
          id: memo.id,
          title: memo.partTitle,
          shortTitle: memo.partTitle,
          subject: memo.subject,
          unit: memo.unit,
          answer: '',
          trap: '',
          strategy: '',
          mnemonic: '',
          insight: memo.text,
          insightUpdatedAt: memo.updatedAt,
          pinned: memo.pinned,
          kind: 'insight',
          source: 'lesson',
          imageIds: [],
          errorCount: 0,
          nextReviewAt: memo.createdAt,
          srs: { ...INITIAL_SRS },
          createdAt: memo.createdAt,
          updatedAt: memo.updatedAt,
        };
        memoProblems.push(built);
        localProblemMap.set(built.id, built);
        result.insightsImported += 1;
      }
      if (memoProblems.length > 0) {
        await db.problems.bulkPut(memoProblems);
      }

      if (flashcards.length > 0) {
        const existingCards = await db.cards.toArray();
        const existingCardIds = new Set(existingCards.map((c) => c.id));
        const newCards: Flashcard[] = [];
        for (const item of flashcards) {
          if (existingCardIds.has(item.id)) continue;
          newCards.push({
            id: item.id,
            front: item.front,
            back: item.back,
            subject: item.subject,
            unit: item.unit,
            srs: { ...INITIAL_SRS },
            nextReviewAt: now,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          });
        }
        if (newCards.length > 0) {
          await db.cards.bulkPut(newCards);
          result.flashcardsImported = newCards.length;
        }
      }
    }
  } catch {
    // lessons 取得エラー時も Stage 1 の問題データはすでに保存済み
  }

  // Stage 2A-2: AI質問アーカイブ (users/{uid}/qna_logs) を取得して db.qnaLogs に統合
  try {
    const qnaSnap = await get(ref(database, `users/${uid}/qna_logs`)).catch(
      () => null,
    );
    const qnaVal = qnaSnap ? qnaSnap.val() : null;
    if (qnaVal && typeof qnaVal === 'object') {
      const existingLogs = await db.qnaLogs.toArray();
      const existingIds = new Set(existingLogs.map((q) => q.id));
      const toPut: QnaLog[] = [];

      for (const [logId, raw] of Object.entries(
        qnaVal as Record<string, unknown>,
      )) {
        if (!logId || existingIds.has(logId) || !raw || typeof raw !== 'object') {
          continue;
        }
        const rec = raw as LegacyRecord;
        const rawMsgs = Array.isArray(rec.messages) ? rec.messages : [];
        const messages: QnaMessage[] = [];
        for (const m of rawMsgs) {
          if (!m || typeof m !== 'object') continue;
          const mRec = m as LegacyRecord;
          const content = asString(mRec.content || mRec.text).trim();
          if (!content) continue;
          const roleRaw = asString(mRec.role).toLowerCase();
          const role: 'user' | 'assistant' =
            roleRaw === 'user' ? 'user' : 'assistant';
          messages.push({ role, content });
        }
        if (messages.length === 0) continue;

        const savedAt = validIso(rec.savedAt || rec.createdAt, now);
        toPut.push({
          id: logId,
          problemId: asString(rec.problemId) || undefined,
          shortTitle:
            asString(rec.shortTitle) ||
            asString(rec.title) ||
            'AI質問アーカイブ',
          subject: asString(rec.subject) || '数学',
          unit: asString(rec.field) || asString(rec.unit) || '未分類',
          messages,
          savedAt,
          updatedAt: savedAt,
        });
      }

      if (toPut.length > 0) {
        await db.qnaLogs.bulkPut(toPut);
        notifyLocalChange();
      }
    }
  } catch {
    // ignore qna_logs error
  }

  // Stage 2B: フルサイズ画像を6並列で高速取得（またはサムネイルにフォールバック）
  if (!options?.skipFullImages && imageJobs.length > 0) {
    const CONCURRENCY = 6;
    let cursor = 0;
    let completedImages = 0;

    async function processImageJob(job: { id: string; record: LegacyRecord }) {
      const { id, record } = job;
      let urls: string[] = [];

      try {
        const snapshot = await get(
          ref(database, `users/${uid}/problemImages/${id}`),
        );
        const value = snapshot.val();
        const stored =
          value && typeof value === 'object'
            ? (value as LegacyRecord).images
            : null;
        if (Array.isArray(stored)) {
          urls = stored.filter(
            (image): image is string =>
              typeof image === 'string' && image.startsWith('data:'),
          );
        }
      } catch {
        // fallback below
      }

      const refBookProbId = asString(record.sourceRefBookProblemId);
      if (urls.length === 0 && refBookProbId) {
        try {
          const snapshot = await get(
            ref(
              database,
              `users/${uid}/refBookProblemImages/${refBookProbId}`,
            ),
          );
          const value = snapshot.val();
          const stored =
            value && typeof value === 'object'
              ? (value as LegacyRecord).images
              : null;
          if (Array.isArray(stored)) {
            urls = stored.filter(
              (image): image is string =>
                typeof image === 'string' && image.startsWith('data:'),
            );
          }
        } catch {
          // ignore
        }
      }

      if (urls.length === 0) urls = inlineImageUrls(record);
      if (urls.length === 0) {
        const thumb = thumbUrl(record);
        if (thumb) urls = [thumb];
      }

      if (urls.length === 0) {
        result.missingImages += 1;
        return;
      }

      const imageRecords: ProblemImage[] = [];
      for (const url of urls) {
        try {
          const blob = dataUrlToBlob(url);
          const { width, height } = await measureBlob(blob);
          imageRecords.push({
            id: newId('img'),
            problemId: id,
            blob,
            mimeType: blob.type || 'image/jpeg',
            width,
            height,
            createdAt: now,
          });
        } catch {
          result.missingImages += 1;
        }
      }

      if (imageRecords.length > 0) {
        await db.transaction('rw', db.problems, db.images, async () => {
          await db.images.where('problemId').equals(id).delete();
          await db.images.bulkAdd(imageRecords);
          const cur = await db.problems.get(id);
          if (cur) {
            await db.problems.put({
              ...cur,
              imageIds: imageRecords.map((img) => img.id),
            });
          }
        });
        result.images += imageRecords.length;
      }
    }

    async function worker() {
      while (cursor < imageJobs.length) {
        const job = imageJobs[cursor];
        cursor += 1;
        await processImageJob(job);
        completedImages += 1;
        onProgress?.({
          done: stage1Problems.length + completedImages,
          total: stage1Problems.length + imageJobs.length,
          images: result.images,
        });
      }
    }

    await Promise.all(
      Array.from(
        { length: Math.min(CONCURRENCY, imageJobs.length) },
        () => worker(),
      ),
    );
  }

  notifyLocalChange();
  return result;
}
