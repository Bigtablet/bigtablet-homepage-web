"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { TopLoading } from "@bigtablet/design-system";

/**
 * @description
 * Next.js 라우트 전환 시 상단에 로딩 바를 표시하는 컴포넌트입니다.
 * Link 클릭 이벤트를 감지하여 로딩을 시작하고, pathname 변경 시 종료합니다.
 */
const RouteLoading = () => {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [isLoading, setIsLoading] = useState(false);

	const handleStart = useCallback(() => {
		setIsLoading(true);
	}, []);

	// pathname/searchParams 변경 시 로딩 종료
	useEffect(() => {
		setIsLoading(false);
	}, [pathname, searchParams]);

	// Link 클릭 감지
	useEffect(() => {
		const handleClick = (e: MouseEvent) => {
			const target = e.target as HTMLElement;
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
			const currentPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
			if (href === currentPath || href === pathname) {
				return;
			}

			handleStart();
		};

		document.addEventListener("click", handleClick);
		return () => document.removeEventListener("click", handleClick);
	}, [pathname, searchParams, handleStart]);

	// 브라우저 뒤로가기/앞으로가기 감지
	useEffect(() => {
		const handlePopState = () => {
			handleStart();
		};

		window.addEventListener("popstate", handlePopState);
		return () => window.removeEventListener("popstate", handlePopState);
	}, [handleStart]);

	return <TopLoading isLoading={isLoading} />;
};

export default RouteLoading;
