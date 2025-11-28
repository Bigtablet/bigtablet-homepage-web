import type { NextRequest } from "next/server";

export const runtime = "edge";

const IMG = /^image\//i;
const HTML = /text\/html/i;

const UA =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

/** 투명 PNG fallback */
const TRANSPARENT_PNG = new Uint8Array([
    137,80,78,71,13,10,26,10,0,0,0,13,73,72,68,82,0,0,0,
    1,0,0,0,1,8,6,0,0,0,31,21,196,137,0,0,0,1,115,82,71,
    66,0,174,206,28,233,0,0,0,10,73,68,65,84,120,156,99,
    0,1,0,0,5,0,1,13,10,42,186,0,0,0,0,73,69,78,68,174,
    66,96,130
]);

/** fetch with timeout */
async function timedFetch(url: string, headers: HeadersInit, ms: number) {
    const c = new AbortController();
    const t = setTimeout(() => c.abort(), ms);
    try {
        return await fetch(url, {
            signal: c.signal,
            redirect: "follow",
            headers,
            cache: "no-store",
        });
    } finally {
        clearTimeout(t);
    }
}

/** 태그 속성 추출 */
function attr(tag: string, name: string) {
    const m = tag.match(new RegExp(`${name}\\s*=\\s*["']([^"']+)["']`, "i"));
    return m?.[1] ?? null;
}

/** 상대 URL → 절대 URL */
function resolveUrl(raw: string | null, base: string) {
    if (!raw) return null;
    try {
        if (raw.startsWith("//")) return `https:${raw}`;
        return new URL(raw, base).toString();
    } catch {
        return null;
    }
}

/** OG 이미지 탐색 */
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

/** favicon URL */
const faviconOf = (u: URL) =>
    `https://www.google.com/s2/favicons?domain=${encodeURIComponent(u.hostname)}&sz=128`;

/** 이미지 Response */
function imgResponse(body: Blob | Uint8Array, contentType: string) {
    return new Response(body as BodyInit, {
        headers: {
            "content-type": contentType,
            "cache-control": "public, s-maxage=86400, stale-while-revalidate=604800",
        },
    });
}

/** 투명 PNG fallback */
function pngFallback() {
    return new Response(TRANSPARENT_PNG, {
        headers: {
            "content-type": "image/png",
            "cache-control": "public, s-maxage=3600",
        },
    });
}

/** 메인 라우트 핸들러 */
export async function GET(req: NextRequest) {
    const raw = req.nextUrl.searchParams.get("u");
    const forceFavicon = req.nextUrl.searchParams.get("f") === "1";

    if (!raw) return new Response("Missing param u", { status: 400 });

    let url: URL;
    try {
        url = new URL(raw);
    } catch {
        return new Response("Invalid URL", { status: 400 });
    }

    /** 강제 favicon */
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

    /** HTML 요청 */
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

        /** 직접 이미지 */
        if (IMG.test(ctype)) {
            const blob = await htmlRes.blob();
            return imgResponse(blob, blob.type || ctype);
        }

        /** HTML → OG 이미지 */
        if (HTML.test(ctype)) {
            const html = await htmlRes.text();
            const og = pickOg(html, url.toString()) || faviconOf(url);

            const imgRes = await timedFetch(
                og,
                {
                    "user-agent": UA,
                    referer: url.toString(),
                    accept: "image/avif,image/webp,image/*",
                },
                3000
            );

            const ict = imgRes.headers.get("content-type") || "";

            /** 실패 → favicon */
            if (!imgRes.ok || !IMG.test(ict)) {
                const f = await timedFetch(
                    faviconOf(url),
                    { "user-agent": UA, accept: "image/*" },
                    2000
                );
                const blob = await f.blob();
                return imgResponse(blob, blob.type || "image/png");
            }

            const blob = await imgRes.blob();
            return imgResponse(blob, blob.type || "image/jpeg");
        }

        /** HTML도 이미지도 아님 → favicon */
        const f = await timedFetch(
            faviconOf(url),
            { "user-agent": UA, accept: "image/*" },
            2000
        );
        const blob = await f.blob();
        return imgResponse(blob, blob.type || "image/png");
    } catch {
        return pngFallback();
    }
}