import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/dictionary/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  // CJS-те `require('postcss-kazaksha')` плагиннің өзін қайтарады (v1 сияқты)
  cjsInterop: true,
  splitting: true,
  target: 'node20',
});
