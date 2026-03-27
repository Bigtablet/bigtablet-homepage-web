import {
	getTalentDetailResponseSchema,
	postTalentSchema,
} from "src/entities/talent/schema/talent.schema";
import { describe, expect, it } from "vitest";

describe("postTalentSchema", () => {
	it("유효한 데이터를 파싱한다", () => {
		const data = {
			name: "홍길동",
			email: "hong@example.com",
			department: "개발",
			portfolioUrl: "https://portfolio.com",
		};
		expect(postTalentSchema.parse(data)).toMatchObject(data);
	});

	it("이름이 비어있으면 실패한다", () => {
		expect(() =>
			postTalentSchema.parse({
				name: "",
				email: "a@b.com",
				department: "개발",
				portfolioUrl: "https://p.com",
			}),
		).toThrow();
	});

	it("이메일 형식이 잘못되면 실패한다", () => {
		expect(() =>
			postTalentSchema.parse({
				name: "홍길동",
				email: "invalid",
				department: "개발",
				portfolioUrl: "https://p.com",
			}),
		).toThrow();
	});

	it("etcUrl은 선택 필드다", () => {
		const data = {
			name: "홍길동",
			email: "a@b.com",
			department: "개발",
			portfolioUrl: "https://p.com",
			etcUrl: ["https://github.com/hong"],
		};
		const parsed = postTalentSchema.parse(data);
		expect(parsed.etcUrl).toEqual(["https://github.com/hong"]);
	});
});

describe("getTalentDetailResponseSchema", () => {
	it("상세 응답을 파싱한다", () => {
		const res = {
			status: 200,
			message: "ok",
			data: {
				idx: 1,
				email: "a@b.com",
				name: "홍길동",
				department: "개발",
				portfolioUrl: "https://p.com",
				createdAt: "2024-01-01",
			},
		};
		const parsed = getTalentDetailResponseSchema.parse(res);
		expect(parsed.data?.idx).toBe(1);
	});
});
