import { cookies } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import Footer from "src/shared/ui/footer";
import Header from "src/shared/ui/header";
import PageTransition from "src/shared/ui/page-transition";
import styles from "./layout.module.scss";

export default async function LocaleLayout({ children }: { children: ReactNode }) {
	const localeValue = (await cookies()).get("NEXT_LOCALE")?.value?.toLowerCase();
	const locale = localeValue?.startsWith("en") ? "en" : "ko"; // 기본 ko, 'en-US' 등 region code도 인식
	const messages = (await import(`../../../messages/${locale}.json`)).default;

	return (
		<NextIntlClientProvider locale={locale} messages={messages}>
			<div className={styles.layout}>
				<Header />
				<main className={styles.layout_main}>
					<PageTransition>{children}</PageTransition>
				</main>
				<Footer />
			</div>
		</NextIntlClientProvider>
	);
}
