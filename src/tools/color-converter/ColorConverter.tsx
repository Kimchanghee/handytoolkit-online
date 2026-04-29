'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import AdsterraSlot from '@/components/AdsterraSlot';

interface RGB { r: number; g: number; b: number; a: number }
interface HSL { h: number; s: number; l: number; a: number }
interface CMYK { c: number; m: number; y: number; k: number }

function hexToRgb(hex: string): RGB | null {
  const m = hex.replace(/^#/, '').match(/^([\da-f]{3}|[\da-f]{6}|[\da-f]{8})$/i);
  if (!m) return null;
  let s = m[1];
  if (s.length === 3) s = s.split('').map((c) => c + c).join('');
  const r = parseInt(s.slice(0, 2), 16);
  const g = parseInt(s.slice(2, 4), 16);
  const b = parseInt(s.slice(4, 6), 16);
  const a = s.length === 8 ? parseInt(s.slice(6, 8), 16) / 255 : 1;
  return { r, g, b, a };
}

function rgbToHex({ r, g, b, a }: RGB): string {
  const h = (n: number) => Math.round(n).toString(16).padStart(2, '0');
  const base = `#${h(r)}${h(g)}${h(b)}`;
  return a < 1 ? `${base}${h(a * 255)}` : base;
}

function rgbToHsl({ r, g, b, a }: RGB): HSL {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  let h = 0, s, l = (max + min) / 2;
  if (max === min) { h = 0; s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn: h = (gn - bn) / d + (gn < bn ? 6 : 0); break;
      case gn: h = (bn - rn) / d + 2; break;
      case bn: h = (rn - gn) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100), a };
}

function hslToRgb({ h, s, l, a }: HSL): RGB {
  const hn = h / 360, sn = s / 100, ln = l / 100;
  let r, g, b;
  if (sn === 0) { r = g = b = ln; }
  else {
    const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn;
    const p = 2 * ln - q;
    const ht = (t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    r = ht(hn + 1 / 3);
    g = ht(hn);
    b = ht(hn - 1 / 3);
  }
  return { r: r * 255, g: g * 255, b: b * 255, a };
}

function rgbToCmyk({ r, g, b }: RGB): CMYK {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const k = 1 - Math.max(rn, gn, bn);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  const c = (1 - rn - k) / (1 - k);
  const m = (1 - gn - k) / (1 - k);
  const y = (1 - bn - k) / (1 - k);
  return { c: Math.round(c * 100), m: Math.round(m * 100), y: Math.round(y * 100), k: Math.round(k * 100) };
}

export default function ColorConverter() {
  const t = useTranslations('ui');
  const [hex, setHex] = useState('#10b981');
  const [copied, setCopied] = useState<string | null>(null);

  const rgb = useMemo(() => hexToRgb(hex), [hex]);
  const hsl = useMemo(() => (rgb ? rgbToHsl(rgb) : null), [rgb]);
  const cmyk = useMemo(() => (rgb ? rgbToCmyk(rgb) : null), [rgb]);

  const updateRgb = (key: 'r' | 'g' | 'b', value: number) => {
    if (!rgb) return;
    setHex(rgbToHex({ ...rgb, [key]: value }));
  };

  const updateHsl = (key: 'h' | 's' | 'l', value: number) => {
    if (!hsl) return;
    setHex(rgbToHex(hslToRgb({ ...hsl, [key]: value })));
  };

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  if (!rgb || !hsl || !cmyk) {
    return <div className="rounded-lg border bg-red-50 p-4 text-red-700">Invalid HEX color</div>;
  }

  const css = {
    hex: hex.toUpperCase(),
    rgb: `rgb(${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)})`,
    rgba: `rgba(${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)}, ${rgb.a.toFixed(2)})`,
    hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
    cmyk: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`,
  };

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-[260px_1fr]">
        <div
          className="aspect-square rounded-2xl shadow-lg"
          style={{ backgroundColor: hex }}
        />

        <div className="grid gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">HEX</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                className="flex-1 rounded border px-3 py-2 font-mono uppercase"
              />
              <input
                type="color"
                value={hex.slice(0, 7)}
                onChange={(e) => setHex(e.target.value)}
                className="h-10 w-16 rounded border"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {(['r', 'g', 'b'] as const).map((k) => (
              <label key={k} className="text-sm">
                <span className="font-mono uppercase">{k}: {Math.round(rgb[k])}</span>
                <input
                  type="range"
                  min={0}
                  max={255}
                  value={Math.round(rgb[k])}
                  onChange={(e) => updateRgb(k, Number(e.target.value))}
                  className="mt-1 w-full"
                />
              </label>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {([['h', 360, 'H'], ['s', 100, 'S%'], ['l', 100, 'L%']] as const).map(([k, max, label]) => (
              <label key={k} className="text-sm">
                <span className="font-mono">{label}: {hsl[k]}</span>
                <input
                  type="range"
                  min={0}
                  max={max}
                  value={hsl[k]}
                  onChange={(e) => updateHsl(k, Number(e.target.value))}
                  className="mt-1 w-full"
                />
              </label>
            ))}
          </div>
        </div>
      </div>

      <AdsterraSlot type="banner" width={728} height={90} />

      <div className="grid gap-2">
        {Object.entries(css).map(([key, value]) => (
          <div
            key={key}
            className="flex items-center justify-between gap-3 rounded-lg border bg-slate-50 p-3 font-mono text-sm"
          >
            <span className="font-semibold uppercase text-slate-500 w-12">{key}</span>
            <span className="flex-1 break-all">{value}</span>
            <button
              onClick={() => copy(value, key)}
              className="shrink-0 rounded bg-slate-700 px-3 py-1 text-xs text-white hover:bg-slate-800"
            >
              {copied === key ? t('copied') : t('copy')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
