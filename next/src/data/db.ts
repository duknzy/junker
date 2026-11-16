import Dexie, { type Table } from 'dexie';
import type {
  BunkeiProgress,
  DrillSession,
  Flashcard,
  Lesson,
  Problem,
  ProblemImage,
  QnaLog,
  ReviewLog,
  SettingsRecord,
  SprintRecord,
} from './types';

class FloraDB extends Dexie {
  problems!: Table<Problem, string>;
  images!: Table<ProblemImage, string>;
  reviewLogs!: Table<ReviewLog, string>;
  lessons!: Table<Lesson, string>;
  drills!: Table<DrillSession, string>;
  sprints!: Table<SprintRecord, string>;
  cards!: Table<Flashcard, string>;
  bunkeiProgress!: Table<BunkeiProgress, string>;
  qnaLogs!: Table<QnaLog, string>;
  settings!: Table<SettingsRecord, string>;

  constructor() {
    super('flora-next');

    this.version(1).stores({
      problems:
        'id, subject, nextReviewAt, updatedAt, createdAt, deletedAt, shortTitle',
      images: 'id, problemId',
      reviewLogs: 'id, problemId, reviewedAt',
      settings: 'key',
    });

    this.version(2).stores({
      problems:
        'id, subject, nextReviewAt, updatedAt, createdAt, deletedAt, shortTitle',
      images: 'id, problemId',
      reviewLogs: 'id, problemId, reviewedAt',
      lessons: 'id, subject, updatedAt, createdAt, deletedAt',
      drills: 'id, dateKey, createdAt, completedAt',
      settings: 'key',
    });

    this.version(3).stores({
      problems:
        'id, subject, nextReviewAt, updatedAt, createdAt, deletedAt, shortTitle',
      images: 'id, problemId',
      reviewLogs: 'id, problemId, reviewedAt',
      lessons: 'id, subject, updatedAt, createdAt, deletedAt',
      drills: 'id, dateKey, createdAt, completedAt',
      sprints: 'id, preset, createdAt',
      settings: 'key',
    });

    this.version(4).stores({
      problems:
        'id, subject, nextReviewAt, updatedAt, createdAt, deletedAt, shortTitle',
      images: 'id, problemId',
      reviewLogs: 'id, problemId, reviewedAt',
      lessons: 'id, subject, updatedAt, createdAt, deletedAt',
      drills: 'id, dateKey, createdAt, completedAt',
      sprints: 'id, preset, createdAt',
      cards:
        'id, problemId, subject, nextReviewAt, updatedAt, createdAt, deletedAt',
      settings: 'key',
    });

    this.version(5).stores({
      problems:
        'id, subject, nextReviewAt, updatedAt, createdAt, deletedAt, shortTitle',
      images: 'id, problemId',
      reviewLogs: 'id, problemId, reviewedAt',
      lessons: 'id, subject, updatedAt, createdAt, deletedAt',
      drills: 'id, dateKey, createdAt, completedAt',
      sprints: 'id, preset, createdAt',
      cards:
        'id, problemId, subject, nextReviewAt, updatedAt, createdAt, deletedAt',
      bunkeiProgress: 'id, mode, problemId, status, updatedAt',
      settings: 'key',
    });

    this.version(6).stores({
      problems:
        'id, subject, nextReviewAt, updatedAt, createdAt, deletedAt, shortTitle',
      images: 'id, problemId',
      reviewLogs: 'id, problemId, reviewedAt',
      lessons: 'id, subject, updatedAt, createdAt, deletedAt',
      drills: 'id, dateKey, createdAt, completedAt',
      sprints: 'id, preset, createdAt',
      cards:
        'id, problemId, subject, nextReviewAt, updatedAt, createdAt, deletedAt',
      bunkeiProgress: 'id, mode, problemId, status, updatedAt',
      qnaLogs: 'id, problemId, subject, savedAt, updatedAt, deletedAt',
      settings: 'key',
    });
  }
}

export const db = new FloraDB();
