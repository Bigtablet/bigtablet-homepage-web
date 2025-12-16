/** @description 멤버 고유 키 상수 */
export const MEMBER_KEYS = [
    "jiho",
    "minho",
    "chaehyung",
    "gyeongmin",
    "yerim",
    "gunwoo",
    "sangmin",
    "byungjun",
] as const;

export type MemberKey = (typeof MEMBER_KEYS)[number];

/** @description 멤버 슬러그 타입 (키=슬러그로 통일) */
export type MemberSlug = MemberKey;

/** @description 멤버 역할 타입 */
export type MemberRole = "CEO" | "CTO" | "Manage" | "PM" | "BE" | "FE" | "APP";

/** @description 멤버 역할 매핑 */
export const MEMBER_ROLE: Record<MemberKey, MemberRole> = {
    jiho: "CEO",
    minho: "CTO",
    chaehyung: "Manage",
    gyeongmin: "PM",
    yerim: "PM",
    gunwoo: "BE",
    sangmin: "FE",
    byungjun: "APP",
} as const;

/** @description 기본 노출 순서 */
export const MEMBER_DEFAULT_ORDER: MemberKey[] = [...MEMBER_KEYS];

/** @description 주어진 값이 멤버 슬러그인지 검사 */
export const isMemberSlug = (x: string): x is MemberSlug =>
    MEMBER_KEYS.includes(x as MemberSlug);