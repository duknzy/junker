import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { IncomingMessage, ServerResponse } from 'node:http';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function readBody(req: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString('utf8');
}

/**
 * ローカル開発用のAIプロキシ。
 * 本番は functions/api/ai.ts（Cloudflare Pages Functions）が同じ shared/ai-core.ts を使う。
 */
function aiDevPlugin(apiKey: string): Plugin {
  return {
    name: 'flora-ai-dev',
    configureServer(server) {
      server.middlewares.use('/api/ai', async (req, res: ServerResponse, next) => {
        if (req.method === 'GET') {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify({ ok: true, configured: Boolean(apiKey) }));
          return;
        }
        if (req.method !== 'POST') {
          next();
          return;
        }

        try {
          const body = await readBody(req);
          const payload = JSON.parse(body);
          const mod = await server.ssrLoadModule('/shared/ai-core.ts');
          const result = await mod.runAI(payload, apiKey);
          res.statusCode = result.ok ? 200 : 502;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify(result));
        } catch (error) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(
            JSON.stringify({
              ok: false,
              error: error instanceof Error ? error.message : String(error),
            }),
          );
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, '..'), '');

  // GitHub Pages では /junker/ ベースパス。ローカル開発は /。
  const base = mode === 'production' ? '/junker/' : '/';

  return {
    base,
    // ルートの .env / .env.local をサーバー・クライアント両方で使う。
    // クライアントへは VITE_ 接頭辞の変数だけが公開される。
    envDir: path.resolve(__dirname, '..'),
    plugins: [react(), tailwindcss(), aiDevPlugin(env.GEMINI_API_KEY || '')],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@shared': path.resolve(__dirname, 'shared'),
      },
    },
    server: {
      port: 5174,
      open: false,
      headers: {
        // Firebase の signInWithPopup が window.closed を監視できるようにする
        'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      },
    },
  };
});
