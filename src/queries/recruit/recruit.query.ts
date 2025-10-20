import {useQuery, UseQueryOptions, useMutation, UseMutationOptions, useQueryClient} from "@tanstack/react-query";
import {
    getRecruitListApi,
    getRecruitDetailApi,
    postRecruitApplyApi,
    deleteRecruitApi, getRecruitApplicantListApi, getRecruitApplicantDetailApi, patchRecruitApplicantAcceptApi,
    patchRecruitApplicantRejectApi
} from "src/api/recruit/recruit.api";
import { QueryKey } from "src/queries/queryKey";
import type {
    RecruitResponse,
    RecruitCard,
    RecruitRequest,
    RecruitApplyResponse, RecruitApplicant,
} from "src/types/recruit/recruit.type";
import {useEffect} from "react";

/* 카드 가공 */
const toRecruitCard = (item: RecruitResponse): RecruitCard => {
    let dday = "상시";
    if (item.endDate) {
        const end = new Date(item.endDate);
        end.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const diff = Math.ceil((end.getTime() - today.getTime()) / 86400000);
        dday = diff > 0 ? `D-${diff}` : "마감";
    }

    const deptLabel =
        item.department === "IT" ? "개발팀" :
            item.department === "MARKETING" ? "마케팅" :
                item.department === "DESIGN" ? "디자인" :
                    item.department === "SALE" ? "영업" :
                        item.department === "BUSINESS_ADMINISTRATION" ? "경영지원" :
                            item.department === "RESEARCH_AND_DEVELOPMENT" ? "R&D" :
                                String(item.department);

    const typeLabel =
        item.recruitType === "FULL_TIME" ? "정규직" :
            item.recruitType === "CONTRACT" ? "계약직" : "인턴";

    const locLabel =
        item.location === "SEOUL" ? "서울" :
            item.location === "DAEGU" ? "대구" : String(item.location);

    const eduLabel =
        item.education === "BACHELOR" ? "대졸" :
            item.education === "HIGH_SCHOOL" ? "고졸" :
                item.education === "ASSOCIATE" ? "전문학사" : "학력무관";

    const tags = [deptLabel, typeLabel, locLabel, eduLabel, item.experiment];

    return { ...item, dday, tags };
};

export const useRecruitListQuery = (
    options?: Omit<UseQueryOptions<RecruitResponse[], Error, RecruitCard[]>, "queryKey" | "queryFn" | "select">
) =>
    useQuery({
        queryKey: [QueryKey.recruit.list],
        queryFn: ({ signal }) => getRecruitListApi(signal),
        select: (data) => data.map(toRecruitCard),
        staleTime: 60_000,
        ...options,
    });

export const useRecruitDetailQuery = (
    idx: number,
    options?: Omit<UseQueryOptions<RecruitResponse, Error, RecruitCard>, "queryKey" | "queryFn" | "select">
) =>
    useQuery({
        queryKey: [QueryKey.recruit.detail, idx],
        queryFn: ({ signal }) => getRecruitDetailApi(idx, signal),
        select: toRecruitCard,
        enabled: !!idx,
        staleTime: 60_000,
        ...options,
    });

export const useRecruitApplyMutation = (
    options?: UseMutationOptions<RecruitApplyResponse, Error, RecruitRequest>
) =>
    useMutation({
        mutationKey: [QueryKey.recruit.apply],
        mutationFn: (body) => postRecruitApplyApi(body),
        ...options,
    });

export const useRecruitDeleteMutation = (
    options?: UseMutationOptions<{ ok: boolean }, Error, number>
) => {
    const qc = useQueryClient();
    return useMutation({
        mutationKey: [QueryKey.recruit.delete],
        mutationFn: (idx) => deleteRecruitApi(idx),
        ...options,
        onSuccess: (data, variables, context, mutation) => {
            qc.invalidateQueries({ queryKey: [QueryKey.recruit.list] });
            options?.onSuccess?.(data, variables, context, mutation);
        },
        onError: (error, variables, context, mutation) => {
            options?.onError?.(error, variables, context, mutation);
        },
    });
};

export const useRecruitApplicantListQuery = (options?: {
    enabled?: boolean;
    staleTime?: number;
    onSuccess?: (data: RecruitApplicant[]) => void;
    onError?: (error: Error) => void;
}) => {
    const query = useQuery<RecruitApplicant[], Error>({
        queryKey: [QueryKey.recruit.applicantList],
        queryFn: ({ signal }) => getRecruitApplicantListApi(signal),
        enabled: options?.enabled ?? true,
        staleTime: options?.staleTime ?? 60_000,
    });

    useEffect(() => {
        if (query.isSuccess && options?.onSuccess) options.onSuccess(query.data!);
    }, [query.isSuccess, query.data, options]);

    useEffect(() => {
        if (query.isError && options?.onError) options.onError(query.error as Error);
    }, [query.isError, query.error, options]);

    return query;
};

export const useRecruitApplicantDetailQuery = (idx: number, options?: {
    enabled?: boolean;
    staleTime?: number;
}) => {
    return useQuery<RecruitApplicant, Error>({
        queryKey: [QueryKey.recruit.applicantDetail, idx],
        queryFn: ({ signal }) => getRecruitApplicantDetailApi(idx, signal),
        enabled: options?.enabled ?? !!idx,
        staleTime: options?.staleTime ?? 60_000,
    });
};

export const useRecruitApplicantAcceptMutation = (
    options?: UseMutationOptions<{ ok: boolean }, Error, number>
) => {
    const qc = useQueryClient();
    return useMutation({
        mutationKey: [QueryKey.recruit.applicantAccept],
        mutationFn: (idx) => patchRecruitApplicantAcceptApi(idx),
        ...options,
        onSuccess: (data, variables, context, mutation) => {
            qc.invalidateQueries({ queryKey: [QueryKey.recruit.applicantDetail, variables] });
            qc.invalidateQueries({ queryKey: [QueryKey.recruit.applicantList] });
            options?.onSuccess?.(data, variables, context, mutation);
        },
        onError: (error, variables, context, mutation) => {
            options?.onError?.(error, variables, context, mutation);
        },
    });
};

export const useRecruitApplicantRejectMutation = (
    options?: UseMutationOptions<{ ok: boolean }, Error, number>
) => {
    const qc = useQueryClient();
    return useMutation({
        mutationKey: [QueryKey.recruit.applicantReject],
        mutationFn: (idx) => patchRecruitApplicantRejectApi(idx),
        ...options,
        onSuccess: (data, variables, context, mutation) => {
            qc.invalidateQueries({ queryKey: [QueryKey.recruit.applicantDetail, variables] });
            qc.invalidateQueries({ queryKey: [QueryKey.recruit.applicantList] });
            options?.onSuccess?.(data, variables, context, mutation);
        },
        onError: (error, variables, context, mutation) => {
            options?.onError?.(error, variables, context, mutation);
        },
    });
};