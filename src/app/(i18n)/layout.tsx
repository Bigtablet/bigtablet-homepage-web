import { cookies } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import Footer from "src/shared/ui/footer";
import Header from "src/shared/ui/header";
import styles from "./layout.module.scss";

export default async function LocaleLayout({
	children,
}: {
	children: ReactNode;
}) {
	const c = (await cookies()).get("NEXT_LOCALE")?.value?.toLowerCase();
	const locale = c === "en" ? "en" : "ko"; // 기본 ko
	const messages = (await import(`../../../messages/${locale}.json`)).default;

	return (
		<NextIntlClientProvider locale={locale} messages={messages}>
			<div className={styles.layout}>
				<Header />
				<main className={styles.layout_main}>{children}</main>
				<Footer />
			</div>
		</NextIntlClientProvider>
	);
}
