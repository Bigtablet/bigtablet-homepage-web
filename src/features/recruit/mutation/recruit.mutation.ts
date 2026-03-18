"use client";

import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { postRecruitApplyApi } from "src/entities/recruit/api/recruit.api";
import type { RecruitApplyResponse } from "src/entities/recruit/schema/recruit.schema";
import type { ApplyFormValues } from "src/features/recruit/apply/form/model/apply.schema";

/**
 * @description Apply for recruit position
 * @param options Optional mutation configuration
 */
export const useRecruitApplyMutation = (
	options?: UseMutationOptions<
		RecruitApplyResponse,
		Error,
		ApplyFormValues,
		unknown
	>,
) => {
	return useMutation({
		mutationKey: ["recruit", "apply"] as const,
		mutationFn: (body) => postRecruitApplyApi(body),
		...options,
	});
};
