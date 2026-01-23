# CLAUDE.md

This file provides guidance for Claude Code when working with this repository.

## Project Overview

Bigtablet Insight Web is a Next.js 16 admin web application (dashboard, payments) for the Insight platform. Built with React 19, TypeScript, and Feature-Sliced Design architecture. The visual language is derived from the Insight Flutter mobile app.

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
│       │   ├── <name>.api.ts
│       │   ├── <name>.schema.ts   # Request/Response schemas for API
│       │   └── index.ts           # Export (3+ files only)
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

### Features Folder Structure

```
features/<feature>/
├── query/                    # Read operations (useQuery)
│   ├── keys.ts               # Query keys factory
│   ├── <name>.query.ts       # Individual query hooks
│   └── index.ts              # Export (3+ files only)
├── mutation/                 # Write operations (useMutation)
│   ├── <name>.mutation.ts    # Individual mutation hooks
│   └── index.ts              # Export (3+ files only)
└── model/                    # Business logic hooks
    └── use-<name>.ts         # Form/UI logic hooks
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

## Code Style

| Item | Rule |
| --- | --- |
| Components | Functional + hooks-based |
| Declaration | `const` + `export default` |
| Components per file | 1 |
| File/Component naming | UpperCamelCase for components |
| Comments | Only where necessary, keep concise |
| Indentation | Tab (1 tab) |
| Semicolons | Required (`;`) |
| Variable naming | Use full names, avoid abbreviation (e.g., `member` not `mem`, `organization` not `org`) |

## Naming Conventions

| Type | Pattern | Example |
| --- | --- | --- |
| Component | `index.tsx` | `src/widgets/sidebar/index.tsx` |
| Hook | `use-<name>.ts` | `src/features/signin/model/use-signin.ts` |
| Utility | `<name>.util.ts` | `src/shared/libs/date.util.ts` |
| Schema/Types | `<name>.schema.ts` | `src/entities/signin/schema/signin.schema.ts` |
| API | `<name>.api.ts` | `src/entities/signin/api/signin.api.ts` |
| API Schema | `<name>.schema.ts` | `src/entities/member/api/api.schema.ts` |
| Style | `style.module.scss` | Component-level styles |
| Index export | `index.ts` | Only create when 3+ files in folder |

## Schema Naming Convention

- **Zod schema variable:** Use `Schema` suffix (not `Zod`)
- **Type:** Use `Schema` suffix with `z.infer`

```typescript
// Good
export const memberListParamsSchema = z.object({ ... });
export type MemberListParams = z.infer<typeof memberListParamsSchema>;

// Bad
export const memberListParamsZod = z.object({ ... });
```

## API Function Naming

API functions follow `<method><Resource>Api` pattern:

```typescript
export const postSigninApi = (data: SigninSchema): Promise<AuthResponseSchema> => { ... }
export const getDocumentApi = (id: string): Promise<DocumentSchema> => { ... }
export const putUserApi = (data: UserSchema): Promise<UserResponseSchema> => { ... }
export const deleteItemApi = (id: string): Promise<OkResponse> => { ... }
```

## JSDoc Style Guide

### Basic Principles

| Item | Rule |
| --- | --- |
| Language | Korean (English when needed) |
| Format | JSDoc (`/** ... */`) |
| Description | Short and clear — focus on *what it does / why it's needed* |
| Line breaks | One blank line between logical units |
| Examples | Use code blocks inside `@example` |

### Comment Block Structure

```typescript
/**
 * @description
 * [One-line summary of what this schema/function defines]
 *
 * - `field1`: [description]
 * - `field2`: [description]
 * - [other conditions / order / validation rules]
 *
 * @example
 * ```ts
 * // Example code (when needed)
 * ```
 */
