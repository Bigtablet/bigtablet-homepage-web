# Architecture Guide

FSD(Feature-Sliced Design) 기반 프로젝트 아키텍처 가이드입니다.

## Layer 구조

```
src/
├── app/          # 페이지, 레이아웃 (Next.js App Router)
├── shared/       # 공통 유틸, UI, 라이브러리
├── entities/     # 도메인 데이터 (CRUD + 스키마)
├── features/     # 사용자 액션 (폼, mutation, 검색)
├── widgets/      # 페이지 섹션 UI (도메인 UI 조합)
├── processes/    # 복합 cross-feature 플로우 (필요시)
└── i18n/         # 다국어 설정
```

### Layer 의존성 규칙

상위 레이어는 하위 레이어만 import할 수 있습니다.

```
app → widgets → features → entities → shared
```

| 규칙 | 설명 |
| --- | --- |
| `shared`는 다른 레이어를 import하지 않음 | 완전히 독립적인 기반 레이어 |
| `entities`는 `shared`만 import | 도메인 간 직접 참조 금지 |
| `features`는 `entities` + `shared` import | 사용자 액션 레이어 |
| `widgets`는 `features` + `entities` + `shared` import | UI 조합 레이어 |
| `app`은 모든 레이어 import 가능 | 최상위 조합 레이어 |

## app/ — 페이지 레이어

Next.js App Router 기반 페이지와 레이아웃을 담당합니다.

```
app/
├── layout.tsx              # 루트 레이아웃
├── route.ts                # 루트 리다이렉트
└── (i18n)/                 # 다국어 라우트 그룹
    ├── layout.tsx
    ├── main/page.tsx
    ├── about/page.tsx
    ├── about/[id]/page.tsx
    ├── blog/page.tsx
    ├── blog/[idx]/page.tsx
    ├── news/page.tsx
    ├── recruit/page.tsx
    ├── recruit/[idx]/page.tsx
    ├── recruit/[idx]/apply/page.tsx
    └── policies/
```

| 파일 | 역할 |
| --- | --- |
| `page.tsx` | Server Component, URL 파라미터 검증, 데이터 존재 확인 |
| `layout.tsx` | 공통 레이아웃, Provider 설정 |
| `error.tsx` | 에러 바운더리 |
| `page.module.scss` | 페이지 전용 스타일 |

## shared/ — 공통 기반 레이어

모든 레이어에서 사용하는 공통 코드입니다.

```
shared/
├── constants/          # 앱 전역 상수
├── hooks/              # 공통 훅
│   ├── next/           # Next.js 라우팅 훅 (BigtabletRouter, BigtabletLink 등)
│   ├── use-scroll-reveal.ts   # GSAP ScrollTrigger 애니메이션 훅
│   └── use-deferred-loading.ts # 스켈레톤 로딩 임계값 훅
├── libs/               # 라이브러리 래퍼 및 유틸리티
│   ├── api/
│   │   ├── axios/      # Axios 인스턴스, 인터셉터
│   │   │   └── error/  # 에러 메시지 유틸
│   │   ├── cookie/     # 토큰 쿠키 관리
│   │   ├── gcp/        # GCP 업로드 API + 훅
│   │   ├── query/      # MutationCache (에러 핸들링)
│   │   ├── toast/      # ToastBridge (전역 토스트)
│   │   └── zod/        # Zod 파싱 유틸 (getParsed 등)
│   ├── gsap/           # GSAP 플러그인 등록
│   ├── i18n/           # next-intl 설정
│   ├── modal/          # 전역 모달 시스템
│   └── storage/        # localStorage 래퍼
├── schema/             # 공통 스키마 (에러, 응답 등)
├── types/              # 전역 타입 선언
└── ui/                 # 공통 UI 컴포넌트
    ├── custom-suspense/
    ├── skeleton/        # 스켈레톤 로딩 컴포넌트
    └── error-fallback/
```

