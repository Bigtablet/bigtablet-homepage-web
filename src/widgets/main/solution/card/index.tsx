"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useMediaQuery } from "src/shared/hooks/use-media-query";
import styles from "./style.module.scss";

interface CardProps {
	id: number;
	src: string;
	poster?: string;
	label: string;
	onOpen: (id: number, rect: DOMRect) => void;
}

/**
 * 카드 비디오 자동재생은 데스크탑에서만. 모바일+poster 있으면 poster 이미지만 렌더 — 5개 비디오 디코딩 비용 절감.
 * 모바일이지만 poster 가 없는 edge case 는 video 렌더되며 IntersectionObserver 가 그대로 동작.
 */
const MOBILE_QUERY = "(max-width: 768px)";

const Card = ({ id, src, poster, label, onOpen }: CardProps) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const isMobile = useMediaQuery(MOBILE_QUERY);
	const openFromTarget = (el: HTMLElement) => onOpen(id, el.getBoundingClientRect());

	useEffect(() => {
		/* videoRef.current 존재 여부만으로 가드 — Image 분기에선 ref 가 null 이라 자동 skip,
		   poster 없는 mobile edge case 에선 video 렌더되어 IO 가 정상 동작. */
		const video = videoRef.current;
		if (!video) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					video.play().catch(() => {});
				} else {
					video.pause();
				}
			},
			{ threshold: 0.3 },
		);

		observer.observe(video);
		return () => observer.disconnect();
	}, []);

	return (
		<button
			type="button"
			className={styles.solution_card}
			aria-label={label}
			onClick={(e) => openFromTarget(e.currentTarget)}
		>
			{isMobile && poster ? (
				<Image
					src={poster}
					alt=""
					aria-hidden="true"
					fill
					sizes="(max-width: 768px) 50vw, 33vw"
					className={styles.solution_card_video}
				/>
			) : (
				<video
					ref={videoRef}
					className={styles.solution_card_video}
					src={src}
					poster={poster}
					muted
					playsInline
					loop
					preload="none"
				/>
			)}
			<div className={styles.solution_card_overlay} />
			<p className={styles.solution_card_title}>{label}</p>
		</button>
	);
};

export default Card;
