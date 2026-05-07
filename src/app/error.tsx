"use client";

import { Button } from "@bigtablet/design-system";
import * as Sentry from "@sentry/nextjs";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import Template from "src/shared/ui/template";
import styles from "./error.module.scss";

const MAX_RETRY = 3;
const COOLDOWN_SEC = 3;

/**
 * 전역 에러 페이지
 * - 재시도 쿨다운 (3초) + 최대 3회 제한
 * - router 훅은 에러 바운더리에서 불안정하므로 window.location 사용
 */
const GlobalError = ({ error: _error, reset }: { error: Error; reset: () => void }) => {
	const t = useTranslations("error");
	const [retryCount, setRetryCount] = useState(0);
	const [cooldown, setCooldown] = useState(0);
	const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);

	const isMaxRetry = retryCount >= MAX_RETRY;
	const isCooling = cooldown > 0;

	useEffect(() => {
		Sentry.captureException(_error);
	}, [_error]);

	useEffect(() => {
		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, []);

	const handleRetry = useCallback(() => {
		if (isCooling || isMaxRetry) return;

		setRetryCount((previous) => previous + 1);
		setCooldown(COOLDOWN_SEC);

		timerRef.current = setInterval(() => {
			setCooldown((previous) => {
				if (previous <= 1) {
					clearInterval(timerRef.current);
					return 0;
				}
				return previous - 1;
			});
		}, 1000);

		reset();
	}, [isCooling, isMaxRetry, reset]);

	const handleHome = () => {
		window.location.href = "/main";
	};

	const retryLabel = isCooling
		? t("retryCooldown", { seconds: cooldown })
		: isMaxRetry
			? t("retryDisabled")
			: t("retry");

	return (
		<Template align="center">
			<section className={styles.error_root}>
				<p className={styles.error_emoji}>!</p>
				<h1 className={styles.error_title}>{t("title")}</h1>
				<p className={styles.error_desc}>{t("globalDescription")}</p>

				{!isMaxRetry && retryCount > 0 && (
					<p className={styles.error_retry_count}>
						{t("retryProgress", { current: retryCount, max: MAX_RETRY })}
					</p>
				)}

				{isMaxRetry && <p className={styles.error_max}>{t("retryExceeded")}</p>}

				<div className={styles.error_actions}>
					<Button variant="primary" onClick={handleRetry} disabled={isCooling || isMaxRetry}>
						{retryLabel}
					</Button>
					<Button variant="secondary" onClick={handleHome}>
						{t("goHome")}
					</Button>
				</div>
			</section>
		</Template>
	);
};

export default GlobalError;
