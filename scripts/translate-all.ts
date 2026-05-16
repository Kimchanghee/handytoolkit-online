/**
 * 빌드 타임 번역 스크립트
 * ko.json (원본) → 7개 언어 자동 번역 후 messages/{lang}.json 저장
 *
 * 실행: npm run translate:all
 *
 * 캐시: .translation-cache/ 에 해시 키별 저장 (변경된 텍스트만 재번역)
 */
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { translateBatch } from '../../../shared/i18n-pipeline/translate';
import { locales, defaultLocale } from '../src/i18n/config';

const MESSAGES_DIR = join(process.cwd(), 'src/i18n/messages');
const SOURCE_LOCALE = defaultLocale;

const DOMAIN_CONTEXT = 'online tools website (image, PDF, text, converter, generator)';
const GLOSSARY = {
  HandyTools: 'HandyTools',
};
const PRESERVE = ['name', 'rights']; // 브랜드명·저작권 표기 보존

async function main() {
  const sourcePath = join(MESSAGES_DIR, `${SOURCE_LOCALE}.json`);
  const source = JSON.parse(await readFile(sourcePath, 'utf-8'));
  console.log(`✓ Loaded ${SOURCE_LOCALE}.json`);

  for (const locale of locales) {
    if (locale === SOURCE_LOCALE) continue;
    console.log(`→ Translating to ${locale}...`);
    const translated = await translateBatch(source, SOURCE_LOCALE, locale, {
      domain: DOMAIN_CONTEXT,
      glossary: GLOSSARY,
      preserveKeys: PRESERVE,
    });
    const out = join(MESSAGES_DIR, `${locale}.json`);
    await writeFile(out, JSON.stringify(translated, null, 2), 'utf-8');
    console.log(`✓ Saved ${locale}.json`);
  }

  console.log('\n✅ All translations completed.');
  console.log('   Estimated cost: ~$0.05~$0.30 (Bedrock Claude Haiku 4.5)');
}

main().catch((err) => {
  console.error('❌ Translation failed:', err);
  process.exit(1);
});
