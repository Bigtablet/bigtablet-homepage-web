"use client";

import { AlertProvider, ToastProvider } from "@bigtablet/design-system";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useMemo } from "react";
import CookieConsent from "src/features/cookie-consent/ui";
import { isHttpError } from "src/shared/libs/api/error";
import { createMutationCache } from "src/shared/libs/api/query/mutation-cache";
import ToastBridgeProvider from "src/shared/libs/api/toast/toast-bridge-provider";

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
					<CookieConsent />
				</QueryClientProvider>
			</ToastProvider>
		</AlertProvider>
	);
}
