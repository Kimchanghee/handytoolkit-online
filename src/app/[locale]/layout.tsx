import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { locales, type Locale } from '@/i18n/config';
import './globals.css';

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'site' });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://handytoolkit.online';

  return {
    metadataBase: new URL(baseUrl),
    title: { default: `${t('name')} ??${t('tagline')}`, template: `%s | ${t('name')}` },
    description: t('description'),
    keywords: ['online tools', 'free tools', 'JSON formatter', 'QR generator', 'password generator', 'developer tools', '臾대즺 ?꾧뎄', '?⑤씪???꾧뎄'],
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
    },
    openGraph: {
      title: t('name'),
      description: t('description'),
      url: `${baseUrl}/${locale}`,
      siteName: t('name'),
      locale,
      type: 'website',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: t('name') }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('name'),
      description: t('description'),
      images: ['/og-image.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true, follow: true,
        'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const messages = await getMessages();
  // JSON-LD 援ъ“???곗씠??(SEO + AEO ?듭떖)
  const ldJson = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://handytoolkit.online#org',
        name: 'HandyToolkit',
        url: 'https://handytoolkit.online',
        logo: 'https://handytoolkit.online/logo.png',
        description: '38+ free browser-based developer and designer tools.',
      },
      {
        '@type': 'WebSite',
        '@id': 'https://handytoolkit.online#site',
        name: 'HandyToolkit',
        url: 'https://handytoolkit.online',
        publisher: { '@id': 'https://handytoolkit.online#org' },
        inLanguage: 'ko-KR',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://handytoolkit.online/search?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'WebApplication',
        name: 'HandyToolkit Online Tools',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Any (browser)',
        url: 'https://handytoolkit.online',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', ratingCount: '250' },
        featureList: [
          'JSON formatter & validator', 'QR code generator', 'Password generator',
          'Base64 encoder/decoder', 'UUID v4/v7 generator', 'Hash (MD5/SHA)',
          'Color converter', 'JWT decoder',
        ],
      },
    ],
  };

  return (
    <>
      <Script
        id="handytoolkit-ldjson"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
      />
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </>
  );
}
