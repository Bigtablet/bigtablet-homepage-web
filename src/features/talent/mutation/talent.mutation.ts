"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PostTalentApi } from "src/entities/talent/api/talent.api";

/**
 * @description Create new talent profile
 * Invalidates talent list cache on success
 */
export const useTalentMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["talent", "create"] as const,
		mutationFn: PostTalentApi,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["talent", "list"] as const });
		},
	});
};
