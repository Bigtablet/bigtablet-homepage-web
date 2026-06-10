"use client";

import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { postRecruitApplyApi } from "src/entities/recruit/api/recruit.api";
import type {
	RecruitApplyResponse,
	RecruitRequest,
} from "src/entities/recruit/schema/recruit.schema";

/**
 * @description Apply for recruit position
 * @param options Optional mutation configuration
 */
export const useRecruitApplyMutation = (
	options?: UseMutationOptions<RecruitApplyResponse, Error, RecruitRequest, unknown>,
) => {
	return useMutation({
		mutationKey: ["recruit", "apply"] as const,
		mutationFn: (body) => postRecruitApplyApi(body),
		...options,
	});
};
