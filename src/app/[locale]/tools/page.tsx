import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { CATEGORIES, getToolsByCategory, type ToolCategory } from '@/tools/registry';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function ToolsIndexPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ToolsIndex locale={locale} />;
}

function ToolsIndex({ locale }: { locale: string }) {
  const t = useTranslations();
  const activeCategories = Object.keys(CATEGORIES)
    .map((category) => ({ category, tools: getToolsByCategory(category as ToolCategory) }))
    .filter((section) => section.tools.length > 0);

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="container mx-auto flex max-w-6xl items-center justify-between p-4">
          <Link href={`/${locale}`} className="text-2xl font-bold text-emerald-600">
            HandyTools
          </Link>
          <Link href={`/${locale}`} className="text-sm text-slate-600 hover:text-slate-900">
            홈
          </Link>
        </div>
      </header>

      <section className="container mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-bold tracking-tight">{t('nav.tools')}</h1>
        <p className="mt-2 max-w-2xl text-slate-600">{t('site.description')}</p>

        <div id="categories" className="mt-8 space-y-8">
          {activeCategories.map(({ category, tools }) => (
            <section key={category}>
              <h2 className="mb-3 text-xl font-semibold">{t(`categories.${category}`)}</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {tools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/${locale}/tools/${tool.slug}`}
                    className="rounded-lg border bg-white p-5 transition hover:border-emerald-400 hover:shadow"
                  >
                    <h3 className="font-semibold text-slate-900">{t(`tools.${tool.id}.name`)}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{t(`tools.${tool.id}.description`)}</p>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
