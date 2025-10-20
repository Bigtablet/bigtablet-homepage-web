import BigtabletAxios from "src/libs/axios";
import type { RecruitRequest, RecruitResponse, RecruitApplyResponse } from "src/types/recruit/recruit.type";

export const getRecruitListApi = async (signal?: AbortSignal): Promise<RecruitResponse[]> => {
    const res = await BigtabletAxios.get("/job/list", { signal });
    return res.data.data as RecruitResponse[];
};

export const getRecruitDetailApi = async (idx: number, signal?: AbortSignal): Promise<RecruitResponse> => {
    const res = await BigtabletAxios.get("/job", { params: { idx }, signal });
    return res.data.data as RecruitResponse;
};

export const postRecruitApplyApi = async (body: RecruitRequest, signal?: AbortSignal): Promise<RecruitApplyResponse> => {
    const res = await BigtabletAxios.post("/recruit", body, { signal });
    return (res.data ?? { ok: true }) as RecruitApplyResponse;
};

export const deleteRecruitApi = async (idx: number): Promise<{ ok: boolean }> => {
    const res = await BigtabletAxios.delete("/job", { params: { idx } });
    return (res.data ?? { ok: true }) as { ok: boolean };
};