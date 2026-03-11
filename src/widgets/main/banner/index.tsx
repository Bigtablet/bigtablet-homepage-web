"use client";

import { Button } from "@bigtablet/design-system";
import { useGSAP } from "@gsap/react";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { useReducedMotion } from "src/shared/hooks/use-reduced-motion";
import { gsap } from "src/shared/libs/gsap";
import styles from "./style.module.scss";

const Banner = () => {
	const t = useTranslations("main.banner");
	const containerRef = useRef<HTMLElement>(null);
	const prefersReduced = useReducedMotion();

	useGSAP(
		() => {
			const targets = [
				`.${styles.banner_title}`,
				`.${styles.banner_description}`,
				`.${styles.banner_cta}`,
				`.${styles.banner_scroll_indicator}`,
			];

			/** reduced motion → 애니메이션 스킵, 즉시 표시 */
			if (prefersReduced) {
				for (const sel of targets) {
					gsap.set(sel, { opacity: 1, y: 0 });
				}
				return;
			}

			const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
			tl.from(`.${styles.banner_title}`, {
				opacity: 0,
				y: 30,
				duration: 0.8,
			})
				.from(
					`.${styles.banner_description}`,
					{ opacity: 0, y: 20, duration: 0.6 },
					"-=0.3",
				)
				.from(
					`.${styles.banner_cta}`,
					{ opacity: 0, y: 20, duration: 0.5 },
					"-=0.2",
				)
				.from(
					`.${styles.banner_scroll_indicator}`,
					{ opacity: 0, duration: 0.5 },
					"-=0.1",
				);
		},
		{ scope: containerRef, dependencies: [prefersReduced] },
	);

	return (
		<section
			ref={containerRef}
			className={styles.banner}
			aria-labelledby="banner_title"
		>
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
