import { defineConfig } from 'vite';
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
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Permissions-Policy': 'keyboard-map=self'
    },
    host: '0.0.0.0',
    port: 5173,
  },
});