import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import PolicyPage from '@/components/PolicyPage';
import { CONTACT_EMAIL, ORG_ID, SEO_DATE, SITE, jsonLdScript } from '@/lib/seo';

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: '이용약관 | HandyTools',
    description: 'HandyTools 이용약관: 도구는 있는 그대로 제공되며 결과의 정확성과 특정 목적 적합성을 보증하지 않습니다. 제3자 링크와 약관 변경 안내를 포함합니다.',
    alternates: { canonical: `/${locale}/terms` },
  };
}

export default async function Terms({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const url = `${SITE}/${locale}/terms`;
  const ld = { '@context': 'https://schema.org', '@type': 'WebPage', '@id': `${url}#page`, url, name: '이용약관', inLanguage: 'ko', dateModified: SEO_DATE, publisher: { '@id': ORG_ID } };
  return (
    <PolicyPage locale={locale} title="이용약관">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(ld) }} />
      <p>최종 갱신: {SEO_DATE}</p>
      <h2>서비스 제공 방식</h2>
      <p>HandyTools는 개발과 일상 업무에 쓰는 무료 온라인 도구를 있는 그대로 제공합니다. 도구 결과의 정확성, 완전성, 특정 목적에의 적합성을 보증하지 않으며 중요한 작업에서는 결과를 직접 검증해 주세요.</p>
      <h2>책임의 한계</h2>
      <p>이 사이트의 도구를 사용해 내린 결정이나 그로 인한 손해에 대해 운영자는 법이 허용하는 범위에서 책임을 지지 않습니다. 비밀번호와 토큰처럼 민감한 값은 스스로 안전하게 관리해야 합니다.</p>
      <h2>제3자 링크</h2>
      <p>광고와 제휴 링크는 운영자가 통제하지 않는 외부 사이트로 연결됩니다. 구매나 가입 전에 해당 사이트의 약관을 확인하세요.</p>
      <h2>변경</h2>
      <p>약관과 도구는 변경될 수 있으며 이 페이지 상단의 날짜가 마지막 개정일입니다.</p>
      <h2>문의</h2>
      <p><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
    </PolicyPage>
  );
}
