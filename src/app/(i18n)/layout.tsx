import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';

export default async function LocaleLayout({
                                               children
                                           }: {
    children: ReactNode;
}) {
    const locale = await getLocale();
    const messages = (await import(`../../../messages/${locale}.json`)).default;

    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
        </NextIntlClientProvider>
    );
}