import { getParsed, postParsed } from "src/shared/libs/api/zod";
import {
    recruitListResponseSchema,
    recruitDetailResponseSchema,
    recruitApplyResponseSchema,
    type RecruitResponse,
    type RecruitApplyResponse,
} from "../schema/recruit.schema";
import type { ApplyFormValues } from "src/features/recruit/model/apply/schema/apply.schema";

// 목록
export const getRecruitListApi = async (signal?: AbortSignal): Promise<RecruitResponse[]> =>
    (await getParsed("/job/list", recruitListResponseSchema, { signal })).data ?? [];

// 상세
export const getRecruitDetailApi = async (idx: number, signal?: AbortSignal): Promise<RecruitResponse> => {
    const { data } = await getParsed("/job", recruitDetailResponseSchema, { params: { idx }, signal });
    if (!data) throw new Error("Empty response data");
    return data;
};

// 지원
export const postRecruitApplyApi = async (
    body: ApplyFormValues,
    signal?: AbortSignal
): Promise<RecruitApplyResponse> =>
    postParsed("/recruit", recruitApplyResponseSchema, body, { signal });