"use client";

import { useEffect, useState } from "react";

/**
 * @description
 * 주어진 미디어 쿼리 매칭 여부를 반환. 변경 시 자동 업데이트.
 * SSR 안전 — 첫 렌더는 false, useEffect 에서 실제 값으로 동기화.
 *
 * @param query - CSS media query 문자열 (예: "(max-width: 768px)")
 * @returns 매칭 여부
 */
export const useMediaQuery = (query: string): boolean => {
	const [matches, setMatches] = useState(false);

	useEffect(() => {
		const mq = window.matchMedia(query);
		setMatches(mq.matches);
		const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
		mq.addEventListener("change", handler);
		return () => mq.removeEventListener("change", handler);
	}, [query]);

	return matches;
};
