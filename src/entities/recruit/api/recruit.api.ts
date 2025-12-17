import { getParsed, postParsed } from "src/shared/libs/api/zod";
import {
    recruitListResponseSchema,
    recruitDetailResponseSchema,
    recruitApplyResponseSchema,
    type RecruitResponse,
    type RecruitApplyResponse,
} from "../model/schema/recruit.schema";
import type { ApplyFormValues } from "src/features/recruit/apply/form/model/schema/apply.schema";

export interface RecruitSearchFilters {
    keyword?: string;
    job?: string;
    education?: string;
    career?: string;
}

/* 목록 + 검색 */
export const getRecruitListApi = async ({
                                            page = 1,
                                            size = 10,
                                            title,
                                            department,
                                            education,
                                            recruitType,
                                            signal,
                                        }: {
    page?: number;
    size?: number;
    title?: string | null;
    department?: string | null;
    education?: string | null;
    recruitType?: string | null;
    signal?: AbortSignal;
} = {}): Promise<RecruitResponse[]> => {
    const { data } = await getParsed("/job/list", recruitListResponseSchema, {
        signal,
        params: {
            page,
            size,
            title,
            department,
            education,
            recruitType,
        },
    });

    return data ?? [];
};

/* 상세 */
export const getRecruitDetailApi = async (idx: number, signal?: AbortSignal) => {
    const { data } = await getParsed("/job", recruitDetailResponseSchema, {
        signal,
        params: { idx },
    });
    if (!data) throw new Error("Empty response");
    return data;
};

/* 지원 */
export const postRecruitApplyApi = async (
    body: ApplyFormValues,
    signal?: AbortSignal
): Promise<RecruitApplyResponse> =>
    postParsed("/recruit", recruitApplyResponseSchema, body, { signal });