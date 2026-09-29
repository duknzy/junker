import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

try {
  process.loadEnvFile();
} catch {
  // No .env file or env already configured
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '20mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// AI Configuration Status (without exposing secret keys)
app.get('/api/ai/status', (req, res) => {
  res.json({
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    hasDeepseekKey: !!process.env.DEEPSEEK_API_KEY,
  });
});

// Server-side Gemini API Proxy
app.post('/api/gemini/generate', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const clientKey = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const apiKey = clientKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(401).json({
        error: { message: 'Gemini API key is not configured on the server or client.' }
      });
    }

    const { model = 'gemini-3.8-flash', ...geminiPayload } = req.body || {};
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const apiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiPayload)
    });

    const data = await apiRes.json();
    return res.status(apiRes.status).json(data);
  } catch (err) {
    console.error('Gemini proxy error:', err);
    return res.status(500).json({ error: { message: err?.message || 'Gemini proxy request failed' } });
  }
});

// Server-side DeepSeek API Proxy
app.post('/api/deepseek/chat', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const clientKey = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const apiKey = clientKey || process.env.DEEPSEEK_API_KEY;

    if (!apiKey) {
      return res.status(401).json({
        error: { message: 'DeepSeek API key is not configured on the server or client.' }
      });
    }

    const url = 'https://api.deepseek.com/v1/chat/completions';
    const apiRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(req.body)
    });

    const data = await apiRes.json();
    return res.status(apiRes.status).json(data);
  } catch (err) {
    console.error('DeepSeek proxy error:', err);
    return res.status(500).json({ error: { message: err?.message || 'DeepSeek proxy request failed' } });
  }
});

// Serve static assets from project root and handle /junker base prefix
app.use('/junker', express.static(__dirname, { extensions: ['html'] }));
app.use(express.static(__dirname, { extensions: ['html'] }));

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Fallback to 404.html
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Flora workspace server running at http://0.0.0.0:${PORT}`);
});
