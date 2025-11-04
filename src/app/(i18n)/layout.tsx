import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { cookies } from 'next/headers';

export default async function LocaleLayout({ children }: { children: ReactNode }) {
    const c = (await cookies()).get('NEXT_LOCALE')?.value?.toLowerCase();
    const locale = c === 'en' ? 'en' : 'ko'; // 기본 ko
    const messages = (await import(`../../../messages/${locale}.json`)).default;

    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
        </NextIntlClientProvider>
    );
}