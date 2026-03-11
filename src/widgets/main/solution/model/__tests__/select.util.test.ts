import { buildInitialSelected } from "src/widgets/main/solution/model/select.util";
import { SOURCES } from "src/widgets/main/solution/model/video-sources";
import { describe, expect, it, vi } from "vitest";

describe("buildInitialSelected", () => {
	it("SOURCES의 모든 키에 대해 값이 할당됨", () => {
		const result = buildInitialSelected();
		for (const key of Object.keys(SOURCES)) {
			expect(result[Number(key)]).toBeDefined();
		}
	});

	it("각 값이 해당 SOURCES 목록에 있는 URL", () => {
		const result = buildInitialSelected();
		for (const [k, urls] of Object.entries(SOURCES)) {
			expect(urls).toContain(result[Number(k)]);
		}
	});

	it("단일 URL인 경우 항상 그 URL 반환", () => {
		// id=1, id=2, id=5는 단일 URL
		const result = buildInitialSelected();
		expect(result[1]).toBe(SOURCES[1][0]);
		expect(result[2]).toBe(SOURCES[2][0]);
		expect(result[5]).toBe(SOURCES[5][0]);
	});

	it("여러 URL인 경우 Math.random으로 선택", () => {
		vi.spyOn(Math, "random").mockReturnValue(0);
		const result = buildInitialSelected();
		// Math.random() = 0 → 항상 첫 번째 URL
		expect(result[3]).toBe(SOURCES[3][0]);
		vi.restoreAllMocks();
	});

	it("Math.random = 0.99일 때 마지막 URL 선택", () => {
		vi.spyOn(Math, "random").mockReturnValue(0.99);
		const result = buildInitialSelected();
		const urls = SOURCES[3];
		expect(result[3]).toBe(urls[urls.length - 1]);
		vi.restoreAllMocks();
	});
});
