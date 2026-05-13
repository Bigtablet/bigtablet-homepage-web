import { cookies } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { pickMessages, resolveLocale } from "src/shared/libs/locale";
import Footer from "src/shared/ui/footer";
import Header from "src/shared/ui/header";
import PageTransition from "src/shared/ui/page-transition";
import styles from "./layout.module.scss";

/* `about` namespace 가 25KB — /about 외 페이지에서 사용 안 함. layout 에서 빼서
   /, /blog, /news, /recruit, /policies/* 의 SSR HTML payload 25KB 절감.
   /about 와 /about/[id] 는 자체 page.tsx 에서 full messages 로 wrap. */
const HEAVY_NAMESPACES = ["about"] as const;

export default async function LocaleLayout({ children }: { children: ReactNode }) {
	const locale = resolveLocale((await cookies()).get("NEXT_LOCALE")?.value);
	const messages = (await import(`../../../messages/${locale}.json`)).default;
	const lightMessages = pickMessages(messages, { exclude: HEAVY_NAMESPACES });

	return (
		<NextIntlClientProvider locale={locale} messages={lightMessages}>
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
