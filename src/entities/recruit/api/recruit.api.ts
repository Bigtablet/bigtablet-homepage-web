import { getParsed, postParsed } from "src/shared/libs/api/zod";
import {
	recruitListResponseSchema,
	recruitDetailResponseSchema,
	recruitApplyResponseSchema,
	type RecruitResponse,
	type RecruitApplyResponse,
	type RecruitRequest,
} from "../model/schema/recruit.schema";

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

    // 서버에서 빈 데이터 시 문자열 반환할 수 있음
    if (!data || typeof data === "string") {
        return [];
    }
    return data;
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

/** 지원 */
export const postRecruitApplyApi = async (
	body: RecruitRequest,
	signal?: AbortSignal,
): Promise<RecruitApplyResponse> =>
	postParsed("/recruit", recruitApplyResponseSchema, body, { signal });