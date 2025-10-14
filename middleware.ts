import createMiddleware from 'next-intl/middleware';
import {routing} from 'src/i18n/routing';

export default createMiddleware(routing);

export const config = {
    matcher: [
        '/((?!_next|apis|images|fonts|videos|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)',
    ],
};