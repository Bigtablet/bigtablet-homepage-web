"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import ErrorFallback from "src/shared/ui/error-fallback";

const RecruitDetailError = ({ error, reset }: { error: Error; reset: () => void }) => {
	useEffect(() => {
		Sentry.captureException(error);
	}, [error]);

	return <ErrorFallback reset={reset} backHref="/recruit" backLabel="채용 목록으로 돌아가기" />;
};

export default RecruitDetailError;
