import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    pool: 'threads',
    isolate: false,
    fileParallelism: false,
    poolOptions: {
      forks: { isolate: false },
    },
    coverage: {
      provider: 'v8',
      reporter: ['cobertura'],
    },
    include: ['**/*.e2e-spec.ts'],
    globals: true,
    root: './',
  },
  plugins: [swc.vite()],
});
