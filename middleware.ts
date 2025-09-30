import {getRequestConfig, type RequestConfig} from 'next-intl/server';
import {routing, type AppLocale} from 'src/i18n/routing';
import type {AbstractIntlMessages} from 'next-intl';

const isSupported = (l: string | undefined): l is AppLocale =>
    !!l && (routing.locales as readonly string[]).includes(l);

export default getRequestConfig(async ({locale}) => {
    const resolved: AppLocale = isSupported(locale) ? locale : routing.defaultLocale;

    const messages = (await import(`./messages/${resolved}.json`))
        .default as AbstractIntlMessages;

    return {locale: resolved, messages} satisfies RequestConfig;
});