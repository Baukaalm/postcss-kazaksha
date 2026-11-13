import type { Dictionary } from '../types.js';

/** Функциялар: `масштаб(1.1)` → `scale(1.1)` */
export const functions: Dictionary = {
  'масштаб': 'scale',
  'масштаб-x': 'scaleX',
  'масштаб-y': 'scaleY',
  'бұру': 'rotate',
  'жылжыту': 'translate',
  'жылжыту-x': 'translateX',
  'жылжыту-y': 'translateY',
  'қисайту': 'skew',
  'есептеу': 'calc',
  'мин': 'min',
  'макс': 'max',
  'шектеу': 'clamp',
  'мин-макс': 'minmax',
  'қайталау': 'repeat',
  'сызықтық-градиент': 'linear-gradient',
  'радиалды-градиент': 'radial-gradient',
  'конустық-градиент': 'conic-gradient',
  'бұлыңғырлау': 'blur',
  'жарықтық': 'brightness',
  'контраст': 'contrast',
  'сұр-реңк': 'grayscale',
  'көлеңке-түсіру': 'drop-shadow',
  'кубтық-безье': 'cubic-bezier',
  'қадамдар': 'steps',
};

/** Псевдокластар мен псевдоэлементтер: `:үстінде` → `:hover` */
export const selectors: Dictionary = {
  'үстінде': 'hover',
  'фокус': 'focus',
  'фокус-ішінде': 'focus-within',
  'фокус-көрінетін': 'focus-visible',
  'белсенді': 'active',
  'барылған': 'visited',
  'өшірілген': 'disabled',
  'қосылған': 'enabled',
  'белгіленген': 'checked',
  'бос': 'empty',
  'түбір': 'root',
  'бірінші-бала': 'first-child',
  'соңғы-бала': 'last-child',
  'жалғыз-бала': 'only-child',
  'n-ші-бала': 'nth-child',
  'емес': 'not',
  'бар': 'has',
  'алдында': 'before',
  'кейін': 'after',
  'толтырғыш': 'placeholder',
  'таңдалған': 'selection',
};

/** At-ережелер: `@медиа` → `@media` */
export const atRules: Dictionary = {
  'медиа': 'media',
  'кадрлар': 'keyframes',
  'қолдау': 'supports',
  'импорт': 'import',
  'қаріп-беті': 'font-face',
  'контейнер': 'container',
  'қабат': 'layer',
};

/** @media / @supports / @container параметрлеріндегі сөздер */
export const mediaWords: Dictionary = {
  'экран': 'screen',
  'басып-шығару': 'print',
  'барлық': 'all',
  'және': 'and',
  'немесе': 'or',
  'емес': 'not',
  'тек': 'only',
  'бағдар': 'orientation',
  'тік': 'portrait',
  'көлденең': 'landscape',
  'түс-схемасы': 'prefers-color-scheme',
  'қараңғы': 'dark',
  'ашық': 'light',
  'азайтылған-қозғалыс': 'prefers-reduced-motion',
  'азайту': 'reduce',
};

/** @keyframes ішіндегі селекторлар */
export const keyframeSelectors: Dictionary = {
  'бастап': 'from',
  'дейін': 'to',
};

/** `!маңызды` → `!important` */
export const IMPORTANT = 'маңызды';
