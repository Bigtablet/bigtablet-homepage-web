import { ellipsis } from "src/shared/libs/ui/text";
import { describe, expect, it } from "vitest";

describe("ellipsis", () => {
	it("빈 값이면 빈 문자열 반환", () => {
		expect(ellipsis(undefined)).toBe("");
		expect(ellipsis(null)).toBe("");
		expect(ellipsis("")).toBe("");
	});

	it("max 이하이면 원본 그대로 반환", () => {
		expect(ellipsis("hello", 10)).toBe("hello");
		expect(ellipsis("hello", 5)).toBe("hello");
	});

	it("max 초과 시 잘라서 … 추가", () => {
		const text = "가나다라마바사아자차카타파하";
		const result = ellipsis(text, 5);
		expect(result).toBe("가나다라마…");
	});

	it("기본 max=120 적용", () => {
		const text = "a".repeat(121);
		const result = ellipsis(text);
		expect(result.endsWith("…")).toBe(true);
		expect(result.length).toBe(121); // 120자 + …
	});

	it("정확히 max 길이이면 자르지 않음", () => {
		const text = "a".repeat(120);
		expect(ellipsis(text)).toBe(text);
	});

	it("끝에 공백 있으면 trimEnd 처리", () => {
		const text = `hello   ${"x".repeat(113)}`;
		const result = ellipsis(text, 8);
		expect(result).toBe("hello…");
	});
});
