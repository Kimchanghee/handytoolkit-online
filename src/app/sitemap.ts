import type { MetadataRoute } from 'next';
import { TOOLS } from '@/tools/registry';
import { locales } from '@/i18n/config';
import { SEO_DATE } from '@/lib/seo';

const SITE = 'https://handytoolkit.online';
const BLOG = ['json-formatter-tutorial', 'jwt-decoder-guide', 'strong-password-tips', 'base64-encoding-explained', 'uuid-vs-nanoid-comparison'];

// Only real, indexable, 200 pages. discover.html is noindex and intentionally not listed.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(SEO_DATE);
  const entries: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    entries.push({ url: `${SITE}/${locale}`, lastModified, changeFrequency: 'weekly', priority: 1.0 });
    entries.push({ url: `${SITE}/${locale}/tools`, lastModified, changeFrequency: 'weekly', priority: 0.9 });
    for (const tool of TOOLS) {
      entries.push({ url: `${SITE}/${locale}/tools/${tool.slug}`, lastModified, changeFrequency: 'monthly', priority: 0.8 });
    }
    for (const p of ['privacy', 'terms', 'contact']) {
      entries.push({ url: `${SITE}/${locale}/${p}`, lastModified, changeFrequency: 'yearly', priority: 0.3 });
    }
  }
  entries.push({ url: `${SITE}/about/`, lastModified, changeFrequency: 'monthly', priority: 0.5 });
  entries.push({ url: `${SITE}/blog/`, lastModified, changeFrequency: 'monthly', priority: 0.6 });
  for (const slug of BLOG) entries.push({ url: `${SITE}/blog/${slug}/`, lastModified, changeFrequency: 'yearly', priority: 0.5 });
  return entries;
}
