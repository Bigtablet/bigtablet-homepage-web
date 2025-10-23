import { NextResponse } from 'next/server';

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|assets|images|video|fonts).*)',
    ],
};


export default function middleware() {
    const res = NextResponse.next();
    res.headers.set('X-MW', 'on');
    return res;
}