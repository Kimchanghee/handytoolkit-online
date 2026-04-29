'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import AdsterraSlot from '@/components/AdsterraSlot';

type Version = 'v4' | 'v7' | 'nil';

function v4(): string {
  const buf = new Uint8Array(16);
  crypto.getRandomValues(buf);
  buf[6] = (buf[6] & 0x0f) | 0x40;
  buf[8] = (buf[8] & 0x3f) | 0x80;
  const hex: string[] = [];
  buf.forEach((b) => hex.push(b.toString(16).padStart(2, '0')));
  return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10, 16).join('')}`;
}

function v7(): string {
  const ts = Date.now();
  const tsHex = ts.toString(16).padStart(12, '0');
  const rand = new Uint8Array(10);
  crypto.getRandomValues(rand);
  rand[0] = (rand[0] & 0x0f) | 0x70;
  rand[2] = (rand[2] & 0x3f) | 0x80;
  const r: string[] = [];
  rand.forEach((b) => r.push(b.toString(16).padStart(2, '0')));
  return `${tsHex.slice(0, 8)}-${tsHex.slice(8, 12)}-${r.slice(0, 2).join('')}-${r.slice(2, 4).join('')}-${r.slice(4, 10).join('')}`;
}

const NIL = '00000000-0000-0000-0000-000000000000';

export default function UuidGenerator() {
  const t = useTranslations('ui');
  const [version, setVersion] = useState<Version>('v4');
  const [count, setCount] = useState(10);
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [list, setList] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | 'all' | null>(null);

  const transform = (uuid: string): string => {
    let result = uuid;
    if (!hyphens) result = result.replace(/-/g, '');
    if (uppercase) result = result.toUpperCase();
    return result;
  };

  const generate = useCallback(() => {
    const fn = version === 'v4' ? v4 : version === 'v7' ? v7 : () => NIL;
    setList(Array.from({ length: count }, fn));
  }, [version, count]);

  const copy = async (text: string, idx: number | 'all') => {
    await navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 rounded-xl border bg-white p-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-lg border bg-slate-50 p-1">
            {(['v4', 'v7', 'nil'] as Version[]).map((v) => (
              <button
                key={v}
                onClick={() => setVersion(v)}
                className={`rounded px-3 py-1.5 text-sm font-medium uppercase ${
                  version === v ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          <label className="text-sm">
            Count:{' '}
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="rounded border px-2 py-1"
            >
              {[1, 5, 10, 25, 50, 100].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} className="h-4 w-4 accent-emerald-600" />
            UPPERCASE
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={hyphens} onChange={(e) => setHyphens(e.target.checked)} className="h-4 w-4 accent-emerald-600" />
            Hyphens
          </label>
        </div>

        <div className="flex gap-2">
          <button onClick={generate} className="rounded-lg bg-emerald-600 px-5 py-2 text-white hover:bg-emerald-700">
            Generate
          </button>
          {list.length > 0 && (
            <button
              onClick={() => copy(list.map(transform).join('\n'), 'all')}
              className="rounded-lg bg-slate-700 px-5 py-2 text-white hover:bg-slate-800"
            >
              {copiedIdx === 'all' ? t('copied') : `${t('copy')} all`}
            </button>
          )}
        </div>

        <p className="text-xs text-slate-500">
          v4 = random · v7 = timestamp-ordered (sortable) · nil = all zeros
        </p>
      </div>

      <AdsterraSlot type="banner" width={728} height={90} />

      <div className="grid gap-2">
        {list.map((uuid, idx) => {
          const display = transform(uuid);
          return (
            <div
              key={idx}
              className="flex items-center justify-between gap-3 rounded-lg border bg-slate-50 p-3 font-mono text-sm"
            >
              <span className="break-all">{display}</span>
              <button
                onClick={() => copy(display, idx)}
                className="shrink-0 rounded bg-slate-700 px-3 py-1 text-xs text-white hover:bg-slate-800"
              >
                {copiedIdx === idx ? t('copied') : t('copy')}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
