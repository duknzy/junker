import { useSyncExternalStore } from 'react';
import type { Problem } from './types';

const STORAGE_KEY = 'flora-marathon-v2';

export interface MarathonState {
  lap: number;
  scopeSubject: string;
  onlyRetryMode: boolean;
  retryTargetIds: string[];
  clearedIds: string[];
  retryIds: string[];
  autoAdvance: boolean;
  startedAt: string;
  updatedAt: string;
}

function defaultState(): MarathonState {
  const now = new Date().toISOString();
  return {
    lap: 1,
    scopeSubject: 'all',
    onlyRetryMode: false,
    retryTargetIds: [],
    clearedIds: [],
    retryIds: [],
    autoAdvance: true,
    startedAt: now,
    updatedAt: now,
  };
}

function loadState(): MarathonState {
  if (typeof window === 'undefined') return defaultState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as Partial<MarathonState>;
    const base = defaultState();
    return {
      lap:
        typeof parsed.lap === 'number' && parsed.lap >= 1
          ? Math.floor(parsed.lap)
          : 1,
      scopeSubject:
        typeof parsed.scopeSubject === 'string' && parsed.scopeSubject
          ? parsed.scopeSubject
          : 'all',
      onlyRetryMode: Boolean(parsed.onlyRetryMode),
      retryTargetIds: Array.isArray(parsed.retryTargetIds)
        ? parsed.retryTargetIds.filter((x): x is string => typeof x === 'string')
        : [],
      clearedIds: Array.isArray(parsed.clearedIds)
        ? Array.from(
            new Set(
              parsed.clearedIds.filter((x): x is string => typeof x === 'string'),
            ),
          )
        : [],
      retryIds: Array.isArray(parsed.retryIds)
        ? Array.from(
            new Set(
              parsed.retryIds.filter((x): x is string => typeof x === 'string'),
            ),
          )
        : [],
      autoAdvance:
        typeof parsed.autoAdvance === 'boolean' ? parsed.autoAdvance : true,
      startedAt:
        typeof parsed.startedAt === 'string' ? parsed.startedAt : base.startedAt,
      updatedAt:
        typeof parsed.updatedAt === 'string' ? parsed.updatedAt : base.updatedAt,
    };
  } catch {
    return defaultState();
  }
}

let currentState: MarathonState = loadState();
const listeners = new Set<() => void>();

function saveState(next: MarathonState): void {
  currentState = next;
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }
  for (const listener of listeners) listener();
}

export function getMarathonState(): MarathonState {
  return currentState;
}

