import type {ReactNode} from 'react';
import {NextIntlClientProvider} from 'next-intl';
import {routing, type AppLocale} from 'src/i18n/routing';

export default async function LocaleLayout({
                                               children,
                                               params
                                           }: {
    children: ReactNode;
    params: Promise<{locale: AppLocale | string}>;
}) {
    const {locale: raw} = await params;
    const locale: AppLocale =
        (routing.locales as readonly string[]).includes(raw as string)
            ? (raw as AppLocale)
            : routing.defaultLocale;

    const messages = (await import(`../../../messages/${locale}.json`)).default;

    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
        </NextIntlClientProvider>
    );
}