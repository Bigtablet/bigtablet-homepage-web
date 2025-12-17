import type { NextRequest } from "next/server";

export const runtime = "nodejs";

/** Content-Type quick checks */
const IMG = /^image\//i;
const HTML = /text\/html/i;

/** UA: 일부 사이트가 봇/빈 UA에 다른 HTML(로그인/에러)을 주는 케이스 방어 */
const UA =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

/**
 * 1x1 투명 PNG (fallback)
 * - OG 이미지/파비콘 모두 실패 시 UI 깨짐 방지
 */
const TRANSPARENT_PNG = new Uint8Array([
    137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0,
    1, 0, 0, 0, 1, 8, 6, 0, 0, 0, 31, 21, 196, 137, 0, 0, 0, 1, 115, 82,
    71, 66, 0, 174, 206, 28, 233, 0, 0, 0, 10, 73, 68, 65, 84, 120, 156, 99,
    0, 1, 0, 0, 5, 0, 1, 13, 10, 42, 186, 0, 0, 0, 0, 73, 69, 78, 68, 174,
    66, 96, 130,
]);

/**
 * fetch with timeout + follow redirects
 * - Edge 런타임에서 fetch가 무한 대기/느린 응답이면 렌더가 멈추는 문제를 방지
 */
async function timedFetch(url: string, headers: HeadersInit, ms: number) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ms);

    try {
        return await fetch(url, {
            signal: controller.signal,
            redirect: "follow",
            headers,
            cache: "no-store",
        });
    } finally {
        clearTimeout(timer);
    }
}

/**
 * HTML tag에서 attribute 값을 추출
 * - 간단한 OG 메타 파싱용 (완전한 HTML 파서가 아니므로 “대략적인” 탐색에만 사용)
 */
function attr(tag: string, name: string) {
    const m = tag.match(new RegExp(`${name}\\s*=\\s*["']([^"']+)["']`, "i"));
    return m?.[1] ?? null;
}

/**
 * 상대 URL → 절대 URL
 * - og:image 가 상대경로일 수 있어서 base 를 기준으로 URL 완성
 */
function resolveUrl(raw: string | null, base: string) {
    if (!raw) return null;
    try {
        if (raw.startsWith("//")) return `https:${raw}`;
        return new URL(raw, base).toString();
    } catch {
        return null;
    }
}

/**
 * OG/Twitter 이미지 후보를 HTML에서 찾기
 * - <meta property="og:image" content="...">
 * - <meta name="twitter:image" content="...">
 * - <link rel="image_src" href="...">
 */
