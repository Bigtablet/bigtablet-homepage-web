"use client";

import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { patchBlogViewApi } from "src/entities/blog/api/blog.api";
import type { BlogOkResponse } from "src/entities/blog/schema/blog.schema";

/**
 * @description Increment blog view count
 * @param options Optional mutation configuration
 */
export const useBlogViewMutation = (
	options?: UseMutationOptions<BlogOkResponse, Error, number>,
) => {
	return useMutation({
		mutationKey: ["blog", "views"] as const,
		mutationFn: (idx) => patchBlogViewApi(idx),
		...options,
	});
};
