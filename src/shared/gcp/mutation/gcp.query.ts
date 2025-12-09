import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { postGcpUploadApi } from "src/shared/gcp/api/gcp.api";
import { Keys } from "src/shared/gcp/mutation/keys";
import type { BaseResponse } from "src/shared/schema/response/response.schema";

/**
 * @description
 * GCP 파일 업로드 Mutation
 * File → 업로드 API → { status, message, data: "https://..." }
 */
export const useGcpUploadMutation = (
    options?: UseMutationOptions<BaseResponse<string>, Error, File>
) =>
    useMutation({
        mutationKey: [Keys.gcp.upload],
        mutationFn: (file) => postGcpUploadApi(file),
        ...options,
    });