## entities/ — 도메인 레이어

서버 데이터 구조와 순수 도메인 로직을 정의합니다.

```
entities/<domain>/
├── api/            # API 호출 함수 + API 전용 스키마
├── schema/         # 도메인 스키마 (Zod) + 타입
├── constants/      # 도메인 상수
└── util/           # 순수 도메인 로직 (검증, 변환 등)
```

**주의:** entities에는 `model/` 폴더를 사용하지 않습니다. 타입은 `schema/`, 로직은 `util/`에 배치합니다.

### 현재 도메인 목록

| Domain | 설명 | 하위 구조 |
| --- | --- | --- |
| `about` | 회사 소개 (팀, 히스토리) | `util/`, `history/schema/`, `history/util/` |
| `blog` | 블로그 | `api/`, `schema/` |
| `news` | 뉴스 | `api/`, `schema/` |
| `recruit` | 채용 | `api/`, `schema/`, `constants/`, `util/` |
| `talent` | 인재 등록 | `api/`, `schema/` |

### Entity 예시

```
entities/recruit/
├── api/
│   └── recruit.api.ts        # getRecruitListApi, postRecruitApplyApi 등
├── schema/
│   ├── recruit.schema.ts     # Zod 스키마 + 추론 타입
│   ├── recruit.enum.ts       # 도메인 열거형
│   └── recruit.domain.ts     # 도메인 타입
├── constants/
│   └── recruit.constants.ts  # 라벨 매핑, 옵션 배열
└── util/
    ├── adapter/              # 데이터 어댑터
    ├── date/                 # 날짜 관련 유틸
    ├── mapper/               # 데이터 매핑
    └── merge/                # 데이터 병합
```

## features/ — 액션 레이어

사용자 인터랙션 단위의 기능을 구현합니다.

```
features/<feature>/
├── model/          # 비즈니스 로직 훅 (use-*.ts)
├── query/          # useQuery 훅 (읽기)
├── mutation/       # useMutation 훅 (쓰기)
└── ui/             # 기능 전용 UI 컴포넌트
```

### Query/Mutation 분리 규칙

| 타입 | 위치 | 파일명 예시 |
| --- | --- | --- |
| `useQuery`, `useSuspenseQuery` | `query/` | `member.query.ts` |
| `useMutation` | `mutation/` | `signin.mutation.ts` |
| 비즈니스 로직 훅 | `model/` | `use-signin.ts` |
| Query/Mutation 키 | 각 폴더의 `keys.ts` | `query/keys.ts` |

### model/ 구조 규칙

- 훅은 `model/` 폴더에 **플랫하게** 배치 (`model/hooks/` 하위 폴더 금지)
- Zustand store도 `model/`에 배치 (`use-*.store.ts`)
- 유틸 함수도 `model/`에 배치 가능 (`*.util.ts`)

```
features/recruit/apply/form/model/
├── apply.schema.ts               # 지원서 Zod 스키마
├── apply.util.ts                 # 포맷, 매핑 유틸
└── use-apply-submit.ts           # 제출 로직 훅
```

### 현재 Feature 목록

| Feature | 설명 | 하위 구조 |
| --- | --- | --- |
| `recruit` | 채용 (지원서) | `apply/form/`, `query/`, `mutation/` |
| `blog` | 블로그 | `query/`, `mutation/` |
| `news` | 뉴스 | `query/` |
| `talent` | 인재 등록 | `form/`, `mutation/` |
| `upload` | 파일 업로드 | `model/`, `mutation/` |

## widgets/ — 위젯 레이어

페이지 섹션 단위의 도메인 UI를 구현합니다.

```
widgets/<widget>/
├── model/              # 위젯 비즈니스 로직 훅
├── ui/                 # UI 컴포넌트
│   ├── index.tsx       # 위젯 진입점
│   └── style.module.scss
└── (style.module.scss) # 위젯 루트 스타일 (ui/ 내에 위치 가능)
```

