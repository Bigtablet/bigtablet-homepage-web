"use client";

import * as Sentry from "@sentry/nextjs";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import ErrorFallback from "src/shared/ui/error-fallback";

const RecruitDetailError = ({ error, reset }: { error: Error; reset: () => void }) => {
	const t = useTranslations("common");

	useEffect(() => {
		Sentry.captureException(error);
	}, [error]);

	return <ErrorFallback reset={reset} backHref="/recruit" backLabel={t("backToRecruitList")} />;
};

export default RecruitDetailError;
