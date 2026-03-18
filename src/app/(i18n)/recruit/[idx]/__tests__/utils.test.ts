import { formatDate, toIdx } from "src/app/(i18n)/recruit/[idx]/utils";
import { describe, expect, it } from "vitest";

describe("toIdx", () => {
	it("숫자 문자열 → 숫자 반환", () => {
		expect(toIdx("123")).toBe(123);
	});

	it("숫자 → 그대로 반환", () => {
		expect(toIdx(42)).toBe(42);
	});

	it("NaN 변환 값 → null", () => {
		expect(toIdx("abc")).toBeNull();
	});

	it("undefined → null", () => {
		expect(toIdx(undefined)).toBeNull();
	});

	it("null → null", () => {
		expect(toIdx(null)).toBeNull();
	});

	it("Infinity → null", () => {
		expect(toIdx(Infinity)).toBeNull();
	});
});

describe("formatDate", () => {
	it("YYYY-MM-DD 형식 → YYYY.MM.DD 반환", () => {
		expect(formatDate("2024-03-05")).toBe("2024.03.05");
	});

	it("undefined → 빈 문자열 반환", () => {
		expect(formatDate(undefined)).toBe("");
	});

	it("빈 문자열 → 빈 문자열 반환", () => {
		expect(formatDate("")).toBe("");
	});

	it("유효하지 않은 날짜 문자열 → 원본 반환", () => {
		expect(formatDate("not-a-date")).toBe("not-a-date");
	});

	it("월/일 한 자리 숫자는 0으로 패딩", () => {
		expect(formatDate("2024-01-01")).toBe("2024.01.01");
	});
});
