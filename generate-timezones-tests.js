import fs from 'fs';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const INPUT_FILE = 'timezones';
const TEST_FILE_PATH = path.join(__dirname, 'src', 'tz', 'tz.gen.test.ts');

function pascalCase(str) {
  return str
    .replace(/([/])/g, '_')
    .replace(/[- ]/g, '')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function generateTestContent(timezones) {
  const imports = timezones
    .map(tz => {
      const varName = pascalCase(tz);
      const importPath = `@/tz/${tz}`;
      return `import ${varName} from "${importPath}";`;
    })
    .join('\n');

  const tests = timezones
    .map(tz => {
      const varName = pascalCase(tz);
      return `  it("${tz} returns valid offset", () => {
    const offset = ${varName}(new Date());
    expect(typeof offset).toBe("number");
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });`;
    })
    .join('\n\n');

  return `import { describe, it, expect } from "vitest";
${imports}

describe("All timezone modules", () => {
${tests}
});
`;
}

function generateTestFile() {
  const timezones = fs
    .readFileSync(INPUT_FILE, 'utf-8')
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  const content = generateTestContent(timezones);
  fs.writeFileSync(TEST_FILE_PATH, content, 'utf-8');
  console.log(`Test file created at: ${TEST_FILE_PATH}`);
}

generateTestFile();
