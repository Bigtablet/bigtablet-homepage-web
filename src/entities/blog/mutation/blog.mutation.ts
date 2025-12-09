"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { patchBlogViewApi } from "src/entities/blog/api/blog.api";
import type { BlogOkResponse } from "src/entities/blog/model/schema/blog.schema";
import { blogMutationKey } from "./key";

/** 조회수 증가 */
export const useBlogViewMutation = (
    options?: UseMutationOptions<BlogOkResponse, Error, number>
) =>
    useMutation({
        mutationKey: blogMutationKey.views,
        mutationFn: (idx) => patchBlogViewApi(idx),
        ...options,
    });