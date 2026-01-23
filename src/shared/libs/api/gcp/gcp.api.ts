import BigtabletAxios from "src/shared/libs/api/axios";
import type { BaseResponse } from "src/shared/schema/response/response.schema";

/**
 * @description
 * GCP 파일 업로드 API
 * 파일을 multipart/form-data로 전송합니다.
 *
 * @param file - 업로드할 파일
 * @param signal - AbortSignal (선택)
 * @returns 업로드된 파일 URL
 *
 * @example
 * ```ts
 * const response = await postGcpUploadApi(file);
 * console.log(response.data); // "https://storage.googleapis.com/..."
 * ```
 */
export const postGcpUploadApi = async (
	file: File,
	signal?: AbortSignal,
): Promise<BaseResponse<string>> => {
	const formData = new FormData();
	formData.append("multipartFile", file);

	const res = await BigtabletAxios.post("/gcp", formData, {
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
