export const newsQueryKeys = {
	all: () => ["news"] as const,

	lists: () => [...newsQueryKeys.all(), "list"] as const,

	page: (page: number, size: number) =>
		[...newsQueryKeys.all(), "page", page, size] as const,

	detail: (idx: number) => [...newsQueryKeys.all(), "detail", idx] as const,
};
