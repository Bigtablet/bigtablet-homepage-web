"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./style.module.scss";

interface CardProps {
	id: number;
	src: string;
	poster?: string;
	label: string;
	onOpen: (id: number, rect: DOMRect) => void;
}

/**
 * 카드 비디오 자동재생은 데스크탑에서만. 모바일은 poster 이미지만 렌더 — 5개 비디오 디코딩 비용 절감.
 * 모달 열면 모달 안에서만 비디오 재생.
 */
const MOBILE_QUERY = "(max-width: 768px)";

const Card = ({ id, src, poster, label, onOpen }: CardProps) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [isMobile, setIsMobile] = useState(false);
	const openFromTarget = (el: HTMLElement) => onOpen(id, el.getBoundingClientRect());

	useEffect(() => {
		const mq = window.matchMedia(MOBILE_QUERY);
		setIsMobile(mq.matches);
		const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
		mq.addEventListener("change", handler);
		return () => mq.removeEventListener("change", handler);
	}, []);

	useEffect(() => {
		if (isMobile) return;
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
	}, [isMobile]);

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
