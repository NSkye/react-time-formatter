import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      jsxRuntime: 'classic',
    }),
  ],
  resolve: {
    alias: {
      '@entities': path.resolve(__dirname, './src/@entities'),
      '@shared': path.resolve(__dirname, './src/@shared'),
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    minify: mode === 'production',
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: format => `react-time-formatter.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*'],
      /** Timezones are too verbose and to be tested separately */
      exclude: ['src/tz/**/*', 'dist/**/*'],
    },
  },
}));
