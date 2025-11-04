import BigtabletAxios from "src/shared/libs/api/axios";
import type { Gcp } from "src/shared/stroage/gcp/type/gcp.type";

export const postGcpUploadApi = async (file: File, signal?: AbortSignal): Promise<Gcp> => {
    const fd = new FormData();
    fd.append("multipartFile", file);

    const res = await BigtabletAxios.post("/gcp", fd, {
        signal,
        withCredentials: false,
    });

    return { data: (res.data?.data as string) ?? "" };
};