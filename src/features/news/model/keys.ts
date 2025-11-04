export const newsKeys = {
    all: ["news"] as const,
    list: (params?: Record<string, unknown>) => [...newsKeys.all, "list", params ?? {}] as const,
    page: (page: number, size: number) => [...newsKeys.all, "page", { page, size }] as const,
    detail: (idx: number) => [...newsKeys.all, "detail", idx] as const,
};