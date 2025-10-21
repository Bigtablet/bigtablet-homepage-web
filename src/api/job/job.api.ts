import BigtabletAxios from "src/libs/axios";
import type { PostJobPayload } from "src/types/job/job.type";

export const postJobApi = async (payload: PostJobPayload) => {
    const { data } = await BigtabletAxios.post("/job", payload);
    return data;
};