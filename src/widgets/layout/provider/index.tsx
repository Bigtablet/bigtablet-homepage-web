"use client";

import { AlertProvider, ToastProvider } from "@bigtablet/design-system";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import CookieConsent from "src/features/cookie-consent/ui";

type Props = { children: ReactNode };

export default function Providers({ children }: Props) {
	const [client] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 1000 * 60 * 60,
						gcTime: 1000 * 60 * 60 * 2,
						retry: (failureCount, error) => {
							const status = (error as { status?: number }).status;
							if (status && status >= 400 && status < 500) return false;
							return failureCount < 1;
						},
					},
				},
			}),
	);

	return (
		<QueryClientProvider client={client}>
			<ToastProvider>
				<AlertProvider>
					{children}
					<CookieConsent />
				</AlertProvider>
			</ToastProvider>
		</QueryClientProvider>
	);
}
