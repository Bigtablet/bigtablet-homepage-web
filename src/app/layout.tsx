import "src/styles/global.scss";
import { cookies } from "next/headers";
import Providers from "src/components/common/provider";
import "src/styles/color/_sementic.scss";
import "src/styles/typography/_mixin.scss";
import {Metadata} from "next";


export const metadata: Metadata = {
    title: "Bigtablet",
    description: "Bigtablet's Product",
};

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
        <div id="modal"/>
        <Providers>{children}</Providers>
        </body>
        </html>
    );
}