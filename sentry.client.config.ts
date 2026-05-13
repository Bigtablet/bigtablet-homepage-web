import * as Sentry from "@sentry/nextjs";

/**
 * Sentry 클라이언트 초기화.
 * replayIntegration (~70KB) 은 lazyLoadIntegration 으로 분리 — 초기 번들에서 제외,
 * production 진입 후 CDN에서 비동기 fetch 해 addIntegration.
 */
Sentry.init({
	dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
	tracesSampleRate: 0.1,
	replaysSessionSampleRate: 0,
	replaysOnErrorSampleRate: 1.0,
	integrations: [Sentry.browserTracingIntegration()],
	enabled: process.env.NODE_ENV === "production",
});

if (process.env.NODE_ENV === "production" && typeof window !== "undefined") {
	Sentry.lazyLoadIntegration("replayIntegration")
		.then((replayIntegration) => {
			Sentry.addIntegration(replayIntegration());
		})
		.catch(() => {
			/* CDN fetch 실패 시 replay 없이 진행 — tracing 은 여전히 동작. */
		});
}
