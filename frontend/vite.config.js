import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin.html')
      }
    },
    chunkSizeWarningLimit: 500,
  },
  server: {
    port: 7777,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:6666',
        changeOrigin: true
      }
    }
  },
  preview: {
    port: 7777
  },
  css: {
    devSourcemap: true
  },
  envPrefix: 'VITE_'
});
