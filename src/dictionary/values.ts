import type { Dictionary } from '../types.js';

/** Кілт сөздер (мәндер): қазақша → CSS */
export const values: Dictionary = {
  // === ТҮСТЕР ===
  'қызыл': 'red',
  'көк': 'blue',
  'жасыл': 'green',
  'сары': 'yellow',
  'қара': 'black',
  'ақ': 'white',
  'сұр': 'gray',
  'қызғылт': 'pink',
  'күлгін': 'purple',
  'қоңыр': 'brown',
  'қызғылт-сары': 'orange',
  'көгілдір': 'cyan',
  'мөлдір': 'transparent',
  'ағымдағы-түс': 'currentcolor',

  // === DISPLAY ===
  'жоқ': 'none',
  'блок': 'block',
  'жол-ішілік': 'inline',
  'жол-ішілік-блок': 'inline-block',
  'икемді': 'flex',
  'жол-ішілік-икемді': 'inline-flex',
  'тор': 'grid',
  'жол-ішілік-тор': 'inline-grid',
  'кесте': 'table',
  'мазмұндар': 'contents',

  // === POSITION ===
  'салыстырмалы': 'relative',
  'абсолютті': 'absolute',
  'бекітілген': 'fixed',
  'жабысқақ': 'sticky',
  'статикалық': 'static',

  // === БАҒЫТТАР ===
  'жоғары': 'top',
  'төмен': 'bottom',
  'сол': 'left',
  'оң': 'right',
  'орта': 'center',
  'екі-жаққа': 'justify',
  'басы': 'start',
  'соңы': 'end',

  // === ҚАРІП ===
  'қалыпты': 'normal',
  'жуан': 'bold',
  'жуанырақ': 'bolder',
  'жіңішкерек': 'lighter',
  'көлбеу': 'italic',
  'бас-әріп': 'uppercase',
  'кіші-әріп': 'lowercase',
  'бас-әріппен-бастау': 'capitalize',
  'асты-сызылған': 'underline',
  'ортасы-сызылған': 'line-through',
  'үсті-сызылған': 'overline',
  'орамау': 'nowrap',
  'көп-нүкте': 'ellipsis',

  // === FLEX / GRID ===
  'қатар': 'row',
  'қатар-кері': 'row-reverse',
  'баған': 'column',
  'баған-кері': 'column-reverse',
  'орау': 'wrap',
  'орау-кері': 'wrap-reverse',
  'арасында-бос': 'space-between',
  'айналасында-бос': 'space-around',
  'тең-бос': 'space-evenly',
  'созу': 'stretch',
  'икемді-басы': 'flex-start',
  'икемді-соңы': 'flex-end',
  'тығыз': 'dense',
  'авто-толтыру': 'auto-fill',
  'авто-сыю': 'auto-fit',

  // === МЕҢЗЕР ===
  'нұсқағыш': 'pointer',
  'қол': 'grab',
  'ұстау': 'grabbing',
  'мәтін': 'text',
  'рұқсат-жоқ': 'not-allowed',
  'күту': 'wait',

  // === ТАСУ / КӨРІНУ ===
  'көрінбейтін': 'hidden',
  'көрінетін': 'visible',
  'айналдыру': 'scroll',
  'авто': 'auto',
  'тегіс': 'smooth',

  // === ШЕКАРА СТИЛІ ===
  'тұтас': 'solid',
  'үзік': 'dashed',
  'нүктелі': 'dotted',
  'қос': 'double',
  'ойық': 'groove',
  'бедер': 'ridge',
  'ішке': 'inset',
  'сыртқа': 'outset',

  // === АНИМАЦИЯ ===
  'барлық': 'all',
  'шексіз': 'infinite',
  'алға': 'forwards',
  'артқа': 'backwards',
  'екеуі-де': 'both',
  'кері': 'reverse',
  'кезекпе-кезек': 'alternate',
  'кезекпе-кезек-кері': 'alternate-reverse',
  'жүруде': 'running',
  'кідірген': 'paused',
  'сызықтық': 'linear',
  'жұмсақ': 'ease',
  'жұмсақ-кіру': 'ease-in',
  'жұмсақ-шығу': 'ease-out',
  'жұмсақ-кіру-шығу': 'ease-in-out',

  // === СУРЕТ / ФОН ===
  'жабу': 'cover',
  'сыю': 'contain',
  'толтыру': 'fill',
  'кішірейіп-сыю': 'scale-down',
  'қайталау': 'repeat',
  'қайталамау': 'no-repeat',
  'қайталау-x': 'repeat-x',
  'қайталау-y': 'repeat-y',
  'дөңгелектеу': 'round',
  'бос-орынмен': 'space',
  'шекара-қорабы': 'border-box',
  'мазмұн-қорабы': 'content-box',
  'ішкі-шегініс-қорабы': 'padding-box',

  // === ЖАЛПЫ ===
  'мұралау': 'inherit',
  'бастапқы': 'initial',
  'орнатылмаған': 'unset',
  'қайтару': 'revert',
};
