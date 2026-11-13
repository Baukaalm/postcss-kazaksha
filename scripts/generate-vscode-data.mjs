// Сөздіктен VS Code Custom Data файлын жасайды: қазақша қасиеттер, мәндер,
// псевдокластар және at-ережелер үшін автотолықтыру.
// Іске қосу: `npm run build` (tsup-тан кейін автоматты түрде).
import { mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import * as dict from '../dist/dictionary/index.js';

const require = createRequire(import.meta.url);
const css = require('@vscode/web-custom-data/data/browsers.css-data.json');

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outFile = resolve(root, 'dist/vscode/kazaksha.css-data.json');

const byName = (list) => new Map(list.map((item) => [item.name, item]));
const cssProperties = byName(css.properties);
const cssPseudoClasses = byName(css.pseudoClasses);
const cssPseudoElements = byName(css.pseudoElements);
const cssAtDirectives = byName(css.atDirectives);

/** CSS атауы → қазақша атау (мәндер үшін кері сөздік) */
const valueToKazakh = new Map(Object.entries(dict.values).map(([kk, en]) => [en, kk]));

/** Синтаксисте ғана көрсетілген (values тізімінде жоқ) кілт сөз топтары */
const SYNTAX_GROUPS = [
  { test: /<color>/, values: ['red', 'blue', 'green', 'yellow', 'black', 'white', 'gray', 'pink', 'purple', 'brown', 'orange', 'cyan', 'transparent', 'currentcolor'] },
  { test: /line-style/, values: ['none', 'hidden', 'solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset'] },
  { test: /transition|animation|easing-function|timing-function/, values: ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out'] },
  { test: /single-animation(?!-composition)/, values: ['infinite', 'forwards', 'backwards', 'both', 'reverse', 'alternate', 'alternate-reverse', 'running', 'paused'] },
];
const GLOBAL_VALUES = ['inherit', 'initial', 'unset', 'revert'];

const md = (value) => ({ kind: 'markdown', value });

/** Қазақша атау → CSS атауы: сипаттама басында тұрады, мысалы `→ color` */
const describe = (en, source) =>
  md(`→ \`${en}\`${source?.description ? `\n\n${source.description}` : ''}`);

const valuesFor = (en) => {
  const source = cssProperties.get(en);
  const names = new Set((source?.values ?? []).map((v) => v.name));
  for (const group of SYNTAX_GROUPS) {
    if (group.test.test(source?.syntax ?? en)) group.values.forEach((v) => names.add(v));
  }
  GLOBAL_VALUES.forEach((v) => names.add(v));

  const sourceValues = byName(source?.values ?? []);
  return [...names]
    .filter((name) => valueToKazakh.has(name))
    .map((name) => ({
      name: valueToKazakh.get(name),
      description: describe(name, sourceValues.get(name)),
    }));
};

const properties = Object.entries(dict.properties).map(([kk, en]) => {
  const source = cssProperties.get(en);
  return {
    name: kk,
    description: describe(en, source),
    ...(source?.syntax && { syntax: source.syntax }),
    values: valuesFor(en),
    ...(source?.references && { references: source.references }),
  };
});

const pseudoClasses = [];
const pseudoElements = [];
for (const [kk, en] of Object.entries(dict.selectors)) {
  const element = cssPseudoElements.get(`::${en}`);
  if (element) {
    pseudoElements.push({
      name: `::${kk}`,
      description: describe(`::${en}`, element),
      ...(element.references && { references: element.references }),
    });
    continue;
  }
  const cls = cssPseudoClasses.get(`:${en}`);
  pseudoClasses.push({
    name: `:${kk}`,
    description: describe(`:${en}`, cls),
    ...(cls?.references && { references: cls.references }),
  });
}

const atDirectives = Object.entries(dict.atRules).map(([kk, en]) => {
  const source = cssAtDirectives.get(`@${en}`);
  return {
    name: `@${kk}`,
    description: describe(`@${en}`, source),
    ...(source?.references && { references: source.references }),
  };
});

const data = { version: 1.1, properties, atDirectives, pseudoClasses, pseudoElements };

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, `${JSON.stringify(data)}\n`);

const missing = Object.entries(dict.properties).filter(([, en]) => !cssProperties.has(en));
console.log(
  `VS Code data: ${properties.length} қасиет, ${atDirectives.length} at-ереже, ` +
    `${pseudoClasses.length + pseudoElements.length} селектор → ${outFile.replace(`${root}/`, '')}`,
);
if (missing.length) {
  console.warn(`CSS деректерінде жоқ қасиеттер: ${missing.map(([kk, en]) => `${kk} (${en})`).join(', ')}`);
}
