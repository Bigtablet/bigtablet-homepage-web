"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useNavigationStore } from "src/shared/hooks/next/navigation";

const DEFAULT_THROTTLE_MS = 300;

/**
 * @description
 * 라우팅 동작을 throttle 처리한 라우터 훅입니다.
 *
 * @returns throttle이 적용된 router 메서드
 */
export const BigtabletRouter = () => {
	const router = useRouter();
	const { setLoading } = useNavigationStore();
	const lastCallRef = useRef(0);

	const runWithThrottle = (
		callback: () => void,
		throttleMs = DEFAULT_THROTTLE_MS,
	) => {
		const now = Date.now();
		if (now - lastCallRef.current < throttleMs) return;
		lastCallRef.current = now;
		callback();
	};

	const push = (href: string, throttleMs = DEFAULT_THROTTLE_MS) => {
		runWithThrottle(() => {
			setLoading(true);
			router.push(href);
		}, throttleMs);
	};

	const replace = (href: string, throttleMs = DEFAULT_THROTTLE_MS) => {
		runWithThrottle(() => {
			setLoading(true);
			router.replace(href);
		}, throttleMs);
	};

	const back = (throttleMs = DEFAULT_THROTTLE_MS) => {
		runWithThrottle(() => {
			setLoading(true);
			router.back();
		}, throttleMs);
	};

	const refresh = (throttleMs = DEFAULT_THROTTLE_MS) => {
		runWithThrottle(() => {
			setLoading(true);
			router.refresh();
		}, throttleMs);
	};

	return { push, replace, back, refresh };
};
