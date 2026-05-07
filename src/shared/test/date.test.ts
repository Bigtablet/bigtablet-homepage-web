import { formatDate } from "src/shared/libs/ui/date";
import { describe, expect, it } from "vitest";

describe("formatDate", () => {
	it("인자 없으면 빈 문자열 반환", () => {
		expect(formatDate(undefined, "ko")).toBe("");
		expect(formatDate("2026-03-11", undefined)).toBe("");
	});

	it("유효하지 않은 날짜는 빈 문자열 반환", () => {
		expect(formatDate("not-a-date", "ko")).toBe("");
	});

	it("ko 로케일 — 연도/월/일 포함", () => {
		const result = formatDate("2026-03-11T12:00:00Z", "ko");
		expect(result).toContain("2026");
		expect(result).toMatch(/3월|03/);
		expect(result).toContain("11");
	});

	it("en 로케일 — 영문 월 표기 포함", () => {
		const result = formatDate("2026-03-11T12:00:00Z", "en");
		expect(result).toContain("Mar");
		expect(result).toContain("2026");
	});

	it("동일 입력은 동일 출력 (server/client hydration 일관성)", () => {
		const dateStr = "2026-04-02T10:00:00Z";
		const a = formatDate(dateStr, "ko");
		const b = formatDate(dateStr, "ko");
		expect(a).toBe(b);
	});
});
