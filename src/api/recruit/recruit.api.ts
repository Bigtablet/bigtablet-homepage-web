import BigtabletAxios from "src/libs/axios";
import type {
    RecruitRequest,
    RecruitResponse,
    RecruitApplyResponse,
    RecruitApplicant
} from "src/types/recruit/recruit.type";

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

export const putRecruitUpdateApi = async (
    body: RecruitResponse & { idx: number },
    signal?: AbortSignal
): Promise<{ ok: boolean }> => {
    const res = await BigtabletAxios.put("/job", body, { signal });
    return (res.data ?? { ok: true }) as { ok: boolean };
};

export const deleteRecruitApi = async (idx: number): Promise<{ ok: boolean }> => {
    const res = await BigtabletAxios.delete("/job", { params: { idx } });
    return (res.data ?? { ok: true }) as { ok: boolean };
};

export const getRecruitApplicantListApi = async (
    signal?: AbortSignal
): Promise<RecruitApplicant[]> => {
    const res = await BigtabletAxios.get("/recruit/list", { signal });
    return res.data.data as RecruitApplicant[];
};

export const getRecruitApplicantDetailApi = async (
    idx: number,
    signal?: AbortSignal
): Promise<RecruitApplicant> => {
    const res = await BigtabletAxios.get("/recruit", { params: { idx }, signal });
    return res.data.data as RecruitApplicant;
};

export const patchRecruitApplicantAcceptApi = async (idx: number, signal?: AbortSignal): Promise<{ ok: boolean }> => {
    const res = await BigtabletAxios.patch("/recruit/accept", null, { params: { idx }, signal });
    return (res.data ?? { ok: true }) as { ok: boolean };
};

export const patchRecruitApplicantRejectApi = async (idx: number, signal?: AbortSignal): Promise<{ ok: boolean }> => {
    const res = await BigtabletAxios.patch("/recruit/reject", null, { params: { idx }, signal });
    return (res.data ?? { ok: true }) as { ok: boolean };
};