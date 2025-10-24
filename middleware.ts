import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

const LOCALES = ['ko', 'en'] as const;
const DEFAULT_LOCALE = 'ko';

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|assets|images|video|fonts).*)',
    ],
};

export default function middleware(req: NextRequest) {
    const {nextUrl, cookies, headers} = req;
    const {pathname} = nextUrl;

    if (pathname.startsWith('/ko') || pathname.startsWith('/en')) {
        const res = NextResponse.next();
        res.headers.set('X-MW', 'on');
        return res;
    }

    if (/\.[a-zA-Z0-9]+$/.test(pathname)) {
        const res = NextResponse.next();
        res.headers.set('X-MW', 'on');
        return res;
    }

    let locale =
        (cookies.get('NEXT_LOCALE')?.value as (typeof LOCALES)[number] | undefined) ??
        undefined;

    if (!locale) {
        const al = (headers.get('accept-language') || '').toLowerCase();
        if (al.includes('ko')) locale = 'ko';
        else if (al.includes('en')) locale = 'en';
    }

    if (!locale || !LOCALES.includes(locale)) locale = DEFAULT_LOCALE;

    const targetPath = pathname === '/' ? `/${locale}/main` : `/${locale}${pathname}`;
    const url = new URL(targetPath, req.url);
    const res = NextResponse.redirect(url);
    res.headers.set('X-MW', 'on');
    return res;
}