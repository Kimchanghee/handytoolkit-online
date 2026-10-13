import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import PolicyPage from '@/components/PolicyPage';
import { CONTACT_EMAIL, ORG_ID, SEO_DATE, SITE, jsonLdScript } from '@/lib/seo';

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: '개인정보 처리방침 | HandyTools',
    description: 'HandyTools가 입력값, 방문 통계(Google Analytics), 광고와 제휴 링크를 어떻게 다루는지 안내합니다. 도구에 입력한 내용은 브라우저 밖으로 나가지 않습니다.',
    alternates: { canonical: `/${locale}/privacy` },
  };
}

export default async function Privacy({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const url = `${SITE}/${locale}/privacy`;
  const ld = { '@context': 'https://schema.org', '@type': 'WebPage', '@id': `${url}#page`, url, name: '개인정보 처리방침', inLanguage: 'ko', dateModified: SEO_DATE, publisher: { '@id': ORG_ID } };
  return (
    <PolicyPage locale={locale} title="개인정보 처리방침">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(ld) }} />
      <p>최종 갱신: {SEO_DATE}</p>
      <h2>도구에 입력한 내용</h2>
      <p>HandyTools의 도구(JSON, JWT, Base64, QR, 비밀번호, UUID, 해시, 색상)는 브라우저 안에서 동작합니다. 입력한 텍스트와 생성된 결과는 이 사이트의 서버로 전송되거나 저장되지 않으며 계정과 로그인도 없습니다.</p>
      <h2>방문 통계</h2>
      <p>방문 수와 이용 현황을 집계하기 위해 Google Analytics를 사용합니다. Google Analytics는 쿠키를 설정할 수 있고 Google의 개인정보 처리방침에 따라 데이터를 처리합니다. 제휴 링크 클릭 수도 같은 도구로 집계합니다.</p>
      <h2>광고와 제휴 링크</h2>
      <p>일부 페이지에는 제3자 광고(Adsterra)와 제휴 링크가 표시될 수 있습니다. 광고 제공자는 광고를 불러올 때 자체 쿠키를 설정하고 IP 주소와 브라우저 정보를 받을 수 있으며, 그 처리는 각 제공자의 정책을 따릅니다. 제휴 링크로 구매가 이뤄지면 이용자에게 추가 비용 없이 수수료를 받을 수 있고, 이런 링크는 계산이나 도구 결과에 영향을 주지 않습니다.</p>
      <h2>선택권</h2>
      <p>브라우저 설정에서 쿠키를 차단하거나 삭제할 수 있고 광고 차단 도구를 쓸 수 있습니다. 도구는 이를 차단해도 계속 동작합니다.</p>
      <h2>아동</h2>
      <p>이 사이트는 만 14세 미만 아동을 대상으로 하지 않으며 아동의 개인정보를 의도적으로 수집하지 않습니다.</p>
      <h2>문의</h2>
      <p>개인정보 관련 문의는 <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>로 보내 주세요.</p>
    </PolicyPage>
  );
}
