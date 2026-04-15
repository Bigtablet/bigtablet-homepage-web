"use client";

import { TopLoading } from "@bigtablet/design-system";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

/** 로딩 안전장치 타임아웃 (ms) */
const LOADING_TIMEOUT = 5000;

/** 로딩바 표시 지연 — 즉시 전환 시 깜빡임 방지 (ms) */
const SHOW_DELAY = 120;

/**
 * @description
 * Next.js 라우트 전환 시 상단에 로딩 바를 표시하는 컴포넌트입니다.
 * Link 클릭 이벤트를 감지하여 로딩을 시작하고, pathname 변경 시 종료합니다.
 */
const RouteLoading = () => {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [isLoading, setIsLoading] = useState(false);
	const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const cancelShowTimer = useCallback(() => {
		if (showTimerRef.current) {
			clearTimeout(showTimerRef.current);
			showTimerRef.current = null;
		}
	}, []);

	const handleStart = useCallback(() => {
		cancelShowTimer();
		showTimerRef.current = setTimeout(() => {
			setIsLoading(true);
			showTimerRef.current = null;
		}, SHOW_DELAY);
	}, [cancelShowTimer]);

	useEffect(() => {
		void pathname;
		void searchParams;
		cancelShowTimer();
		setIsLoading(false);
	}, [pathname, searchParams, cancelShowTimer]);

	/**
	 * 안전장치: bfcache 복원 등으로 pathname effect가 재실행되지 않는 경우
	 * 일정 시간 후 로딩을 강제 해제합니다.
	 */
	useEffect(() => {
		if (!isLoading) return;
		const timer = setTimeout(() => setIsLoading(false), LOADING_TIMEOUT);
		return () => clearTimeout(timer);
	}, [isLoading]);

	// Link 클릭 감지
	useEffect(() => {
		const handleClick = (event: MouseEvent) => {
			const target = event.target as HTMLElement;
			const anchor = target.closest("a");

			if (!anchor) return;

			const href = anchor.getAttribute("href");
			if (!href) return;

			// 외부 링크, 앵커, mailto 등 제외
			if (
				href.startsWith("http") ||
				href.startsWith("#") ||
				href.startsWith("mailto:") ||
				href.startsWith("tel:") ||
				anchor.target === "_blank"
			) {
				return;
			}

			// 현재 경로와 같으면 무시
			const currentPath =
				pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
			if (href === currentPath || href === pathname) {
				return;
			}

			handleStart();
		};

		document.addEventListener("click", handleClick);
		return () => document.removeEventListener("click", handleClick);
	}, [pathname, searchParams, handleStart]);

	return <TopLoading isLoading={isLoading} />;
};

export default RouteLoading;
