export const newsQueryKey = {
    all: ["news"] as const,
    list: (params?: Record<string, unknown>) => [...newsQueryKey.all, "list", params ?? {}] as const,
    page: (page: number, size: number) => [...newsQueryKey.all, "page", { page, size }] as const,
    detail: (idx: number) => [...newsQueryKey.all, "detail", idx] as const,
};