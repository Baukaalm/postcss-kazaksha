import postcss, { CssSyntaxError } from 'postcss';

import kazaksha, { type Options } from '../../src/index';

export interface Message {
  kind: 'warning' | 'error';
  text: string;
  line?: number;
  column?: number;
}

export interface CompileResult {
  css: string;
  messages: Message[];
}

export function compile(input: string, options: Options): CompileResult {
  try {
    const result = postcss([kazaksha(options)]).process(input, { from: undefined });
    // .css — синхронды нәтиже: плагин тек Once қолданады
    const css = result.css;
    return {
      css,
      messages: result.warnings().map((w) => ({
        kind: 'warning',
        text: w.text,
        line: w.line,
        column: w.column,
      })),
    };
  } catch (error) {
    if (error instanceof CssSyntaxError) {
      return {
        css: '',
        messages: [{ kind: 'error', text: error.reason, line: error.line, column: error.column }],
      };
    }
    throw error;
  }
}

/** URL hash ↔ CSS (UTF-8 → base64url) */
export function encodeShare(css: string): string {
  const bytes = new TextEncoder().encode(css);
  let binary = '';
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeShare(hash: string): string | null {
  try {
    const base64 = hash.replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(base64);
    return new TextDecoder().decode(Uint8Array.from(binary, (c) => c.charCodeAt(0)));
  } catch {
    return null;
  }
}
