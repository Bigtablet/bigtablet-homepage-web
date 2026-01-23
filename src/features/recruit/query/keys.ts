import type { RecruitSearchFilters } from "src/entities/recruit/api/recruit.api";

export const recruitQueryKeys = {
	all: ["recruit"] as const,

	list: () => [...recruitQueryKeys.all, "list"] as const,

	detail: (idx: number) => [...recruitQueryKeys.all, "detail", idx] as const,

	search: (filters: RecruitSearchFilters) =>
		[...recruitQueryKeys.all, "search", filters] as const,
};
