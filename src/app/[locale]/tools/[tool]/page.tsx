import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import nextDynamic from 'next/dynamic';
import Link from 'next/link';
import { TOOLS, getToolBySlug } from '@/tools/registry';
import { locales, type Locale } from '@/i18n/config';

interface Props {
  params: Promise<{ locale: string; tool: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, tool } = await params;
  const meta = getToolBySlug(tool);
  if (!meta) return {};
  const t = await getTranslations({ locale });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://handytoolkit.online';
  let name = '';
  let description = '';
  try {
    name = t(`tools.${meta.id}.name`);
    description = t(`tools.${meta.id}.description`);
  } catch {
    name = meta.slug.replace(/-/g, ' ');
    description = `Free online ${name}. Browser-only, no signup required.`;
  }
  return {
    title: name,
    description,
    alternates: {
      canonical: `/${locale}/tools/${tool}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/tools/${tool}`])),
    },
    openGraph: { title: name, description, url: `${baseUrl}/${locale}/tools/${tool}` },
  };
}

// 도구별 클라이언트 컴포넌트 동적 로드 (코드 스플리팅)
const TOOL_COMPONENTS: Record<string, ReturnType<typeof nextDynamic>> = {
  'json-formatter': nextDynamic(() => import('@/tools/json-formatter/JsonFormatter')),
  'qr-code-generator': nextDynamic(() => import('@/tools/qr-generator/QrGenerator')),
  'password-generator': nextDynamic(() => import('@/tools/password-generator/PasswordGenerator')),
  'base64-encoder-decoder': nextDynamic(() => import('@/tools/base64/Base64Tool')),
  'uuid-generator': nextDynamic(() => import('@/tools/uuid-generator/UuidGenerator')),
  'hash-generator': nextDynamic(() => import('@/tools/hash-generator/HashGenerator')),
  'color-converter': nextDynamic(() => import('@/tools/color-converter/ColorConverter')),
  'jwt-decoder': nextDynamic(() => import('@/tools/jwt-decoder/JwtDecoder')),
};

const TOOL_GUIDES: Record<string, { summary: string; steps: string[]; checks: string[] }> = {
  'json-formatter': {
    summary: 'Use this page when a JSON API response, config file, webhook payload, or pasted log needs to be cleaned up before you copy it into code or documentation.',
    steps: [
      'Paste the raw JSON into the editor, then check whether the formatted output keeps the same keys and nested arrays.',
      'If parsing fails, start from the first highlighted character and look for missing quotes, trailing commas, or copied HTML entities.',
      'After formatting, collapse large arrays mentally by section so you can compare payload shape without losing the original data.'
    ],
    checks: ['No data is uploaded to a server.', 'Useful for API debugging, config review, and support tickets.', 'Keep secrets out of screenshots after formatting.']
  },
  'base64-encoder-decoder': {
    summary: 'Use this converter for safe text snippets, test fixtures, JWT segments, data URI checks, and API examples that need quick Base64 encoding or decoding.',
    steps: [
      'Choose encode when you have plain text and need a Base64 string for a test payload.',
      'Choose decode when you receive a Base64 value and need to confirm the readable text before using it.',
      'For binary files, verify the source application generated the Base64 correctly before pasting large content.'
    ],
    checks: ['Runs in the browser only.', 'Handles short text and developer snippets best.', 'Decoded private tokens should not be shared publicly.']
  },
  'jwt-decoder': {
    summary: 'Use this decoder to inspect JWT headers and payload claims before debugging authentication, expiry, audience, issuer, or role problems.',
    steps: [
      'Paste the token and compare exp, iat, aud, iss, and role claims against the application you are testing.',
      'Do not treat decoded text as proof that a token is valid; signature verification still belongs in your backend.',
      'If the payload looks wrong, regenerate the token from the identity provider instead of editing claims by hand.'
    ],
    checks: ['Decoding stays local.', 'Great for expiry and audience checks.', 'Never paste production admin tokens into shared chats.']
  },
  'qr-code-generator': {
    summary: 'Use this generator for URLs, Wi-Fi details, event check-in links, small contact cards, and labels that need a scannable QR code.',
    steps: [
      'Enter the final URL or text exactly as the scanner should open it.',
      'Test the QR on a phone before printing, especially when the destination includes tracking parameters.',
      'Use a short URL when the code becomes too dense for small labels or low-quality printers.'
    ],
    checks: ['Works without signup.', 'Good for posters, packaging, and internal operations.', 'Test scan distance before publishing.']
  },
  'password-generator': {
    summary: 'Use this generator when you need a new password for a manager, test account, shared lab environment, or temporary credential rotation.',
    steps: [
      'Pick a length that matches the site policy, then include symbols only when the target service accepts them cleanly.',
      'Copy the result directly into a password manager rather than storing it in notes or chat.',
      'Regenerate for every account; do not reuse a strong password across multiple services.'
    ],
    checks: ['Random generation happens locally.', 'Longer passwords beat clever patterns.', 'Store the final value in a password manager.']
  },
  'uuid-generator': {
    summary: 'Use this generator for database seed IDs, test records, request correlation IDs, local fixtures, and quick examples in API documentation.',
    steps: [
      'Generate a fresh ID for each object that should remain distinct in logs or fixtures.',
      'Use UUIDs for identifiers, not for secrets; they are unique labels, not authentication tokens.',
      'When pasting into code, keep the same casing and hyphen layout expected by your system.'
    ],
    checks: ['Good for test data and logs.', 'Not a replacement for secure tokens.', 'Copy one ID per entity.']
  },
  'hash-generator': {
    summary: 'Use this page to compare checksums, create quick SHA digests, verify pasted text integrity, or document a deterministic fingerprint.',
    steps: [
      'Paste the exact text, including spaces and line breaks, because even one hidden character changes the digest.',
      'Use SHA-256 or SHA-512 for modern integrity checks; keep MD5 only for legacy comparison.',
      'Copy the digest and compare it with the value from your build log, vendor page, or API response.'
    ],
    checks: ['Hashes update as you type.', 'Whitespace matters.', 'Hashing is not encryption and cannot recover the original text.']
  },
  'color-converter': {
    summary: 'Use this converter to move between HEX, RGB, and HSL while checking whether a color remains readable in UI tokens, charts, and design notes.',
    steps: [
      'Paste a HEX value from a design file or browser inspector and compare the generated RGB/HSL values.',
      'Use HSL when you need lighter or darker variants while keeping the same hue.',
      'Before shipping a UI color, check it against real text and background combinations.'
    ],
    checks: ['Useful for CSS tokens and design QA.', 'Preview before copying.', 'Avoid using color alone to convey status.']
  }
};

