"use client";

import { Button } from "@bigtablet/design-system";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import styles from "./style.module.scss";

/**
 * @component Banner
 *
 * @description
 * 메인 페이지 상단 히어로 배너 섹션.
 * CSS keyframe 애니메이션으로 텍스트 등장 (GSAP 의존성 제거).
 * prefers-reduced-motion 자동 대응 (CSS media query).
 */
const Banner = () => {
	const t = useTranslations("main.banner");

	return (
		<section className={styles.banner} aria-labelledby="banner_title">
			<div className={styles.banner_video}>
				<video
					className={styles.banner_video_tag}
					src="/media/6122c823-e40e-4d29-8855-4a64f0c7d881"
					autoPlay
					loop
					muted
					playsInline
					preload="metadata"
				/>
				<div className={styles.banner_overlay} />
			</div>

			<div className={styles.banner_content}>
				<h1 id="banner_title" className={styles.banner_title}>
					{t("title")}
				</h1>
				<p className={styles.banner_description}>{t("description")}</p>

				<a
					className={styles.banner_cta}
					href="https://docs.google.com/forms/d/e/1FAIpQLSd0on7yADoLSWYFN0it0LtCii7ov1yLwIpM91lR66vtHtaEuQ/viewform"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Button variant="primary" size="lg">
						{t("button")}
					</Button>
				</a>
			</div>

			<div className={styles.banner_scroll_indicator} aria-hidden="true">
				<ChevronDown size={20} />
			</div>
		</section>
	);
};

export default Banner;
