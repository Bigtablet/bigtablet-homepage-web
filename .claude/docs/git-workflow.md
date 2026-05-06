# Git Workflow Guide

Git 컨벤션, 브랜치 전략, PR 워크플로우 가이드입니다.

## Commit Message Format

```
label: message

Co-Authored-By: Claude <noreply@anthropic.com>
```

- 라벨을 앞에, 커밋 내용을 뒤에 작성
- 모두 소문자 사용, 필요시 camelCase 허용
- **메시지는 반드시 영문으로 작성**
- 어디서 무엇을 어떻게 했는지 알 수 있도록 작성
  - 예) 로그인/회원가입 같은 인증 도메인 개발 → `feat: add auth service`

## Co-Authored-By 규칙

- Claude와 함께 작업한 모든 커밋에는 `Co-Authored-By: Claude <noreply@anthropic.com>` 트레일러를 추가합니다
- 커밋 메시지 본문과 트레일러 사이에는 빈 줄을 하나 추가합니다

## Commit Labels

| Label | Description |
| --- | --- |
| `feat` | 추가 기능 개발 / 새로운 코드 추가 |
| `fix` | 기능/코드 수정 |
| `bug` | 버그/에러 수정 |
| `merge` | 브랜치 병합 |
| `deploy` | 프로젝트 배포 / 관련 문서 작업 |
| `docs` | 문서 추가/수정 |
| `delete` | 코드/파일/문서 삭제 |
| `note` | 주석 추가/제거 |
| `style` | 코드 스타일/구조 수정 |
| `config` | 기초 설정 파일 / 의존성 / 라이브러리 관련 버전이나 파일 수정 |
| `etc` | 기타 위에 해당하지 않는 경우 |
| `tada` | 프로젝트 생성 |

## Branch Naming

```
label/domain
```

- 라벨을 앞에, 작업 도메인을 뒤에 작성
- 예) 인증 도메인 코드 수정 → `fix/auth`, `feat/member-table`

### Branch Labels

브랜치에 사용 가능한 라벨은 아래와 같습니다. 이 목록에 없는 라벨(예: `refactor`)은 사용하지 않습니다.

| Label | 용도 | 예시 |
| --- | --- | --- |
| `feat` | 새로운 기능 추가 | `feat/member-list` |
| `fix` | 기능/코드 수정 | `fix/login-error` |
| `bug` | 버그/에러 수정 | `bug/null-pointer` |
| `style` | 코드 스타일/구조 변경 | `style/fsd-architecture-cleanup` |
| `docs` | 문서 수정 | `docs/readme-update` |
| `config` | 설정 파일 수정 | `config/biome-config` |
| `delete` | 코드/파일/문서 삭제 | `delete/deprecated-api` |
| `note` | 주석 추가/제거 | `note/add-jsdoc` |
| `etc` | 기타 | `etc/minor-cleanup` |

## Branch Merge Rules

- 병합 시 반드시 코드 리뷰어가 approve 후 브랜치 생성자가 병합
- Approve가 내려지기 전에 해당 Pull Request는 병합하지 않음
- 병합 커밋 메시지: `merge: branch-name`
  - 예) fix/auth 브랜치 병합 → `merge: fix/auth`
- Develop → Main 배포: `merge: release [version]`

## Pull Request

- 반드시 이슈를 생성하고 이와 연결한 뒤에 PR 생성
- **PR 제목은 해당 PR이 생성된 브랜치와 동일**
- PR 본문은 한글로 작성

## Review

- Pull Request를 열었다면 반드시 팀원에게 Review를 요청
- 요청을 받은 팀원은 Review 후 Approve 혹은 Comment 등으로 코드 리뷰를 성실히 수행
- Approve가 내려지기 전에 해당 Pull Request는 병합하지 않음

## Claude Workflow

사용자가 기능 개발이나 수정을 요청하면 아래 워크플로우를 따릅니다.

### 1. Issue 생성

기능 단위로 Issue를 생성합니다. Issue 본문은 한글로 작성합니다.

