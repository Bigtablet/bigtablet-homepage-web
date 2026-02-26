# Code Style Guide

코드 스타일, 네이밍 컨벤션, JSDoc 가이드입니다.

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

## Control Flow

- **switch vs if-else**: 3개 이상의 조건 분기는 `switch`문 사용
- **Early return**: 가드 절(guard clause) 패턴 권장

```typescript
// Good - switch for 3+ conditions
const getRoleLabel = (role: UserRole): string => {
  switch (role) {
    case "OWNER":
      return "소유자";
    case "ADMIN":
      return "관리자";
    case "MASTER":
      return "마스터";
    default:
      return "팀원";
  }
};

// Bad - long if-else chain
const getRoleLabel = (role: UserRole): string => {
  if (role === "OWNER") return "소유자";
  else if (role === "ADMIN") return "관리자";
  else if (role === "MASTER") return "마스터";
  else return "팀";
};

// Good - early return
const handleSubmit = () => {
  if (!isValid) return;
  if (!user) return;
  // main logic
};
```

## Code Deduplication

- **중복 코드 금지**: 동일한 로직이 2곳 이상에서 반복되면 유틸 함수나 커스텀 훅으로 추출
- **Single Source of Truth**: 상수, 라벨 매핑 등은 한 곳에서만 정의
  - Role/Type 라벨: `src/entities/member/util/member.util.ts`
  - 검증 패턴: `src/entities/signin/model/auth.model.ts`

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
    `organization/member/list?page=${params.page}&size=${params.size}`,
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

## TypeScript

- Strict mode enabled
- Path alias: `src/*` maps to `./src/*`
- Target: ES2017

## Formatting Rules (Biome)

- Indentation: Tabs (4 spaces width)
- Line width: 100 characters
- Imports: Auto-organized
