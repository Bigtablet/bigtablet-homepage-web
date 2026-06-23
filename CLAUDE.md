# CLAUDE.md

This file provides guidance for Claude Code when working with this repository.

## Project Overview

Bigtablet Homepage Web is a Next.js 16 admin web application (dashboard, payments) for the Insight platform. Built with React 19, TypeScript, and Feature-Sliced Design architecture. The visual language is derived from the Insight Flutter mobile app.

## Tech Stack

- **Framework:** Next.js 16.1.0 with App Router
- **UI:** React 19, @bigtablet/design-system, SCSS
- **State Management:** TanStack React Query 5
- **HTTP Client:** Axios with interceptors (에러 메시지 유틸: `src/shared/libs/api/axios/error`)
- **Validation:** Zod 4 schemas
- **Linting/Formatting:** Biome
- **Package Manager:** pnpm only

## Commands

```bash
pnpm install              # Install dependencies
pnpm dev                  # Start development server
pnpm dev -- -p 3001       # Run on specific port
pnpm build                # Production build
pnpm start                # Run production server
pnpm lint                 # Lint with Biome
pnpm format               # Format code with Biome
```

## Terminology

| Term | Meaning |
| --- | --- |
| **JS/TS** | JavaScript / TypeScript |
| **Class** | JS/TS Class syntax |
| **Function** | JS/TS Function (including Arrow) |
| **Member** | Variables/constants (no global/local distinction) |

## Domain Terminology (Do Not Rename)

- **Meeting:** Recorded consultation session (avoid "session")
- **Expo:** Exhibition/event context for a meeting
- **Client:** Unified role for visitor/counselor/manager

## Architecture (Feature-Sliced Design)

```
src/
├── app/          # Next.js pages and layouts
├── shared/       # Common UI / libs / tokens
│   ├── libs/
│   │   ├── api/
│   │   └── zod/      # Zod parsing utilities (parsedZod)
│   ├── ui/
│   └── hooks/
├── entities/     # Domain layer (CRUD logic + data structures)
│   └── <domain>/
│       ├── api/        # API functions + API-specific schemas
│       ├── schema/     # Domain schemas / types
│       ├── constants/  # Domain constants
│       └── util/       # Pure domain logic
├── features/     # User action-based features (forms, mutations, search)
│   └── <feature>/
│       ├── ui/
│       ├── query/      # useQuery hooks only (read operations)
│       ├── mutation/   # useMutation hooks only (write operations)
│       └── model/      # Business logic hooks (use-*.ts)
├── widgets/      # Page section UI (domain UI)
│   └── <widget>/
│       ├── ui/
│       ├── model/
│       └── style.module.scss
├── processes/    # Complex cross-feature flows (if needed)
└── test/
```

### Query/Mutation Separation Rules

| Type | Location | Example |
| --- | --- | --- |
| `useQuery`, `useSuspenseQuery` | `query/` folder | `member.query.ts` |
| `useMutation` | `mutation/` folder | `auth.mutation.ts` |
| Business logic hooks | `model/` folder | `use-signin.ts` |

**File Split Criteria:**
- Split when a file exceeds **100 lines**
- Split when a file has **too many responsibilities**
- Keep related functionality together when under these thresholds

## Environment & Configuration

| Item | Rule |
| --- | --- |
| Server URL | `NEXT_PUBLIC_SERVER_URL` in `.env` (Axios baseURL) |
| Media Proxy | `next.config.mjs` rewrites: `/media/:id*` → GCS |
| TypeScript | Strict mode, path alias `src/*` |
| Biome | Tabs (4 spaces width), 100 char line width |

## SEO

- `src/app/sitemap.ts`의 `LAST_MODIFIED` 상수는 **사이트 콘텐츠를 수정한 날짜**로 수동 업데이트
  - 형식: `"YYYY-MM-DD"`
  - 빌드 시점 자동 날짜(`new Date()`) 사용 금지 — 내용 변경 없이 매 배포마다 갱신되어 크롤러 과부하 유발
- `src/app/robots.ts` 변경 시 sitemap URL 일치 여부 확인

## Authentication Flow

