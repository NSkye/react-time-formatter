import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const INPUT_FILE = 'timezones';
const OUTPUT_BASE_DIR = path.join(__dirname, 'src', 'tz');

const template = timezone => `
  import { createTimezone } from "@/tz/createTimezone";
  export default createTimezone("${timezone}");
`;

function ensureDirExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function generateFiles() {
  const timezones = fs
    .readFileSync(INPUT_FILE, 'utf-8')
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean); // skip empty lines

  for (const timezone of timezones) {
    const outPath = path.join(OUTPUT_BASE_DIR, ...timezone.split('/')) + '/index.ts';
    const outDir = path.dirname(outPath);

    ensureDirExists(outDir);
    fs.writeFileSync(outPath, template(timezone), 'utf-8');
    console.log(`Created: ${outPath}`);
  }
}

generateFiles();
