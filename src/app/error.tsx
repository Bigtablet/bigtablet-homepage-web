"use client";

import { Button } from "@bigtablet/design-system";
import * as Sentry from "@sentry/nextjs";
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
		? `${cooldown}초 후 재시도`
		: isMaxRetry
			? "재시도 불가"
			: "다시 시도";

	return (
		<Template align="center">
			<section className={styles.error_root}>
				<p className={styles.error_emoji}>!</p>
				<h1 className={styles.error_title}>문제가 발생했습니다</h1>
				<p className={styles.error_desc}>
					일시적인 오류가 발생했습니다.
					<br />
					잠시 후 다시 시도해주세요.
				</p>

				{!isMaxRetry && retryCount > 0 && (
					<p className={styles.error_retry_count}>
						재시도 {retryCount}/{MAX_RETRY}
					</p>
				)}

				{isMaxRetry && (
					<p className={styles.error_max}>
						재시도 횟수를 초과했습니다.
						<br />
						문제가 지속되면 관리자에게 문의해주세요.
					</p>
				)}

				<div className={styles.error_actions}>
					<Button variant="primary" onClick={handleRetry} disabled={isCooling || isMaxRetry}>
						{retryLabel}
					</Button>
					<Button variant="secondary" onClick={handleHome}>
						홈으로 이동
					</Button>
				</div>
			</section>
		</Template>
	);
};

export default GlobalError;
