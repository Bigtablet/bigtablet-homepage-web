import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { cookies } from 'next/headers';
import Header from 'src/shared/ui/header';
import Footer from 'src/shared/ui/footer';
import styles from './layout.module.scss';

export default async function LocaleLayout({ children }: { children: ReactNode }) {
    const c = (await cookies()).get('NEXT_LOCALE')?.value?.toLowerCase();
    const locale = c === 'en' ? 'en' : 'ko'; // 기본 ko
    const messages = (await import(`../../../messages/${locale}.json`)).default;

    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            <div className={styles.layout}>
                <Header />
                <main className={styles.layout_main}>
                    {children}
                </main>
                <Footer />
            </div>
        </NextIntlClientProvider>
    );
}
