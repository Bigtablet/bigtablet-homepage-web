import { SOURCES } from "src/widgets/main/solution/model/video-sources";
import { describe, expect, it } from "vitest";

const UUID_PATTERN = /^\/media\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

describe("SOURCES", () => {
	it("키 1~5가 모두 존재한다", () => {
		expect(
			Object.keys(SOURCES)
				.map(Number)
				.sort((a, b) => a - b),
		).toEqual([1, 2, 3, 4, 5]);
	});

	it("각 키의 URL 배열이 비어있지 않다", () => {
		for (const urls of Object.values(SOURCES)) {
			expect(urls.length).toBeGreaterThan(0);
		}
	});

	it("모든 URL이 /media/uuid 패턴을 따른다", () => {
		for (const urls of Object.values(SOURCES)) {
			for (const url of urls) {
				expect(url).toMatch(UUID_PATTERN);
			}
		}
	});

	it("중복 URL이 없다", () => {
		const all = Object.values(SOURCES).flat();
		const unique = new Set(all);
		expect(unique.size).toBe(all.length);
	});

	it("총 10개의 URL이 있다", () => {
		const total = Object.values(SOURCES).reduce((sum, urls) => sum + urls.length, 0);
		expect(total).toBe(10);
	});
});
