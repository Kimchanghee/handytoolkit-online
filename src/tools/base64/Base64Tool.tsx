'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';

type Mode = 'encode' | 'decode';

function utf8ToBase64(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
}

function base64ToUtf8(str: string): string {
  return decodeURIComponent(escape(atob(str)));
}

export default function Base64Tool() {
  const t = useTranslations('ui');
  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('Hello, World!');
  const [urlSafe, setUrlSafe] = useState(false);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!input) return { ok: true, output: '', error: '' };
    try {
      if (mode === 'encode') {
        let out = utf8ToBase64(input);
        if (urlSafe) out = out.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        return { ok: true, output: out, error: '' };
      } else {
        let normalized = input;
        if (urlSafe) {
          normalized = normalized.replace(/-/g, '+').replace(/_/g, '/');
          while (normalized.length % 4) normalized += '=';
        }
        return { ok: true, output: base64ToUtf8(normalized), error: '' };
      }
    } catch (e: any) {
      return { ok: false, output: '', error: e.message };
    }
  }, [input, mode, urlSafe]);

  const copy = async () => {
    await navigator.clipboard.writeText(result.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-lg border bg-white p-1">
          {(['encode', 'decode'] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded px-4 py-1.5 text-sm capitalize ${
                mode === m ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={urlSafe}
            onChange={(e) => setUrlSafe(e.target.checked)}
            className="h-4 w-4 accent-emerald-600"
          />
          URL-safe (RFC 4648 §5)
        </label>
        <button
          onClick={() => setInput('')}
          className="rounded bg-slate-200 px-3 py-1 text-sm hover:bg-slate-300"
        >
          {t('reset')}
        </button>
        <button
          onClick={() => setInput(result.output)}
          disabled={!result.ok || !result.output}
          className="rounded bg-slate-700 px-3 py-1 text-sm text-white hover:bg-slate-800 disabled:bg-slate-300"
        >
          ↑ Use output as input
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">
            {mode === 'encode' ? 'Plain text' : 'Base64 input'}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            className="h-64 w-full rounded-lg border bg-slate-50 p-3 font-mono text-sm focus:border-emerald-400 focus:outline-none"
          />
          <div className="mt-1 text-xs text-slate-500">
            {input.length} chars · {new Blob([input]).size} bytes
          </div>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium">
              {mode === 'encode' ? 'Base64 output' : 'Decoded text'}
            </label>
            {result.ok && result.output && (
              <button
                onClick={copy}
                className="rounded bg-emerald-600 px-3 py-1 text-xs text-white hover:bg-emerald-700"
              >
                {copied ? t('copied') : t('copy')}
              </button>
            )}
          </div>
          <pre
            className={`h-64 overflow-auto rounded-lg border p-3 font-mono text-sm ${
              result.ok ? 'bg-emerald-50' : 'bg-red-50 text-red-700'
            }`}
          >
            {result.ok ? result.output : `❌ ${result.error}`}
          </pre>
          <div className="mt-1 text-xs text-slate-500">
            {result.output.length} chars · {new Blob([result.output]).size} bytes
          </div>
        </div>
      </div>
    </div>
  );
}
