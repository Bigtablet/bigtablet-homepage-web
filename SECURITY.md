# 보안 정책 / Security Policy

> 이 문서는 Bigtablet, Inc.의 저장소에서 보안 취약점을 보고하고 처리하는 절차를 안내합니다.  
> This document describes the procedures for reporting and handling security vulnerabilities in Bigtablet, Inc.'s repositories.

---

## 지원되는 버전 / Supported Versions

지원되는 보안 업데이트는 **최신 (latest) 릴리즈 버전**에 한해 제공됩니다.  
이전 릴리즈(이전 메이저/마이너 버전)는 더 이상 보안 업데이트가 적용되지 않으니, 가능한 한 최신 버전을 사용해 주시기 바랍니다.

The project provides security updates **only for the latest released version**. Previous releases (older major/minor versions) will not receive security updates — please upgrade to the latest release.

#### 최신 릴리즈 버전 / Latest release version
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/Bigtablet/bigtablet-homepage-web)](https://github.com/Bigtablet/bigtablet-homepage-web/releases)

---

## 취약점 신고 / Reporting a Vulnerability

보안 취약점은 아래 이메일로 **양식 형식**으로 신고해 주세요:  
**security@bigtablet.com**

Please report security vulnerabilities via email using the form below:  
**security@bigtablet.com**

### 신고 양식 (한국어)
- 신고자 본명 :  
- 연락처 (이메일 / 전화) :  
- 저장소 이름 (Repository) :  
- GitHub ID :  
- 취약점 요약 (한 줄) :  
- 취약점 상세 설명 (재현 단계 / 영향 범위 / PoC 및 로그 등 포함 — 가능한 한 구체적으로) :  
- 첨부 파일 (스크린샷 / 로그 / 패치 제안 등, 있으면 목록으로) :  
- 추가 코멘트 :

### Report template (English)
- Reporter full name:  
- Contact (email / phone):  
- Repository name:  
- GitHub ID:  
- Vulnerability summary (one line):  
- Detailed description (reproduction steps / impact / PoC / logs — please be as specific as possible):  
- Attachments (screenshots / logs / proposed patch, if any):  
- Additional comments:

접수된 신고에 대해서는 **48시간 이내에 회신**드리겠습니다.

We will acknowledge receipt within **48 hours**.

---

## 처리 절차 / Triage & Response Process
<div>
1. 신고 접수 및 확인 — 접수 확인 메일 발송.  <br>
2. 48시간 이내 초기 회신(접수 확인 및 담당자 연락).  <br>
3. 취약점 검증 및 영향도 평가.  <br>
4. 수정 계획 수립 및 패치 개발.  <br>
5. 패치 배포 및 공지(필요 시 커뮤니티/사용자 공지). <br>
</div>
<br>
<div>
1. Receive and confirm report — send receipt confirmation.  <br>
2. Initial response within 48 hours (acknowledgement and assigned contact).  <br>
3. Verify the vulnerability and assess impact.  <br>
4. Plan and develop a fix.  <br>
5. Release patch and notify affected users/communities as appropriate.  <br>
</div>

---

## 비밀 유지 / Confidentiality

신고자는 요청 시 **익명 처리**가 가능합니다. 제공한 정보는 취약점 대응을 위해서만 사용되며, 신고자의 사전 동의 없이 외부에 공개되지 않습니다. (법적 의무가 있는 경우 제외)

Reporters may request anonymity. Information provided will be used solely for remediation and will not be disclosed without prior consent (except as required by law).

---

## 공개 및 조율된 공개 / Disclosure & Coordinated Release

취약점이 확인되고 패치가 완료되기 전까지 공개를 자제해주시기 바랍니다. 취약점의 공표 시점 및 내용은 Bigtablet, Inc. 보안팀과 조율됩니다. 만약 취약점 패치 전 독단적 공개로 인해 Bigtablet, Inc.에 손해를 끼치는 경우 법적 대응을 진행할 수 있습니다.

Please refrain from publicly disclosing the vulnerability until a patch has been completed. The timing and content of any public disclosure must be coordinated with the Bigtablet, Inc. Security Team. If you unilaterally disclose the vulnerability before a patch is available and that disclosure causes damage to Bigtablet, Inc., we may pursue legal action.

---

감사합니다.  
Bigtablet, Inc. 보안팀 / Bigtablet, Inc. Security Team
