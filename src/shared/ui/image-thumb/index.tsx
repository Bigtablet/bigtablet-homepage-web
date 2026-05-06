"use client";

import Image, { type ImageProps } from "next/image";
import { type ReactNode, useState } from "react";
import styles from "./style.module.scss";

type Props = Pick<ImageProps, "alt" | "sizes" | "priority"> & {
	src?: ImageProps["src"];
	/** 이미지 URL이 비었거나 로드 실패 시 보여줄 fallback 노드 */
	fallback?: ReactNode;
	className?: string;
	imgClassName?: string;
};

/**
 * @component ImageThumb
 *
 * @description
 * next/image 래퍼. 다음 3가지 상태를 일관되게 처리한다.
 *
 * 1. 로딩 중 — shimmer 애니메이션 표시
 * 2. 로드 완료 — 이미지를 자연스럽게 fade-in
 * 3. URL 없음 / 에러 — fallback 노드 또는 기본 placeholder 표시
 */
const ImageThumb = ({ src, alt, sizes, priority, fallback, className, imgClassName }: Props) => {
	const [loaded, setLoaded] = useState(false);
	const [errored, setErrored] = useState(false);

	const wrapperClass = [styles.thumb, className].filter(Boolean).join(" ");

	if (!src || errored) {
		return <div className={`${wrapperClass} ${styles.thumb_fallback}`}>{fallback ?? null}</div>;
	}

	return (
		<div className={`${wrapperClass} ${loaded ? styles.thumb_loaded : styles.thumb_loading}`}>
			<Image
				src={src}
				alt={alt}
				fill
				sizes={sizes}
				priority={priority}
				className={imgClassName}
				onLoad={() => setLoaded(true)}
				onError={() => setErrored(true)}
			/>
		</div>
	);
};

export default ImageThumb;
