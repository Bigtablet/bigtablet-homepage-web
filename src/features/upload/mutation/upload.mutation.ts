"use client";

import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { postGcpUploadApi } from "src/shared/libs/api/gcp/gcp.api";
import type { BaseResponse } from "src/shared/schema/response/response.schema";

/**
 * @description Upload file to GCP Cloud Storage
 * Transforms File input to uploaded URL in response data
 * @param options Optional mutation configuration
 */
export const useUploadMutation = (
	options?: UseMutationOptions<BaseResponse<string>, Error, File>,
) => {
	return useMutation({
		mutationKey: ["upload", "gcp"] as const,
		mutationFn: (file) => postGcpUploadApi(file),
		...options,
	});
};
