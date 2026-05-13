"use client";

import { useEffect, useState } from "react";
import CookieConsent from "src/features/cookie-consent/ui";

/**
 * @description
 * CookieConsent 의 mount 자체를 idle 시점까지 미루는 wrapper.
 * 첫 LCP/TBT 측정 윈도우 안에서 CookieConsent 의 hydration + DOM 작업이 안 일어나도록 분리.
 * 부모(Providers)에서 이미 dynamic(ssr:false) 로 코드 청크가 분리됨 — 여기선 평범한 import.
 * ric 에 2000ms timeout 부여 → 메인 스레드가 계속 바빠도 동의 배너가 영구히 안 보이는 일 방지.
 */
const IDLE_TIMEOUT_MS = 2000;
const FALLBACK_DELAY_MS = 500;

const DeferredCookieConsent = () => {
	const [shouldMount, setShouldMount] = useState(false);

	useEffect(() => {
		const ric = (
			window as Window & {
				requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
			}
		).requestIdleCallback;
		const cic = (window as Window & { cancelIdleCallback?: (id: number) => void })
			.cancelIdleCallback;

		if (ric && cic) {
			const id = ric(() => setShouldMount(true), { timeout: IDLE_TIMEOUT_MS });
			return () => cic(id);
		}
		const timer = setTimeout(() => setShouldMount(true), FALLBACK_DELAY_MS);
		return () => clearTimeout(timer);
	}, []);

	if (!shouldMount) return null;
	return <CookieConsent />;
};

export default DeferredCookieConsent;
