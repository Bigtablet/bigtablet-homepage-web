import BigtabletAxios from "src/shared/libs/api/axios";
import type { BaseResponse } from "src/shared/schema/response/response.schema";

/**
 * @description
 * GCP 파일 업로드 API
 * 파일을 multipart/form-data로 전송합니다.
 * 응답 예시:
 * {
 *   "status": 201,
 *   "message": "업로드 성공",
 *   "data": "https://storage.googleapis.com/bigtablet-homepage/abc123..."
 * }
 */
export const postGcpUploadApi = async (
    file: File,
    signal?: AbortSignal
): Promise<BaseResponse<string>> => {
    const fd = new FormData();
    fd.append("multipartFile", file);

    const res = await BigtabletAxios.post("/gcp", fd, {
        signal,
        withCredentials: false,
        headers: { "Content-Type": "multipart/form-data" },
    });

    return {
        status: res.data?.status ?? 0,
        message: res.data?.message ?? "",
        data: res.data?.data ?? "",
    };
};