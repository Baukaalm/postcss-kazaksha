import postcss from 'postcss';
import { describe, expect, it } from 'vitest';

import kazaksha, { type Options } from '../src/index.js';
import * as dict from '../src/dictionary/index.js';

const run = (input: string, opts?: Options) => {
  const result = postcss([kazaksha(opts)]).process(input, { from: undefined });
  return { css: result.css, warnings: result.warnings().map((w) => w.text) };
};
const css = (input: string, opts?: Options) => run(input, opts).css;

describe('қасиеттер мен мәндер', () => {
  it('негізгі аударма', () => {
    expect(css('a { түс: қызыл; фон-түсі: ақ }')).toBe('a { color: red; background-color: white }');
  });

  it('қасиет атауы регистрге тәуелсіз', () => {
    expect(css('a { ТҮС: red }')).toBe('a { color: red }');
  });

  it('бірнеше сөзден тұратын мән', () => {
    expect(css('a { шекара: 1px тұтас қара }')).toBe('a { border: 1px solid black }');
  });

  it('стандартты CSS өзгеріссіз қалады', () => {
    const input = 'a { color: red; margin: 0 auto; transform: scale(1.1) }';
    expect(css(input)).toBe(input);
  });
});

describe('v1 багтары', () => {
  it('қатар display-де row болып кетпейді: жол-ішілік → inline', () => {
    expect(css('a { көрсету: жол-ішілік }')).toBe('a { display: inline }');
    expect(css('a { икемді-бағыт: қатар }')).toBe('a { flex-direction: row }');
  });

  it('қию қасиеті clip болып аударылады (бұрын cover болатын)', () => {
    expect(css('a { қию: auto }')).toBe('a { clip: auto }');
    expect(css('a { фон-өлшемі: жабу }')).toBe('a { background-size: cover }');
  });

  it('жолдар (strings) ішіндегі мәтін аударылмайды', () => {
    expect(css('a::before { мазмұн: "ақ түс" }')).toBe('a::before { content: "ақ түс" }');
    expect(css("a { тор-үлгі-аймақтар: 'сол оң' }")).toBe("a { grid-template-areas: 'сол оң' }");
  });

  it('url() ішіндегі жол аударылмайды', () => {
    expect(css('a { фон-суреті: url(сары.png) }')).toBe('a { background-image: url(сары.png) }');
    expect(css('a { фон: url("ақ/қара.svg") қайталамау }')).toBe(
      'a { background: url("ақ/қара.svg") no-repeat }',
    );
  });

  it('README мысалы толық аударылады: барлық, масштаб', () => {
    expect(css('a { өту: барлық 0.3s; түрлендіру: масштаб(1.1) }')).toBe(
      'a { transition: all 0.3s; transform: scale(1.1) }',
    );
  });

  it('сөз бөлігі ауыстырылмайды', () => {
    expect(css('a { анимация-аты: ақсүйек }')).toBe('a { animation-name: ақсүйек }');
  });

  it('мәндердегі бас әріптер (мысалы, қаріп атаулары) өзгермейді', () => {
    expect(css('a { қаріп-жанұясы: Қара, sans-serif }')).toBe('a { font-family: Қара, sans-serif }');
  });
});

describe('функциялар', () => {
  it('ішкі функциялар мен мәндер', () => {
    expect(css('a { тор-үлгі-бағандар: қайталау(авто-толтыру, мин-макс(100px, 1fr)) }')).toBe(
      'a { grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)) }',
    );
  });

  it('есептеу және градиент', () => {
    expect(css('a { ені: есептеу(100% - 10px); фон: сызықтық-градиент(қызыл, көк) }')).toBe(
      'a { width: calc(100% - 10px); background: linear-gradient(red, blue) }',
    );
  });

  it('өту ішіндегі қасиет атауы', () => {
    expect(css('a { өту: түс 0.2s жұмсақ-кіру-шығу }')).toBe('a { transition: color 0.2s ease-in-out }');
  });
});

describe('CSS айнымалылары', () => {
  it('сөздікте бар айнымалы аударылады', () => {
    expect(css(':root { --түс: көк } a { түс: var(--түс) }')).toBe(
      ':root { --color: blue } a { color: var(--color) }',
    );
  });

  it('сөздікте жоқ айнымалы өзгермейді, fallback аударылады', () => {
    expect(css('a { түс: var(--негізгі-түс, қызыл) }')).toBe('a { color: var(--негізгі-түс, red) }');
  });
});

