"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { RecruitApplyResponse } from "src/entities/recruit/model/schema/recruit.schema";
import type { ApplyFormValues } from "src/features/recruit/apply/form/model/schema/apply.schema";
import { postRecruitApplyApi } from "src/entities/recruit/api/recruit.api";
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
