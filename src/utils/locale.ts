const SUPPORTED = ["ko", "en"] as const;
export type Locale = (typeof SUPPORTED)[number];

export const setLocaleCookie = (locale: Locale) => {
    document.cookie = `locale=${locale}; path=/; max-age=${
        60 * 60 * 24 * 365
    }; samesite=lax`;
};

export const swapLocaleInPath = (path: string, next: Locale) => {
    const segs = path.split("/");
    if (SUPPORTED.includes(segs[1] as Locale)) {
        segs[1] = next;
        return segs.join("/") || `/${next}`;
    }
    return `/${next}${path.startsWith("/") ? "" : "/"}${path}`;
};