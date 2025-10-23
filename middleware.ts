import {NextRequest} from 'next/server';
import createMiddleware from 'next-intl/middleware';
import {routing} from 'src/i18n/routing';

const intl = createMiddleware({
    locales: routing.locales as readonly string[],
    defaultLocale: routing.defaultLocale,
    localePrefix: 'never'
});

export default function middleware(req: NextRequest) {
    return intl(req);
}

export const config = {
    matcher: [
        '/((?!_next|api|images|fonts|videos|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\..*|admin).*)'
    ]
};