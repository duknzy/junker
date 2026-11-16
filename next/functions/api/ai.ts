import { runAI } from '../../shared/ai-core';

interface Env {
  GEMINI_API_KEY?: string;
}

export const onRequestGet = async () => {
  return Response.json({ ok: true });
};

export const onRequestPost = async (context: {
  request: Request;
  env: Env;
}) => {
  try {
    const payload = await context.request.json();
    const result = await runAI(payload, context.env.GEMINI_API_KEY || '');
    return Response.json(result, { status: result.ok ? 200 : 502 });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
};
