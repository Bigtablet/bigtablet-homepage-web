export const MEMBER_KEYS = ["CEO", "CTO", "Manage", "PM", "BE", "FE"] as const;
export type MemberKey = typeof MEMBER_KEYS[number];

export const MEMBER_SLUG_MAP = {
    CEO: "jiho",
    CTO: "minho",
    Manage: "chaehyung",
    PM: "yerim",
    BE: "gunwoo",
    FE: "sangmin",
} as const;

export type MemberSlug = (typeof MEMBER_SLUG_MAP)[MemberKey];

export const SLUG_TO_MEMBER: Record<MemberSlug, MemberKey> = {
    "jiho": "CEO",
    "minho": "CTO",
    "chaehyung": "Manage",
    "yerim": "PM",
    "gunwoo": "BE",
    "sangmin": "FE",
};