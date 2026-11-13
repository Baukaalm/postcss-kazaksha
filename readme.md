# postcss-kazaksha 🇰🇿

PostCSS плагині: қазақша CSS жазып, стандартты CSS-ке аударыңыз!

**[Онлайн ойын алаңы](https://baukaalm.github.io/postcss-kazaksha/)**: орнатпай-ақ браузерде байқап көріңіз.

## Орнату

```bash
npm install -D postcss-kazaksha
```

Node.js 20+ және PostCSS 8 қажет.

## Қолдану

**postcss.config.js:**

```js
module.exports = {
  plugins: [require('postcss-kazaksha')],
};
```

**ESM / TypeScript:**

```ts
import kazaksha from 'postcss-kazaksha';

export default {
  plugins: [kazaksha({ strict: true })],
};
```

## Мысал

**Қазақша CSS:**

```css
:root {
  --негізгі-түс: көк;
}

.батырма {
  фон-түсі: var(--негізгі-түс);
  түс: ақ;
  шекара: 1px тұтас мөлдір;
  меңзер: нұсқағыш;
  өту: барлық 0.3s жұмсақ;
}

.батырма:үстінде {
  түрлендіру: масштаб(1.1);
}

.тор {
  көрсету: тор;
  тор-үлгі-бағандар: қайталау(авто-толтыру, мин-макс(200px, 1fr));
  аралық: 20px;
}

@медиа экран және (ең-кіші-ені: 768px) {
  .тор {
    ені: есептеу(100% - 40px) !маңызды;
  }
}

@кадрлар пайда-болу {
  бастап { мөлдірлік: 0 }
  дейін { мөлдірлік: 1 }
}
```

**Нәтиже:**

```css
:root {
  --негізгі-түс: blue;
}

.батырма {
  background-color: var(--негізгі-түс);
  color: white;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.батырма:hover {
  transform: scale(1.1);
}

.тор {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

@media screen and (min-width: 768px) {
  .тор {
    width: calc(100% - 40px) !important;
  }
}

@keyframes пайда-болу {
  from { opacity: 0 }
  to { opacity: 1 }
}
```

Класс атаулары, `"тырнақшадағы мәтін"` және `url(...)` ішіндегі жолдар өзгертілмейді.
Мәндерде тек кіші әріппен жазылған кілт сөздер аударылады, сондықтан `Қара Sans` сияқты қаріп атаулары өзгермейді.

## Не аударылады

| Бөлім | Мысалдар |
|---|---|
| Қасиеттер | `түс`, `фон-түсі`, `ені`, `сыртқы-шегініс`, `ішкі-шегініс`, `көрсету`, `меңзер` |
| Мәндер | `қызыл`, `тұтас`, `орта`, `жол-ішілік`, `жоқ`, `авто`, `барлық` |
| Функциялар | `масштаб()`, `бұру()`, `есептеу()`, `қайталау()`, `сызықтық-градиент()` |
| Псевдокластар | `:үстінде`, `:фокус`, `:белсенді`, `:n-ші-бала()`, `::алдында`, `::кейін` |
| At-ережелер | `@медиа`, `@кадрлар`, `@қолдау`, `@контейнер`, `@қабат`, `@импорт` |
| Медиа | `экран`, `басып-шығару`, `және`, `түс-схемасы: қараңғы` |
| Басқа | `!маңызды`, `бастап` / `дейін` |

Толық тізім: [`src/dictionary`](./src/dictionary). Сөздікті кодтан да алуға болады:

```js
import { properties, values } from 'postcss-kazaksha/dictionary';
```

## VS Code: автотолықтыру

Пакетпен бірге VS Code үшін деректер файлы келеді: редактор қазақша қасиеттерді, әр қасиетке сәйкес мәндерді,
псевдокластар мен at-ережелерді ұсынады, ал сипаттамада CSS атауы мен MDN сілтемесі көрсетіледі.
Сондай-ақ «Unknown property» ескертулері жоғалады.

Жобаның `.vscode/settings.json` файлына қосыңыз:

```json
{
  "css.customData": ["./node_modules/postcss-kazaksha/dist/vscode/kazaksha.css-data.json"]
}
```

Содан кейін VS Code терезесін қайта жүктеңіз (`Developer: Reload Window`).

## Опциялар

```ts
kazaksha({
  // Өз сөздеріңізді қосу немесе бар сөзді қайта анықтау
  extend: {
    values: { 'теңіз': '#1e90ff' },
    properties: { 'қалқыма': 'float' },
  },
  // Сөздікте жоқ қазақша сөздерге ескерту шығару (әдепкі: false)
  strict: true,
});
```

## Әзірлеу

```bash
npm install
npm test          # vitest
npm run typecheck # tsc
npm run build     # tsup → dist/
npm run playground # ойын алаңы, localhost
```

## Лицензия

MIT
