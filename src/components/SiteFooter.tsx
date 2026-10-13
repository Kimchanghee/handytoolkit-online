import Link from 'next/link';

export default function SiteFooter({ locale }: { locale: string }) {
  return (
    <footer className="border-t bg-white py-8">
      <div className="container mx-auto max-w-6xl px-4 text-center text-sm text-slate-500">
        <nav aria-label="Footer" className="mb-3 flex flex-wrap justify-center gap-x-5 gap-y-2">
          <a href="/about/" className="hover:text-slate-900">소개</a>
          <Link href={`/${locale}/privacy`} className="hover:text-slate-900">개인정보 처리방침</Link>
          <Link href={`/${locale}/terms`} className="hover:text-slate-900">이용약관</Link>
          <Link href={`/${locale}/contact`} className="hover:text-slate-900">문의</Link>
          <Link href={`/${locale}/tools`} className="hover:text-slate-900">도구 목록</Link>
        </nav>
        <p>© 2026 HandyTools. All rights reserved.</p>
      </div>
    </footer>
  );
}
