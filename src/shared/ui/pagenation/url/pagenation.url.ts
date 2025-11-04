export const buildPageHref = (basePath: string, page: number, size?: number) => {
    const url = new URL(basePath, "https://dummy"); // base for building
    url.searchParams.set("page", String(page));
    if (size) url.searchParams.set("size", String(size));
    return url.pathname + "?" + url.searchParams.toString();
};

// 현재 URLSearchParams에서 안전하게 page/size 읽기
export const parsePageParams = (params: URLSearchParams) => {
    const page = Math.max(1, Number(params.get("page") || 1));
    const size = Math.max(1, Number(params.get("size") || 9));
    return { page, size };
};