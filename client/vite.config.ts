import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import react from '@vitejs/plugin-react';
import path from 'path';
import runtimeErrorModalPlugin from '@replit/vite-plugin-runtime-error-modal';

export default defineConfig({
  plugins: [react(), runtimeErrorModalPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'unsafe-none',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Content-Security-Policy': "frame-ancestors 'self' https://www.tradingview.com https://s.tradingview.com https://www.youtube.com;",
      'Access-Control-Allow-Origin': '*'
    },
    host: '0.0.0.0',
    port: 5173,
  },
});