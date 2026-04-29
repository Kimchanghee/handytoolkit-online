'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import AdsterraSlot from '@/components/AdsterraSlot';

const SAMPLE_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

function b64UrlDecode(str: string): string {
  let s = str.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  return decodeURIComponent(escape(atob(s)));
}

interface DecodedClaims {
  [key: string]: any;
}

function annotateClaim(key: string, value: any): string {
  if (typeof value !== 'number') return '';
  const knownDate = ['iat', 'exp', 'nbf', 'auth_time'];
  if (knownDate.includes(key)) {
    return new Date(value * 1000).toLocaleString();
  }
  return '';
}

export default function JwtDecoder() {
  const t = useTranslations('ui');
  const [token, setToken] = useState(SAMPLE_JWT);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const result = useMemo(() => {
    if (!token.trim()) return { ok: true, header: null as DecodedClaims | null, payload: null as DecodedClaims | null, signature: '', error: '' };
    try {
      const [h, p, s] = token.split('.');
      if (!h || !p || !s) throw new Error('Invalid JWT format (expected 3 dot-separated parts)');
      const header = JSON.parse(b64UrlDecode(h));
      const payload = JSON.parse(b64UrlDecode(p));
      return { ok: true, header, payload, signature: s, error: '' };
    } catch (e: any) {
      return { ok: false, header: null, payload: null, signature: '', error: e.message };
    }
  }, [token]);

  const expCheck = useMemo(() => {
    const exp = result.payload?.exp;
    if (typeof exp !== 'number') return null;
    const now = Math.floor(Date.now() / 1000);
    return {
      isExpired: exp < now,
      remainingMs: (exp - now) * 1000,
    };
  }, [result.payload]);

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedSection(key);
    setTimeout(() => setCopiedSection(null), 1500);
  };

  return (
    <div className="grid gap-6">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium">JWT Token</label>
          <button
            onClick={() => setToken(SAMPLE_JWT)}
            className="text-xs text-emerald-600 hover:underline"
          >
            Load sample
          </button>
        </div>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          spellCheck={false}
          className="h-32 w-full rounded-lg border bg-slate-50 p-3 font-mono text-xs focus:border-emerald-400 focus:outline-none"
        />
      </div>

      {!result.ok && (
        <div className="rounded-lg border bg-red-50 p-4 text-sm text-red-700">
          ❌ {result.error}
        </div>
      )}

      {expCheck && (
        <div
          className={`rounded-lg border p-3 text-sm ${
            expCheck.isExpired
              ? 'border-red-300 bg-red-50 text-red-700'
              : 'border-emerald-300 bg-emerald-50 text-emerald-700'
          }`}
        >
          {expCheck.isExpired
            ? `⚠️ Token expired ${formatMs(-expCheck.remainingMs)} ago`
            : `✓ Token valid (expires in ${formatMs(expCheck.remainingMs)})`}
        </div>
      )}

      <AdsterraSlot type="banner" width={728} height={90} />

      <div className="grid gap-4 md:grid-cols-2">
        <Section
          title="Header"
          color="bg-rose-50 border-rose-200"
          data={result.header}
          onCopy={() => copy(JSON.stringify(result.header, null, 2), 'header')}
          copied={copiedSection === 'header'}
        />
        <Section
          title="Payload"
          color="bg-violet-50 border-violet-200"
          data={result.payload}
          onCopy={() => copy(JSON.stringify(result.payload, null, 2), 'payload')}
          copied={copiedSection === 'payload'}
          annotate={annotateClaim}
        />
      </div>

      <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-semibold text-cyan-800">Signature</span>
          {result.signature && (
            <button
              onClick={() => copy(result.signature, 'sig')}
              className="rounded bg-cyan-600 px-3 py-1 text-xs text-white hover:bg-cyan-700"
            >
              {copiedSection === 'sig' ? t('copied') : t('copy')}
            </button>
          )}
        </div>
        <code className="block break-all font-mono text-xs text-cyan-900">
          {result.signature || '...'}
        </code>
        <p className="mt-2 text-xs text-cyan-700">
          서명 검증은 서버 사이드에서만 가능 (HMAC 키 또는 RSA 공개키 필요).
        </p>
      </div>
    </div>
  );
}

function Section({
  title, color, data, onCopy, copied, annotate,
}: { title: string; color: string; data: DecodedClaims | null; onCopy: () => void; copied: boolean; annotate?: (key: string, value: any) => string }) {
  return (
    <div className={`rounded-lg border p-4 ${color}`}>
      <div className="mb-2 flex items-center justify-between">
        <span className="font-semibold">{title}</span>
        {data && (
          <button
            onClick={onCopy}
            className="rounded bg-slate-700 px-3 py-1 text-xs text-white hover:bg-slate-800"
          >
            {copied ? '✓' : 'Copy'}
          </button>
        )}
      </div>
      {data ? (
        <div className="space-y-1.5 font-mono text-xs">
          {Object.entries(data).map(([k, v]) => {
            const note = annotate?.(k, v);
            return (
              <div key={k}>
                <span className="font-semibold text-slate-700">{k}:</span>{' '}
                <span className="text-slate-900">{JSON.stringify(v)}</span>
                {note && <span className="ml-2 text-slate-500">({note})</span>}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-sm text-slate-500">—</div>
      )}
    </div>
  );
}

function formatMs(ms: number): string {
  const abs = Math.abs(ms);
  const s = Math.floor(abs / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ${m % 60}m`;
  const d = Math.floor(h / 24);
  return `${d}d ${h % 24}h`;
}
