"use client";

import { useEffect, useRef, useState } from "react";

/**
 * @hook useReveal
 *
 * @description
 * 뷰포트 진입을 IntersectionObserver 로 1회 감지해 visible=true 를 반환한다.
 * Problem 섹션의 fade-up 스크롤 리빌 패턴을 재사용 가능하게 추출 — GSAP 의존성 없음.
 * 반환한 ref 를 리빌 대상 섹션에 부여하고, visible 로 is_visible 클래스를 토글한다.
 */
export const useReveal = <T extends HTMLElement>(threshold = 0.15) => {
	const ref = useRef<T | null>(null);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const node = ref.current;
		if (!node) return;
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setVisible(true);
						observer.disconnect();
						break;
					}
				}
			},
			{ threshold },
		);
		observer.observe(node);
		return () => observer.disconnect();
	}, [threshold]);

	return { ref, visible };
};
