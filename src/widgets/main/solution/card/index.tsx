"use client";

import { useEffect, useRef } from "react";
import styles from "./style.module.scss";

interface CardProps {
	id: number;
	src: string;
	poster?: string;
	label: string;
	onOpen: (id: number, rect: DOMRect) => void;
}

const Card = ({ id, src, poster, label, onOpen }: CardProps) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const openFromTarget = (el: HTMLElement) => onOpen(id, el.getBoundingClientRect());

	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					video.play();
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
			<div className={styles.solution_card_overlay} />
			<p className={styles.solution_card_title}>{label}</p>
		</button>
	);
};

export default Card;