1. Tokens stored in cookies via `js-cookie`
2. Request interceptor adds Bearer token
3. Response interceptor handles 401 with token refresh queue
4. Automatic logout on permanent 401

## Detailed Documentation

자세한 가이드라인은 `.claude/docs/` 폴더의 문서를 참조하세요:

| Document | Contents |
| --- | --- |
| [code-style.md](.claude/docs/code-style.md) | 코드 스타일, 네이밍 컨벤션, JSDoc 가이드 |
| [design-system.md](.claude/docs/design-system.md) | SCSS 토큰, 컴포넌트 가이드, 반응형 디자인 |
| [react-patterns.md](.claude/docs/react-patterns.md) | React Query, Server/Client 컴포넌트 패턴 |
| [git-workflow.md](.claude/docs/git-workflow.md) | Git 컨벤션, 브랜치 전략, PR 워크플로우 |

## Quick Reference

### Code Style Summary

- Components: Functional + hooks-based, `const` + `export default`
- Naming: UpperCamelCase (components), snake_case (SCSS classes)
- Comments: Only where necessary, Korean (English when needed)
- Control flow: 3+ conditions → `switch`, Early return pattern
- Route client delegate: 서버 `page.tsx` 가 위임하는 `"use client"` 컴포넌트는 같은 폴더에 **`page-client.tsx`** 로 둔다 (목록/상세 라우트 공통, `client.tsx` 금지)

### Styling Summary

- SCSS with `@bigtablet/design-system/scss/token`
- Import: `@use "@bigtablet/design-system/scss/token" as token;`
- Responsive: `mobile`, `tablet`, `desktop` mixins

### Git Summary (⚠️ 필수 준수)

- **커밋 메시지는 반드시 영문 소문자**: `label: english message` (한글 금지)
- **Co-Authored-By**: `Co-Authored-By: Claude <noreply@anthropic.com>`
- **브랜치**: `label/domain` (예: `feat/member-table`)
- **브랜치 라벨**: `feat`, `fix`, `bug`, `chore`, `test`, `style`, `docs`, `config`, `delete`, `note`, `etc` (이 목록에 없는 라벨 사용 금지)
- **PR/Issue 워크플로우** (순서 필수):
  1. Issue 생성 (조직 공용 템플릿 사용: 제목 `[BUG]`/`[FEATURE]`/`[TASK]` + 설명, 라벨 `Bug`/`Feature`/`Fix`)
  2. Branch 생성
  3. 구현 + 커밋 (영문)
  4. PR 생성 (title = 브랜치명, base = `develop`)
  5. PR에 `Closes #이슈번호` 추가
- **Issue 본문**: 조직 공용 템플릿(`[BUG]`/`[FEATURE]`/`[TASK]`) 섹션을 그대로 사용. 자의적 변경 금지. 템플릿별 제목 접두사·라벨·섹션은 [git-workflow.md](.claude/docs/git-workflow.md) 참조
- **PR 본문 템플릿** (자의적 변경 금지):
  ```markdown
  ## 제목
  브랜치명

  ## 작업한 내용
  - [x] 작업1

  ## 전달할 추가 이슈
  - 없음
  ```
- **PR 제목 = 브랜치명** (설명문 아님, 예: `fix/detail-page-pagination`)
- **PR 라벨** (⚠️ 필수): PR 생성 시 작업 성격에 맞는 라벨을 1개 이상 부착한다. 성격이 겹치면 복수 부착 (예: 코드 수정 + 문서 → `Fix`, `Docs`).

  | Label | 의미 |
  | --- | --- |
  | `Bug` | 에러 발견 / 수정 |
  | `Deploy` | 배포 관련 작업/이슈 |
  | `Docs` | 문서 관련 |
  | `Feature` | 기능 개발 |
  | `Fix` | 코드/구조 수정 |
  | `Hotfix` | 급히 수정/삭제/추가 되어야 할 이슈 |
  | `quality-report` | 코드 품질 리포트 |
  | `Suggestion` | 제안 / 의견 / 질문 |

