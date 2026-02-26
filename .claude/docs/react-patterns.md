# React Patterns Guide

React Query, Server/Client 컴포넌트 패턴 가이드입니다.

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

## React Query Usage

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

### useSuspenseQuery vs useQuery

| Hook | Suspense 지원 | 용도 |
| --- | --- | --- |
| `useSuspenseQuery` | ✅ | 데이터 필수, Suspense boundary와 함께 사용 |
| `useQuery` | ❌ | 조건부 로딩, isLoading 상태 직접 처리 |

```typescript
// useSuspenseQuery - Suspense와 함께 사용
const MemberListContent = () => {
  const { data: members } = useMemberListQuery(); // useSuspenseQuery 사용
  // data는 항상 존재 (Suspense가 로딩 처리)
  return <MemberTable members={members} />;
};

// 부모에서 Suspense로 감싸기
<CustomSuspense fallback={<MemberListSkeleton />}>
  <MemberListContent />
</CustomSuspense>

// useQuery - isLoading 직접 처리
const ProfileButton = () => {
  const { data: user, isLoading } = useUserQuery();

  if (isLoading || !user) return <ProfileSkeleton />;
  return <Profile user={user} />;
};
```

## Skeleton UI Patterns

### Static JSX Hoisting

스켈레톤 엘리먼트는 모듈 레벨에 호이스팅하여 재생성 방지:

```typescript
// Good - hoisted static skeleton
const profileButtonSkeleton = <div className={styles.skeleton_profile} />;

const MainComponent = () => {
  const { isLoading } = useUserQuery();
  return isLoading ? profileButtonSkeleton : <ProfileButton />;
};

// Bad - recreated every render
const MainComponent = () => {
  const { isLoading } = useUserQuery();
  return isLoading ? <div className={styles.skeleton_profile} /> : <ProfileButton />;
};
```

### CustomSuspense 사용

```typescript
import CustomSuspense from "src/shared/ui/custom-suspense";

<CustomSuspense fallback={<TableSkeleton />}>
  <DataTable />
</CustomSuspense>
```

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

## Best Practices Reference

더 자세한 React/Next.js 최적화 패턴은 `.agents/skills/vercel-react-best-practices/` 참조:

- `async-suspense-boundaries` - Suspense 경계 전략
- `rendering-hoist-jsx` - Static JSX 호이스팅
- `rerender-memo` - 메모이제이션 패턴
- `rendering-usetransition-loading` - useTransition 로딩 상태