function pickOg(html: string, base: string) {
    const metas = Array.from(html.matchAll(/<meta\b[^>]*>/gi)).map((m) => m[0]);
    const want = new Set(["og:image", "og:image:url", "twitter:image", "twitter:image:src"]);

    for (const m of metas) {
        const key = (attr(m, "property") || attr(m, "name") || "").toLowerCase();
        if (!want.has(key)) continue;

        const url = resolveUrl(attr(m, "content"), base);
        if (url) return url;
    }

    const link = html.match(/<link\b[^>]*rel=["']image_src["'][^>]*>/i)?.[0];
    return link ? resolveUrl(attr(link, "href"), base) : null;
}

/**
 * favicon URL (Google S2)
 * - OG 이미지가 없거나 막힌 사이트에서 최소한의 아이콘이라도 표시하기 위한 fallback
 */
const faviconOf = (u: URL) =>
    `https://www.google.com/s2/favicons?domain=${encodeURIComponent(u.hostname)}&sz=128`;

/**
 * 이미지 응답 래퍼
 * - CDN/엣지 캐시 힌트 설정 (일반적으로 재사용 가능)
 */
function imgResponse(body: Blob | Uint8Array, contentType: string) {
    return new Response(body as BodyInit, {
        headers: {
            "content-type": contentType,
            "cache-control": "public, s-maxage=86400, stale-while-revalidate=604800",
        },
    });
}

/** 투명 PNG fallback 응답 */
function pngFallback() {
    return new Response(TRANSPARENT_PNG, {
        headers: {
            "content-type": "image/png",
            "cache-control": "public, s-maxage=3600",
        },
    });
}

/**
 * query param "u" 디코딩 + URL 정규화
 *
 * ✅ 왜 필요?
 * - Pagination 이후 `/api/og-image?u=<뉴스URL>&page=2` 같은 형태가 되면
 *   u 값이 오염되거나(또는 u 내부 query와 바깥 query가 섞여) 잘못된 URL을 fetch 하게 됨
 *
 * ✅ 프론트에서는 반드시:
 *   `/api/og-image?u=${encodeURIComponent(newsUrl)}`
 *
 * ✅ 서버에서도 방어적으로:
 *   decodeURIComponent → new URL 로 파싱
 */
function parseTargetUrl(raw: string): URL | null {
    /** raw가 이미 디코딩되어 들어올 수도 있어서 try/catch로 안전하게 처리 */
    const decoded = (() => {
        try {
            return decodeURIComponent(raw);
        } catch {
            return raw;
        }
    })();

    try {
        return new URL(decoded);
    } catch {
        return null;
    }
}

/** 메인 라우트 핸들러 */
export async function GET(req: NextRequest) {
    /**
     * u: 크롤링할 “외부 뉴스 원문 URL”
     * f=1: OG 무시하고 favicon 강제
     */
    const raw = req.nextUrl.searchParams.get("u");
    const forceFavicon = req.nextUrl.searchParams.get("f") === "1";

    if (!raw) return new Response("Missing param u", { status: 400 });

    const url = parseTargetUrl(raw);
    if (!url) return new Response("Invalid URL", { status: 400 });

    /** favicon 강제 모드 */
    if (forceFavicon) {
        try {
            const f = await timedFetch(
                faviconOf(url),
                { "user-agent": UA, accept: "image/*" },
                2000
            );
            if (!f.ok) return pngFallback();
            const blob = await f.blob();
            return imgResponse(blob, blob.type || "image/png");
        } catch {
            return pngFallback();
        }
    }

    /**
     * 1) 원문 URL을 fetch
     * 2) content-type 보고:
     *    - 이미지면 그대로 반환
     *    - HTML이면 og:image 추출 후 이미지 fetch
     *    - 그 외면 favicon fallback
     */
    try {
        const htmlRes = await timedFetch(
            url.toString(),
            {
                "user-agent": UA,
                accept: "text/html,application/xhtml+xml,image/*,*/*",
            },
            5000
        );

        const ctype = htmlRes.headers.get("content-type") || "";

        /** 원문이 이미 “이미지”인 경우 */
        if (IMG.test(ctype)) {
            const blob = await htmlRes.blob();
            return imgResponse(blob, blob.type || ctype);
        }

        /** 원문이 HTML인 경우: OG → 이미지 요청 */
        if (HTML.test(ctype)) {
            const html = await htmlRes.text();

            /** og:image 후보가 없으면 favicon으로 대체 */
            const og = pickOg(html, url.toString()) || faviconOf(url);

            /** page 쿼리 제거 함수 */
            const cleanReferer = `${url.origin}${url.pathname}`;

            const imgRes = await timedFetch(
                og,
                {
                    "user-agent": UA,
                    referer: cleanReferer,
                    accept: "image/avif,image/webp,image/*",
                },
                3000
            );

            const imgType = imgRes.headers.get("content-type") || "";

            /**
             * OG 이미지 요청 실패 / 이미지가 아닌 응답(HTML 등)인 경우
             * - 사이트가 핫링크를 막거나(403), 로봇/리퍼러 체크로 HTML을 돌려주는 케이스 대응
             */
            if (!imgRes.ok || !IMG.test(imgType)) {
                const f = await timedFetch(
                    faviconOf(url),
                    { "user-agent": UA, accept: "image/*" },
                    2000
                );
                if (!f.ok) return pngFallback();
                const blob = await f.blob();
                return imgResponse(blob, blob.type || "image/png");
            }

            const blob = await imgRes.blob();
            return imgResponse(blob, blob.type || "image/jpeg");
        }

        /** HTML도 이미지도 아닌 경우: favicon fallback */
        const f = await timedFetch(
            faviconOf(url),
            { "user-agent": UA, accept: "image/*" },
            2000
        );
        if (!f.ok) return pngFallback();
        const blob = await f.blob();
        return imgResponse(blob, blob.type || "image/png");
    } catch {
        return pngFallback();
    }
}