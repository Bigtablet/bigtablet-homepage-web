"use client";

import { Button } from "@bigtablet/design-system";
import styles from "./error.module.scss";
import Template from "src/shared/ui/template";

/**
 * 전역 에러 페이지
 * - 런타임 오류
 * - 서버/클라이언트 예외
 */
const GlobalError = ({ error, reset }: { error: Error; reset: () => void }) => {
	return (
		<Template>
			<section className={styles.error_root}>
				<div className={styles.error_card}>
					<h1 className={styles.error_title}>문제가 발생했습니다</h1>
					<p className={styles.error_desc}>잠시 후 다시 시도해주세요.</p>

					<div className={styles.error_actions}>
						<Button variant="primary" onClick={reset}>
							다시 시도
						</Button>
					</div>
				</div>
			</section>
		</Template>
	);
};

export default GlobalError;
