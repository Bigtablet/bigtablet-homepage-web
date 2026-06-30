"use client";

import { Button } from "@bigtablet/design-system";
import { useTranslations } from "next-intl";
import { useReveal } from "src/shared/hooks/use-reveal";
import BgFx from "src/shared/ui/bg-fx";
import styles from "./style.module.scss";

/**
 * @component Cta
 *
 * @description
 * 클로징 CTA — "기존 카메라로, 지금 시작하세요". 다크 그라운드 위 BgFx(capture, YOLO) 배경.
 * 버튼은 mailto:biz@bigtablet.com.
 */
const Cta = () => {
	const t = useTranslations("main.cta");
	const { ref, visible } = useReveal<HTMLElement>();
	const mailto = `mailto:${t("email")}`;

	return (
		<section
			ref={ref}
			id="contact"
			className={`${styles.cta} ${visible ? styles.is_visible : ""}`}
			aria-labelledby="cta_title"
		>
			<BgFx variant="capture" opacity={0.85} />

			<div className={styles.cta_inner}>
				<h2 id="cta_title" className={styles.cta_title}>
					{t("title")}
				</h2>
				<p className={styles.cta_description}>{t("description")}</p>

				<div className={styles.cta_actions}>
					<a href={mailto}>
						<Button variant="filled" size="lg">
							{t("button")}
						</Button>
					</a>
					<a className={styles.cta_email} href={mailto}>
						{t("email")}
					</a>
				</div>
			</div>
		</section>
	);
};

export default Cta;
