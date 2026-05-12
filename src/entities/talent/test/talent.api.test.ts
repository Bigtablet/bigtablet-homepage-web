import { HttpResponse, http } from "msw";
import { server } from "src/test/msw/server";
import { describe, expect, it } from "vitest";
import { PostTalentApi } from "../api/talent.api";

const validBody = {
	name: "홍길동",
	email: "honggildong@example.com",
	department: "프론트엔드",
	portfolioUrl: "https://portfolio.example.com",
};

describe("PostTalentApi", () => {
	it("탤런트 등록 시 올바른 페이로드를 전송하고 성공 응답을 반환한다", async () => {
		let capturedBody: unknown;
		server.use(
			http.post("*/talent", async ({ request }) => {
				capturedBody = await request.json();
				return HttpResponse.json({ status: 201, message: "ok" });
			}),
		);
		const result = await PostTalentApi(validBody);
		expect(capturedBody).toEqual(validBody);
		expect(result.status).toBe(201);
		expect(result.message).toBe("ok");
	});

	it("etcUrl 포함 시 페이로드에 그대로 실려 전송된다", async () => {
		let capturedBody: unknown;
		server.use(
			http.post("*/talent", async ({ request }) => {
				capturedBody = await request.json();
				return HttpResponse.json({ status: 201, message: "ok" });
			}),
		);
		const payload = { ...validBody, etcUrl: ["https://a.com", "https://b.com"] };
		const result = await PostTalentApi(payload);
		expect(capturedBody).toEqual(payload);
		expect(result.status).toBe(201);
	});

	it("서버 4xx 시 예외를 throw한다", async () => {
		server.use(http.post("*/talent", () => HttpResponse.json(null, { status: 400 })));
		await expect(PostTalentApi(validBody)).rejects.toThrow();
	});
});
