import { afterEach, describe, expect, it, vi } from "vitest";

// crypto.randomUUID 모킹
vi.stubGlobal("crypto", {
	randomUUID: () => "test-uuid-1234",
});

// Next.js server 모듈 모킹
const mockRedirect = vi.fn((url: URL, status: number) => ({
	headers: new Headers(),
	status,
	url: url.toString(),
}));
const mockNextHeaders = new Headers();
const mockCookies = new Map<string, unknown>();
const mockNext = vi.fn((_opts?: unknown) => ({
	headers: mockNextHeaders,
	cookies: {
		set: (name: string, value: unknown, options: unknown) =>
			mockCookies.set(name, { value, options }),
	},
}));

vi.mock("next/server", () => ({
	NextResponse: {
		redirect: (url: URL, status: number) => mockRedirect(url, status),
		next: (opts?: unknown) => mockNext(opts),
	},
}));

import { config, proxy } from "src/proxy";

const makeRequest = (
	pathname: string,
	search = "",
	options?: { localeCookie?: string; acceptLanguage?: string },
) => {
	const url = `https://example.com${pathname}${search}`;
	const headers = new Headers();
	if (options?.acceptLanguage) {
		headers.set("accept-language", options.acceptLanguage);
	}
	const cookies = new Map<string, string>();
	if (options?.localeCookie) {
		cookies.set("NEXT_LOCALE", options.localeCookie);
	}
	return {
		url,
		headers,
		cookies: {
			has: (key: string) => cookies.has(key),
			get: (key: string) => cookies.get(key),
		},
	} as unknown as import("next/server").NextRequest;
};

describe("proxy", () => {
	afterEach(() => {
		vi.clearAllMocks();
		mockNextHeaders.delete("Content-Security-Policy");
		mockCookies.clear();
	});

	it("config matcher가 정적 리소스를 제외한다", () => {
		expect(config.matcher[0]).toContain("(?!api|_next");
	});

	describe("locale prefix redirect", () => {
		it("/en/about → /about 308 리다이렉트", () => {
			proxy(makeRequest("/en/about"));
			expect(mockRedirect).toHaveBeenCalledWith(
				expect.objectContaining({ pathname: "/about" }),
				308,
			);
		});

		it("/ko/main → /main 308 리다이렉트", () => {
			proxy(makeRequest("/ko/main"));
			expect(mockRedirect).toHaveBeenCalledWith(
				expect.objectContaining({ pathname: "/main" }),
				308,
			);
		});

		it("/ko → / 308 리다이렉트", () => {
			proxy(makeRequest("/ko"));
			expect(mockRedirect).toHaveBeenCalledWith(expect.objectContaining({ pathname: "/" }), 308);
		});

		it("쿼리 파라미터를 유지한다", () => {
			proxy(makeRequest("/en/about", "?tab=1"));
			expect(mockRedirect).toHaveBeenCalledWith(expect.objectContaining({ search: "?tab=1" }), 308);
		});
	});

	describe("non-locale paths", () => {
		it("/about → NextResponse.next()", () => {
			proxy(makeRequest("/about"));
			expect(mockNext).toHaveBeenCalled();
			expect(mockRedirect).not.toHaveBeenCalled();
		});
	});

	describe("locale cookie", () => {
		it("쿠키가 없으면 Accept-Language 기반으로 설정한다", () => {
			proxy(makeRequest("/about", "", { acceptLanguage: "ko-KR,ko;q=0.9" }));
			expect(mockCookies.has("NEXT_LOCALE")).toBe(true);
			expect(mockCookies.get("NEXT_LOCALE")).toMatchObject({
				value: "ko",
			});
		});

		it("쿠키가 있으면 건드리지 않는다", () => {
			proxy(makeRequest("/about", "", { localeCookie: "ko" }));
			expect(mockCookies.has("NEXT_LOCALE")).toBe(false);
		});

		it("지원하지 않는 언어이면 기본값 en을 설정한다", () => {
			proxy(makeRequest("/about", "", { acceptLanguage: "fr-FR,fr;q=0.9" }));
			expect(mockCookies.get("NEXT_LOCALE")).toMatchObject({
				value: "en",
			});
		});
	});
});
