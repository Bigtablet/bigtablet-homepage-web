"use client";

import { AlertProvider, ThemeProvider, ToastProvider } from "@bigtablet/design-system";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { type ReactNode, useState } from "react";
import { isHttpError } from "src/shared/libs/api/error";
import { createMutationCache } from "src/shared/libs/api/query/mutation-cache";
import ToastBridgeProvider from "src/shared/libs/api/toast/toast-bridge-provider";

/* CookieConsent 는 초기 hydration 차단 요인 — dynamic + idle 마운트 컴포넌트로 분리해 LCP 이후로 미룸 */
const DeferredCookieConsent = dynamic(() => import("src/features/cookie-consent/deferred"), {
	ssr: false,
});

type Props = { children: ReactNode };

export default function Providers({ children }: Props) {
	/* useState 지연 초기화. useMemo는 React가 폐기 가능해 캐시 유실 위험 */
	const [queryClient] = useState(
		() =>
			new QueryClient({
				mutationCache: createMutationCache(),
				defaultOptions: {
					queries: {
						staleTime: 5 * 60 * 1000,
						gcTime: 5 * 60 * 1000,
						retry: (failureCount, error) => {
							/* 4xx 클라이언트 에러는 재시도 무의미 — 즉시 실패. 그 외는 1회 재시도. */
							if (isHttpError(error) && error.status >= 400 && error.status < 500) {
								return false;
							}
							return failureCount < 1;
						},
					},
				},
			}),
	);

	return (
		/* defaultMode="light" 고정 — DS 3.1 토큰/테마 인프라는 도입하되, 현 사이트는
		   라이트 기반(특정 섹션만 다크)이라 system/dark 자동 전환은 추후 다크 대응 후 활성화 */
		<ThemeProvider defaultMode="light">
			<AlertProvider>
				<ToastProvider>
					<QueryClientProvider client={queryClient}>
						<ToastBridgeProvider />
						{children}
						<DeferredCookieConsent />
					</QueryClientProvider>
				</ToastProvider>
			</AlertProvider>
		</ThemeProvider>
	);
}