- **리뷰 반영**: 해당 PR 브랜치에 직접 추가 커밋 (별도 브랜치 생성 금지). **develop → main PR 의 리뷰도 `develop` 에 직접 커밋**
- **리뷰 답글 멘션** (⚠️ 필수): 봇 리뷰 코멘트에 답글/스레드 처리 시 **해당 코멘트를 작성한 봇을 멘션**한다.
  - `gemini-code-assist` 가 단 리뷰 → 답글에 `@gemini-code-assist` 멘션
  - `coderabbitai` 가 단 리뷰 → 답글에 `@coderabbitai` 멘션
  - 멘션으로 봇이 재확인/재리뷰하도록 트리거한다. 답글은 한 줄로 "무엇을 바꿨는지(또는 왜 안 바꿨는지)" 명시 후 스레드 resolve.

### Jira 티켓 규칙 (⚠️ 필수 준수)

작업을 Jira에 등록할 때 (Atlassian MCP 사용, cloud `bigtablet.atlassian.net`):

- **프로젝트**: `DEV` (개발팀)
- **부모 에픽**: 이 repo 작업은 **반드시 `DEV-388` (공식 홈페이지) 에픽 하위**로 생성한다 (`parent: { key: "DEV-388" }`). 다른 에픽(예: `DEV-37` Nottiv) 사용 금지.
- **담당자(assignee)**: **작업자 본인**으로 지정한다 (`atlassianUserInfo`로 accountId 조회 후 `assignee`). 미지정 금지.
- **제목 접두사**: `[WEB]` (`[BUG]`/`[TASK]` 아님 — GitHub 이슈 접두사와 다름). 예: `[WEB] 작업 설명`
- **이슈 타입**: `작업` (Task)
- **필드 4종 필수**:
  | 필드 | Jira 필드 | 내용 |
  | --- | --- | --- |
  | 설명 | `description` | 작업 목적/배경 요약 |
  | 기존안 | `customfield_10229` (ADF) | 변경 전 상태/문제 |
  | 수정안 | `customfield_10230` (ADF) | 적용한 해결책 + 검증 + branch/PR |
  | 시작 날짜 | `customfield_10015` (`YYYY-MM-DD`) | **커밋 첫 날짜** (`git log`로 확인) |
- **기존안/수정안은 ADF 포맷 필수** (plain string 거부됨): `{"type":"doc","version":1,"content":[{"type":"paragraph","content":[{"type":"text","text":"..."}]}]}`. 코드 예시는 `codeBlock` 노드 사용 가능.
- **생성 전 중복 검색 (⚠️ 필수)**: `searchJiraIssuesUsingJql`로 동일/유사 티켓이 이미 있는지 확인 후 생성한다. 무지성 일괄 생성 금지.

### Release 규칙 (⚠️ 필수 준수)

- **태그 형식: `X.Y.Z`** — `v` 접두사 절대 사용 금지 (예: `1.9.0` ✅, `v1.9.0` ❌)
- **제목**: 태그와 동일 (예: `1.9.0`)
- **타겟 브랜치**: `main` (develop → main 머지 후 main 기준 생성)

#### Release 본문 양식 (자의적 변경 금지)

```markdown
## Official Website Web of Bigtablet, Inc.

#### Key Updates
- <conventional commit-style line, 영문 소문자>
- <conventional commit-style line, 영문 소문자>
```

- 첫 줄: `## Official Website Web of Bigtablet, Inc.` (절대 변경 금지)
- 두 번째: `#### Key Updates` (절대 변경 금지)
- 본문은 **영문 소문자 conventional commit 스타일** (`fix:`, `feat:`, `chore:`, `delete:` 등) 한 줄씩
- ❌ `## Features` / `## Bug Fixes` / `## Performance` 등 카테고리 섹션 추가 금지
- ❌ 한글 본문 금지 — 모두 영문 소문자
- ❌ 빈 줄로 그룹 분리 금지

생성 예시:

```bash
gh release create 1.9.0 --target main --title "1.9.0" --notes "$(cat <<'EOF'
## Official Website Web of Bigtablet, Inc.

#### Key Updates
- feat: add new feature description
- fix: bug description
- chore: bump dependency from x to y
EOF
)"
```
