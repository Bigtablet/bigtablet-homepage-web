export const blogQueryKeys = {
	all: ["blog"] as const,
	list: (params?: Record<string, unknown>) =>
		[...blogQueryKeys.all, "list", params ?? {}] as const,
	infinite: (size: number) =>
		[...blogQueryKeys.all, "infinite", { size }] as const,
	page: (page: number, size: number) =>
		[...blogQueryKeys.all, "page", { page, size }] as const,
	detail: (idx: number) => [...blogQueryKeys.all, "detail", idx] as const,
};
