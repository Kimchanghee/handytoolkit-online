import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always', // /ko, /en, /ja ... 항상 prefix
  localeDetection: true,  // Accept-Language 헤더로 자동 리다이렉트
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
