import glob from 'fast-glob';
import { defineConfig } from 'tsup';

const mainConfig = {
  outDir: 'dist',
  tsconfig: './tsconfig.main.json',
  external: ['react', 'react-dom'],
  sourcemap: false,
  clean: true,
  splitting: true,
  minify: true,
  esbuildOptions(options) {
    options.minifyIdentifiers = true;
    options.minifySyntax = true;
    options.minifyWhitespace = true;
    options.treeShaking = true;
  },
};

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    ...mainConfig,
  },
  {
    entry: {
      Duration: 'src/duration/react/Duration.tsx',
      DateTime: 'src/date-time/react/DateTime.tsx',
      Interval: 'src/interval/react/Interval.tsx',
    },
    format: ['esm', 'cjs'],
    dts: true,
    ...mainConfig,
  },
  {
    // Dynamically add timezone modules as separate entries
    entry: await glob('src/tz/**/index.ts'),
    format: ['esm', 'cjs'],
    outDir: 'dist/tz',
    dts: true,
    sourcemap: false,
    silent: true,
    tsconfig: './tsconfig.main.json',
  },
]);
