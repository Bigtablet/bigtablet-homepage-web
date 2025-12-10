import {
    DepartmentType,
    EducationType,
    LocationType,
    RecruitType,
} from "src/entities/recruit/model/enum/recruit.enum";

/** 옵션 배열 */
export const DEPARTMENTS = DepartmentType.options;
export const EDUCATIONS = EducationType.options;
export const RECRUIT_TYPES = RecruitType.options;
export const LOCATIONS = LocationType.options;

/** Enum에서 key 타입만 추출 */
type EnumValue<T> = T extends { _type: infer U } ? U : never;

/** 라벨 매핑 */
export const DEPARTMENT_LABEL: Record<EnumValue<typeof DepartmentType>, string> = {
    BUSINESS_ADMINISTRATION: "경영혁신",
    SALES: "영업",
    MARKETING: "마케팅",
    IT: "개발",
    DESIGN: "디자인",
    RESEARCH_AND_DEVELOPMENT: "연구개발",
};

export const EDUCATION_LABEL: Record<EnumValue<typeof EducationType>, string> = {
    HIGH_SCHOOL: "고졸",
    ASSOCIATE: "전문학사",
    BACHELOR: "학사",
    NO_REQUIREMENT: "학력무관",
};

export const RECRUIT_TYPE_LABEL: Record<EnumValue<typeof RecruitType>, string> = {
    FULL_TIME: "정규직",
    CONTRACT: "계약직",
    INTERN: "인턴",
};

export const LOCATION_LABEL: Record<EnumValue<typeof LocationType>, string> = {
    DAEGU: "대구",
    GASAN: "가산",
    USA: "미국",
    PANGYO: "판교",
    ILSAN: "일산",
};

/** 공통 라벨 함수 생성기 */
const createLabelGetter =
    <T extends Record<string, string>>(map: T) =>
        (value: keyof T | string) =>
            map[value as keyof T] ?? value;

/** 라벨 함수 */
export const departmentLabel = createLabelGetter(DEPARTMENT_LABEL);
export const educationLabel = createLabelGetter(EDUCATION_LABEL);
export const recruitTypeLabel = createLabelGetter(RECRUIT_TYPE_LABEL);
export const locationLabel = createLabelGetter(LOCATION_LABEL);