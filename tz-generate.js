import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const INPUT = 'tz';
const OUTPUT = path.join(__dirname, 'src', 'tz');

const template = timezone => `
  // NOTE: Auto-generated with a script
  // do not change anything here
  //
  //
  //
  //
  //
  //
  //
  //
  import { createTimezone } from "@/tz/createTimezone";
  export default createTimezone("${timezone}");
`;

function ensureDirExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

const timezones = fs
  .readFileSync(INPUT, 'utf-8')
  .split('\n')
  .map(line => line.trim())
  .filter(Boolean);

for (const timezone of timezones) {
  const outPath = path.join(OUTPUT, ...timezone.split('/')) + '/index.ts';
  const outDir = path.dirname(outPath);

  ensureDirExists(outDir);
  fs.writeFileSync(outPath, template(timezone), 'utf-8');
  console.log(`Created: ${outPath}`);
}
