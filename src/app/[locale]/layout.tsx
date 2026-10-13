import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { CONTACT_EMAIL, HOME_SEO, ORG_ID, SITE, SITE_ID, jsonLdScript } from '@/lib/seo';
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
    title: { default: HOME_SEO.title, template: `%s | ${t('name')}` },
    description: HOME_SEO.description,
    keywords: ['online tools', 'free tools', 'JSON formatter', 'QR generator', 'password generator', 'developer tools', '무료 도구', '온라인 도구'],
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
    },
    openGraph: {
      title: HOME_SEO.title,
      description: HOME_SEO.description,
      url: `${baseUrl}/${locale}`,
      siteName: t('name'),
      locale: locale === 'ko' ? 'ko_KR' : 'en_US',
      type: 'website',
      images: [{ url: "/og-image.png", width: 1200, height: 630, type: "image/png", alt: "HandyTools - 무료 온라인 도구 모음" }],
    },
    twitter: {
      card: 'summary_large_image',
      title: HOME_SEO.title,
      description: HOME_SEO.description,
      images: [{ url: "/og-image.png", alt: "HandyTools - 무료 온라인 도구 모음" }],
    },
    icons: { apple: "/apple-touch-icon.png" },
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
      other: { 'naver-site-verification': 'f38a47d490e8957953233d207dcf1e937a05d647' },
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const messages = await getMessages();
  const ldJson = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': ORG_ID,
        name: 'HandyToolkit',
        url: SITE + '/',
        email: CONTACT_EMAIL,
        description: 'JSON, JWT, Base64, QR, 비밀번호, UUID, 해시, 색상 변환 도구를 브라우저에서 무료로 제공합니다.',
      },
      {
        '@type': 'WebSite',
        '@id': SITE_ID,
        name: 'HandyTools',
        url: SITE + '/',
        inLanguage: 'ko-KR',
        publisher: { '@id': ORG_ID },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(ldJson) }} />
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </>
  );
}
