import {
  runAI,
  type AIChatMessage,
  type AIRequest,
  type AIResult,
  type DrillPlan,
  type Explanation,
  type LessonPlan,
  type ProblemAnalysis,
  type QnaChatReply,
} from '@shared/ai-core';
import type { Problem } from '@/data/types';

function getLocalBrowserApiKey(): string {
  if (typeof window === 'undefined') return '';
  try {
    const direct =
      window.localStorage.getItem('flora-gemini-api-key') ||
      window.localStorage.getItem('flora_gemini_api_key') ||
      window.localStorage.getItem('gemini_api_key');
    if (direct && direct.trim()) return direct.trim();

    const poolRaw = window.localStorage.getItem('flora_api_keys_pool');
    if (poolRaw) {
      const pool = JSON.parse(poolRaw);
      if (Array.isArray(pool)) {
        for (const item of pool) {
          if (typeof item === 'string' && item.trim()) return item.trim();
          if (item && typeof item.key === 'string' && item.key.trim()) {
            return item.key.trim();
          }
        }
      }
    }
  } catch {
    // ignore
  }
  return '';
}

export async function callAI<T>(request: AIRequest): Promise<AIResult<T>> {
  const browserKey = getLocalBrowserApiKey();
  if (browserKey) {
    return runAI<T>(request, browserKey);
  }

  try {
    const response = await fetch(`${import.meta.env.BASE_URL}api/ai`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    const text = await response.text();
    if (!text) {
      return { ok: false, error: 'AIサーバーから応答がありませんでした。' };
    }

    const result = JSON.parse(text) as AIResult<T>;
    if (!result.ok) {
      return { ok: false, error: result.error ?? 'AI生成に失敗しました。' };
    }
    return result;
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? `AIサーバーに接続できませんでした: ${error.message}`
          : 'AIサーバーに接続できませんでした。',
    };
  }
}

export interface AnalyzeInput {
  text: string;
  subject: string;
  images: Array<{ mimeType: string; data: string }>;
}

export function analyzeProblem(input: AnalyzeInput): Promise<AIResult<ProblemAnalysis>> {
  return callAI<ProblemAnalysis>({
    feature: 'problem_analysis',
    text: input.text,
    subject: input.subject,
    images: input.images,
    thinkingLevel: 'high',
  });
}

export function generateExplanation(
  problem: Pick<Problem, 'title' | 'subject' | 'unit' | 'answer' | 'trap' | 'strategy'>,
): Promise<AIResult<Explanation>> {
  return callAI<Explanation>({
    feature: 'explanation',
    text: problem.title,
    subject: problem.subject,
    unit: problem.unit,
    answer: problem.answer,
    trap: problem.trap,
    strategy: problem.strategy,
    thinkingLevel: 'high',
  });
}

export function generateLessonPlan(input: {
  subject: string;
  unit: string;
  note?: string;
}): Promise<AIResult<LessonPlan>> {
  return callAI<LessonPlan>({
    feature: 'lesson_plan',
    subject: input.subject,
    unit: input.unit,
    text: input.note,
    thinkingLevel: 'high',
  });
}

export function generateDailyDrill(input: {
  subject: string;
  unit?: string;
  count: number;
  note?: string;
  level?: string;
}): Promise<AIResult<DrillPlan>> {
  return callAI<DrillPlan>({
    feature: 'daily_drill',
    subject: input.subject,
    unit: input.unit,
    count: input.count,
    text: input.note,
    level: input.level,
    thinkingLevel: 'high',
  });
}

export function askProblemQuestion(input: {
  problem: Pick<
    Problem,
    'title' | 'shortTitle' | 'subject' | 'unit' | 'answer' | 'strategy' | 'trap'
  >;
  messages: AIChatMessage[];
}): Promise<AIResult<QnaChatReply>> {
  return callAI<QnaChatReply>({
    feature: 'qna_chat',
    text: input.problem.title || input.problem.shortTitle,
    subject: input.problem.subject,
    unit: input.problem.unit,
    answer: input.problem.answer,
    strategy: input.problem.strategy,
    trap: input.problem.trap,
    messages: input.messages,
    thinkingLevel: 'medium',
  });
}

export async function checkAIStatus(): Promise<{ ok: boolean; configured: boolean }> {
  // ブラウザにAPIキーが保存されていればサーバー不要で利用可能
  const browserKey = getLocalBrowserApiKey();
  if (browserKey) {
    return { ok: true, configured: true };
  }
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}api/ai`);
    if (!response.ok) return { ok: false, configured: false };
    const json = (await response.json()) as { ok?: boolean; configured?: boolean };
    return { ok: Boolean(json.ok), configured: Boolean(json.configured) };
  } catch {
    return { ok: false, configured: false };
  }
}
