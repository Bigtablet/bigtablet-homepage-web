import {
	blogDetailResponseSchema,
	blogItemSchema,
	blogListResponseSchema,
} from "src/entities/blog/schema/blog.schema";
import { describe, expect, it } from "vitest";

const validItem = {
	idx: 1,
	titleKr: "테스트",
	titleEn: "Test",
	imageUrl: "https://example.com/img.png",
	summaryKr: "요약",
	summaryEn: "summary",
	contentKr: "내용",
	contentEn: "content",
	createdAt: "2024-01-01",
	modifiedAt: "2024-01-02",
	views: 10,
};

describe("blogItemSchema", () => {
	it("유효한 아이템을 파싱한다", () => {
		expect(blogItemSchema.parse(validItem)).toMatchObject({ idx: 1 });
	});

	it("optional 필드가 없어도 파싱된다", () => {
		const { imageUrl, summaryKr, summaryEn, contentKr, contentEn, views, ...minimal } = validItem;
		expect(blogItemSchema.parse(minimal)).toMatchObject({ idx: 1 });
	});

	it("idx가 없으면 실패한다", () => {
		const { idx, ...noIdx } = validItem;
		expect(() => blogItemSchema.parse(noIdx)).toThrow();
	});
});

describe("blogListResponseSchema", () => {
	it("목록 응답을 파싱한다", () => {
		const response = { status: 200, message: "ok", data: [validItem] };
		const parsed = blogListResponseSchema.parse(response);
		expect(parsed.data).toHaveLength(1);
	});
});

describe("blogDetailResponseSchema", () => {
	it("상세 응답을 파싱한다", () => {
		const response = { status: 200, message: "ok", data: validItem };
		const parsed = blogDetailResponseSchema.parse(response);
		expect(parsed.data?.idx).toBe(1);
	});
});
