import "src/app/global.css";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Providers from "src/widgets/layout/provider";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import RouteLoading from "src/shared/ui/route-loading";

export const metadata: Metadata = {
    title: "Bigtablet",
    description: "Bigtablet's Official Website",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
                                             children,
                                         }: {
    children: React.ReactNode;
}) {
    const store = await cookies();
    const val = store.get("NEXT_LOCALE")?.value;
    const locale = (val === "en" ? "en" : "ko") as "en" | "ko";

    let messages;
    try {
        messages = await getMessages();
    } catch {
        notFound();
    }

    return (
        <html lang={locale} suppressHydrationWarning>
        <head>
            <link rel="icon" href="/images/logo/favicon.png"/>
        </head>
        <body className="font-sans antialiased">
        <Suspense fallback={null}>
            <RouteLoading />
        </Suspense>
        <div id="modal"/>
        <NextIntlClientProvider locale={locale} messages={messages}>
            <Providers>{children}</Providers>
        </NextIntlClientProvider>
        </body>
        </html>
    );
}