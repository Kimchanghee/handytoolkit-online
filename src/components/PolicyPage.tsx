import Link from 'next/link';
import type { ReactNode } from 'react';
import SiteFooter from './SiteFooter';

export default function PolicyPage({ locale, title, children }: { locale: string; title: string; children: ReactNode }) {
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="container mx-auto flex max-w-6xl items-center justify-between p-4">
          <Link href={`/${locale}`} className="text-2xl font-bold text-emerald-600">HandyTools</Link>
          <Link href={`/${locale}/tools`} className="text-sm text-slate-600 hover:text-slate-900">도구 목록</Link>
        </div>
      </header>
      <article className="container mx-auto max-w-3xl px-4 py-10 leading-7 text-slate-700">
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-slate-950">{title}</h1>
        <div className="space-y-4 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-slate-950 [&_a]:text-emerald-700 [&_a]:underline">{children}</div>
      </article>
      <SiteFooter locale={locale} />
    </main>
  );
}