```

### Recommended Tags

| Tag | Description | Example |
| --- | --- | --- |
| `@description` | Main description (required) | 회원가입 요청 스키마입니다. |
| `@example` | Code example (optional) | Usage, validation examples |
| `@template` | Generic type description | `baseResponseSchema<T>` |
| `@returns` | Return description | Function return value |
| `@param` | Parameter description | API / utility function args |

### Schema Example

```typescript
/**
 * @description
 * 로그인 요청 스키마입니다.
 *
 * - `email`: 필수 문자열
 * - `password`: 필수 문자열
 */
export const signinSchema = z.object({
  email: z.string(),
  password: z.string(),
});

/** @description 로그인 요청 타입 */
export type SigninSchema = z.infer<typeof signinSchema>;
```

### API with Zod Parsing

Use `src/shared/libs/api/zod/zod.util.ts` utilities for API response parsing:

```typescript
import { getParsed } from "src/shared/libs/api/zod/zod.util";
import { memberListResponseSchema } from "./member.schema";

export const getMemberListApi = async (params: MemberListParams): Promise<MemberSchema[]> => {
  const parsed = await getParsed(
    `${SERVER_URL}/organization/member/list?page=${params.page}&size=${params.size}`,
    memberListResponseSchema,
  );
  return parsed.data ?? [];
};
```

### API Function Example

```typescript
/**
 * @description
 * 로그인 API를 호출합니다.
 *
 * @param signin - 로그인 요청 데이터 (`SigninSchema`)
 * @returns 인증 응답 데이터 (`AuthResponseSchema`)
 */
export const postSigninApi = async (signin: SigninSchema): Promise<AuthResponseSchema> => {
  const { data } = await axios.post<AuthResponseSchema>(`${SERVER_URL}/auth/sign-in`, signin);
  return data;
};
```

## State & Data

| Type | Rule |
| --- | --- |
| Global state | TBD |
| Server state | **TanStack Query** recommended |
| Suspense | `suspense: true` recommended |
| Error/Loading | `ErrorBoundary` + `Suspense` combination |

## Server Component vs Client Component

### page.tsx (Server Component) Responsibilities

- URL parameter validation
- Data existence check
- `notFound()` calls
- Error delegation to `error.tsx`
- Layout / Template composition
- Data passing to Client Components

**Do NOT in page.tsx:**
- useEffect
- State management
- Mutations
- Browser API access
- Detailed UI implementation

### Client Component Responsibilities

- UI rendering
- Locale handling
- useEffect / useRef
- Mutations (view count, likes, etc.)
- Markdown, animation, event handlers

Client Components "receive and use" data only; they do not determine data validity.

### notFound / error Handling

| Case | Action |
| --- | --- |
| Invalid URL | `notFound()` in Server Component |
| Data doesn't exist | `notFound()` in Server Component |
| Network / Server error | `throw Error` in Server Component → `error.tsx` handles |

Client Components do NOT call `notFound` or `throw Error` directly.

### React Query Usage

| Case | Approach |
| --- | --- |
| Lists, filtering, pagination | Client Component + React Query |
| Detail pages, SEO-critical pages | Server Component with direct fetch |

### React Query `select` Option

Use the `select` option to transform API response data in queries. This keeps the API layer clean (returning raw responses) while transforming data at the query level.

```typescript
// Good - use select for data transformation
export const useOrganizationMemberListQuery = (page: number, size: number) => {
  return useQuery({
    queryKey: OrganizationQueryKeys.members(page, size),
    queryFn: async () => {
      return await getOrganizationMemberListApi(page, size);
    },
    select: (response) => response.data ?? [],
  });
};

// Usage in component
const { data: members } = useOrganizationMemberListQuery(page, size);
// members is already MemberSchema[] type

// Bad - transform data in hook or component
const { data } = useOrganizationMemberListQuery(page, size);
const members = data?.data ?? []; // Avoid this pattern
```

## Styling

| Item | Rule |
| --- | --- |
| Styling | **SCSS-based** |
| Token source | `@bigtablet/design-system/scss/token` |
| Class naming | **snake_case** (e.g., `auth_main`, `email_button`) |
| Page/Component styles | `style.module.scss` |
| Import pattern | `@use "@bigtablet/design-system/scss/token" as token;` |

### SCSS Import Example

```scss
@use "@bigtablet/design-system/scss/token" as token;

