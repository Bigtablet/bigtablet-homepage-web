import BigtabletAxios from "src/libs/axios";
import type { RecruitResponse } from "src/types/recruit/recruit.type";

export const getRecruitListApi = async (signal?: AbortSignal): Promise<RecruitResponse[]> => {
    const res = await BigtabletAxios.get("/job/list", { signal });
    return res.data.data as RecruitResponse[];
};

export const getRecruitDetailApi = async (
    idx: number,
    signal?: AbortSignal
): Promise<RecruitResponse> => {
    const res = await BigtabletAxios.get("/job", {
        params: { idx },
        signal,
    });
    return res.data.data as RecruitResponse;
};