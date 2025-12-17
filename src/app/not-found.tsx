"use client";

import { Button } from "@bigtablet/design-system";
import { BigtabletRouter } from "src/shared/hooks/router";
import styles from "./not-found.module.scss";
import Template from "src/shared/ui/template";

/**
 * 공통 404 페이지
 * - 존재하지 않는 경로
 * - notFound() 호출 시 자동 표시
 */
const NotFoundPage = () => {
	const router = BigtabletRouter();

	const handleBack = () => {
		if (window.history.length > 1) {
			router.back();
		} else {
			router.replace("/main");
		}
	};

	return (
		<Template>
			<div className={styles.root}>
				<div className={styles.card}>
					<h1 className={styles.code}>404</h1>
					<h2 className={styles.title}>페이지를 찾을 수 없습니다</h2>
					<p className={styles.desc}>
						요청하신 페이지가 존재하지 않거나
						<br />
						잘못된 접근입니다.
					</p>

					<div className={styles.actions}>
						<Button onClick={handleBack}>이전 페이지로 이동</Button>
					</div>
				</div>
			</div>
		</Template>
	);
};

export default NotFoundPage;
