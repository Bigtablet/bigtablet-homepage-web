"use client";

import { AlertProvider, ToastProvider } from "@bigtablet/design-system";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useMemo } from "react";
import CookieConsent from "src/features/cookie-consent/ui";
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
							const status = (error as { status?: number }).status;
							if (status && status >= 400 && status < 500) return false;
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
