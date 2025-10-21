import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import {routing} from 'src/i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    if (pathname === '/') return NextResponse.next();
    return intlMiddleware(req);
}

export const config = {
    matcher: [
        '/((?!_next|api|images|fonts|videos|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\..*|admin).*)',
    ],
};