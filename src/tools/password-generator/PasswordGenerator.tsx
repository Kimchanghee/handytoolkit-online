'use client';

import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import AdsterraSlot from '@/components/AdsterraSlot';

const SETS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  digits: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{}<>?/|',
  similar: '0Oo1lI',
};

function genSecure(length: number, charset: string): string {
  const out: string[] = [];
  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  for (let i = 0; i < length; i++) {
    out.push(charset[arr[i] % charset.length]);
  }
  return out.join('');
}

function entropy(length: number, charsetSize: number): number {
  return Math.round(length * Math.log2(charsetSize));
}

function strengthLabel(bits: number): { label: string; color: string } {
  if (bits < 40) return { label: 'Weak', color: 'bg-red-500' };
  if (bits < 60) return { label: 'Fair', color: 'bg-yellow-500' };
  if (bits < 80) return { label: 'Strong', color: 'bg-emerald-500' };
  return { label: 'Excellent', color: 'bg-emerald-700' };
}

export default function PasswordGenerator() {
  const t = useTranslations('ui');
  const [length, setLength] = useState(20);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [count, setCount] = useState(5);
  const [results, setResults] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const charset = (() => {
    let c = '';
    if (useUpper) c += SETS.upper;
    if (useLower) c += SETS.lower;
    if (useDigits) c += SETS.digits;
    if (useSymbols) c += SETS.symbols;
    if (excludeSimilar) {
      c = c
        .split('')
        .filter((ch) => !SETS.similar.includes(ch))
        .join('');
    }
    return c;
  })();

  const regenerate = useCallback(() => {
    if (charset.length === 0) return;
    setResults(Array.from({ length: count }, () => genSecure(length, charset)));
  }, [length, charset, count]);

  useEffect(() => {
    regenerate();
  }, [regenerate]);

  const bits = entropy(length, charset.length || 1);
  const strength = strengthLabel(bits);

  const copy = async (pwd: string, idx: number) => {
    await navigator.clipboard.writeText(pwd);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 rounded-xl border bg-white p-5">
        <label className="text-sm font-medium">
          Length: <span className="text-emerald-600">{length}</span>
          <input
            type="range"
            min={8}
            max={64}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="mt-1 w-full"
          />
        </label>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {[
            { label: 'Uppercase A-Z', value: useUpper, set: setUseUpper },
            { label: 'Lowercase a-z', value: useLower, set: setUseLower },
            { label: 'Digits 0-9', value: useDigits, set: setUseDigits },
            { label: 'Symbols !@#$', value: useSymbols, set: setUseSymbols },
            { label: 'Exclude 0Oo1lI', value: excludeSimilar, set: setExcludeSimilar },
          ].map((o) => (
            <label key={o.label} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={o.value}
                onChange={(e) => o.set(e.target.checked)}
                className="h-4 w-4 accent-emerald-600"
              />
              {o.label}
            </label>
          ))}
        </div>

        <label className="text-sm">
          Generate{' '}
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="rounded border px-2 py-1"
          >
            {[1, 5, 10, 25, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>{' '}
          passwords
        </label>

        <div className="flex items-center gap-3">
          <button
            onClick={regenerate}
            disabled={charset.length === 0}
            className="rounded-lg bg-emerald-600 px-5 py-2 text-white hover:bg-emerald-700 disabled:bg-slate-300"
          >
            Regenerate
          </button>
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>
                Entropy: <strong>{bits}</strong> bits
              </span>
              <span className={`rounded px-2 py-0.5 text-white ${strength.color}`}>{strength.label}</span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded bg-slate-200">
              <div
                className={`h-full ${strength.color}`}
                style={{ width: `${Math.min(100, (bits / 100) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <AdsterraSlot type="banner" width={728} height={90} />

      <div className="grid gap-2">
        {results.map((pwd, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between gap-3 rounded-lg border bg-slate-50 p-3 font-mono text-sm"
          >
            <span className="break-all">{pwd}</span>
            <button
              onClick={() => copy(pwd, idx)}
              className="shrink-0 rounded bg-slate-700 px-3 py-1 text-xs text-white hover:bg-slate-800"
            >
              {copiedIdx === idx ? t('copied') : t('copy')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
