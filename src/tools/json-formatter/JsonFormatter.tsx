'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';

export default function JsonFormatter() {
  const t = useTranslations('ui');
  const [input, setInput] = useState<string>('');
  const [indent, setIndent] = useState<number>(2);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!input.trim()) return { ok: true, output: '', error: '' };
    try {
      const parsed = JSON.parse(input);
      return { ok: true, output: JSON.stringify(parsed, null, indent), error: '' };
    } catch (e: any) {
      return { ok: false, output: '', error: e.message };
    }
  }, [input, indent]);

  const minified = useMemo(() => {
    if (!result.ok) return '';
    try {
      return JSON.stringify(JSON.parse(input));
    } catch {
      return '';
    }
  }, [input, result.ok]);

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm">
          Indent:
          <select
            value={indent}
            onChange={(e) => setIndent(Number(e.target.value))}
            className="ml-2 rounded border px-2 py-1"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={0}>Minify</option>
          </select>
        </label>
        <button
          onClick={() => setInput('')}
          className="rounded bg-slate-200 px-3 py-1 text-sm hover:bg-slate-300"
        >
          {t('reset')}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"hello": "world"}'
            spellCheck={false}
            className="h-96 w-full rounded-lg border bg-slate-50 p-3 font-mono text-sm focus:border-emerald-400 focus:outline-none"
          />
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium">Output</label>
            {result.ok && result.output && (
              <button
                onClick={() => copy(result.output)}
                className="rounded bg-emerald-600 px-3 py-1 text-xs text-white hover:bg-emerald-700"
              >
                {copied ? t('copied') : t('copy')}
              </button>
            )}
          </div>
          <pre
            className={`h-96 overflow-auto rounded-lg border p-3 font-mono text-sm ${
              result.ok ? 'bg-emerald-50' : 'bg-red-50 text-red-700'
            }`}
          >
            {result.ok ? result.output : `❌ ${result.error}`}
          </pre>
        </div>
      </div>

      {/* 광고: 결과 영역 아래 Native Banner */}

      {result.ok && minified && (
        <div className="rounded-lg border bg-slate-50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">Minified ({minified.length} bytes)</span>
            <button
              onClick={() => copy(minified)}
              className="rounded bg-slate-700 px-3 py-1 text-xs text-white hover:bg-slate-800"
            >
              {t('copy')}
            </button>
          </div>
          <code className="block max-h-32 overflow-auto break-all font-mono text-xs text-slate-700">
            {minified}
          </code>
        </div>
      )}
    </div>
  );
}
