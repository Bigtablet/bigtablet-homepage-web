"use client";

import { Button } from "@bigtablet/design-system";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import styles from "./style.module.scss";

const VIDEO_SRC = "/media/6122c823-e40e-4d29-8855-4a64f0c7d881";
const POSTER_SRC = "/images/banner-poster.webp";
const VIDEO_DEFER_FALLBACK_MS = 500;

/**
 * @component Banner
 *
 * @description
 * 메인 페이지 상단 히어로 배너.
 * LCP 최적화 — 포스터를 next/image priority 로 즉시 렌더, 동영상은 hydration 이후 idle 시점에 src 부여.
 * 동영상 file fetch 가 LCP/페이로드를 막지 않도록 deferred load 전략.
 */
const Banner = () => {
	const t = useTranslations("main.banner");
	const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

	useEffect(() => {
		/* hydration 이후 idle 시점에 비디오 fetch 시작. requestIdleCallback 미지원 환경은 setTimeout fallback. */
		const ric = (window as Window & { requestIdleCallback?: (cb: () => void) => number })
			.requestIdleCallback;
		const cic = (window as Window & { cancelIdleCallback?: (id: number) => void })
			.cancelIdleCallback;

		if (ric && cic) {
			const id = ric(() => setShouldLoadVideo(true));
			return () => cic(id);
		}
		const timer = setTimeout(() => setShouldLoadVideo(true), VIDEO_DEFER_FALLBACK_MS);
		return () => clearTimeout(timer);
	}, []);

	return (
		<section className={styles.banner} aria-labelledby="banner_title">
			<div className={styles.banner_video}>
				{/* poster — LCP candidate, next/image priority 로 즉시 렌더 */}
				<Image
					src={POSTER_SRC}
					alt=""
					fill
					priority
					sizes="100vw"
					className={styles.banner_poster}
				/>
				<video
					className={styles.banner_video_tag}
					poster={POSTER_SRC}
					autoPlay
					loop
					muted
					playsInline
					preload="none"
					/* 일정 시점 이후에만 src 부여 — 그 전엔 비디오 fetch 안 일어남 */
					{...(shouldLoadVideo ? { src: VIDEO_SRC } : {})}
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
