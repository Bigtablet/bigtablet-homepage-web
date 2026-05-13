"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const CookieConsent = dynamic(() => import("src/features/cookie-consent/ui"), { ssr: false });

/**
 * @description
 * CookieConsent 의 mount 자체를 idle 시점까지 미루는 wrapper.
 * 첫 LCP/TBT 측정 윈도우 안에서 CookieConsent 의 hydration + DOM 작업이 안 일어나도록 분리.
 * idle 미지원 환경은 500ms setTimeout fallback.
 */
const DeferredCookieConsent = () => {
	const [shouldMount, setShouldMount] = useState(false);

	useEffect(() => {
		const ric = (window as Window & { requestIdleCallback?: (cb: () => void) => number })
			.requestIdleCallback;
		const cic = (window as Window & { cancelIdleCallback?: (id: number) => void })
			.cancelIdleCallback;

		if (ric && cic) {
			const id = ric(() => setShouldMount(true));
			return () => cic(id);
		}
		const timer = setTimeout(() => setShouldMount(true), 500);
		return () => clearTimeout(timer);
	}, []);

	if (!shouldMount) return null;
	return <CookieConsent />;
};

export default DeferredCookieConsent;
