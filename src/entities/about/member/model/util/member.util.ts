/** @description 멤버 키 상수 */
export const MEMBER_KEYS = ["CEO", "CTO", "Manage", "PM", "BE", "FE", "APP"] as const;
export type MemberKey = (typeof MEMBER_KEYS)[number];

/** @description 멤버 슬러그 타입 */
export type MemberSlug = "jiho" | "minho" | "chaehyung" | "yerim" | "gunwoo" | "sangmin" | "byungjun";

/** @description 슬러그 → 키 매핑 (단일 출처) */
export const SLUG_TO_MEMBER: Record<MemberSlug, MemberKey> = {
    jiho: "CEO",
    minho: "CTO",
    chaehyung: "Manage",
    yerim: "PM",
    gunwoo: "BE",
    sangmin: "FE",
    byungjun: "APP",
} as const;

/** @description 키 → 슬러그 매핑 (SLUG_TO_MEMBER에서 역산) */
export const MEMBER_TO_SLUG: Record<MemberKey, MemberSlug> = Object.fromEntries(
    Object.entries(SLUG_TO_MEMBER).map(([slug, key]) => [key, slug as MemberSlug])
) as Record<MemberKey, MemberSlug>;

/** @description 기본 노출 순서 (widgets에서 기본값으로 사용) */
export const MEMBER_DEFAULT_ORDER: MemberKey[] = [...MEMBER_KEYS];

/** @description 주어진 값이 멤버 슬러그인지 검사 */
export const isMemberSlug = (x: string): x is MemberSlug => (x as MemberSlug) in SLUG_TO_MEMBER;