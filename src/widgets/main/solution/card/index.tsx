"use client";

import styles from "./style.module.scss";

interface CardProps {
	id: number;
	src: string;
	poster?: string;
	label: string;
	onOpen: (id: number, rect: DOMRect) => void;
}

const Card = ({ id, src, poster, label, onOpen }: CardProps) => {
	const openFromTarget = (el: HTMLElement) => onOpen(id, el.getBoundingClientRect());

	return (
		<button
			type="button"
			className={styles.solution_card}
			aria-label={label}
			onClick={(e) => openFromTarget(e.currentTarget)}
		>
			<video
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
