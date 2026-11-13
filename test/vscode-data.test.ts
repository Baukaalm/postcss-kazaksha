import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { beforeAll, describe, expect, it } from 'vitest';

import * as dict from '../src/dictionary/index.js';

interface Entry {
  name: string;
  description: { value: string };
  values?: Entry[];
}
interface Data {
  properties: Entry[];
  atDirectives: Entry[];
  pseudoClasses: Entry[];
  pseudoElements: Entry[];
}

let data: Data;

beforeAll(() => {
  execFileSync('npm', ['run', 'build'], { stdio: 'ignore' });
  data = JSON.parse(readFileSync('dist/vscode/kazaksha.css-data.json', 'utf8')) as Data;
}, 60_000);

const prop = (name: string) => data.properties.find((p) => p.name === name)!;

describe('VS Code custom data', () => {
  it("сөздіктегі әр қасиет бар", () => {
    expect(data.properties.map((p) => p.name).sort()).toEqual(Object.keys(dict.properties).sort());
  });

  it('сипаттамада CSS атауы көрсетілген', () => {
    expect(prop('көрсету').description.value).toMatch(/^→ `display`/);
  });

  it('мәндер қасиетке сәйкес келеді', () => {
    const names = (p: string) => prop(p).values!.map((v) => v.name);
    expect(names('көрсету')).toEqual(expect.arrayContaining(['икемді', 'тор', 'жоқ']));
    expect(names('көрсету')).not.toContain('қызыл');
    // values тізімі жоқ, тек синтаксисте бар: <color>, <line-style>
    expect(names('түс')).toContain('қызыл');
    expect(names('шекара')).toEqual(expect.arrayContaining(['тұтас', 'қара']));
  });

  it('селекторлар мен at-ережелер', () => {
    expect(data.pseudoClasses.map((p) => p.name)).toContain(':үстінде');
    expect(data.pseudoElements.map((p) => p.name)).toContain('::алдында');
    expect(data.atDirectives.map((p) => p.name)).toContain('@медиа');
  });
});
