import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { postGcpUploadApi } from "src/api/gcp/gcp.api";
import { QueryKey } from "src/queries/queryKey";
import type { Gcp } from "src/types/gcp/gcp.type";

export const useGcpUploadMutation = (
    options?: UseMutationOptions<Gcp, Error, File>
) =>
    useMutation({
        mutationKey: [QueryKey.gcp.upload],
        mutationFn: (file) => postGcpUploadApi(file),
        ...options,
    });