"use client";

import { useUploadMutation } from "src/features/upload/mutation/upload.mutation";

/**
 * @description
 * 파일 업로드 훅
 * GCP 업로드 mutation을 래핑하여 URL만 반환합니다.
 */
export const useUpload = () => {
	const mutation = useUploadMutation();

	const upload = async (file: File): Promise<string> => {
		const res = await mutation.mutateAsync(file);
		return res.data ?? "";
	};

	return { upload, ...mutation };
};
