# AGENTS.md

AI 에이전트를 위한 프로젝트 가이드라인입니다.

## Quick Start

프로젝트 작업 시 아래 문서들을 참조하세요:

### Core Documentation

| Document | Description |
| --- | --- |
| [CLAUDE.md](./CLAUDE.md) | 프로젝트 개요, 아키텍처, 명령어 |
| [.claude/docs/code-style.md](.claude/docs/code-style.md) | 코드 스타일, 네이밍 컨벤션 |
| [.claude/docs/design-system.md](.claude/docs/design-system.md) | SCSS 토큰, 컴포넌트 가이드 |
| [.claude/docs/react-patterns.md](.claude/docs/react-patterns.md) | React Query, Server/Client 패턴 |
| [.claude/docs/git-workflow.md](.claude/docs/git-workflow.md) | Git 컨벤션, PR 워크플로우 |

### Skills (Best Practices)

| Skill | Description |
| --- | --- |
| [vercel-react-best-practices](.agents/skills/vercel-react-best-practices/SKILL.md) | React 성능 최적화, Suspense, 렌더링 패턴 |
| [web-design-guidelines](.agents/skills/web-design-guidelines/SKILL.md) | 웹 디자인 가이드라인 |

## Key Principles

1. **Feature-Sliced Design**: `entities/` → `features/` → `widgets/` 계층 구조 준수
2. **TanStack Query**: 서버 상태는 React Query로 관리, `select`로 데이터 변환
3. **SCSS Tokens**: `@bigtablet/design-system/scss/token` 사용
4. **Git Flow**: `develop` 브랜치 타겟, Co-Authored-By 트레일러 필수
