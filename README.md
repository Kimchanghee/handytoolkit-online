# handytools.io — 온라인 도구 허브 (1순위)

> 50+ 무료 온라인 도구를 한 도메인에 모은 허브. 이미지·PDF·변환·생성기·인코더 등.
> Adsterra RPM 최상위 카테고리(글로벌 도구 트래픽)이며 다국어 8개로 Tier 1 트래픽 흡수.

## 핵심 지표

| 항목 | 값 |
|---|---|
| 카테고리 | 온라인 도구 (B-3) |
| 도메인 | handytools.io |
| 지원 언어 | ko, en, ja, zh, de, fr, es, pt (8개) |
| 광고 형식 | Adsterra Multitag(5종) |
| AWS 비용 | 약 $35~$50/월 |
| 예상 RPM | $5~$13 (글로벌 트래픽) |
| Stage 3 월 PV | 약 4,500K |
| Stage 3 월 수익 | $31,500 ~ $58,500 |

## 도구 50종 (Phase 1: 20종부터 시작)

### 이미지 도구
1. 이미지 압축 (JPEG/PNG/WebP)
2. 이미지 리사이즈
3. 이미지 포맷 변환 (PNG↔JPG↔WebP↔AVIF)
4. 이미지 자르기 (Crop)
5. 이미지 회전 / 뒤집기
6. 배경 제거 (rembg-wasm)
7. 색상 추출 (이미지 → 팔레트)
8. EXIF 제거

### PDF 도구
9. PDF 합치기
10. PDF 분할
11. PDF 회전
12. PDF → 이미지
13. 이미지 → PDF
14. PDF 압축
15. PDF 비밀번호 제거 (사용자 본인 파일 한정)

### 텍스트·코드 도구
16. JSON 포매터 / 검증
17. JSON ↔ YAML 변환
18. JSON ↔ CSV 변환
19. Base64 인코드/디코드
20. URL 인코드/디코드
21. 정규식 테스터
22. 텍스트 차이 비교 (Diff)
23. 마크다운 미리보기
24. SQL 포매터
25. HTML 포매터 / Minify
26. 텍스트 글자수 카운터

### 변환기
27. 단위 변환 (길이·무게·온도·면적·부피 등 종합)
28. 시간대 변환
29. 환율 변환 (B-2와 데이터 공유)
30. 색상 변환 (HEX↔RGB↔HSL↔CMYK)

### 생성기
31. QR 코드 생성기
32. 비밀번호 생성기
33. UUID 생성기
34. 가짜 이름·주소 생성기 (Lorem Ipsum 한글판 포함)
35. 해시 생성기 (MD5·SHA1·SHA256·bcrypt)
36. JWT 디코더
37. Cron 표현식 생성기 / 검증
38. 색상 팔레트 생성기

### 미디어
39. 동영상 메타데이터 분석
40. 오디오 포맷 변환 (mp3↔wav↔aac, FFmpeg-wasm)
41. 동영상 압축 (FFmpeg-wasm)
42. 자막 변환 (srt↔vtt↔ass)

### 기타
43. URL 단축
44. IP 정보 조회 (사용자 IP)
45. DNS 조회
46. SSL 인증서 정보
47. 메타 태그 생성기 (SEO)
48. og 이미지 미리보기
49. favicon 생성기 (16/32/180/192/512)
50. CSS 클립패스 생성기

## 기술 스택

- **Next.js 15** (App Router, ISR, Edge Runtime 일부 도구)
- **TypeScript 5.5+**
- **Tailwind CSS 3.4**
- **next-intl** (8개국어 i18n)
- **WebAssembly** (이미지 압축 = `@squoosh/lib`, PDF = `pdf-lib`, 동영상 = `@ffmpeg/ffmpeg`)
- **Adsterra Multitag** (`shared/adsterra-integration`)
- **AWS CDK + Lambda Edge** (대용량 처리는 Lambda로 위임)

## SEO 페이지 자동 생성

각 도구 × 8개 언어 = 400개 페이지. 추가로 사용 사례 페이지(예: "PDF를 5MB로 압축하기")를 도구당 5~10개 생성 → **총 2,000~4,000 SEO 페이지**.

## 광고 배치

```
[헤더 — Native Banner 728×90]
   도구 검색 / 카테고리 그리드
[Native Banner 300×250]
   추천 도구 카드 6개
[Native Banner — 본문 중간]
   도구 사용 영역
[Direct Link 버튼 — "결과 다운로드"]
[푸터 — Social Bar]
[Popunder — head에 1회]
```

## 디렉토리 구조

```
01-handytools-io/
├── package.json
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── .env.example
├── .gitignore
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── page.tsx              (홈)
│   │   │   ├── layout.tsx
│   │   │   └── tools/
│   │   │       ├── [tool]/page.tsx   (동적 도구 페이지)
│   │   │       └── page.tsx          (도구 목록)
│   │   └── api/
│   │       └── process/route.ts      (서버사이드 처리)
│   ├── components/
│   │   ├── AdsterraSlot.tsx
│   │   ├── ToolCard.tsx
│   │   └── LangSwitch.tsx
│   ├── i18n/
│   │   ├── messages/
│   │   │   ├── ko.json
│   │   │   ├── en.json
│   │   │   └── ... (8개 언어)
│   │   └── config.ts
│   ├── tools/                         (도구별 로직)
│   │   ├── image-compress.ts
│   │   ├── pdf-merge.ts
│   │   ├── json-format.ts
│   │   └── ...
│   └── lib/
│       ├── seo.ts
│       └── analytics.ts
├── infrastructure/
│   ├── cdk-app.ts
│   ├── cdk.json
│   └── deploy.sh
└── .github/
    └── workflows/
        └── deploy.yml
```

## 배포 흐름

1. `npm run build` → `.next/` 빌드 산출물
2. `npm run translate:all` → Bedrock으로 8개국어 번역 + 캐시
3. `cdk deploy --all` → S3 업로드 + CloudFront 무효화 + Route 53 연결
4. Adsterra 대시보드에서 광고 zone 5개 생성 → `.env`에 키 입력 → 재배포

## 다음 단계 (이 폴더 안에서)

1. `package.json` + 기본 의존성 설치
2. 각 도구를 1개씩 구현 (Phase 1: 20개 / Phase 2: 30개 추가)
3. `src/i18n/messages/ko.json` 작성 → Bedrock으로 7개 언어 자동 번역
4. AWS 계정 연결 → `cdk bootstrap` → `cdk deploy`
5. IONOS에서 `handytools.io` 등록 → Route 53 네임서버로 위임
6. Adsterra 사이트 등록 → 광고 zone 5종 생성 → `.env` 입력 → 재배포
