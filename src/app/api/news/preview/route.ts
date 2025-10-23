import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const IMG_TYPE = /^image\//i;
const HTML_TYPE = /text\/html/i;

const UA =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

const log = (...a: any[]) => console.log("[api/news/preview]", ...a);

function attr(tag: string, name: string) {
    const re = new RegExp(`${name}\\s*=\\s*["']([^"']+)["']`, "i");
    return tag.match(re)?.[1] ?? null;
}

function resolveUrl(raw: string | null, base: string): string | null {
    if (!raw) return null;
    try {
        if (raw.startsWith("//")) return new URL(`https:${raw}`).toString();
        return new URL(raw, base).toString();
    } catch {
        return null;
    }
}

function pickOg(html: string, base: string): string | null {
    const metas = Array.from(html.matchAll(/<meta\b[^>]*>/gi)).map((m) => m[0]);
    const want = new Set(["og:image", "og:image:url", "twitter:image", "twitter:image:src"]);
    for (const m of metas) {
        const name = (attr(m, "property") || attr(m, "name") || "").toLowerCase();
        if (!want.has(name)) continue;
        const content = attr(m, "content");
        const url = resolveUrl(content, base);
        if (url) return url;
    }
    const link = html.match(/<link\b[^>]*rel=["']image_src["'][^>]*>/i)?.[0];
    if (link) {
        const href = attr(link, "href");
        const url = resolveUrl(href, base);
        if (url) return url;
    }
    return null;
}

const faviconOf = (u: URL) =>
    `https://www.google.com/s2/favicons?domain=${encodeURIComponent(u.hostname)}&sz=128`;

// 1x1 transparent PNG → Blob 고정
const TRANSPARENT_PNG = new Blob(
    [new Uint8Array([137,80,78,71,13,10,26,10,0,0,0,13,73,72,68,82,0,0,0,1,0,0,0,1,8,6,0,0,0,31,21,196,137,0,0,0,1,115,82,71,66,0,174,206,28,233,0,0,0,10,73,68,65,84,120,156,99,0,1,0,0,5,0,1,13,10,42,186,0,0,0,0,73,69,78,68,174,66,96,130])]
    , { type: "image/png" }
);

async function fetchWithGuards(url: string, headers: HeadersInit) {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), 8000);
    try {
        return await fetch(url, { signal: ac.signal, redirect: "follow", headers, cache: "no-store" });
    } finally {
        clearTimeout(t);
    }
}

function imgResponse(body: Blob, contentType = "image/png", extra?: Record<string, string>) {
    return new Response(body, {
        headers: {
            "content-type": contentType,
            "cache-control": "public, s-maxage=86400, max-age=86400, stale-while-revalidate=604800",
            ...(extra || {}),
        },
    });
}

function pngFallback(extra?: Record<string, string>) {
    return new Response(TRANSPARENT_PNG, {
        headers: {
            "content-type": "image/png",
            "cache-control": "public, s-maxage=3600, max-age=3600",
            ...(extra || {}),
        },
    });
}

export async function GET(req: NextRequest) {
    const target = req.nextUrl.searchParams.get("u");
    const forceFavicon = req.nextUrl.searchParams.get("f") === "1";
    if (!target) return new Response("Missing param u", { status: 400 });

    let articleUrl: URL;
    try {
        articleUrl = new URL(target);
    } catch {
        return new Response("Invalid URL", { status: 400 });
    }

    log("request", { u: articleUrl.toString(), f: forceFavicon });

    if (forceFavicon) {
        try {
            const favi = await fetchWithGuards(faviconOf(articleUrl), {
                "user-agent": UA,
                accept: "image/*,*/*;q=0.8",
            });
            const blob = await favi.blob();
            const ct = blob.type || favi.headers.get("content-type") || "image/png";
            return imgResponse(blob, ct, { "x-preview-src": "favicon-forced" });
        } catch (e) {
            log("force favicon failed", String(e));
            return pngFallback({ "x-preview-src": "transparent-error" });
        }
    }

    try {
        // 1) HTML 가져오기
        const htmlRes = await fetchWithGuards(articleUrl.toString(), {
            "user-agent": UA,
            accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/*;q=0.8,*/*;q=0.7",
            "accept-language": "en-US,en;q=0.9,ko-KR;q=0.8,ko;q=0.7",
        });

        const ctype = htmlRes.headers.get("content-type") || "";
        log("html fetch", htmlRes.status, ctype);
        if (!htmlRes.ok) throw new Error(`HTML ${htmlRes.status}`);

        // 페이지가 바로 이미지
        if (IMG_TYPE.test(ctype)) {
            const blob = await htmlRes.blob();
            return imgResponse(blob, blob.type || ctype, { "x-preview-src": "direct" });
        }

        if (HTML_TYPE.test(ctype)) {
            const html = await htmlRes.text();
            const ogUrl = pickOg(html, articleUrl.toString()) || faviconOf(articleUrl);
            log("og candidate", ogUrl);

            // 2) 이미지 요청
            const imgRes = await fetchWithGuards(ogUrl, {
                "user-agent": UA,
                accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
                referer: articleUrl.toString(),
            });

            const ict = imgRes.headers.get("content-type") || "";
            log("img fetch", imgRes.status, ict);

            if (!imgRes.ok) {
                // 실패 → 파비콘
                const favi = await fetchWithGuards(faviconOf(articleUrl), {
                    "user-agent": UA,
                    accept: "image/*,*/*;q=0.8",
                });
                if (favi.ok) {
                    const blob = await favi.blob();
                    const ct = blob.type || favi.headers.get("content-type") || "image/png";
                    return imgResponse(blob, ct, { "x-preview-src": "favicon-on-fail" });
                }
                return pngFallback({ "x-preview-src": "transparent-on-fail" });
            }

            // 이미지 대신 HTML(봇 차단 등) → 파비콘
            if (HTML_TYPE.test(ict) || !IMG_TYPE.test(ict)) {
                const favi = await fetchWithGuards(faviconOf(articleUrl), {
                    "user-agent": UA,
                    accept: "image/*,*/*;q=0.8",
                });
                if (favi.ok) {
                    const blob = await favi.blob();
                    const ct = blob.type || favi.headers.get("content-type") || "image/png";
                    return imgResponse(blob, ct, { "x-preview-src": "favicon-on-html" });
                }
                return pngFallback({ "x-preview-src": "transparent-on-html" });
            }

            const blob = await imgRes.blob();
            return imgResponse(blob, blob.type || "image/jpeg", { "x-preview-src": "og" });
        }

        // HTML도 이미지도 아님 → 파비콘
        const favi = await fetchWithGuards(faviconOf(articleUrl), {
            "user-agent": UA,
            accept: "image/*,*/*;q=0.8",
        });
        const blob = await favi.blob();
        const ct = blob.type || favi.headers.get("content-type") || "image/png";
        return imgResponse(blob, ct, { "x-preview-src": "favicon-generic" });
    } catch (e) {
        log("catch error", String(e));
        return pngFallback({ "x-preview-src": "transparent-error" });
    }
}