import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: './index.html',
        admin: './admin.html'
      }
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:6666',
        changeOrigin: true
      },
      '/uploads': {
        target: 'http://localhost:6666',
        changeOrigin: true
      }
    }
  }
});
