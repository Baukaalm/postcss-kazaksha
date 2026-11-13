import {
  Check,
  CircleExclamation,
  Copy,
  Link,
  LogoGithub,
  Moon,
  Sun,
  TriangleExclamation,
} from '@gravity-ui/icons';
import {
  Button,
  Card,
  Chip,
  Label,
  ListBox,
  Select,
  Switch,
  TextArea,
  Tooltip,
} from '@heroui/react';
import { useDeferredValue, useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';

import { compile, decodeShare, encodeShare, type Message } from './compile';
import { EXAMPLES } from './examples';

const REPO_URL = 'https://github.com/Baukaalm/postcss-kazaksha';
const SHARE_PREFIX = '#c=';

const initialInput = (): string => {
  if (location.hash.startsWith(SHARE_PREFIX)) {
    const shared = decodeShare(location.hash.slice(SHARE_PREFIX.length));
    if (shared !== null) return shared;
  }
  return EXAMPLES[0]!.css;
};

/** «Көшірілді» белгісін 1.5 секунд көрсетеді */
function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied((c) => (c === id ? null : c)), 1500);
  };
  return { copied, copy };
}

function useTheme() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    try {
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    } catch {
      // localStorage қолжетімсіз болуы мүмкін (жеке режим)
    }
  }, [dark]);
  return { dark, toggle: () => setDark((d) => !d) };
}

