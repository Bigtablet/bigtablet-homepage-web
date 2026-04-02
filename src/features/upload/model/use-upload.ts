"use client";

import { useUploadMutation } from "src/features/upload/mutation/upload.mutation";
import { validateFile } from "src/shared/libs/file/validate";

/**
 * @description
 * 파일 업로드 훅
 * GCP 업로드 mutation을 래핑하여 URL만 반환합니다.
 * 업로드 전 파일 크기(50MB) 및 타입 검증을 수행합니다.
 */
export const useUpload = () => {
	const mutation = useUploadMutation();

	const upload = async (file: File): Promise<string> => {
		const validation = validateFile(file);
		if (!validation.valid) {
			throw new Error(validation.error ?? "파일 검증에 실패했습니다.");
		}

		const response = await mutation.mutateAsync(file);
		return response.data ?? "";
	};

	return { upload, ...mutation };
};
