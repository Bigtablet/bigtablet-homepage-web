import "src/shared/styles/global.css";
import { cookies } from "next/headers";
import Providers from "src/widgets/layout/provider";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Bigtablet",
    description: "Bigtablet's Product",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const store = await cookies();
    const val = store.get("NEXT_LOCALE")?.value;
    const locale = (val === "en" ? "en" : "ko") as "en" | "ko";

    return (
        <html lang={locale} suppressHydrationWarning>
        <head>
            <link rel="icon" href="/images/logo/favicon.png" />
        </head>
        <body className="font-sans antialiased">
        <div id="modal" />
        <Providers>{children}</Providers>
        </body>
        </html>
    );
}