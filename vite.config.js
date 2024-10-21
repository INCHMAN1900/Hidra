import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: process.env.ELECTRON === 'true' ? './' : '/',
  server: {
    port: 28718,
  },
  build: {
    outDir: 'dist',
    assetsDir: '.',
  },
});