import { cookies } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { resolveLocale } from "src/shared/libs/locale";
import Footer from "src/shared/ui/footer";
import Header from "src/shared/ui/header";
import PageTransition from "src/shared/ui/page-transition";
import styles from "./layout.module.scss";

export default async function LocaleLayout({ children }: { children: ReactNode }) {
	const locale = resolveLocale((await cookies()).get("NEXT_LOCALE")?.value);
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
