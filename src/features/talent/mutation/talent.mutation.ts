"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PostTalentApi } from "src/entities/talent/api/talent.api";
import { talentMutationKeys } from "./keys";

export const useTalentMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: talentMutationKeys.create(),
		mutationFn: PostTalentApi,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: talentMutationKeys.list() });
		},
	});
};
