import fs from 'fs';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const INPUT = 'tz';
const OUTPUT = path.join(__dirname, 'src', 'tz', 'tz.gen.test.ts');

const toVariableName = str =>
  str
    .replace(/\//g, '_')
    .replace(/\b\w/g, c => c.toUpperCase())
    .replace(/\-\s/g, '');

const templateImportPath = tz => `@/tz/${tz}`;

const templateImport = tz => `import ${toVariableName(tz)} from "${templateImportPath(tz)}";`;

const templateTest = tz => `
  it("${tz} returns valid offset", () => {
    const offset = ${toVariableName(tz)}(new Date());
    expect(typeof offset).toBe("number");
    expect(offset).not.toBeNaN();
    expect(offset).toBeGreaterThanOrEqual(-840);
    expect(offset).toBeLessThanOrEqual(840);
  });
`;

const timezones = fs
  .readFileSync(INPUT, 'utf-8')
  .split('\n')
  .map(line => line.trim())
  .filter(Boolean);

const timezoneImports = timezones.map(templateImport).join('\n');
const timezoneTests = timezones.map(templateTest).join('\n\n');

const contents = `
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
  import { describe, it, expect } from "vitest";
  ${timezoneImports}

  describe("Generated timezones", () => {
    ${timezoneTests}
  });
`;

fs.writeFileSync(OUTPUT, contents, 'utf-8');
console.log(`Test file created at: ${OUTPUT}`);
