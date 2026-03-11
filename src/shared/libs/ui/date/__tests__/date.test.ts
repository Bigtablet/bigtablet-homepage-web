import { formatRelative } from "src/shared/libs/ui/date";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("formatRelative", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2026-03-11T12:00:00Z"));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("인자 없으면 빈 문자열 반환", () => {
		expect(formatRelative(undefined, "ko")).toBe("");
		expect(formatRelative("2026-03-11", undefined)).toBe("");
	});

	it("30초 전 — 초 단위 (ko)", () => {
		const dateStr = new Date(Date.now() - 30_000).toISOString();
		const result = formatRelative(dateStr, "ko");
		expect(result).toContain("초");
	});

	it("5분 전 — 분 단위 (ko)", () => {
		const dateStr = new Date(Date.now() - 5 * 60_000).toISOString();
		const result = formatRelative(dateStr, "ko");
		expect(result).toContain("분");
	});

	it("3시간 전 — 시간 단위 (ko)", () => {
		const dateStr = new Date(Date.now() - 3 * 3600_000).toISOString();
		const result = formatRelative(dateStr, "ko");
		expect(result).toContain("시간");
	});

	it("5일 전 — 일 단위 (ko)", () => {
		const dateStr = new Date(Date.now() - 5 * 86400_000).toISOString();
		const result = formatRelative(dateStr, "ko");
		expect(result).toContain("일");
	});

	it("en 로케일 지원", () => {
		const dateStr = new Date(Date.now() - 2 * 86400_000).toISOString();
		const result = formatRelative(dateStr, "en");
		expect(result).toContain("day");
	});
});