describe('!маңызды', () => {
  it('!important-ке айналады', () => {
    expect(css('a { түс: қызыл !маңызды }')).toBe('a { color: red !important }');
  });
});

describe('селекторлар', () => {
  it('псевдокластар мен псевдоэлементтер', () => {
    expect(css('a:үстінде, b::алдында, li:n-ші-бала(2n) {}')).toBe('a:hover, b::before, li:nth-child(2n) {}');
  });

  it('класс аттары мен атрибуттар өзгермейді', () => {
    expect(css('.ақ[data-x="сол:оң"]:фокус {}')).toBe('.ақ[data-x="сол:оң"]:focus {}');
  });
});

describe('at-ережелер', () => {
  it('@медиа және параметрлер', () => {
    expect(css('@медиа экран және (ең-кіші-ені: 768px) { a { ені: 100% } }')).toBe(
      '@media screen and (min-width: 768px) { a { width: 100% } }',
    );
  });

  it('@қолдау', () => {
    expect(css('@қолдау (көрсету: тор) {}')).toBe('@supports (display: grid) {}');
  });

  it('@кадрлар: бастап/дейін, атау өзгермейді', () => {
    expect(css('@кадрлар айналу { бастап { мөлдірлік: 0 } дейін { мөлдірлік: 1 } }')).toBe(
      '@keyframes айналу { from { opacity: 0 } to { opacity: 1 } }',
    );
  });

  it('анимация атауы сөздіктегі сөзбен сәйкес келсе де аударылмайды', () => {
    // `айналдыру` — сөздікте scroll, бірақ мұнда пайдаланушының @кадрлар атауы
    expect(css('@кадрлар айналдыру {} a { анимация: айналдыру 1s сызықтық }')).toBe(
      '@keyframes айналдыру {} a { animation: айналдыру 1s linear }',
    );
    expect(css('a { тасу: айналдыру }')).toBe('a { overflow: scroll }');
  });

  it('strict: @кадрлар атаулары ескерту бермейді', () => {
    const { warnings } = run('@кадрлар пайда-болу {} a { анимация-аты: пайда-болу }', { strict: true });
    expect(warnings).toEqual([]);
  });

  it('@импорт жолы өзгермейді', () => {
    expect(css('@импорт "ақ.css";')).toBe('@import "ақ.css";');
  });
});

describe('терминология', () => {
  it('фон және шегіністер', () => {
    expect(css('a { фон-түсі: ақ; сыртқы-шегініс: 0 авто; ішкі-шегініс-жоғарғы: 8px }')).toBe(
      'a { background-color: white; margin: 0 auto; padding-top: 8px }',
    );
  });

  it('justify = теңестіру, align = туралау', () => {
    expect(css('a { мазмұнды-теңестіру: орта; мазмұнды-туралау: созу }')).toBe(
      'a { justify-content: center; align-content: stretch }',
    );
  });

  it('ортасы сызылған және үсті сызылған әртүрлі', () => {
    expect(css('a { мәтін-безендіру: ортасы-сызылған } b { мәтін-безендіру: үсті-сызылған }')).toBe(
      'a { text-decoration: line-through } b { text-decoration: overline }',
    );
  });

  it('ескі v1 атаулары енді аударылмайды', () => {
    expect(run('a { аспап: auto }', { strict: true }).warnings).toEqual([
      '"аспап" сөзі сөздікте жоқ, аударылмады',
    ]);
  });
});

describe('опциялар', () => {
  it('extend: өз сөздеріңіз', () => {
    expect(css('a { түс: теңіз }', { extend: { values: { 'теңіз': '#1e90ff' } } })).toBe(
      'a { color: #1e90ff }',
    );
  });

  it('strict: аударылмаған қазақ сөздеріне ескерту', () => {
    const { warnings } = run('a { түс: жұлдыз; foo: bar }', { strict: true });
    expect(warnings).toEqual(['"жұлдыз" сөзі сөздікте жоқ, аударылмады']);
  });
});

describe('сөздік тұтастығы', () => {
  it('бір CSS қасиетіне бір ғана қазақша атау', () => {
    const seen = new Map<string, string>();
    for (const [kk, en] of Object.entries(dict.properties)) {
      expect(seen.get(en), `${en}: ${seen.get(en)} / ${kk}`).toBeUndefined();
      seen.set(en, kk);
    }
  });
});
