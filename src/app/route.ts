import { NextResponse } from 'next/server';

export function GET(req: Request) {
    return NextResponse.redirect(new URL('/main', req.url), 308);
}

export { GET as HEAD }