.auth_main {
  @include token.flex_center;
  background-color: token.$color_background;
  padding: token.$spacing_xl;

  @include token.mobile {
    padding: token.$spacing_lg;
  }
}

.password_toggle {
  color: token.$color_text_tertiary;
  transition: color token.$transition_fast;

  &:hover {
    color: token.$color_text_secondary;
  }
}
```

### Available Tokens (from @bigtablet/design-system)

**Colors:**
- `$color_primary`, `$color_primary_hover`
- `$color_background`, `$color_background_secondary`, `$color_background_neutral`, `$color_background_muted`
- `$color_text_primary`, `$color_text_secondary`, `$color_text_tertiary`
- `$color_border`, `$color_border_light`
- `$color_success`, `$color_error`, `$color_warning`, `$color_info`
- `$color_overlay`

**Spacing:**
- `$spacing_xs` (4px) ~ `$spacing_8xl` (48px)

**Typography:**
- `$font_size_xs` ~ `$font_size_4xl`
- `$font_weight_thin` ~ `$font_weight_black`
- Mixins: `text_xs`, `text_sm`, `text_base`, `text_md`, `text_lg`, `text_xl`, `text_2xl`, `text_3xl`
- Mixins: `heading_1`, `heading_2`, `heading_3`, `body_regular`, `body_medium`, `caption`

**Layout Mixins:**
- `flex_center`, `flex_left`, `flex_right`, `flex_between`
- `flex_column`, `flex_column_center`, `flex_column_start`

**Responsive Mixins:**
- `mobile`, `tablet`, `laptop`, `desktop`

**Transitions:**
- `$transition_fast` (0.1s), `$transition_base` (0.2s), `$transition_slow` (0.3s)
- `$transition_emphasized`, `$transition_bounce`, `$transition_fade`, `$transition_slide`, `$transition_scale`, `$transition_state`

**Radius:**
- `$radius_sm` (6px), `$radius_md` (8px), `$radius_lg` (12px), `$radius_xl` (16px), `$radius_full`

**Shadows:**
- `$shadow_sm`, `$shadow_md`, `$shadow_lg`, `$shadow_xl`

**Skeleton Mixins:**
- `skeleton($width, $height, $radius)`, `skeleton_text`, `skeleton_title`, `skeleton_avatar($size)`, `skeleton_rect($width, $height)`

## Design System

### Visual Direction
- Monochrome/neutral palette with minimal accents
- Soft, quiet surfaces with subtle borders
- Emphasis through weight and spacing, not color
- Light/dark mode support with semantic color roles

### Typography (Pretendard)
- **Weights:** 300/400/500/600/700
- **Sizes:** Display (57/45/36), Headline (32/28/24), Title (22/16/14), Body (16/14/12), Label (14/12/11)
- **Line heights:** 1.2 (tight), 1.4 (normal), 1.6 (relaxed)

### Spacing (4px Grid)
- **Scale:** 0, 2, 4, 8, 12, 16, 24, 32, 48, 64
- **Screen padding:** 16 (large: 24)
- **Section gap:** 24
- **Item gap:** 12
- **Card padding:** 16 (large: 24)

### Radii
- **Scale:** 0, 4, 8, 12, 16, 24, full
- **Defaults:** Button (12), Card (12), Input (8), Dialog (16), Chips (full or 8)

### Color Tokens (Light)
```
background: #FFFFFF          backgroundSecondary: #F5F5F5
surface: #FFFFFF             surfaceVariant: #F8F8F8
textPrimary: #1A1A1A         textSecondary: #666666
textTertiary: #999999        textDisabled: #BDBDBD
border: #E0E0E0              borderStrong: #BDBDBD
borderFocused: #1A1A1A       hover: #0A000000
feedbackError: #D32F2F       feedbackSuccess: #388E3C
feedbackWarning: #F57C00     feedbackInfo: #1976D2
```

### Color Tokens (Dark)
```
background: #121212          backgroundSecondary: #1E1E1E
surface: #1E1E1E             surfaceVariant: #2C2C2C
textPrimary: #E0E0E0         textSecondary: #A0A0A0
textTertiary: #757575        textDisabled: #4A4A4A
border: #3D3D3D              borderStrong: #525252
borderFocused: #E0E0E0       hover: #14FFFFFF
feedbackError: #EF5350       feedbackSuccess: #66BB6A
feedbackWarning: #FFA726     feedbackInfo: #42A5F5
```

## Component Guidelines

### Buttons
- **Variants:** primary (filled), secondary (outlined), tertiary (text)
- **Sizes:** small/medium/large with proportional padding
- Loading state: 20px spinner

### Text Field
- Filled style with surfaceVariant background
- Label above input; focus border 2px borderFocused
- Error shows red text and border

### Cards
- 1px border, 12 radius, optional elevation
- Default padding 16 (large 24)
- Use for list items and info panels

### Chips
- **Filter:** pill shape, label + value, optional delete
- **Selection:** 8 radius, filled when selected
- **Action:** 8 radius, surfaceVariant background

### Tables (Admin)
- Wrap in card; row separators use border color
- Row padding 12-16; status column uses pill badge pattern

### Dashboard KPIs
- Card with title (titleMedium) and value (titleLarge/headlineSmall)
- Use tabular figures for numbers

## Responsive Design

### Breakpoints
- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

### SCSS Mixins
```scss
@mixin mobile { @media (max-width: 639px) { @content; } }
@mixin tablet { @media (min-width: 640px) and (max-width: 1023px) { @content; } }
@mixin desktop { @media (min-width: 1024px) { @content; } }
@mixin tablet-up { @media (min-width: 640px) { @content; } }
@mixin desktop-up { @media (min-width: 1024px) { @content; } }
```

### Responsive Patterns
- **Mobile-first:** Base styles for mobile, enhance with breakpoint mixins
- **Screen padding:** 16px (mobile) → 24px (tablet) → 32px (desktop)
- **Grid columns:** 1 (mobile) → 2 (tablet) → 3-4 (desktop)
- **Navigation:** Bottom nav (mobile) → Sidebar (tablet/desktop)
- **Tables:** Card list (mobile) → Full table (tablet-up)
- **Typography scale:** Reduce display/headline sizes on mobile

### Component Adaptations
- **Cards:** Full width on mobile, grid layout on larger screens
- **Dialogs:** Full screen (mobile) → Centered modal (tablet-up)
- **Forms:** Single column (mobile) → Multi-column (desktop)
- **Sidebar:** Hidden with hamburger (mobile) → Visible (desktop)
- **KPI tiles:** Stack vertically (mobile) → Grid (tablet-up)

## Layout Patterns

- **App bar:** Centered title, minimal actions
- **Lists:** Vertical cards with 12px separator, 16px horizontal padding
- **Empty states:** Centered icon (48px), short message, secondary action
- **Loading:** Centered spinner; inline small spinners in buttons/cards
- **Status badge:** Pill with icon + text using feedback colors

## Interaction States

- **Focus ring:** borderFocused, 2px
- **Hover/pressed:** Use semantic hover/pressed tokens
- Maintain accessibility with visible focus indicators

## Localization

- **Default:** Korean
- **Supported:** English
- Leave room for longer strings; avoid fixed-width labels

## Authentication Flow

1. Tokens stored in cookies via `js-cookie`
2. Request interceptor adds Bearer token
3. Response interceptor handles 401 with token refresh queue
4. Automatic logout on permanent 401

## Environment Variables

| Item | Rule |
| --- | --- |
| Server URL | In `.env` file |
| Next.js | `NEXT_PUBLIC_SERVER_URL` |
| Vite-based | `VITE_SERVER_URL` |

## TypeScript

- Strict mode enabled
- Path alias: `src/*` maps to `./src/*`
- Target: ES2017

## Formatting Rules (Biome)

- Indentation: Tabs (4 spaces width)
- Line width: 100 characters
- Imports: Auto-organized


## Claude Workflow (AI Assistant Guide)

사용자가 기능 개발이나 수정을 요청하면 아래 워크플로우를 따릅니다.

### Branch Labels

| Label | 용도 | 예시 |
| --- | --- | --- |
| `feat` | 새로운 기능 추가 | `feat/member-list` |
| `fix` | 버그 수정 | `fix/login-error` |
| `refactor` | 코드 리팩토링 | `refactor/api-structure` |
| `style` | 스타일/UI 변경 | `style/dashboard-layout` |
| `docs` | 문서 수정 | `docs/readme-update` |
| `chore` | 설정, 빌드 등 기타 작업 | `chore/biome-config` |

### 1. Issue 생성

기능 단위로 Issue를 생성합니다. Issue 본문은 한글로 작성합니다.

```bash
gh issue create --title "[feat] 기능 제목" --body "$(cat <<'EOF'
## 개요
기능에 대한 간단한 설명

## 작업 내용
- [ ] 작업1
- [ ] 작업2
- [ ] 작업3

## 참고 사항
- 관련 링크나 추가 정보
EOF
)"
```

**Issue Title 형식:**
- `[feat] 새로운 기능 제목`
- `[fix] 버그 수정 제목`
- `[refactor] 리팩토링 제목`

### 2. Branch 생성

Issue 번호를 포함하여 브랜치를 생성합니다.

```bash
# Issue 번호가 있는 경우
git checkout -b feat/123-member-list

# Issue 번호가 없는 경우
git checkout -b feat/member-list
```

### 3. 구현

- CSS Modules 컨벤션 준수 (`style.module.scss`)
- 디자인 토큰 사용 (`src/shared/styles/token`)
- Feature-Sliced Design 아키텍처 준수

### 4. Commit

```bash
git add -A && git commit -m "$(cat <<'EOF'
feat: commit message
)"
```

**Commit Message 형식:**
- `feat: 새로운 기능 추가`
- `fix: 버그 수정`
- `refactor: 코드 리팩토링`
- `style: 스타일 변경`
- `docs: 문서 수정`
- `chore: 기타 작업`

### 5. PR 생성

- **Base branch**: `develop` (main 아님!)
- **PR title**: 브랜치 이름과 동일하게
- **PR body**: 한글로 작성

```bash
gh pr create --base develop --title "feat/123-member-list" --body "$(cat <<'EOF'
## 작업 요약
간단한 작업 요약 (1-2문장)

## 관련 Issue
- closes #123

## 작업한 내용
- [x] 작업1
- [x] 작업2
- [x] 작업3

## 스크린샷 (UI 변경 시)
필요한 경우 스크린샷 첨부

## 테스트
- [ ] 로컬에서 테스트 완료
- [ ] 빌드 성공 확인

## 전달할 추가 이슈
- 추가로 전달할 내용이 있으면 작성
EOF
)"
```

### 전체 워크플로우 예시

```bash
# 1. Issue 생성
gh issue create --title "feat/add issue" --body "..."
# Issue #123 생성됨

# 2. 브랜치 생성
git checkout -b feat/123-member-list

# 3. 구현 작업...

# 4. 커밋
git add -A && git commit -m "feat: develop functionalities"

# 5. PR 생성
gh pr create --base develop --title "feat/member-list" --body "..."
```

### Important Notes

- PR은 항상 `develop` 브랜치를 타겟으로 생성
- Issue와 PR 본문은 한글로 작성
- 커밋메시지는 영어를 사용하고 가급적 소문자를 지향
- 팀 리뷰 후 머지
