"use client";

import { TopLoading } from "@bigtablet/design-system";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

/** 로딩 안전장치 타임아웃 (ms) — pathname effect가 끝까지 안 발동하는 케이스 fallback */
const LOADING_TIMEOUT = 1500;

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

	const clearLoading = useCallback(() => {
		cancelShowTimer();
		setIsLoading(false);
	}, [cancelShowTimer]);

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
		clearLoading();
	}, [pathname, searchParams, clearLoading]);

	/**
	 * bfcache(뒤로/앞으로가기 복원) 케이스: 복원 시 pathname effect가 재실행되지
	 * 않아 로딩바가 fallback(LOADING_TIMEOUT)까지 떠 있었음. pageshow.persisted로
	 * 복원을 즉시 감지해 로딩을 해제한다.
	 */
	useEffect(() => {
		const handlePageShow = (event: PageTransitionEvent) => {
			if (event.persisted) clearLoading();
		};
		window.addEventListener("pageshow", handlePageShow);
		return () => window.removeEventListener("pageshow", handlePageShow);
	}, [clearLoading]);

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

	// 뒤로가기/앞으로가기 감지
	useEffect(() => {
		const handlePopState = () => handleStart();
		window.addEventListener("popstate", handlePopState);
		return () => window.removeEventListener("popstate", handlePopState);
	}, [handleStart]);

	return <TopLoading isLoading={isLoading} />;
};

export default RouteLoading;
