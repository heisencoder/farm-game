import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';
import path from 'path';

export default defineConfig({
  plugins: [basicSsl()],
  server: {
    https: {},
    port: 3000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ['phaser'],
        },
      },
    },
  },
});
