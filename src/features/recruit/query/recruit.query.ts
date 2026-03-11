"use client";

import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import {
	getRecruitDetailApi,
	getRecruitListApi,
	type RecruitSearchFilters,
} from "src/entities/recruit/api/recruit.api";
import type {
	RecruitCard,
	RecruitResponse,
} from "src/entities/recruit/schema/recruit.schema";
import { toRecruitCard } from "src/entities/recruit/util/adapter";
import { recruitQueryKeys } from "./keys";

/** 검색 */
export const useRecruitSearchQuery = (
	filters: RecruitSearchFilters,
	options?: Omit<
		UseQueryOptions<RecruitResponse[], Error, RecruitCard[]>,
		"queryKey" | "queryFn" | "select"
	>,
) =>
	useQuery({
		queryKey: recruitQueryKeys.search(filters),
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
		select: (data) => data.map(toRecruitCard),
		staleTime: 60000,
		gcTime: 300000,
		refetchOnWindowFocus: false,
		...options,
	});

/** 목록 */
export const useRecruitListQuery = (
	options?: Omit<
		UseQueryOptions<RecruitResponse[], Error, RecruitCard[]>,
		"queryKey" | "queryFn" | "select"
	>,
) =>
	useQuery({
		queryKey: recruitQueryKeys.list(),
		queryFn: ({ signal }) => getRecruitListApi({ signal }),
		select: (data) => data.map(toRecruitCard),
		staleTime: 60000,
		gcTime: 300000,
		refetchOnWindowFocus: false,
		...options,
	});

/** 상세 */
export const useRecruitDetailQuery = (
	idx: number,
	options?: Omit<
		UseQueryOptions<RecruitResponse, Error, RecruitCard>,
		"queryKey" | "queryFn" | "select"
	>,
) =>
	useQuery({
		queryKey: recruitQueryKeys.detail(idx),
		queryFn: ({ signal }) => getRecruitDetailApi(idx, signal),
		select: toRecruitCard,
		enabled: !!idx,
		staleTime: 60000,
		gcTime: 300000,
		refetchOnWindowFocus: false,
		...options,
	});
