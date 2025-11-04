export const blogKeys = {
    all: ["blog"] as const,
    list: (params?: Record<string, unknown>) => [...blogKeys.all, "list", params ?? {}] as const,
    infinite: (size: number) => [...blogKeys.all, "infinite", { size }] as const,
    page: (page: number, size: number) => [...blogKeys.all, "page", { page, size }] as const,
    detail: (idx: number) => [...blogKeys.all, "detail", idx] as const,
    views:   ["blog", "views"] as const,
};