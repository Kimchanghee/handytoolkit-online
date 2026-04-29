import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import AdsterraSlot from '@/components/AdsterraSlot';
import { TOOLS, getAllSlugs, getToolBySlug } from '@/tools/registry';
import { locales, type Locale } from '@/i18n/config';

interface Props {
  params: Promise<{ locale: string; tool: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return locales.flatMap((locale) => slugs.map((tool) => ({ locale, tool })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, tool } = await params;
  const meta = getToolBySlug(tool);
  if (!meta) return {};
  const t = await getTranslations({ locale, namespace: `tools.${meta.id}` });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://handytools.io';
  let name = '';
  let description = '';
  try {
    name = t('name');
    description = t('description');
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
const TOOL_COMPONENTS: Record<string, ReturnType<typeof dynamic>> = {
  'json-formatter': dynamic(() => import('@/tools/json-formatter/JsonFormatter')),
  'qr-code-generator': dynamic(() => import('@/tools/qr-generator/QrGenerator')),
  'password-generator': dynamic(() => import('@/tools/password-generator/PasswordGenerator')),
  'base64-encoder-decoder': dynamic(() => import('@/tools/base64/Base64Tool')),
  'uuid-generator': dynamic(() => import('@/tools/uuid-generator/UuidGenerator')),
  'hash-generator': dynamic(() => import('@/tools/hash-generator/HashGenerator')),
  'color-converter': dynamic(() => import('@/tools/color-converter/ColorConverter')),
  'jwt-decoder': dynamic(() => import('@/tools/jwt-decoder/JwtDecoder')),
};

export default async function ToolPage({ params }: Props) {
  const { locale, tool } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  setRequestLocale(locale);

  const meta = getToolBySlug(tool);
  if (!meta) notFound();

  const Component = TOOL_COMPONENTS[tool];
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

        {/* 상단 광고 */}
        <div className="my-6">
          <AdsterraSlot type="banner" width={728} height={90} />
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

        {/* 하단 광고 + Social Bar */}
        <div className="my-8">
          <AdsterraSlot type="banner" width={728} height={90} refreshOnScroll />
        </div>
        <AdsterraSlot type="push" width={0} height={0} />
        <AdsterraSlot type="social" width={0} height={0} />
      </div>
    </main>
  );
}
