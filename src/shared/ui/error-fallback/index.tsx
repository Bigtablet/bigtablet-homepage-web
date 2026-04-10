"use client";

import { Button } from "@bigtablet/design-system";
import { BigtabletLink } from "src/shared/hooks/next";
import styles from "./style.module.scss";

interface ErrorFallbackProps {
	/** error.tsx에서 전달되는 reset 함수 */
	reset: () => void;
	/** 목록 페이지로 돌아가기 링크 */
	backHref?: string;
	/** 돌아가기 버튼 텍스트 */
	backLabel?: string;
}

/** 세그먼트 에러 바운더리 공용 UI */
const ErrorFallback = ({
	reset,
	backHref,
	backLabel = "목록으로 돌아가기",
}: ErrorFallbackProps) => {
	return (
		<div className={styles.error_fallback} role="alert">
			<h2 className={styles.error_fallback_title}>문제가 발생했습니다</h2>
			<p className={styles.error_fallback_desc}>
				페이지를 불러오는 중 오류가 발생했습니다.
				<br />
				잠시 후 다시 시도해 주세요.
			</p>

			<div className={styles.error_fallback_actions}>
				<Button variant="filled" onClick={() => reset()}>
					다시 시도
				</Button>

				{backHref && (
					<BigtabletLink href={backHref} className={styles.error_fallback_back}>
						{backLabel}
					</BigtabletLink>
				)}
			</div>
		</div>
	);
};

export default ErrorFallback;
