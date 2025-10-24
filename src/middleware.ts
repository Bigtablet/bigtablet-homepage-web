import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

const LOCALE_PREFIX_RE = /^\/(en|ko)(?=\/|$)/i;

export const config = {
    matcher: ['/(.*)'],
};

export default function middleware(req: NextRequest) {
    const url = new URL(req.url);

    // /en/... 또는 /ko/... 이면 → 접두사 제거 후 308 리다이렉트
    if (LOCALE_PREFIX_RE.test(url.pathname)) {
        const stripped = url.pathname.replace(LOCALE_PREFIX_RE, '') || '/';
        const to = new URL(stripped + url.search, url.origin);
        const r = NextResponse.redirect(to, 308);
        r.headers.set('x-mw', 'redirected'); // 디버그용
        return r;
    }

    const res = NextResponse.next();
    res.headers.set('x-mw', 'passed'); // 디버그용
    return res;
}