export default async function ToolPage({ params }: Props) {
  const { locale, tool } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  setRequestLocale(locale);

  const meta = getToolBySlug(tool);
  if (!meta) notFound();

  const Component = TOOL_COMPONENTS[tool];
  const guide = TOOL_GUIDES[tool];
  const t = await getTranslations({ locale });

  // 같은 카테고리 다른 도구 추천 (PV 체인용)
  const related = TOOLS.filter((x) => x.category === meta.category && x.slug !== tool).slice(0, 4);

  let toolName = meta.slug.replace(/-/g, ' ');
  let toolDesc = '';
  try {
    toolName = t(`tools.${meta.id}.name`);
    toolDesc = t(`tools.${meta.id}.description`);
  } catch {}

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="container mx-auto flex max-w-6xl items-center justify-between p-4">
          <Link href={`/${locale}`} className="text-2xl font-bold text-emerald-600">
            HandyTools
          </Link>
          <Link href={`/${locale}/tools`} className="text-sm text-slate-600 hover:text-slate-900">
            ← All tools
          </Link>
        </div>
      </header>

      <div className="container mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-bold tracking-tight">{toolName}</h1>
        {toolDesc && <p className="mt-2 text-slate-600">{toolDesc}</p>}

        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          {meta.clientOnly && (
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">
              {t('ui.browserOnly')}
            </span>
          )}
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">
            {t('ui.free')}
          </span>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">
            {t('ui.noSignup')}
          </span>
        </div>

        {/* 도구 컴포넌트 */}
        {Component ? (
          <Component />
        ) : (
          <div className="rounded-lg border bg-white p-8 text-center text-slate-600">
            <p>Coming soon — this tool is being implemented.</p>
            <Link href={`/${locale}/tools`} className="mt-3 inline-block text-emerald-600 hover:underline">
              ← Browse other tools
            </Link>
          </div>
        )}

        {guide && (
          <section className="mt-10 grid gap-4 rounded-xl border bg-white p-6 text-slate-700 md:grid-cols-[1.2fr_1fr]">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">How to use this tool well</h2>
              <p className="mt-3 leading-7">{guide.summary}</p>
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6">
                {guide.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
            <aside className="rounded-lg bg-emerald-50 p-4">
              <h3 className="font-semibold text-emerald-900">Before you copy the result</h3>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-emerald-950">
                {guide.checks.map((check) => (
                  <li key={check}>- {check}</li>
                ))}
              </ul>
            </aside>
          </section>
        )}

        {/* 관련 도구 */}
        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-4 text-xl font-semibold">Related tools</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((r) => {
                let rname = r.slug.replace(/-/g, ' ');
                try {
                  rname = t(`tools.${r.id}.name`);
                } catch {}
                return (
                  <Link
                    key={r.slug}
                    href={`/${locale}/tools/${r.slug}`}
                    className="rounded-lg border bg-white p-4 transition hover:border-emerald-400 hover:shadow"
                  >
                    <div className="font-medium text-slate-900">{rname}</div>
                    <div className="mt-1 text-xs text-slate-500 capitalize">{r.category}</div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}
