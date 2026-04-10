"use client";

import { Button } from "@bigtablet/design-system";
import { BigtabletRouter } from "src/shared/hooks/next";
import Template from "src/shared/ui/template";
import styles from "./not-found.module.scss";

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

	const handleHome = () => router.replace("/main");

	return (
		<Template align="center">
			<section className={styles.root}>
				<p className={styles.code}>404</p>
				<h1 className={styles.title}>페이지를 찾을 수 없습니다</h1>
				<p className={styles.desc}>
					요청하신 페이지가 존재하지 않거나
					<br />
					잘못된 접근입니다.
				</p>

				<div className={styles.actions}>
					<Button variant="filled" onClick={handleHome}>
						홈으로 이동
					</Button>
					<Button variant="tonal" onClick={handleBack}>
						이전 페이지
					</Button>
				</div>
			</section>
		</Template>
	);
};

export default NotFoundPage;
