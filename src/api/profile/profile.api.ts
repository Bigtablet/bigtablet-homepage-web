import BigtabletAxios from "src/libs/axios";
import type { ProfileType } from "src/types/profile/profile.type";

export const getProfileApi = async (signal?: AbortSignal): Promise<ProfileType> => {
    const res = await BigtabletAxios.get("/user", { signal });
    return res.data.data as ProfileType;
};