import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Routes /api/anthropic/* → https://api.anthropic.com/*
      // Avoids CORS: browser hits same-origin /api/anthropic, Vite forwards
      // the request server-side where CORS doesn't apply.
      '/api/anthropic': {
        target: 'https://api.anthropic.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/anthropic/, ''),
      },
    },
  },
})
