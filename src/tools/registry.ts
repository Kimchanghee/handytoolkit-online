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
  { id: 'json-format', category: 'text', slug: 'json-formatter', clientOnly: true, priority: 1 },
  { id: 'base64', category: 'text', slug: 'base64-encoder-decoder', clientOnly: true, priority: 2 },
  { id: 'jwt-decode', category: 'text', slug: 'jwt-decoder', clientOnly: true, priority: 3 },
  { id: 'qr-generate', category: 'generator', slug: 'qr-code-generator', clientOnly: true, bundleHint: 'qrcode', priority: 1 },
  { id: 'password-generate', category: 'generator', slug: 'password-generator', clientOnly: true, priority: 2 },
  { id: 'uuid-generate', category: 'generator', slug: 'uuid-generator', clientOnly: true, priority: 3 },
  { id: 'hash-generate', category: 'generator', slug: 'hash-generator', clientOnly: true, priority: 4 },
  { id: 'color-convert', category: 'converter', slug: 'color-converter', clientOnly: true, priority: 3 },
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
