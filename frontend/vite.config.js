// ============================================
// Webowo v3.1 – Vite Config
// ============================================

import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: './index.html',
        admin: './admin.html'
      }
    }
  },
  server: {
    port: 7777,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/uploads': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  css: {
    devSourcemap: true
  }
});
