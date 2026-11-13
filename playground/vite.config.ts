import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  root: __dirname,
  // GitHub Pages: https://baukaalm.github.io/postcss-kazaksha/
  base: process.env.PLAYGROUND_BASE ?? '/postcss-kazaksha/',
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // HeroUI + React + PostCSS бір бетте: ~200 KB gzip, бұл қалыпты
    chunkSizeWarningLimit: 1000,
  },
});
