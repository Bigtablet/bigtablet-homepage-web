"use client";

import { AlertProvider, ToastProvider } from "@bigtablet/design-system";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { type ReactNode, useMemo } from "react";
import { isHttpError } from "src/shared/libs/api/error";
import { createMutationCache } from "src/shared/libs/api/query/mutation-cache";
import ToastBridgeProvider from "src/shared/libs/api/toast/toast-bridge-provider";

/* CookieConsent 는 초기 hydration 차단 요인 — dynamic + idle 마운트 컴포넌트로 분리해 LCP 이후로 미룸 */
const DeferredCookieConsent = dynamic(() => import("src/features/cookie-consent/deferred"), {
	ssr: false,
});

type Props = { children: ReactNode };

export default function Providers({ children }: Props) {
	const queryClient = useMemo(
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
		[],
	);

	return (
		<AlertProvider>
			<ToastProvider>
				<QueryClientProvider client={queryClient}>
					<ToastBridgeProvider />
					{children}
					<DeferredCookieConsent />
				</QueryClientProvider>
			</ToastProvider>
		</AlertProvider>
	);
}
