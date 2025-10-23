import { NextResponse } from 'next/server';

export const config = { matcher: '/:path*' };

export default function middleware() {
    const res = NextResponse.next();
    res.headers.set('X-MW', 'on'); // 디버그 마킹
    return res;
}