"use client";

import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";
import styles from "./style.module.scss";

type Props = {
	href?: string;
	label: string;
};

/**
 * @description
 * 이전 페이지로 돌아가는 링크. 히스토리가 있으면 router.back(), 없으면 href로 push.
 *
 * anchor 태그 + onClick.preventDefault 패턴 — RouteLoading의 anchor click 감지가
 * 작동해 navigation 시작 즉시 top loading bar가 켜지고 pathname effect로 자연스럽게 꺼진다.
 * (이전엔 button이었어서 popstate 우회 경로로만 들어가고 fallback timeout까지 걸쳐 있었음)
 */
const BackLink = ({ href, label }: Props) => {
	const router = useRouter();

	const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault();
		const hasHistory = typeof window !== "undefined" && window.history.length > 1;
		if (hasHistory) {
			router.back();
		} else if (href) {
			router.push(href);
		}
	};

	return (
		<a className={styles.back_link} href={href ?? "#"} onClick={handleClick}>
			<span aria-hidden="true">←</span> {label}
		</a>
	);
};

export default BackLink;
