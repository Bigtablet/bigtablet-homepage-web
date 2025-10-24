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
    const res = NextResponse.next();

    const cur = req.cookies.get('NEXT_LOCALE')?.value as typeof LOCALES[number] | undefined;
    if (!cur || !LOCALES.includes(cur)) {
        const al = (req.headers.get('accept-language') || '').toLowerCase();
        const detected = al.includes('ko') ? 'ko' : al.includes('en') ? 'en' : DEFAULT_LOCALE;
        res.cookies.set('NEXT_LOCALE', detected, {path: '/', maxAge: 60 * 60 * 24 * 365});
    }

    res.headers.set('X-MW', 'on');
    return res;
}