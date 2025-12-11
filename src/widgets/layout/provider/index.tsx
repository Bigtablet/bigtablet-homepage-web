"use client";

import {ReactNode, useState} from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {AlertProvider, ToastProvider} from "@bigtablet/design-system";

type Props = { children: ReactNode };

export default function Providers({children}: Props) {
    const [client] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {retry: 1},
                },
            })
    );

    return (
        <QueryClientProvider client={client}>
            <ToastProvider/>
            <AlertProvider>

                {children}
            </AlertProvider>
        </QueryClientProvider>
    )
}