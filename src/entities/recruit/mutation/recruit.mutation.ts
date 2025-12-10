"use client";

import {useMutation, type UseMutationOptions} from "@tanstack/react-query";

import type {RecruitApplyResponse} from "src/entities/recruit/model/schema/recruit.schema";
import {ApplyFormValues} from "src/features/recruit/model/apply/schema/apply.schema";
import {postRecruitApplyApi} from "src/entities/recruit/api/recruit.api";

/* 지원하기 */
export const useRecruitApplyMutation = (
    options?: UseMutationOptions<
        RecruitApplyResponse,
        Error,
        ApplyFormValues,
        unknown
    >
) =>
    useMutation({
        mutationKey: ["recruit", "apply"],
        mutationFn: (body) => postRecruitApplyApi(body),
        ...options,
    });