### model/ 구조 규칙 (Feature와 동일)

- 훅, store, util 모두 `model/`에 **플랫하게** 배치
- 하위 폴더(`model/store/`, `model/util/` 등) 금지
- 접미사로 파일 성격을 구분: `use-*.ts`, `use-*.store.ts`, `*.util.ts`

```
widgets/main/solution/model/
├── select.util.ts                 # 랜덤 선택 유틸
└── video-sources.ts               # 솔루션 영상 소스
```

### 현재 Widget 목록

| Widget | 설명 |
| --- | --- |
| `main/banner` | 메인 배너 |
| `main/problem` | 문제 제시 섹션 |
| `main/solution` | 솔루션 섹션 |
| `main/collaborations` | 협업사 섹션 |
| `about/introduce` | 회사 소개 |
| `about/team` | 팀 소개 |
| `about/history` | 연혁 |
| `about/member` | 멤버 카드 |
| `recruit/main` | 채용 메인 (헤더, 목록) |
| `blog/card`, `blog/list` | 블로그 |
| `news/card`, `news/list` | 뉴스 |
| `layout/provider` | 전역 Provider |

## 파일 분할 기준

| 조건 | 액션 |
| --- | --- |
| 파일이 **100줄** 초과 | 분할 검토 |
| 파일의 **책임이 2개 이상** | 분할 |
| 관련 기능이 100줄 미만 | 한 파일에 유지 |

## 새 도메인 추가 가이드

### 1. Entity 생성

```bash
# 필요한 폴더만 생성 (전부 필수는 아님)
entities/<domain>/
├── api/<domain>.api.ts
├── schema/<domain>.schema.ts
├── constants/<domain>.constants.ts    # 필요시
└── util/<domain>.util.ts              # 필요시
```

### 2. Feature 생성

```bash
features/<feature>/
├── model/use-<feature>.ts             # 통합 훅 (필수)
├── model/use-<feature>-form.ts        # 폼이 있을 경우
├── model/use-<feature>-submit.ts      # 제출 로직이 복잡할 경우
├── query/<feature>.query.ts           # 읽기 API가 있을 경우
├── query/keys.ts
├── mutation/<feature>.mutation.ts     # 쓰기 API가 있을 경우
├── mutation/keys.ts
└── ui/                                # 기능 전용 UI가 있을 경우
```

### 3. Widget 생성

```bash
widgets/<widget>/
├── model/use-<widget>.ts              # 비즈니스 로직 훅
└── ui/
    ├── index.tsx                      # 위젯 진입점
    └── style.module.scss
```

## 핵심 인프라

### 에러 처리 흐름

```
API 에러 발생
  → Axios Response Interceptor (401 토큰 갱신)
  → MutationCache onError (shared/libs/api/query/mutation-cache.ts)
  → ToastBridge (shared/libs/api/toast/toast-bridge.ts)
  → 토스트 UI 표시
```

- Mutation 에러는 `MutationCache`에서 중앙 처리
- 개별 mutation에서 `meta.errorMessage`로 커스텀 메시지 설정
- `meta.showErrorToast: false`로 특정 mutation의 토스트 비활성화

### 인증 흐름

```
로그인 → 토큰 쿠키 저장 (js-cookie)
  → Request Interceptor: Bearer 토큰 자동 첨부
  → 401 발생 시: Response Interceptor → 토큰 갱신 큐
  → 갱신 실패 시: 자동 로그아웃
```

### 모달 시스템

```
shared/libs/modal/
├── modal.ts                 # 모달 등록/해제 API
├── use-modal-store.ts       # Zustand 기반 모달 상태
├── use-modal.ts             # 모달 사용 훅
├── modal-renderer.tsx       # 전역 모달 렌더러
└── modal-store.schema.ts    # 모달 타입 정의
```
