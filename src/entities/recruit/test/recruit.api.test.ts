import { HttpResponse, http } from "msw";
import { server } from "src/test/msw/server";
import { describe, expect, it } from "vitest";
import { getRecruitDetailApi, getRecruitListApi } from "../api/recruit.api";

describe("getRecruitListApi", () => {
	it("채용 목록을 정상 조회한다", async () => {
		const result = await getRecruitListApi({ page: 1, size: 10 });
		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(0);
		expect(result[0]).toHaveProperty("idx");
	});

	it("빈 데이터 시 빈 배열을 반환한다", async () => {
		server.use(
			http.get("*/job/list", () => HttpResponse.json({ status: 200, message: "ok", data: null })),
		);
		const result = await getRecruitListApi({ page: 1, size: 10 });
		expect(result).toEqual([]);
	});

	it("문자열 데이터 시 빈 배열을 반환한다", async () => {
		server.use(
			http.get("*/job/list", () =>
				HttpResponse.json({
					status: 200,
					message: "ok",
					data: "no data",
				}),
			),
		);
		const result = await getRecruitListApi({ page: 1, size: 10 });
		expect(result).toEqual([]);
	});

	it("AbortSignal로 요청을 취소할 수 있다", async () => {
		const controller = new AbortController();
		controller.abort();
		await expect(
			getRecruitListApi({ page: 1, size: 10, signal: controller.signal }),
		).rejects.toThrow();
	});

	it("서버 에러 시 예외를 throw한다", async () => {
		server.use(http.get("*/job/list", () => HttpResponse.json(null, { status: 500 })));
		await expect(getRecruitListApi({ page: 1, size: 10 })).rejects.toThrow();
	});
});

describe("getRecruitDetailApi", () => {
	it("채용 상세를 정상 조회한다", async () => {
		const result = await getRecruitDetailApi(1);
		expect(result).toBeDefined();
		expect(result.idx).toBe(1);
	});

	it("빈 응답 시 에러를 throw한다", async () => {
		server.use(
			http.get("*/job", () => HttpResponse.json({ status: 200, message: "ok", data: null })),
		);
		await expect(getRecruitDetailApi(1)).rejects.toThrow("Empty response");
	});
});
