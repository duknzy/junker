import type { SrsState } from './types';

export const INITIAL_SRS: SrsState = {
  state: 'new',
  intervalDays: 0,
  ease: 2.5,
  streak: 0,
  lapses: 0,
};

const CORRECT_INTERVALS = [1, 3, 7, 14, 30, 60];

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export interface ScheduleResult {
  srs: SrsState;
  nextReviewAt: string;
}

export function scheduleReview(
  current: SrsState,
  correct: boolean,
  now = new Date(),
): ScheduleResult {
  if (correct) {
    const streak = current.streak + 1;
    const intervalDays =
      CORRECT_INTERVALS[Math.min(streak - 1, CORRECT_INTERVALS.length - 1)];
    return {
      srs: {
        state: streak >= 3 ? 'review' : 'learning',
        intervalDays,
        ease: Math.min(2.8, current.ease + 0.05),
        streak,
        lapses: current.lapses,
      },
      nextReviewAt: addDays(now, intervalDays).toISOString(),
    };
  }

  return {
    srs: {
      state: current.state === 'new' ? 'learning' : 'relearning',
      intervalDays: 1,
      ease: Math.max(2.0, current.ease - 0.2),
      streak: 0,
      lapses: current.lapses + 1,
    },
    nextReviewAt: addDays(now, 1).toISOString(),
  };
}

export function isDue(nextReviewAt: string, now = new Date()): boolean {
  return new Date(nextReviewAt).getTime() <= now.getTime();
}

export function describeNextReview(nextReviewAt: string): string {
  const due = new Date(nextReviewAt);
  const now = new Date();
  const diff = due.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (diff <= 0) return '今日';
  if (days <= 1) return '明日';
  if (days <= 7) return `${days}日後`;
  return `${Math.ceil(days / 7)}週間後`;
}
