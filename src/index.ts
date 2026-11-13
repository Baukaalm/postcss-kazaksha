import type { AtRule, Declaration, Node, PluginCreator, Result, Root, Rule } from 'postcss';
import valueParser from 'postcss-value-parser';
import selectorParser from 'postcss-selector-parser';

import * as dict from './dictionary/index.js';
import type { Dictionary, Options } from './types.js';

export type { Dictionary, DictionaryKind, Options } from './types.js';

const PLUGIN_NAME = 'postcss-kazaksha';

/** Қазақ әліпбиіндегі кириллица әріптері */
const KAZAKH_LETTER = /[а-яёәіңғүұқөһ]/i;
const IMPORTANT_RE = new RegExp(`\\s*!\\s*${dict.IMPORTANT}\\s*$`, 'iu');

/** @media / @supports / @container параметрлері аударылады */
const CONDITIONAL_AT_RULES = new Set(['media', 'supports', 'container', 'custom-media']);

type Table = ReadonlyMap<string, string>;

const table = (base: Dictionary, extra?: Dictionary): Table =>
  new Map(Object.entries({ ...base, ...extra }));

/** Сөзді кестелерден ретімен іздейді: алдыңғы кесте басым. */
const lookup = (word: string, order: Table[]): string | undefined => {
  for (const t of order) {
    const translated = t.get(word);
    if (translated !== undefined) return translated;
  }
  return undefined;
};

const kazaksha: PluginCreator<Options> = (opts = {}) => {
  const { extend = {}, strict = false } = opts;

  const tables = {
    properties: table(dict.properties, extend.properties),
    values: table(dict.values, extend.values),
    functions: table(dict.functions, extend.functions),
    selectors: table(dict.selectors, extend.selectors),
    atRules: table(dict.atRules, extend.atRules),
    mediaWords: table(dict.mediaWords, extend.mediaWords),
    keyframes: table(dict.keyframeSelectors),
  };

  const warnUnknown = (word: string, node: Node, result: Result): void => {
    if (strict && KAZAKH_LETTER.test(word)) {
      node.warn(result, `"${word}" сөзі сөздікте жоқ, аударылмады`, { word });
    }
  };

  /**
   * Осы файлдағы @кадрлар атаулары. Олар — пайдаланушы аттары, сондықтан
   * `анимация: айналдыру 1s` ішіндегі `айналдыру` scroll болып аударылмайды.
   * Once синхронды орындалады, сондықтан әр файл үшін қайта толтыру жеткілікті.
   */
  let keyframeNames = new Set<string>();

  const collectKeyframeNames = (root: Root): Set<string> => {
    const names = new Set<string>();
    root.walkAtRules((atRule) => {
      const name = lookup(atRule.name.toLowerCase(), [tables.atRules]) ?? atRule.name;
      if (/keyframes$/i.test(name) && atRule.params) names.add(atRule.params.trim());
    });
    return names;
  };

  const valueOrder = [tables.values, tables.properties];
  const mediaOrder = [tables.mediaWords, tables.properties, tables.values];

  /** `--түс` → `--color`. Сөздікте жоқ айнымалылар өзгеріссіз қалады. */
  const translateCustomProperty = (name: string): string => {
    const translated = lookup(name.slice(2), valueOrder);
    return translated ? `--${translated}` : name;
  };

  const translateValue = (
    value: string,
    order: Table[],
    node: Node,
    result: Result,
  ): string => {
    const parsed = valueParser(value);
    parsed.walk((n) => {
      if (n.type === 'function') {
        // url(...) ішіндегі жолдарды ешқашан өзгертпейміз
        if (n.value.toLowerCase() === 'url') return false;
        const fn = lookup(n.value, [tables.functions]);
        if (fn) n.value = fn;
        else if (n.value) warnUnknown(n.value, node, result);
        return undefined;
      }
      if (n.type === 'word') {
        if (n.value.startsWith('--')) {
          n.value = translateCustomProperty(n.value);
          return undefined;
        }
        if (keyframeNames.has(n.value)) return undefined;
        const translated = lookup(n.value, order);
        if (translated) n.value = translated;
        else warnUnknown(n.value, node, result);
      }
      // 'string' түйіндері әдейі аударылмайды: content: "ақ түс" өзгермейді
      return undefined;
    });
    return parsed.toString();
  };

  const processDecl = (decl: Declaration, result: Result): void => {
    if (decl.prop.startsWith('--')) {
      decl.prop = translateCustomProperty(decl.prop);
    } else {
      const prop = decl.prop.toLowerCase();
      const translated = lookup(prop, [tables.properties]);
      if (translated) decl.prop = translated;
      else warnUnknown(decl.prop, decl, result);
    }

    let value = decl.value;
    if (IMPORTANT_RE.test(value)) {
      value = value.replace(IMPORTANT_RE, '');
      decl.important = true;
    }
    decl.value = translateValue(value, valueOrder, decl, result);
  };

  const processAtRule = (atRule: AtRule, result: Result): void => {
    const name = lookup(atRule.name.toLowerCase(), [tables.atRules]);
    if (name) atRule.name = name;

    if (atRule.params && CONDITIONAL_AT_RULES.has(atRule.name.toLowerCase())) {
      atRule.params = translateValue(atRule.params, mediaOrder, atRule, result);
    }
  };

  const isInsideKeyframes = (rule: Rule): boolean => {
    const parent = rule.parent;
    return parent?.type === 'atrule' && /keyframes$/i.test((parent as AtRule).name);
  };

  const processRule = (rule: Rule, result: Result): void => {
    if (isInsideKeyframes(rule)) {
      rule.selectors = rule.selectors.map(
        (s) => lookup(s.trim(), [tables.keyframes]) ?? s,
      );
      return;
    }
    if (!rule.selector.includes(':')) return;

    rule.selector = selectorParser((selectors) => {
      selectors.walkPseudos((pseudo) => {
        const colons = pseudo.value.startsWith('::') ? '::' : ':';
        const name = pseudo.value.slice(colons.length);
        const translated = lookup(name.toLowerCase(), [tables.selectors]);
        if (translated) pseudo.value = colons + translated;
        else warnUnknown(name, rule, result);
      });
    }).processSync(rule.selector);
  };

  return {
    postcssPlugin: PLUGIN_NAME,
    Once(root, { result }) {
      keyframeNames = collectKeyframeNames(root);
      // walk() ата-ананы балаларынан бұрын аралайды, сондықтан @keyframes
      // атауы ішіндегі ережелерден бұрын аударылып үлгереді.
      root.walk((node) => {
        if (node.type === 'atrule') processAtRule(node, result);
        else if (node.type === 'rule') processRule(node, result);
        else if (node.type === 'decl') processDecl(node, result);
      });
    },
  };
};

kazaksha.postcss = true;

export default kazaksha;
