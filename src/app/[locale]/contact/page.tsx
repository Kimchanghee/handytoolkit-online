import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import PolicyPage from '@/components/PolicyPage';
import { CONTACT_EMAIL, ORG_ID, SEO_DATE, SITE, jsonLdScript } from '@/lib/seo';

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: '문의 | HandyTools',
    description: 'HandyTools 도구의 오류 제보와 문의는 이메일로 받습니다. 연락처와 보안 취약점 제보 방법을 안내합니다.',
    alternates: { canonical: `/${locale}/contact` },
  };
}

export default async function Contact({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const url = `${SITE}/${locale}/contact`;
  const ld = { '@context': 'https://schema.org', '@type': 'ContactPage', '@id': `${url}#page`, url, name: '문의', inLanguage: 'ko', dateModified: SEO_DATE, publisher: { '@id': ORG_ID } };
  return (
    <PolicyPage locale={locale} title="문의">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(ld) }} />
      <p>도구 오류, 개선 제안, 제휴 및 개인정보 문의는 이메일로 보내 주세요.</p>
      <p>이메일: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
      <p>이 사이트는 메일 전송을 대신 처리하지 않으며, 메일 앱이 열립니다.</p>
      <h2>보안 취약점 제보</h2>
      <p>취약점은 <a href="/.well-known/security.txt">security.txt</a>에 적힌 연락처로 알려 주세요.</p>
    </PolicyPage>
  );
}
