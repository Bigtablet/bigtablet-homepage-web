import { afterEach, describe, expect, it, vi } from "vitest";

// Next.js server 모듈 모킹
const mockRedirect = vi.fn((url: URL, status: number) => ({
	headers: new Headers(),
	status,
	url: url.toString(),
}));
const mockNext = vi.fn(() => ({
	headers: new Headers(),
}));

vi.mock("next/server", () => ({
	NextResponse: {
		redirect: (url: URL, status: number) => mockRedirect(url, status),
		next: () => mockNext(),
	},
}));

import proxy, { config } from "src/proxy";

const makeRequest = (pathname: string, search = "") => {
	const url = `https://example.com${pathname}${search}`;
	return { url } as import("next/server").NextRequest;
};

describe("proxy middleware", () => {
	afterEach(() => vi.clearAllMocks());

	it("config matcher가 모든 경로를 포함한다", () => {
		expect(config.matcher).toContain("/(.*)");
	});

	describe("locale prefix redirect", () => {
		it("/en/about → /about 308 리다이렉트", () => {
			proxy(makeRequest("/en/about"));

			expect(mockRedirect).toHaveBeenCalledWith(
				expect.objectContaining({
					pathname: "/about",
				}),
				308,
			);
		});

		it("/ko/main → /main 308 리다이렉트", () => {
			proxy(makeRequest("/ko/main"));

			expect(mockRedirect).toHaveBeenCalledWith(
				expect.objectContaining({
					pathname: "/main",
				}),
				308,
			);
		});

		it("/ko → / 308 리다이렉트", () => {
			proxy(makeRequest("/ko"));

			expect(mockRedirect).toHaveBeenCalledWith(
				expect.objectContaining({
					pathname: "/",
				}),
				308,
			);
		});

		it("쿼리 파라미터를 유지한다", () => {
			proxy(makeRequest("/en/about", "?tab=1"));

			expect(mockRedirect).toHaveBeenCalledWith(
				expect.objectContaining({
					search: "?tab=1",
				}),
				308,
			);
		});

		it("리다이렉트 응답에 x-mw: redirected 헤더를 설정한다", () => {
			const res = proxy(makeRequest("/en/about"));
			expect(res.headers.get("x-mw")).toBe("redirected");
		});
	});

	describe("non-locale paths", () => {
		it("/about → NextResponse.next()", () => {
			proxy(makeRequest("/about"));

			expect(mockNext).toHaveBeenCalled();
			expect(mockRedirect).not.toHaveBeenCalled();
		});

		it("응답에 x-mw: passed 헤더를 설정한다", () => {
			const res = proxy(makeRequest("/about"));
			expect(res.headers.get("x-mw")).toBe("passed");
		});
	});
});
