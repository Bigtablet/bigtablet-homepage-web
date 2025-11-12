"use client";

import {
    useQuery, UseQueryOptions,
    useMutation, UseMutationOptions,
} from "@tanstack/react-query";

import {
    getRecruitListApi,
    getRecruitDetailApi,
    postRecruitApplyApi,
} from "src/entities/recruit/model/api/recruit.api";

import {
    type RecruitResponse,
    type RecruitCard,
    type RecruitApplyResponse,
} from "src/entities/recruit/model/schema/recruit.schema";

import {recruitKeys} from "./keys"
import {toRecruitCard} from "src/entities/recruit/util/adapter";
import {ApplyFormValues} from "src/features/recruit/model/apply/schema/apply.schema";

/* 목록 */
export const useRecruitListQuery = (
    options?: Omit<UseQueryOptions<RecruitResponse[], Error, RecruitCard[]>, "queryKey" | "queryFn" | "select">
) =>
    useQuery({
        queryKey: recruitKeys.recruit.list,
        queryFn: ({ signal }) => getRecruitListApi(signal),
        select: (data) => data.map(toRecruitCard),
        staleTime: 60_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: false,
        ...options,
    });

/* 상세 */
export const useRecruitDetailQuery = (
    idx: number,
    options?: Omit<UseQueryOptions<RecruitResponse, Error, RecruitCard>, "queryKey" | "queryFn" | "select">
) =>
    useQuery({
        queryKey: recruitKeys.recruit.detail(idx),
        queryFn: ({ signal }) => getRecruitDetailApi(idx, signal),
        select: toRecruitCard,
        enabled: !!idx,
        staleTime: 60_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: false,
        ...options,
    });

export const useRecruitApplyMutation = (
    options?: UseMutationOptions<RecruitApplyResponse, Error, ApplyFormValues, unknown>
) =>
    useMutation<RecruitApplyResponse, Error, ApplyFormValues, unknown>({
        mutationKey: ["recruit", "apply"],
        mutationFn: (body) => postRecruitApplyApi(body),
        ...options,
    });