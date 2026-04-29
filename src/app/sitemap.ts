import type { MetadataRoute } from 'next';
import { TOOLS } from '@/tools/registry';
import { locales } from '@/i18n/config';

const SITE = 'https://handytoolkit.online';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // 홈 (언어별)
  for (const locale of locales) {
    entries.push({
      url: `${SITE}/${locale}`,
      lastModified,
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${SITE}/${l}`])),
      },
    });
  }

  // 도구별 페이지 (언어별)
  for (const tool of TOOLS) {
    for (const locale of locales) {
      entries.push({
        url: `${SITE}/${locale}/tools/${tool.slug}`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: {
          languages: Object.fromEntries(locales.map((l) => [l, `${SITE}/${l}/tools/${tool.slug}`])),
        },
      });
    }
  }

  return entries;
}
