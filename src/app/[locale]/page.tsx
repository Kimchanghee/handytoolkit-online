import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { CodeIcon, KeyRoundIcon, QrCodeIcon, ShieldCheckIcon, PaletteIcon, FingerprintIcon } from 'lucide-react';
import { TOOLS } from '@/tools/registry';
import SafeInlineSponsored from '@/components/SafeInlineSponsored';

interface Props {
  params: Promise<{ locale: string }>;
}

const ICONS = {
  'json-format': CodeIcon,
  base64: CodeIcon,
  'jwt-decode': ShieldCheckIcon,
  'qr-generate': QrCodeIcon,
  'password-generate': KeyRoundIcon,
  'uuid-generate': FingerprintIcon,
  'hash-generate': ShieldCheckIcon,
  'color-convert': PaletteIcon,
} as const;

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
            <Link href={`/${locale}/tools#categories`}>{t('nav.categories')}</Link>
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
          <form
            action={`/${locale}/tools`}
            className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 rounded-2xl border bg-white p-3 shadow-sm sm:flex-row"
          >
            <label className="sr-only" htmlFor="tool-search">
              Search tools
            </label>
            <input
              id="tool-search"
              name="q"
              type="search"
              placeholder="JSON, QR, password, hash..."
              className="min-h-11 flex-1 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="min-h-11 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Open tools
            </button>
          </form>
        </div>
      </section>

      {/* Featured Tools Grid */}
      <section className="container mx-auto max-w-6xl px-4 py-12">
        <h2 className="mb-6 text-2xl font-semibold">{t('nav.tools')}</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map(({ id, slug }) => {
            const Icon = ICONS[id as keyof typeof ICONS] || CodeIcon;
            return (
            <Link
              key={id}
              href={`/${locale}/tools/${slug}`}
              className="group rounded-xl border bg-white p-6 transition hover:border-emerald-400 hover:shadow-lg"
            >
              <Icon className="h-8 w-8 text-emerald-600" />
              <h3 className="mt-3 font-semibold group-hover:text-emerald-600">
                {t(`tools.${id}.name`)}
              </h3>
              <p className="mt-1 text-sm text-slate-600">{t(`tools.${id}.description`)}</p>
            </Link>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-8">
        <div className="container mx-auto max-w-6xl px-4 text-center text-sm text-slate-500">
          <p>{t('footer.rights')}</p>
        </div>
      </footer>
          <SafeInlineSponsored placement="homepage-inline" />
    </main>
  );
}
