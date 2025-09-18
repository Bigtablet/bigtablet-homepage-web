import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

// 지원하는 언어 목록
const SUPPORTED = ['ko', 'en'] as const;

export function middleware(req: NextRequest) {
    const {pathname} = req.nextUrl;

    // 1. 정적 파일(_next, 이미지, 폰트 등)은 미들웨어 처리하지 않고 그대로 통과
    if (
        pathname.startsWith('/_next') ||
        pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico|css|js|map|txt|woff|woff2|ttf)$/)
    ) {
        return NextResponse.next();
    }

    // 2. 이미 /ko, /en 같은 로케일 prefix가 붙어 있는 경우도 그대로 통과
    if (SUPPORTED.some(l => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) {
        return NextResponse.next();
    }

    // 3. locale 결정 우선순위
    //    (1) 쿠키(locale 값) → (2) 브라우저 Accept-Language → (3) 기본값 'ko'
    const cookieLocale = req.cookies.get('locale')?.value;
    const headerLocale = req.headers.get('accept-language')?.split(',')[0].split('-')[0] ?? 'ko';

    const locale =
        (cookieLocale && (SUPPORTED as readonly string[]).includes(cookieLocale) && cookieLocale) ||
        ((SUPPORTED as readonly string[]).includes(headerLocale) ? headerLocale : 'ko');

    // 4. 로케일 prefix가 없으면 자동으로 붙여서 리다이렉트
    const url = req.nextUrl.clone();
    url.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(url);
}

// 5. matcher 설정
//    - _next, 정적 파일을 제외한 모든 요청 경로에 대해 미들웨어 실행
export const config = {
    matcher: ['/((?!_next|.*\\..*).*)']
};