/**
 * Tool Registry — 모든 도구 메타 정보를 한 곳에서 관리.
 * 새 도구 추가 시 여기에만 등록 → 자동으로 SEO 페이지 + 카테고리 그리드 + sitemap에 반영.
 */

export type ToolCategory =
  | 'image'
  | 'pdf'
  | 'text'
  | 'converter'
  | 'generator'
  | 'media'
  | 'web';

export interface ToolMeta {
  id: string;
  category: ToolCategory;
  /** 8개 언어별 슬러그를 자동 생성하기 위한 영문 키 (URL용) */
  slug: string;
  /** 클라이언트 100% 처리 여부 — true면 서버 업로드 없음 강조 */
  clientOnly: boolean;
  /** 이 도구가 사용하는 외부 라이브러리 (지연 로드 힌트) */
  bundleHint?: string;
  /** 인기도/우선순위 (1=최고) — 홈 그리드 정렬용 */
  priority: number;
}

export const TOOLS: ToolMeta[] = [
  // 텍스트·코드
  { id: 'json-format', category: 'text', slug: 'json-formatter', clientOnly: true, priority: 1 },
  { id: 'base64', category: 'text', slug: 'base64-encoder-decoder', clientOnly: true, priority: 2 },
  { id: 'url-encode', category: 'text', slug: 'url-encoder-decoder', clientOnly: true, priority: 3 },
  { id: 'jwt-decode', category: 'text', slug: 'jwt-decoder', clientOnly: true, priority: 4 },
  { id: 'regex-test', category: 'text', slug: 'regex-tester', clientOnly: true, priority: 5 },
  { id: 'json-yaml', category: 'converter', slug: 'json-to-yaml', clientOnly: true, priority: 6 },
  { id: 'json-csv', category: 'converter', slug: 'json-to-csv', clientOnly: true, priority: 7 },
  { id: 'text-diff', category: 'text', slug: 'text-diff', clientOnly: true, priority: 8 },
  { id: 'markdown-preview', category: 'text', slug: 'markdown-preview', clientOnly: true, priority: 9 },
  { id: 'word-count', category: 'text', slug: 'word-counter', clientOnly: true, priority: 10 },

  // 생성기
  { id: 'qr-generate', category: 'generator', slug: 'qr-code-generator', clientOnly: true, bundleHint: 'qrcode', priority: 1 },
  { id: 'password-generate', category: 'generator', slug: 'password-generator', clientOnly: true, priority: 2 },
  { id: 'uuid-generate', category: 'generator', slug: 'uuid-generator', clientOnly: true, priority: 3 },
  { id: 'hash-generate', category: 'generator', slug: 'hash-generator', clientOnly: true, priority: 4 },
  { id: 'lorem-ipsum', category: 'generator', slug: 'lorem-ipsum-generator', clientOnly: true, priority: 5 },
  { id: 'fake-data', category: 'generator', slug: 'fake-data-generator', clientOnly: true, priority: 6 },
  { id: 'color-palette', category: 'generator', slug: 'color-palette-generator', clientOnly: true, priority: 7 },
  { id: 'cron-build', category: 'generator', slug: 'cron-expression-generator', clientOnly: true, priority: 8 },
  { id: 'favicon-generate', category: 'generator', slug: 'favicon-generator', clientOnly: true, priority: 9 },
  { id: 'meta-tag', category: 'generator', slug: 'meta-tag-generator', clientOnly: true, priority: 10 },

  // 이미지
  { id: 'image-compress', category: 'image', slug: 'image-compressor', clientOnly: true, bundleHint: '@squoosh/lib', priority: 1 },
  { id: 'image-resize', category: 'image', slug: 'image-resizer', clientOnly: true, priority: 2 },
  { id: 'image-convert', category: 'image', slug: 'image-format-converter', clientOnly: true, priority: 3 },
  { id: 'image-crop', category: 'image', slug: 'image-cropper', clientOnly: true, priority: 4 },
  { id: 'image-rotate', category: 'image', slug: 'image-rotator', clientOnly: true, priority: 5 },
  { id: 'exif-remove', category: 'image', slug: 'exif-remover', clientOnly: true, bundleHint: 'exifreader', priority: 6 },
  { id: 'color-extract', category: 'image', slug: 'color-extractor-from-image', clientOnly: true, priority: 7 },

  // PDF
  { id: 'pdf-merge', category: 'pdf', slug: 'pdf-merger', clientOnly: true, bundleHint: 'pdf-lib', priority: 1 },
  { id: 'pdf-split', category: 'pdf', slug: 'pdf-splitter', clientOnly: true, bundleHint: 'pdf-lib', priority: 2 },
  { id: 'pdf-rotate', category: 'pdf', slug: 'pdf-rotator', clientOnly: true, bundleHint: 'pdf-lib', priority: 3 },
  { id: 'pdf-image', category: 'pdf', slug: 'pdf-to-image', clientOnly: true, priority: 4 },
  { id: 'image-pdf', category: 'pdf', slug: 'image-to-pdf', clientOnly: true, priority: 5 },

  // 변환기
  { id: 'unit-convert', category: 'converter', slug: 'unit-converter', clientOnly: true, priority: 1 },
  { id: 'timezone-convert', category: 'converter', slug: 'timezone-converter', clientOnly: true, priority: 2 },
  { id: 'color-convert', category: 'converter', slug: 'color-converter', clientOnly: true, priority: 3 },

  // 웹·기타
  { id: 'ip-info', category: 'web', slug: 'ip-info', clientOnly: false, priority: 1 },
  { id: 'dns-lookup', category: 'web', slug: 'dns-lookup', clientOnly: false, priority: 2 },
  { id: 'og-preview', category: 'web', slug: 'og-image-preview', clientOnly: true, priority: 3 },
];

export const CATEGORIES: Record<ToolCategory, { label: Record<string, string>; icon: string }> = {
  image: { label: { ko: '이미지', en: 'Image', ja: '画像' }, icon: 'image' },
  pdf: { label: { ko: 'PDF', en: 'PDF', ja: 'PDF' }, icon: 'file-text' },
  text: { label: { ko: '텍스트·코드', en: 'Text & Code', ja: 'テキスト・コード' }, icon: 'code' },
  converter: { label: { ko: '변환기', en: 'Converters', ja: '変換ツール' }, icon: 'refresh-cw' },
  generator: { label: { ko: '생성기', en: 'Generators', ja: 'ジェネレーター' }, icon: 'sparkles' },
  media: { label: { ko: '미디어', en: 'Media', ja: 'メディア' }, icon: 'film' },
  web: { label: { ko: '웹·네트워크', en: 'Web & Network', ja: 'Web・ネットワーク' }, icon: 'globe' },
};

export function getToolsByCategory(category: ToolCategory): ToolMeta[] {
  return TOOLS.filter((t) => t.category === category).sort((a, b) => a.priority - b.priority);
}

export function getToolBySlug(slug: string): ToolMeta | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function getAllSlugs(): string[] {
  return TOOLS.map((t) => t.slug);
}
