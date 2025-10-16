import { UseQueryOptions } from "@tanstack/react-query";
import {
    useRecruitListQuery,
    useRecruitDetailQuery,
    useRecruitApplyMutation,
} from "src/queries/recruit/recruit.query";
import type {
    RecruitResponse,
    RecruitCard,
    RecruitRequest,
} from "src/types/recruit/recruit.type";

export const useRecruitList = (
    options?: Omit<UseQueryOptions<RecruitResponse[], Error, RecruitCard[]>, "queryKey" | "queryFn" | "select">
) => {
    const { data, status, error } = useRecruitListQuery(options);
    const list = data ?? [];
    return { list, status, error, isEmpty: list.length === 0 };
};

export const useRecruitDetail = (
    idx: number,
    options?: Omit<UseQueryOptions<RecruitResponse, Error, RecruitCard>, "queryKey" | "queryFn" | "select">
) => {
    const { data, status, error } = useRecruitDetailQuery(idx, { enabled: !!idx, ...options });
    return { recruit: data ?? null, status, error };
};

export const useRecruitApply = (options?: Parameters<typeof useRecruitApplyMutation>[0]) => {
    const m = useRecruitApplyMutation(options);
    const submit = (payload: RecruitRequest) => m.mutate(payload);
    return { submit, ...m };
};