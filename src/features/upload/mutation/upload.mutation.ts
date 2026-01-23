"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { postGcpUploadApi } from "src/shared/libs/api/gcp/gcp.api";
import type { BaseResponse } from "src/shared/schema/response/response.schema";
import { uploadMutationKeys } from "./keys";

/**
 * @description
 * GCP 파일 업로드 Mutation
 * File -> 업로드 API -> { status, message, data: "https://..." }
 */
export const useUploadMutation = (
	options?: UseMutationOptions<BaseResponse<string>, Error, File>,
) =>
	useMutation({
		mutationKey: uploadMutationKeys.gcp(),
		mutationFn: (file) => postGcpUploadApi(file),
		...options,
	});
