import { keepPreviousData, queryOptions, useQuery } from "@tanstack/react-query";
import {
	getRecruitDetailApi,
	getRecruitListApi,
	type RecruitSearchFilters,
} from "src/entities/recruit/api/recruit.api";
import type { RecruitResponse } from "src/entities/recruit/schema/recruit.schema";
import { toRecruitCard } from "src/entities/recruit/util/adapter";

/**
 * @description Recruit query key factory
 * Organized hierarchically for cache management
 */
export const recruitQueries = {
	all: ["recruit"] as const,
	list: () =>
		queryOptions({
			queryKey: [...recruitQueries.all, "list"] as const,
			queryFn: ({ signal }) => getRecruitListApi({ signal }),
			select: (data: RecruitResponse[]) => data.map(toRecruitCard),
			staleTime: 60000,
			gcTime: 300000,
			refetchOnWindowFocus: false,
		}),
	detail: (idx: number) =>
		queryOptions({
			queryKey: [...recruitQueries.all, "detail", idx] as const,
			/* signal 미전달 — react cache 키 일관성 유지 (generateMetadata와 dedupe) */
			queryFn: () => getRecruitDetailApi(idx),
			select: toRecruitCard,
			enabled: Number.isFinite(idx) && idx > 0,
			staleTime: 60000,
			gcTime: 300000,
			refetchOnWindowFocus: false,
		}),
	search: (filters: RecruitSearchFilters) =>
		queryOptions({
			queryKey: [...recruitQueries.all, "search", filters] as const,
			queryFn: ({ signal }) =>
				getRecruitListApi({
					page: 1,
					size: 5,
					title: filters.keyword ?? null,
					department: filters.job ?? null,
					education: filters.education ?? null,
					recruitType: filters.career ?? null,
					signal,
				}),
			select: (data: RecruitResponse[]) => data.map(toRecruitCard),
			/* 필터 변경 시 이전 결과 유지해 깜빡임 방지 */
			placeholderData: keepPreviousData,
			staleTime: 60000,
			gcTime: 300000,
			refetchOnWindowFocus: false,
		}),
};

/**
 * @description Search recruit by filters
 * @param filters Search filter criteria
 */
export const useRecruitSearchQuery = (
	filters: RecruitSearchFilters,
	options?: { enabled?: boolean },
) => {
	return useQuery({
		...recruitQueries.search(filters),
		...options,
	});
};

/**
 * @description Fetch recruit list
 */
export const useRecruitListQuery = (options?: { enabled?: boolean }) => {
	return useQuery({
		...recruitQueries.list(),
		...options,
	});
};

/**
 * @description Fetch recruit detail by index
 * @param idx Recruit ID
 */
export const useRecruitDetailQuery = (idx: number, options?: { enabled?: boolean }) => {
	return useQuery({
		...recruitQueries.detail(idx),
		...options,
	});
};
