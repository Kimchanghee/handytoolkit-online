'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import AdsterraSlot from '@/components/AdsterraSlot';

type QrType = 'text' | 'url' | 'wifi' | 'email' | 'tel';

export default function QrGenerator() {
  const t = useTranslations('ui');
  const [type, setType] = useState<QrType>('url');
  const [text, setText] = useState('https://handytools.io');
  const [size, setSize] = useState(300);
  const [margin, setMargin] = useState(2);
  const [fg, setFg] = useState('#000000');
  const [bg, setBg] = useState('#ffffff');

  // Wi-Fi 전용 필드
  const [ssid, setSsid] = useState('');
  const [pwd, setPwd] = useState('');
  const [enc, setEnc] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 실제 인코딩 텍스트
  const encoded = (() => {
    switch (type) {
      case 'wifi':
        return `WIFI:T:${enc};S:${ssid};P:${pwd};;`;
      case 'email':
        return `mailto:${text}`;
      case 'tel':
        return `tel:${text}`;
      default:
        return text;
    }
  })();

  // QR 라이브러리 동적 로드 + 렌더
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const QRCode = (await import('qrcode')).default;
      if (cancelled || !canvasRef.current) return;
      try {
        await QRCode.toCanvas(canvasRef.current, encoded || ' ', {
          width: size,
          margin,
          color: { dark: fg, light: bg },
          errorCorrectionLevel: 'M',
        });
      } catch (err) {
        console.error(err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [encoded, size, margin, fg, bg]);

  const download = (format: 'png' | 'svg') => {
    if (format === 'png' && canvasRef.current) {
      const link = document.createElement('a');
      link.download = `qrcode-${Date.now()}.png`;
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
    }
    if (format === 'svg') {
      import('qrcode').then(async (m) => {
        const svg = await m.default.toString(encoded || ' ', {
          type: 'svg',
          width: size,
          margin,
          color: { dark: fg, light: bg },
        });
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `qrcode-${Date.now()}.svg`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      });
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium">Type</label>
          <div className="flex flex-wrap gap-2">
            {(['url', 'text', 'wifi', 'email', 'tel'] as QrType[]).map((tt) => (
              <button
                key={tt}
                onClick={() => setType(tt)}
                className={`rounded-lg border px-3 py-1.5 text-sm capitalize ${
                  type === tt
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {tt}
              </button>
            ))}
          </div>
        </div>

        {type === 'wifi' ? (
          <div className="grid gap-3 sm:grid-cols-3">
            <input
              value={ssid}
              onChange={(e) => setSsid(e.target.value)}
              placeholder="SSID"
              className="rounded border px-3 py-2"
            />
            <input
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              placeholder="Password"
              className="rounded border px-3 py-2"
            />
            <select
              value={enc}
              onChange={(e) => setEnc(e.target.value as any)}
              className="rounded border px-3 py-2"
            >
              <option value="WPA">WPA / WPA2</option>
              <option value="WEP">WEP</option>
              <option value="nopass">No password</option>
            </select>
          </div>
        ) : (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={type === 'url' ? 'https://example.com' : type === 'email' ? 'name@example.com' : 'Enter text...'}
            className="h-32 w-full rounded-lg border bg-slate-50 p-3 focus:border-emerald-400 focus:outline-none"
          />
        )}

        <div className="grid gap-3 sm:grid-cols-4">
          <label className="text-sm">
            Size
            <input
              type="range"
              min={100}
              max={800}
              step={10}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="mt-1 w-full"
            />
            <span className="text-xs text-slate-500">{size}px</span>
          </label>
          <label className="text-sm">
            Margin
            <input
              type="range"
              min={0}
              max={10}
              value={margin}
              onChange={(e) => setMargin(Number(e.target.value))}
              className="mt-1 w-full"
            />
            <span className="text-xs text-slate-500">{margin}</span>
          </label>
          <label className="text-sm">
            Foreground
            <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="mt-1 block w-full h-8" />
          </label>
          <label className="text-sm">
            Background
            <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="mt-1 block w-full h-8" />
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => download('png')}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
          >
            {t('download')} PNG
          </button>
          <button
            onClick={() => download('svg')}
            className="rounded-lg bg-slate-700 px-4 py-2 text-white hover:bg-slate-800"
          >
            {t('download')} SVG
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center rounded-xl border bg-white p-6">
        <canvas ref={canvasRef} className="max-w-full" />
      </div>

      <div className="lg:col-span-2">
        <AdsterraSlot type="banner" width={728} height={90} refreshOnScroll />
      </div>
    </div>
  );
}
