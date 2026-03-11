"use client";

import Image from "next/image";
import { useMemo } from "react";
import { formatRelative } from "src/shared/libs/ui/date";
import styles from "./style.module.scss";

interface NewsCardProps {
	title: string;
	url: string;
	createdAt: string;
	locale: string;
	thumbnailImageUrl: string;
	source?: string;
	priority?: boolean;
}

const NewsCard = ({
	title,
	url,
	createdAt,
	locale,
	thumbnailImageUrl,
	source,
	priority = false,
}: NewsCardProps) => {
	const time = useMemo(
		() => formatRelative(createdAt, locale),
		[createdAt, locale],
	);

	const imageSrc = useMemo(() => {
		const trimmed = thumbnailImageUrl?.trim();
		if (!trimmed) return null;
		return encodeURI(trimmed);
	}, [thumbnailImageUrl]);

	return (
		<a className={styles.news_card} href={url} target="_blank" rel="noreferrer">
			<div className={styles.news_card_thumb}>
				{imageSrc ? (
					<Image
						className={styles.news_card_img}
						src={imageSrc}
						alt=""
						fill
						sizes="(max-width: 768px) 100vw, 33vw"
						priority={priority}
					/>
				) : null}
			</div>

			<div className={styles.news_card_meta}>
				<span className={styles.news_card_time}>{time}</span>
				{source && <span className={styles.news_card_dot}>·</span>}
				{source && <span className={styles.news_card_source}>{source}</span>}
			</div>

			<span className={styles.news_card_title}>{title}</span>
		</a>
	);
};

export default NewsCard;
