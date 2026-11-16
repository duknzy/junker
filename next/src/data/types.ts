import type { Explanation, LessonCheck } from '@shared/ai-core';

export type ISODate = string;

export interface SrsState {
  state: 'new' | 'learning' | 'review' | 'relearning';
  intervalDays: number;
  ease: number;
  streak: number;
  lapses: number;
}

export interface Problem {
  id: string;
  title: string;
  shortTitle: string;
  subject: string;
  unit: string;
  answer: string;
  trap: string;
  strategy: string;
  mnemonic: string;
  /** ユーザーが記録した「気づき・極意メモ」 */
  insight?: string;
  /** 気づきメモの更新日時 */
  insightUpdatedAt?: ISODate;
  /** 気づき一覧でのピン留め（★） */
  pinned?: boolean;
  /** 軽量サムネイル Data URL（旧データ取り込み時の即時表示用） */
  thumbDataUrl?: string;
  /** 'insight' の場合は誤答リスト・復習対象から除外し、ノート（気づき一覧）専用として扱う */
  kind?: 'problem' | 'insight';
  /** 『文系の数学』連携メタデータ */
  bunkeiMode?: 'reidai' | 'exercise';
  bunkeiId?: number;
  source: 'manual' | 'photo' | 'lesson';
  imageIds: string[];
  errorCount: number;
  lastReviewedAt?: ISODate;
  nextReviewAt: ISODate;
  srs: SrsState;
  explanation?: Explanation;
  demo?: boolean;
  createdAt: ISODate;
  updatedAt: ISODate;
  deletedAt?: ISODate;
}

export interface BunkeiProgress {
  /** `${mode}_${problemId}` (例: 'reidai_1', 'exercise_1') */
  id: string;
  mode: 'reidai' | 'exercise';
  problemId: number;
  status?: 'cleared' | 'mistake';
  insight?: string;
  updatedAt: ISODate;
}

export interface ProblemImage {
  id: string;
  problemId: string;
  blob: Blob;
  mimeType: string;
  width: number;
  height: number;
  createdAt: ISODate;
}

export interface ReviewLog {
  id: string;
  problemId: string;
  result: 'correct' | 'wrong' | 'skip';
  mode: 'review' | 'daily' | 'calculation' | 'custom';
  durationMs: number;
  reviewedAt: ISODate;
}

export interface SettingsRecord {
  key: string;
  value: unknown;
}

export interface LessonPart {
  id: string;
  title: string;
  body: string;
  keyPoints: string[];
  check: LessonCheck;
}

export interface Lesson {
  id: string;
  title: string;
  subject: string;
  unit: string;
  overview: string;
  parts: LessonPart[];
  /** 完了したパートのID */
  completedPartIds: string[];
  /** 最後に開いていたパートのID */
  lastPartId?: string;
  demo?: boolean;
  createdAt: ISODate;
  updatedAt: ISODate;
  deletedAt?: ISODate;
}

export interface DrillQuestionRecord {
  unit: string;
  question: string;
  answer: string;
  explanation: string;
}

export type DrillResult = 'correct' | 'wrong' | 'skip';

export type DrillKind = 'daily' | 'custom';

export type DrillLevel = '基礎' | '標準' | '応用';

export interface DrillSession {
  id: string;
  /** ローカル日付キー（YYYY-MM-DD） */
  dateKey: string;
  /** 未指定は daily（既存データとの互換） */
  kind?: DrillKind;
  level?: DrillLevel;
  title: string;
  subject: string;
  questions: DrillQuestionRecord[];
  results: DrillResult[];
  demo?: boolean;
  createdAt: ISODate;
  updatedAt?: ISODate;
  completedAt?: ISODate;
}

export type SprintPresetId =
  | 'arithmetic'
  | 'signed'
  | 'fraction'
  | 'sqrt'
  | 'factor';

export interface SprintAnswerLog {
  prompt: string;
  answer: string;
  given: string;
  correct: boolean;
  durationMs: number;
}

export interface SprintRecord {
  id: string;
  preset: SprintPresetId;
  presetLabel: string;
  durationSec: number;
  total: number;
  correct: number;
  answers: SprintAnswerLog[];
  createdAt: ISODate;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  subject: string;
  unit: string;
  problemId?: string;
  problemTitle?: string;
  srs: SrsState;
  lastReviewedAt?: ISODate;
  nextReviewAt: ISODate;
  createdAt: ISODate;
  updatedAt: ISODate;
  deletedAt?: ISODate;
}

export interface NewFlashcardInput {
  front: string;
  back: string;
  subject: string;
  unit?: string;
  problemId?: string;
  problemTitle?: string;
}

export interface NewProblemInput {
  title: string;
  shortTitle: string;
  subject: string;
  unit: string;
  answer: string;
  trap: string;
  strategy: string;
  mnemonic: string;
  images: Array<{
    blob: Blob;
    mimeType: string;
    width: number;
    height: number;
  }>;
  source: 'manual' | 'photo' | 'lesson';
  explanation?: Explanation;
  demo?: boolean;
}

export interface QnaMessage {
  role: 'user' | 'assistant';
  content: string;
  createdAt?: ISODate;
}

export interface QnaLog {
  id: string;
  problemId?: string;
  shortTitle: string;
  subject: string;
  unit: string;
  messages: QnaMessage[];
  savedAt: ISODate;
  updatedAt: ISODate;
  deletedAt?: ISODate;
}

