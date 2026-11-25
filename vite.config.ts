import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { GoogleGenAI } from '@google/genai';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      {
        name: 'gemini-ephemeral-token-middleware',
        configureServer(server) {
          server.middlewares.use('/api/token', async (req, res) => {
            if (req.method !== 'POST' && req.method !== 'GET') {
              res.statusCode = 405;
              res.end(JSON.stringify({ error: 'Method not allowed' }));
              return;
            }

            const apiKey = (env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '').trim();
            if (!apiKey) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Missing GEMINI_API_KEY in .env.local' }));
              return;
            }

            try {
              const ai = new GoogleGenAI({
                apiKey,
                httpOptions: { apiVersion: 'v1beta' },
              });
              const expireTime = new Date(Date.now() + 30 * 60 * 1000).toISOString();
              const newSessionExpireTime = new Date(Date.now() + 2 * 60 * 1000).toISOString();
              const token = await ai.authTokens.create({
                config: {
                  uses: 1,
                  expireTime,
                  newSessionExpireTime,
                  liveConnectConstraints: {
                    model: 'gemini-3.8-live',
                  },
                },
              });

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Cache-Control', 'no-store');
              res.end(JSON.stringify({ token: token.name }));
            } catch (err: unknown) {
              const message = err instanceof Error ? err.message : 'Token generation failed';
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: message }));
            }
          });
        },
      },
    ],
  };
});
