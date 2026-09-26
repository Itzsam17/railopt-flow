import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/kpis': 'http://127.0.0.1:8000',
      '/tracks': 'http://127.0.0.1:8000',
      '/conflicts': {
        target: 'http://127.0.0.1:8000',
        bypass: (req) => {
          if (req.headers.accept?.includes('html')) {
            return '/index.html';
          }
        },
      },
      '/maintenance-requests': 'http://127.0.0.1:8000',
      '/optimize': 'http://127.0.0.1:8000',
      '/api': 'http://127.0.0.1:8000',
    },
  },
});
