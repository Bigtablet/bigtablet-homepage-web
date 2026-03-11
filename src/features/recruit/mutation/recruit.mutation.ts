"use client";

import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { postRecruitApplyApi } from "src/entities/recruit/api/recruit.api";
import type { RecruitApplyResponse } from "src/entities/recruit/schema/recruit.schema";
import type { ApplyFormValues } from "src/features/recruit/apply/form/model/apply.schema";
import { recruitMutationKeys } from "./keys";

/** 지원하기 */
export const useRecruitApplyMutation = (
	options?: UseMutationOptions<
		RecruitApplyResponse,
		Error,
		ApplyFormValues,
		unknown
	>,
) =>
	useMutation({
		mutationKey: recruitMutationKeys.apply(),
		mutationFn: (body) => postRecruitApplyApi(body),
		...options,
	});
