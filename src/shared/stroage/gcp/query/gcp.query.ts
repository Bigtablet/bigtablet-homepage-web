import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { postGcpUploadApi } from "src/shared/stroage/gcp/api/gcp.api";
import { Keys } from "src/shared/stroage/gcp/query/keys";
import type { Gcp } from "src/shared/stroage/gcp/type/gcp.type";

export const useGcpUploadMutation = (
    options?: UseMutationOptions<Gcp, Error, File>
) =>
    useMutation({
        mutationKey: [Keys.gcp.upload],
        mutationFn: (file) => postGcpUploadApi(file),
        ...options,
    });