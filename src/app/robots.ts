import type { MetadataRoute } from 'next';

const SITE = 'https://handytoolkit.online';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/_next/'] },
      // AI 크롤러 명시 허용 (AEO/GEO 핵심)
      ...['GPTBot', 'ChatGPT-User', 'OAI-SearchBot', 'ClaudeBot', 'Claude-Web', 'anthropic-ai',
          'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Bytespider', 'CCBot',
          'meta-externalagent', 'Applebot-Extended'].map((ua) => ({
        userAgent: ua, allow: '/',
      })),
    ],
    sitemap: [`${SITE}/sitemap.xml`],
    host: SITE,
  };
}
