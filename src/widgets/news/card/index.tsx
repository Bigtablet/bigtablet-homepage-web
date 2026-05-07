"use client";

import { useMemo } from "react";
import { formatDate } from "src/shared/libs/ui/date";
import ImageThumb from "src/shared/ui/image-thumb";
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
	const time = useMemo(() => formatDate(createdAt, locale), [createdAt, locale]);

	const imageSrc = useMemo(() => {
		const trimmed = thumbnailImageUrl?.trim();
		if (!trimmed) return null;
		return encodeURI(trimmed);
	}, [thumbnailImageUrl]);

	return (
		<a className={styles.news_card} href={url} target="_blank" rel="noreferrer">
			<ImageThumb
				className={styles.news_card_thumb}
				imgClassName={styles.news_card_img}
				src={imageSrc ?? undefined}
				alt={title}
				sizes="(max-width: 768px) 100vw, 33vw"
				priority={priority}
			/>

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
