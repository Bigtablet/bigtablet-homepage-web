import { HttpResponse, http } from "msw";
import { server } from "src/test/msw/server";
import { describe, expect, it } from "vitest";
import { getNewsApi } from "../api/news.api";

describe("getNewsApi", () => {
	it("뉴스 목록을 정상 조회한다", async () => {
		const result = await getNewsApi({ page: 1, size: 10 });
		expect(result).toBeDefined();
		expect(result.data).toBeDefined();
	});

	it("빈 데이터 시 null data를 반환한다", async () => {
		server.use(
			http.get("*/news/list", () =>
				HttpResponse.json({ status: 200, message: "ok", data: null }),
			),
		);
		const result = await getNewsApi({ page: 1, size: 10 });
		expect(result.data).toBeNull();
	});

	it("AbortSignal로 요청을 취소할 수 있다", async () => {
		const controller = new AbortController();
		controller.abort();
		await expect(
			getNewsApi({ page: 1, size: 10 }, controller.signal),
		).rejects.toThrow();
	});

	it("서버 에러 시 예외를 throw한다", async () => {
		server.use(
			http.get("*/news/list", () => HttpResponse.json(null, { status: 500 })),
		);
		await expect(getNewsApi({ page: 1, size: 10 })).rejects.toThrow();
	});
});
