import BigtabletAxios from "src/shared/libs/api/axios";
import {
    recruitListResponseSchema,
    recruitDetailResponseSchema,
    recruitApplyResponseSchema,
    type RecruitResponse,
    type RecruitRequest,
    type RecruitApplyResponse,
} from "../schema/recruit.schema";

// 목록
export const getRecruitListApi = async (signal?: AbortSignal): Promise<RecruitResponse[]> => {
    const res = await BigtabletAxios.get<unknown>("/job/list", {signal});
    const parsed = recruitListResponseSchema.parse(res.data);
    return parsed.data ?? [];
};

// 상세
export const getRecruitDetailApi = async (idx: number, signal?: AbortSignal): Promise<RecruitResponse> => {
    const res = await BigtabletAxios.get<unknown>("/job", {params: {idx}, signal});
    const parsed = recruitDetailResponseSchema.parse(res.data);
    if (!parsed.data) throw new Error("Empty response data");
    return parsed.data;
};

// 지원
export const postRecruitApplyApi = async (body: RecruitRequest, signal?: AbortSignal): Promise<RecruitApplyResponse> => {
    const res = await BigtabletAxios.post<unknown>("/recruit", body, {signal});
    return recruitApplyResponseSchema.parse(res.data);
};