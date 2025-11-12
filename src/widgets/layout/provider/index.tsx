"use client";

import {ReactNode, useState} from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ToastProvider} from "src/shared/ui/feedback/toast";

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
            <ToastProvider />
            {children}
        </QueryClientProvider>
    )
}