export function subscribeMarathon(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useMarathon(): MarathonState {
  return useSyncExternalStore(
    subscribeMarathon,
    getMarathonState,
    getMarathonState,
  );
}

/**
 * 問題1問のマラソン判定を記録する（IDベースなので並び順や問題増減で絶対にバグらない）
 */
export function recordMarathonStep(problemId: string, correct: boolean): void {
  if (!problemId) return;
  const now = new Date().toISOString();
  const clearedSet = new Set(currentState.clearedIds);
  const retrySet = new Set(currentState.retryIds);

  if (correct) {
    clearedSet.add(problemId);
    retrySet.delete(problemId);
  } else {
    clearedSet.delete(problemId);
    retrySet.add(problemId);
  }

  saveState({
    ...currentState,
    clearedIds: Array.from(clearedSet),
    retryIds: Array.from(retrySet),
    updatedAt: now,
  });
}

export function setMarathonScope(scopeSubject: string): void {
  saveState({
    ...currentState,
    scopeSubject: scopeSubject || 'all',
    onlyRetryMode: false,
    retryTargetIds: [],
    updatedAt: new Date().toISOString(),
  });
}

export function toggleMarathonAutoAdvance(): void {
  saveState({
    ...currentState,
    autoAdvance: !currentState.autoAdvance,
    updatedAt: new Date().toISOString(),
  });
}

/**
 * 次の周回を開始する
 * - 'all': 全問題を対象に (lap + 1) 周目を開始
 * - 'retry_only': 今周で間違えた問題 (retryIds) だけを対象に集中周回を開始
 */
export function startNextMarathonLap(mode: 'all' | 'retry_only' = 'all'): void {
  const now = new Date().toISOString();
  if (mode === 'retry_only' && currentState.retryIds.length > 0) {
    saveState({
      ...currentState,
      onlyRetryMode: true,
      retryTargetIds: [...currentState.retryIds],
      clearedIds: [],
      retryIds: [],
      startedAt: now,
      updatedAt: now,
    });
    return;
  }

  saveState({
    ...currentState,
    lap: currentState.lap + 1,
    onlyRetryMode: false,
    retryTargetIds: [],
    clearedIds: [],
    retryIds: [],
    startedAt: now,
    updatedAt: now,
  });
}

export function resetMarathonProgress(resetLapToOne = false): void {
  const now = new Date().toISOString();
  saveState({
    ...currentState,
    lap: resetLapToOne ? 1 : currentState.lap,
    onlyRetryMode: false,
    retryTargetIds: [],
    clearedIds: [],
    retryIds: [],
    startedAt: now,
    updatedAt: now,
  });
}

export interface ComputedMarathonProgress {
  targetProblems: Problem[];
  total: number;
  cleared: number;
  retry: number;
  remaining: number;
  percent: number;
  isCompleted: boolean;
  clearedSet: Set<string>;
  retrySet: Set<string>;
  nextUnclearedProblem: Problem | null;
}

/**
 * 現在の実問題リストに対して、不整合ゼロでマラソン進捗を計算する
 */
export function computeMarathonProgress(
  allProblems: Problem[],
  state: MarathonState,
  currentSelectedId?: string | null,
): ComputedMarathonProgress {
  let pool =
    state.scopeSubject === 'all'
      ? allProblems
      : allProblems.filter((p) => p.subject === state.scopeSubject);

  if (state.onlyRetryMode && state.retryTargetIds.length > 0) {
    const targetSet = new Set(state.retryTargetIds);
    const retryPool = pool.filter((p) => targetSet.has(p.id));
    if (retryPool.length > 0) {
      pool = retryPool;
    }
  }

  const rawCleared = new Set(state.clearedIds);
  const rawRetry = new Set(state.retryIds);

  const validCleared = new Set<string>();
  const validRetry = new Set<string>();

  for (const p of pool) {
    if (rawCleared.has(p.id)) validCleared.add(p.id);
    if (rawRetry.has(p.id) && !rawCleared.has(p.id)) validRetry.add(p.id);
  }

  const total = pool.length;
  const cleared = validCleared.size;
  const retry = validRetry.size;
  const remaining = Math.max(0, total - cleared);
  const percent = total > 0 ? Math.min(100, Math.round((cleared / total) * 100)) : 0;
  const isCompleted = total > 0 && cleared >= total;

  // 現在選択中の問題の「次」にある未クリア問題を探す（なければ先頭の未クリア問題）
  let nextUnclearedProblem: Problem | null = null;
  if (remaining > 0) {
    const currentIndex = currentSelectedId
      ? pool.findIndex((p) => p.id === currentSelectedId)
      : -1;
    if (currentIndex >= 0) {
      for (let i = currentIndex + 1; i < pool.length; i += 1) {
        if (!validCleared.has(pool[i].id)) {
          nextUnclearedProblem = pool[i];
          break;
        }
      }
    }
    if (!nextUnclearedProblem) {
      nextUnclearedProblem =
        pool.find((p) => !validCleared.has(p.id) && p.id !== currentSelectedId) ??
        pool.find((p) => !validCleared.has(p.id)) ??
        null;
    }
  }

  return {
    targetProblems: pool,
    total,
    cleared,
    retry,
    remaining,
    percent,
    isCompleted,
    clearedSet: validCleared,
    retrySet: validRetry,
    nextUnclearedProblem,
  };
}
