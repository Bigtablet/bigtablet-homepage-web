import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { cookies, headers } from 'next/headers';

export const dynamic = 'force-dynamic';

async function pickLocale(): Promise<'ko' | 'en'> {
    const c = (await cookies()).get('NEXT_LOCALE')?.value?.toLowerCase();
    if (c === 'ko' || c === 'en') return c as 'ko' | 'en';

    const al = (await headers()).get('accept-language') || '';
    return /(^|,|\s)ko(-|,|;|$)/i.test(al) ? 'ko' : 'en';
}

export default async function LocaleLayout({ children }: { children: ReactNode }) {
    const locale = await pickLocale();
    const messages = (await import(`../../../messages/${locale}.json`)).default;

    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
        </NextIntlClientProvider>
    );
}