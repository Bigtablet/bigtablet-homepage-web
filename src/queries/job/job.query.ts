import {useMutation, useQueryClient} from "@tanstack/react-query";
import {postJobApi} from "src/api/job/job.api";
import {QueryKey} from "src/queries/queryKey";
import type {PostJobPayload} from "src/types/job/job.type";

export const usePostJobQuery = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationKey: [QueryKey.job.post],
        mutationFn: (payload: PostJobPayload) => postJobApi(payload),
        onSuccess: () => {
            qc.invalidateQueries({queryKey: [QueryKey.job.list]});
        },
    });
};