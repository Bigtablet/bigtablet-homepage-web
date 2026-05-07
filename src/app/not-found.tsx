"use client";

import { Button } from "@bigtablet/design-system";
import { useTranslations } from "next-intl";
import { BigtabletRouter } from "src/shared/hooks/next";
import Template from "src/shared/ui/template";
import styles from "./not-found.module.scss";

/**
 * 공통 404 페이지
 * - 존재하지 않는 경로
 * - notFound() 호출 시 자동 표시
 */
const NotFoundPage = () => {
	const t = useTranslations("error");
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
				<p className={styles.code}>{t("notFoundCode")}</p>
				<h1 className={styles.title}>{t("notFoundTitle")}</h1>
				<p className={styles.desc}>{t("notFoundDescription")}</p>

				<div className={styles.actions}>
					<Button variant="primary" onClick={handleHome}>
						{t("goHome")}
					</Button>
					<Button variant="secondary" onClick={handleBack}>
						{t("goBack")}
					</Button>
				</div>
			</section>
		</Template>
	);
};

export default NotFoundPage;
