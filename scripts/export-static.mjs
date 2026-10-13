// Static export of the Next app for Cloudflare static assets.
// usage: node scripts/export-static.mjs   (run in a copy/work dir with node_modules installed)
// Default build stays `output: 'standalone'`; this script only patches a throw-away copy of the sources:
//  - tool route: force-dynamic -> force-static
//  - middleware removed (next-intl redirect "/" -> "/ko" is done by the Worker)
//  - robots/sitemap metadata routes forced static
import fs from 'node:fs';
import { execSync } from 'node:child_process';
const root = process.cwd();
const rd = (f) => fs.readFileSync(f, 'utf8');
const toolPage = 'src/app/[locale]/tools/[tool]/page.tsx';
fs.writeFileSync(toolPage, rd(toolPage).replace("export const dynamic = 'force-dynamic';", "export const dynamic = 'force-static';\nexport const dynamicParams = false;"));
if (fs.existsSync('src/middleware.ts')) fs.rmSync('src/middleware.ts');
for (const f of ['src/app/robots.ts', 'src/app/sitemap.ts']) {
  const s = rd(f); if (!s.includes("dynamic = 'force-static'")) fs.writeFileSync(f, s + "\nexport const dynamic = 'force-static';\n");
}
fs.rmSync('out', { recursive: true, force: true });
execSync('npx next build', { stdio: 'inherit', env: { ...process.env, STATIC_EXPORT: '1', NEXT_TELEMETRY_DISABLED: '1' } });
if (!fs.existsSync('out/404.html')) console.error('WARN: out/404.html missing');
console.log('exported to', root + '/out');
