import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PostTalentApi } from "../api/talent.api";
import { talentMutationKeys } from "./keys";

export const useTalentMutation = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationKey: talentMutationKeys.create(),
        mutationFn: PostTalentApi,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: talentMutationKeys.list() });
        },
    });
};