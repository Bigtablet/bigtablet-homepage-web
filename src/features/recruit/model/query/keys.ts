import {RecruitSearchFilters} from "src/entities/recruit/model/api/recruit.api";

export const recruitKeys = {
    all: ["recruit"] as const,

    list: () => [...recruitKeys.all, "list"] as const,

    detail: (idx: number) => [...recruitKeys.all, "detail", idx] as const,

    search: (filters: RecruitSearchFilters) =>
        [...recruitKeys.all, "search", filters] as const,
};