export function App() {
  const [input, setInput] = useState(initialInput);
  const [exampleId, setExampleId] = useState<string | null>(() =>
    location.hash.startsWith(SHARE_PREFIX) ? null : EXAMPLES[0]!.id,
  );
  const [strict, setStrict] = useState(true);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const { copied, copy } = useCopy();
  const theme = useTheme();

  const deferredInput = useDeferredValue(input);
  const result = useMemo(
    () => compile(deferredInput, { strict }),
    [deferredInput, strict],
  );

  // Ағымдағы кодты URL-де сақтаймыз, сілтемені бөлісуге болады
  useEffect(() => {
    history.replaceState(null, '', SHARE_PREFIX + encodeShare(input));
  }, [input]);

  const selectExample = (id: string) => {
    const example = EXAMPLES.find((e) => e.id === id);
    if (!example) return;
    setExampleId(id);
    setInput(example.css);
  };

  /** Tab пернесі фокусты ауыстырмай, 2 бос орын қояды */
  const onEditorKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Tab' || e.shiftKey) return;
    e.preventDefault();
    const el = e.currentTarget;
    el.setRangeText('  ', el.selectionStart, el.selectionEnd, 'end');
    setInput(el.value);
  };

  /** Ескертуді басқанда курсорды сол жолға апарады */
  const jumpTo = (msg: Message) => {
    const el = editorRef.current;
    if (!el || !msg.line) return;
    const lines = input.split('\n');
    const offset =
      lines.slice(0, msg.line - 1).reduce((sum, l) => sum + l.length + 1, 0) + (msg.column ?? 1) - 1;
    el.focus();
    el.setSelectionRange(offset, offset);
  };

  const warnings = result.messages.filter((m) => m.kind === 'warning').length;
  const errors = result.messages.length - warnings;

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-4 px-4 py-6 md:px-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Қазақша CSS 🇰🇿</h1>
          <p className="text-sm text-muted">
            postcss-kazaksha ойын алаңы: сол жақта жазыңыз, оң жақта стандартты CSS
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Tooltip delay={300}>
            <Tooltip.Trigger>
              <Button
                isIconOnly
                variant="ghost"
                aria-label="Тақырыпты ауыстыру"
                onPress={theme.toggle}
              >
                {theme.dark ? <Sun /> : <Moon />}
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>{theme.dark ? 'Ашық тақырып' : 'Қараңғы тақырып'}</Tooltip.Content>
          </Tooltip>
          <Tooltip delay={300}>
            <Tooltip.Trigger>
              <Button
                isIconOnly
                variant="ghost"
                aria-label="GitHub"
                onPress={() => window.open(REPO_URL, '_blank', 'noopener')}
              >
                <LogoGithub />
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>GitHub</Tooltip.Content>
          </Tooltip>
        </div>
      </header>

      <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
        <Select
          className="w-60"
          placeholder="Мысал таңдаңыз"
          value={exampleId}
          onChange={(key) => key !== null && selectExample(String(key))}
        >
          <Label>Мысалдар</Label>
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {EXAMPLES.map((example) => (
                <ListBox.Item key={example.id} id={example.id} textValue={example.title}>
                  {example.title}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>

        <Switch isSelected={strict} onChange={setStrict}>
          <Switch.Content>
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
            Қатаң режим (strict)
          </Switch.Content>
        </Switch>

        <Button
          className="ml-auto"
          variant="secondary"
          onPress={() => copy('link', location.href)}
        >
          {copied === 'link' ? <Check /> : <Link />}
          {copied === 'link' ? 'Көшірілді' : 'Сілтемені көшіру'}
        </Button>
      </div>

      <main className="grid flex-1 gap-4 md:grid-cols-2">
        <Card className="flex min-h-[420px] flex-col">
          <Card.Header>
            <Card.Title>Қазақша</Card.Title>
          </Card.Header>
          <Card.Content className="flex flex-1">
            <TextArea
              ref={editorRef}
              aria-label="Қазақша CSS"
              className="code min-h-[360px] flex-1 resize-none"
              fullWidth
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setExampleId(null);
              }}
              onKeyDown={onEditorKeyDown}
            />
          </Card.Content>
        </Card>

        <Card className="flex min-h-[420px] flex-col">
          <Card.Header className="flex flex-row items-center justify-between">
            <Card.Title>CSS</Card.Title>
            <Button
              size="sm"
              variant="ghost"
              isDisabled={!result.css}
              onPress={() => copy('css', result.css)}
            >
              {copied === 'css' ? <Check /> : <Copy />}
              {copied === 'css' ? 'Көшірілді' : 'Көшіру'}
            </Button>
          </Card.Header>
          <Card.Content className="flex flex-1">
            <pre className="code min-h-[360px] flex-1 overflow-auto whitespace-pre rounded-xl bg-default/60 p-3">
              {result.css}
            </pre>
          </Card.Content>
        </Card>
      </main>

      <Card>
        <Card.Header className="flex flex-row items-center gap-2">
          <Card.Title>Хабарламалар</Card.Title>
          {errors > 0 && (
            <Chip size="sm" color="danger" variant="soft">
              <Chip.Label>{errors} қате</Chip.Label>
            </Chip>
          )}
          <Chip size="sm" color={warnings ? 'warning' : 'success'} variant="soft">
            <Chip.Label>{warnings ? `${warnings} ескерту` : 'Ескерту жоқ'}</Chip.Label>
          </Chip>
        </Card.Header>
        {result.messages.length > 0 && (
          <Card.Content>
            <ul className="flex flex-col gap-1">
              {result.messages.map((msg, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => jumpTo(msg)}
                    className="flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-default/60"
                  >
                    {msg.kind === 'error' ? (
                      <CircleExclamation className="mt-0.5 shrink-0 text-danger" />
                    ) : (
                      <TriangleExclamation className="mt-0.5 shrink-0 text-warning" />
                    )}
                    {msg.line !== undefined && (
                      <span className="code shrink-0 text-muted">
                        {msg.line}:{msg.column}
                      </span>
                    )}
                    <span>{msg.text}</span>
                  </button>
                </li>
              ))}
            </ul>
          </Card.Content>
        )}
      </Card>

      <footer className="pb-2 text-center text-xs text-muted">
        <code>npm install -D postcss-kazaksha</code> · MIT
      </footer>
    </div>
  );
}
