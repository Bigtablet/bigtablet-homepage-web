"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import ErrorFallback from "src/shared/ui/error-fallback";

const MemberDetailError = ({ error, reset }: { error: Error; reset: () => void }) => {
	useEffect(() => {
		Sentry.captureException(error);
	}, [error]);

	return <ErrorFallback reset={reset} backHref="/about" backLabel="팀 소개로 돌아가기" />;
};

export default MemberDetailError;
