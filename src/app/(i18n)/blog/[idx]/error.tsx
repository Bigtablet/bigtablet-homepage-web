"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import ErrorFallback from "src/shared/ui/error-fallback";

const BlogDetailError = ({
	error,
	reset,
}: {
	error: Error;
	reset: () => void;
}) => {
	useEffect(() => {
		Sentry.captureException(error);
	}, [error]);

	return (
		<ErrorFallback
			reset={reset}
			backHref="/blog"
			backLabel="블로그 목록으로 돌아가기"
		/>
	);
};

export default BlogDetailError;