```bash
gh issue create --title "브랜치명" --body "$(cat <<'EOF'
## 제목
제목제목제목

## 작업한 내용
- [ ] 작업1
- [ ] 작업2

## 전달할 추가 이슈
- 이슈1 (없으면 "없음")
EOF
)"
```

### 2. Branch 생성

```bash
git checkout -b feat/domain-name
```

### 3. 구현

- CSS Modules 컨벤션 준수 (`style.module.scss`)
- 디자인 토큰 사용 (`@bigtablet/design-system/scss/token`)
- Feature-Sliced Design 아키텍처 준수

### 4. Commit

커밋 메시지는 **반드시 영문**으로 작성합니다.

```bash
git add -A && git commit -m "$(cat <<'EOF'
feat: add feature description

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### 5. PR 생성

- **Base branch**: `develop` (main 아님!)
- **PR title**: 브랜치 이름과 동일
- **PR body**: 한글로 작성

```bash
gh pr create --base develop --title "feat/domain-name" --body "$(cat <<'EOF'
## 제목
feat/domain-name

## 작업한 내용
- [x] 작업1
- [x] 작업2
- [x] 작업3

## 전달할 추가 이슈
- 이슈1 (없으면 "없음")
EOF
)"
```

## Issue / PR 템플릿 (필수)

> **⚠️ Issue와 PR 본문은 반드시 아래 템플릿을 사용해야 합니다. 자의적으로 섹션을 변경하거나 추가하지 마세요.**

```
## 제목
제목제목제목

## 작업한 내용
- [ ] 작업1
- [ ] 작업2

## 전달할 추가 이슈
- 이슈1 (없으면 "없음")
```

- **Issue**: `작업한 내용`은 `- [ ]` (미완료 체크박스)
- **PR**: `작업한 내용`은 `- [x]` (완료 체크박스)
- **제목 섹션**: Issue는 작업 설명, PR은 브랜치명
- `## 개요`, `## 변경사항`, `## 관련 파일` 등 **다른 형식 사용 금지**

## Release 양식 (⚠️ 필수 — 자의적 변경 금지)

> **Release 본문은 반드시 아래 양식 그대로 사용. 섹션 추가/삭제/이름 변경 모두 금지.**

- **태그 형식**: `x.x.x` (v 접두사 없음, 예: `1.8.6`)
- **제목**: 태그와 동일 (예: `1.8.6`)
- **타겟 브랜치**: `main` (develop → main 머지 후 main 기준 생성)

### 본문 템플릿

```markdown
## Official Website Web of Bigtablet, Inc.

#### Key Updates
- <conventional commit-style line, 영문 소문자>
- <conventional commit-style line, 영문 소문자>
```

### 규칙

- 첫 줄 `## Official Website Web of Bigtablet, Inc.` — 텍스트 그대로 (변경 금지)
- 두 번째 `#### Key Updates` — 텍스트 그대로 (변경 금지)
- bullet 한 줄 = 하나의 변경 사항. **영문 소문자 + conventional prefix** (`fix:`, `feat:`, `chore:`, `delete:`, `style:`, `refactor:` 등)
- ❌ `## Features` / `## Bug Fixes` / `## Performance` / `## Security` 등 **카테고리 섹션 절대 추가 금지**
- ❌ 한글 본문 금지 — 한글 commit 메시지였어도 release 본문은 영문 소문자로 변환
- ❌ bullet을 빈 줄로 그룹화 금지 — 모든 bullet 연속

### 생성 예시

```bash
gh release create 1.8.6 --target main --title "1.8.6" --notes "$(cat <<'EOF'
## Official Website Web of Bigtablet, Inc.

#### Key Updates
- feat: add new feature description
- fix: bug description
- chore: bump dependency from x to y
EOF
)"
```

## Important Notes

- PR은 항상 `develop` 브랜치를 타겟으로 생성
- Issue와 PR 본문은 한글로 작성
- **커밋 메시지는 반드시 영문 소문자 사용**
- Approve 없이 병합 금지
