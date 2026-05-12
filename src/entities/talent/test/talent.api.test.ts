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
	it("탤런트 등록 시 성공 응답을 반환한다", async () => {
		const result = await PostTalentApi(validBody);
		expect(result.status).toBe(201);
		expect(result.message).toBe("ok");
	});

	it("etcUrl 포함 시에도 정상 등록된다", async () => {
		const result = await PostTalentApi({
			...validBody,
			etcUrl: ["https://a.com", "https://b.com"],
		});
		expect(result.status).toBe(201);
	});

	it("서버 4xx 시 예외를 throw한다", async () => {
		server.use(http.post("*/talent", () => HttpResponse.json(null, { status: 400 })));
		await expect(PostTalentApi(validBody)).rejects.toThrow();
	});
});
