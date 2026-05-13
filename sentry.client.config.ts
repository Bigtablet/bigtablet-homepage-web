/**
 * Sentry 클라이언트 초기화 — 전체를 idle 시점으로 미룬다.
 * 동기 init 은 Sentry SDK (~100KB) 가 첫 hydration JS 윈도우에 포함되어 TBT/LCP 압박.
 * dynamic import 로 SDK 다운로드 자체를 LCP 이후로 분리.
 *
 * trade-off: 첫 paint 직후 발생하는 에러는 캡쳐 못 함. 대신 production perf 점수 회복.
 */

if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
	const init = () => {
		import("@sentry/nextjs")
			.then((Sentry) => {
				Sentry.init({
					dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
					tracesSampleRate: 0.1,
					replaysSessionSampleRate: 0,
					replaysOnErrorSampleRate: 1.0,
					integrations: [Sentry.browserTracingIntegration()],
				});

				Sentry.lazyLoadIntegration("replayIntegration")
					.then((replay) => Sentry.addIntegration(replay()))
					.catch(() => {});
			})
			.catch(() => {
				/* SDK fetch 실패 시 침묵 — 본 앱 동작에 영향 없음 */
			});
	};

	const ric = (
		window as Window & {
			requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
		}
	).requestIdleCallback;
	if (ric) ric(init, { timeout: 3000 });
	else setTimeout(init, 1500);
}
