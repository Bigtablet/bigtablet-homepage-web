import {
    DepartmentType,
    EducationType,
    RecruitType,
    LocationType,
} from "src/entities/recruit/model/schema/recruit.schema";

/** @description 셀렉트 옵션(배열) */
export const DEPARTMENTS   = DepartmentType.options;
export const EDUCATIONS    = EducationType.options;
export const RECRUIT_TYPES = RecruitType.options;
export const LOCATIONS     = LocationType.options;

/** @description 라벨 매핑 */
export const DEPARTMENT_LABEL: Record<typeof DepartmentType._type, string> = {
    BUSINESS_ADMINISTRATION: "경영관리",
    SALE: "영업",
    MARKETING: "마케팅",
    IT: "개발",
    DESIGN: "디자인",
    RESEARCH_AND_DEVELOPMENT: "연구개발",
};

export const EDUCATION_LABEL: Record<typeof EducationType._type, string> = {
    HIGH_SCHOOL: "고졸",
    ASSOCIATE: "전문학사",
    BACHELOR: "학사",
    NO_REQUIREMENT: "학력무관",
};

export const RECRUIT_TYPE_LABEL: Record<typeof RecruitType._type, string> = {
    FULL_TIME: "정규직",
    CONTRACT: "계약직",
    INTERN: "인턴",
};

export const LOCATION_LABEL: Record<typeof LocationType._type, string> = {
    SEOUL: "서울",
    DAEGU: "대구",
};

/** @description 라벨 헬퍼 */
export const departmentLabel  = (v: typeof DepartmentType._type | string) =>
    DEPARTMENT_LABEL[v as typeof DepartmentType._type] ?? v;

export const educationLabel   = (v: typeof EducationType._type | string) =>
    EDUCATION_LABEL[v as typeof EducationType._type] ?? v;

export const recruitTypeLabel = (v: typeof RecruitType._type | string) =>
    RECRUIT_TYPE_LABEL[v as typeof RecruitType._type] ?? v;

export const locationLabel    = (v: typeof LocationType._type | string) =>
    LOCATION_LABEL[v as typeof LocationType._type] ?? v;