// src/utils/job/label.ts
const normalize = (v?: string) => (v ?? "").trim().toUpperCase();

export const statusLabel = (s?: string) => {
    switch (normalize(s)) {
        case "DOCUMENT":  return "서류";
        case "INTERVIEW": return "인터뷰";
        case "PASSED":
        case "ACCEPTED":  return "합격";
        case "REJECTED":  return "불합격";
        default:          return (s ?? "-");
    }
};

export const statusClass = (s?: string) => {
    switch (normalize(s)) {
        case "DOCUMENT":  return "document";
        case "INTERVIEW": return "interview";
        case "PASSED":
        case "ACCEPTED":  return "passed";
        case "REJECTED":  return "rejected";
        default:          return "document";
    }
};

// --- 학력 ---
export const educationLabel = (e?: string) => {
    switch (normalize(e)) {
        case "GED":            return "검정고시";
        case "HIGH_SCHOOL":    return "고졸";
        case "ASSOCIATE":      return "전문학사";
        case "BACHELOR":       return "대졸";
        case "NO_REQUIREMENT": return "학력무관";
        default:               return e ?? "-";
    }
};

// --- 병역 ---
export const militaryLabel = (m?: string) => {
    switch (normalize(m)) {
        case "COMPLETED":      return "군필";
        case "NOT_COMPLETED":  return "미필";
        case "NOT_APPLICABLE": return "해당없음";
        case "EXEMPTED":       return "면제";
        default:               return m ?? "-";
    }
};

// --- 근무 형태 ---
export const recruitTypeLabel = (t?: string) => {
    switch (normalize(t)) {
        case "FULL_TIME": return "정규직";
        case "CONTRACT":  return "계약직";
        case "INTERN":    return "인턴";
        default:          return t ?? "-";
    }
};

// --- 근무지 ---
export const locationLabel = (l?: string) => {
    switch (normalize(l)) {
        case "SEOUL": return "서울";
        case "DAEGU": return "대구";
        default:      return l ?? "-";
    }
};

// --- 부서(=직무 카테고리로 활용) ---
export const departmentLabel = (d?: string) => {
    switch (normalize(d)) {
        case "IT":                       return "개발팀";
        case "DESIGN":                   return "디자인팀";
        case "MARKETING":                return "마케팅팀";
        case "SALE":                     return "영업팀";
        case "BUSINESS_ADMINISTRATION":  return "경영지원팀";
        case "RESEARCH_AND_DEVELOPMENT": return "R&D팀";
        default:                         return d ?? "-";
    }
};

// ✅ 셀렉트에 쓸 코드 리스트(값)들
export const DEPARTMENTS = [
    "IT",
    "DESIGN",
    "MARKETING",
    "SALE",
    "BUSINESS_ADMINISTRATION",
    "RESEARCH_AND_DEVELOPMENT",
] as const;

export const EDUCATIONS = [
    "GED",
    "HIGH_SCHOOL",
    "ASSOCIATE",
    "BACHELOR",
    "NO_REQUIREMENT",
] as const;

// 경력 라벨
export const experienceLabel = (x?: string) => {
    switch (normalize(x)) {
        case "JUNIOR": return "신입";
        case "SENIOR": return "경력";
        default:       return x ?? "-";
    }
};

// 경력 코드 리스트
export const EXPERIENCES = ["JUNIOR", "SENIOR"] as const;