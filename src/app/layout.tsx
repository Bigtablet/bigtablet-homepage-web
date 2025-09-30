import "./globals.css";
import { cookies } from "next/headers";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const store = await cookies();
    const locale = (store.get("locale")?.value === "en" ? "en" : "ko") as "en" | "ko";

    return (
        <html lang={locale} suppressHydrationWarning>
        <body>{children}</body>
        </html>
    );
}