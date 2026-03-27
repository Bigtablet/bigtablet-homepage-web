# Bigtablet Homepage Web

Bigtablet 공식 홈페이지 웹 애플리케이션입니다.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **UI:** React 19, @bigtablet/design-system, SCSS Modules
- **Animation:** GSAP + ScrollTrigger
- **State:** TanStack React Query 5
- **HTTP:** Axios
- **Validation:** Zod 4
- **i18n:** next-intl
- **Lint/Format:** Biome

## Architecture

[Feature-Sliced Design (FSD)](https://feature-sliced.design/) 기반 레이어 구조

```
src/
├── app/          # Next.js 페이지, 레이아웃
├── shared/       # 공통 UI, 훅, 라이브러리
├── entities/     # 도메인 데이터 (API, 스키마)
├── features/     # 사용자 액션 (폼, Query, Mutation)
├── widgets/      # 페이지 섹션 UI
└── i18n/         # 다국어 설정
```

## Quick Start

### Requirements

- **Node.js:** v24 이상
- **Package Manager:** pnpm

### Setup

```bash
pnpm install
```

### Environment

`.env` 파일에 서버 URL을 설정합니다.

```env
NEXT_PUBLIC_SERVER_URL=https://localhost:8080
SERVER_URL=https://localhost:8080
```

### Development

```bash
pnpm dev                # 개발 서버 (http://localhost:3000)
pnpm dev -- -p 3001     # 포트 변경
```

### Build & Run

```bash
pnpm build              # 프로덕션 빌드
pnpm start              # 프로덕션 서버
```

### Lint & Format

```bash
pnpm lint               # Biome 린트
pnpm format             # Biome 포맷
```

## Deployment

GitHub Actions + Docker 기반 자동 배포

1. Git 태그 push (`1.x.x`)
2. Docker 이미지 빌드 & Docker Hub push
3. Cosign 서명
4. SSH로 프로덕션 서버 배포

### Required GitHub Secrets

| Secret | Description |
| --- | --- |
| `DOCKER_USERNAME` | Docker Hub 사용자명 |
| `DOCKER_PASSWORD` | Docker Hub 비밀번호 |
| `SERVER_URL` | 백엔드 서버 URL |
| `HOST_PROD` | 프로덕션 서버 호스트 |
| `SSH_USER` | SSH 사용자명 |
| `PRIVATE_KEY` | SSH 개인키 |
| `PORT` | SSH 포트 |

## Pages

| Route | Description |
| --- | --- |
| `/main` | 메인 (배너, 솔루션, 협업사) |
| `/about` | 회사 소개 |
| `/about/[id]` | 팀원 상세 |
| `/blog` | 블로그 목록 |
| `/blog/[idx]` | 블로그 상세 |
| `/news` | 뉴스 목록 |
| `/recruit` | 채용 목록 |
| `/recruit/[idx]` | 채용 상세 |
| `/recruit/[idx]/apply` | 지원서 작성 |
| `/policies/*` | 정책 (이용약관, 개인정보 등) |
