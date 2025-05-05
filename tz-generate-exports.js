import glob from 'fast-glob';
import { promises as fs } from 'fs';
import path from 'path';

const EXPORTS_START_KEY = './tz/';

async function run() {
  const pkgPath = path.resolve('package.json');
  const pkg = JSON.parse(await fs.readFile(pkgPath, 'utf8'));

  const files = await glob('src/tz/**/index.ts', { dot: false });
  const newExports = {};

  for (const file of files) {
    const relativePath = file.replace(/^src\//, '').replace(/\/index\.ts$/, '');
    const distPath = `./dist/${relativePath}`;

    newExports[`./${relativePath}`] = {
      types: `${distPath}/index.d.ts`,
      import: `${distPath}/index.js`,
      require: `${distPath}/index.cjs`,
    };
  }

  pkg.exports = pkg.exports || {};

  for (const key of Object.keys(pkg.exports)) {
    if (key.startsWith(EXPORTS_START_KEY)) {
      delete pkg.exports[key];
    }
  }

  Object.assign(pkg.exports, newExports);

  await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2));
  console.log(`Updated package.json with ${files.length} timezone exports.`);
}

run().catch(err => {
  console.error('❌ Failed to generate exports:', err);
  process.exit(1);
});
