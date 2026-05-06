import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import AdsterraSlot from '@/components/AdsterraSlot';
import { ImageIcon, FileTextIcon, CodeIcon, RefreshCwIcon, KeyRoundIcon, FilmIcon } from 'lucide-react';

interface Props {
  params: Promise<{ locale: string }>;
}

const FEATURED_TOOLS = [
  { id: 'image-compress', category: 'image', icon: ImageIcon },
  { id: 'pdf-merge', category: 'pdf', icon: FileTextIcon },
  { id: 'json-format', category: 'text', icon: CodeIcon },
  { id: 'qr-generate', category: 'generator', icon: RefreshCwIcon },
  { id: 'password-generate', category: 'generator', icon: KeyRoundIcon },
];

function buildAmazonUrl(keyword: string) {
  const url = new URL('https://www.amazon.com/s');
  url.searchParams.set('k', keyword);
  url.searchParams.set('tag', 'amazonfi00681-20');
  url.searchParams.set('linkCode', 'll2');
  return url.toString();
}

function buildCoupangUrl(keyword: string) {
  const custom = process.env.NEXT_PUBLIC_COUPANG_PARTNER_URL;
  if (custom) return custom;
  const url = new URL('https://www.coupang.com/np/search');
  url.searchParams.set('component', '');
  url.searchParams.set('q', keyword);
  return url.toString();
}

function buildAliExpressUrl(keyword: string) {
  const custom = process.env.NEXT_PUBLIC_ALIEXPRESS_PARTNER_URL;
  if (custom) return custom;
  return `https://www.aliexpress.com/w/wholesale-${encodeURIComponent(keyword.replace(/\s+/g, '-'))}.html`;
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HomeContent locale={locale} />;
}

function HomeContent({ locale }: { locale: string }) {
  const t = useTranslations();

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto flex max-w-6xl items-center justify-between p-4">
          <Link href={`/${locale}`} className="text-2xl font-bold text-emerald-600">
            {t('site.name')}
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href={`/${locale}/tools`}>{t('nav.tools')}</Link>
            <Link href={`/${locale}/categories`}>{t('nav.categories')}</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-50 to-white py-12">
        <div className="container mx-auto max-w-6xl px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            {t('site.tagline')}
          </h1>
          <p className="mt-4 text-lg text-slate-600">{t('site.description')}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs text-slate-500">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">{t('ui.free')}</span>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">{t('ui.noSignup')}</span>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">{t('ui.browserOnly')}</span>
          </div>
        </div>
      </section>

      {/* Adsterra — 상단 Native Banner */}
      <div className="container mx-auto max-w-6xl px-4">
        <AdsterraSlot type="banner" width={728} height={90} />
      </div>

      {/* Featured Tools Grid */}
      <section className="container mx-auto max-w-6xl px-4 py-12">
        <h2 className="mb-6 text-2xl font-semibold">{t('nav.tools')}</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FEATURED_TOOLS.map(({ id, category, icon: Icon }) => (
            <Link
              key={id}
              href={`/${locale}/tools/${id}`}
              className="group rounded-xl border bg-white p-6 transition hover:border-emerald-400 hover:shadow-lg"
            >
              <Icon className="h-8 w-8 text-emerald-600" />
              <h3 className="mt-3 font-semibold group-hover:text-emerald-600">
                {t(`tools.${id}.name`)}
              </h3>
              <p className="mt-1 text-sm text-slate-600">{t(`tools.${id}.description`)}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Adsterra — 본문 중간 Native Banner (refresh on scroll) */}
      <div className="container mx-auto max-w-6xl px-4">
        <AdsterraSlot type="banner" width={728} height={90} refreshOnScroll />
      </div>

      {/* Adsterra — In-Page Push (사이드 알림) */}
      <AdsterraSlot type="push" width={0} height={0} />

      {/* Adsterra — Social Bar (모바일 하단 고정) */}
      <AdsterraSlot type="social" width={0} height={0} />

      <section className="container mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-xl border bg-white p-5">
          <h2 className="mb-2 text-xl font-semibold">Partner Picks</h2>
          <p className="mb-4 text-sm text-slate-600">개발/생산성 도구 관련 추천 링크입니다.</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <a className="rounded-lg border border-amber-300 bg-amber-50 p-4 hover:border-amber-400" href={buildAmazonUrl('mechanical keyboard')} target="_blank" rel="sponsored noopener noreferrer">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Amazon</p>
              <p className="mt-1 text-sm">Mechanical Keyboard</p>
            </a>
            <a className="rounded-lg border border-blue-300 bg-blue-50 p-4 hover:border-blue-400" href={buildCoupangUrl('노트북 거치대')} target="_blank" rel="sponsored noopener noreferrer">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Coupang</p>
              <p className="mt-1 text-sm">노트북 거치대</p>
            </a>
            <a className="rounded-lg border border-rose-300 bg-rose-50 p-4 hover:border-rose-400" href={buildAliExpressUrl('usb hub')} target="_blank" rel="sponsored noopener noreferrer">
              <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">AliExpress</p>
              <p className="mt-1 text-sm">USB Hub</p>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-8">
        <div className="container mx-auto max-w-6xl px-4 text-center text-sm text-slate-500">
          <p>{t('footer.rights')}</p>
        </div>
      </footer>
    </main>
  );
}
