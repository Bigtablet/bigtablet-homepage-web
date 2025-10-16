import BigtabletAxios from "src/libs/axios";
import type { Gcp } from "src/types/gcp/gcp.type";

export const postGcpUploadApi = async (file: File, signal?: AbortSignal): Promise<Gcp> => {
    const fd = new FormData();
    fd.append("multipartFile", file);

    const res = await BigtabletAxios.post("/gcp", fd, {
        signal,
        skipAuth: true,
        withCredentials: false,
    });

    return { data: (res.data?.data as string) ?? "" };
};