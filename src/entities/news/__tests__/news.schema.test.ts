import {
	newsItemSchema,
	newsListResponseSchema,
} from "src/entities/news/schema/news.schema";
import { describe, expect, it } from "vitest";

const validItem = {
	idx: 1,
	titleKr: "뉴스 제목",
	titleEn: "News Title",
	newsUrl: "https://example.com/news/1",
	thumbnailImageUrl: "https://example.com/thumb.png",
	createdAt: "2024-01-01",
	modifiedAt: "2024-01-02",
};

describe("newsItemSchema", () => {
	it("유효한 아이템을 파싱한다", () => {
		expect(newsItemSchema.parse(validItem)).toMatchObject({ idx: 1 });
	});

	it("newsUrl이 유효한 URL이 아니면 실패한다", () => {
		expect(() =>
			newsItemSchema.parse({ ...validItem, newsUrl: "not-a-url" }),
		).toThrow();
	});
});

describe("newsListResponseSchema", () => {
	it("목록 응답을 파싱한다", () => {
		const response = { status: 200, message: "ok", data: [validItem] };
		const parsed = newsListResponseSchema.parse(response);
		expect(parsed.data).toHaveLength(1);
	});
});
