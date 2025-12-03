"use client";

import {
    useMutation,
    useQuery,
    type UseMutationOptions,
    type UseQueryOptions,
} from "@tanstack/react-query";

import {
    getRecruitListApi,
    getRecruitDetailApi,
    postRecruitApplyApi,
    type RecruitSearchFilters,
} from "src/entities/recruit/model/api/recruit.api";

import { recruitKeys } from "./keys";
import { toRecruitCard } from "src/entities/recruit/util/adapter";
import type {
    RecruitResponse,
    RecruitCard,
    RecruitApplyResponse,
} from "src/entities/recruit/model/schema/recruit.schema";
import type { ApplyFormValues } from "../apply/schema/apply.schema";

/* 검색 */
export const useRecruitSearchQuery = (
    filters: RecruitSearchFilters,
    options?: Omit<
        UseQueryOptions<RecruitResponse[], Error, RecruitCard[]>,
        "queryKey" | "queryFn" | "select"
    >
) =>
    useQuery({
        queryKey: recruitKeys.search(filters),
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

/* 목록 */
export const useRecruitListQuery = (
    options?: Omit<
        UseQueryOptions<RecruitResponse[], Error, RecruitCard[]>,
        "queryKey" | "queryFn" | "select"
    >
) =>
    useQuery({
        queryKey: recruitKeys.list(),
        queryFn: ({ signal }) => getRecruitListApi({ signal }),
        select: (data) => data.map(toRecruitCard),
        staleTime: 60000,
        gcTime: 300000,
        refetchOnWindowFocus: false,
        ...options,
    });

/* 상세 */
export const useRecruitDetailQuery = (
    idx: number,
    options?: Omit<
        UseQueryOptions<RecruitResponse, Error, RecruitCard>,
        "queryKey" | "queryFn" | "select"
    >
) =>
    useQuery({
        queryKey: recruitKeys.detail(idx),
        queryFn: ({ signal }) => getRecruitDetailApi(idx, signal),
        select: toRecruitCard,
        enabled: !!idx,
        staleTime: 60000,
        gcTime: 300000,
        refetchOnWindowFocus: false,
        ...options,
    });

/* 지원 */
export const useRecruitApplyMutation = (
    options?: UseMutationOptions<
        RecruitApplyResponse,
        Error,
        ApplyFormValues,
        unknown
    >
) =>
    useMutation({
        mutationKey: ["recruit", "apply"],
        mutationFn: (body) => postRecruitApplyApi(body),
        ...options,
    });