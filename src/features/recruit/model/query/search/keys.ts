export const recruitKeys = {
    all: ["recruit"] as const,
    list: () => [...recruitKeys.all, "list"] as const,
    detail: (idx: number) => [...recruitKeys.all, "detail", idx] as const,
    search: (filter: string, value: string) =>
        [...recruitKeys.all, "search", filter, value] as const,
};