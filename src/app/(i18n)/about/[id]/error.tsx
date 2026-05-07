"use client";

import * as Sentry from "@sentry/nextjs";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import ErrorFallback from "src/shared/ui/error-fallback";

const MemberDetailError = ({ error, reset }: { error: Error; reset: () => void }) => {
	const t = useTranslations("common");

	useEffect(() => {
		Sentry.captureException(error);
	}, [error]);

	return <ErrorFallback reset={reset} backHref="/about" backLabel={t("backToAboutTeam")} />;
};

export default MemberDetailError;
