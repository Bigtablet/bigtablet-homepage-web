import { act, renderHook } from "@testing-library/react";
import type { HistorySchema } from "src/entities/about/history/schema/history.schema";
import { useHistoryGroups } from "src/widgets/about/history/model/use-history-groups";
import { describe, expect, it } from "vitest";

const makeItem = (year: number, title: string): HistorySchema => ({
	id: `${year}-${title}`,
	year,
	title,
});

describe("useHistoryGroups", () => {
	it("빈 배열이면 groups, years 빈 상태", () => {
		const { result } = renderHook(() => useHistoryGroups([]));
		expect(result.current.groups).toEqual([]);
		expect(result.current.years).toEqual([]);
		expect(result.current.currentYear).toBeNull();
		expect(result.current.activeGroup).toBeNull();
	});

	it("items가 있으면 currentYear를 최신 연도로 초기화", () => {
		const items = [makeItem(2024, "A"), makeItem(2023, "B")];
		const { result } = renderHook(() => useHistoryGroups(items));
		expect(result.current.currentYear).toBe(2024);
	});

	it("activeGroup은 currentYear의 그룹 반환", () => {
		const items = [
			makeItem(2024, "A"),
			makeItem(2024, "B"),
			makeItem(2023, "C"),
		];
		const { result } = renderHook(() => useHistoryGroups(items));
		expect(result.current.activeGroup?.year).toBe(2024);
		expect(result.current.activeGroup?.list).toHaveLength(2);
	});

	it("setCurrentYear로 연도 변경 시 activeGroup 갱신", () => {
		const items = [makeItem(2024, "A"), makeItem(2023, "B")];
		const { result } = renderHook(() => useHistoryGroups(items));

		act(() => {
			result.current.setCurrentYear(2023);
		});

		expect(result.current.currentYear).toBe(2023);
		expect(result.current.activeGroup?.year).toBe(2023);
		expect(result.current.activeGroup?.list[0].title).toBe("B");
	});

	it("years는 내림차순 정렬", () => {
		const items = [
			makeItem(2022, "A"),
			makeItem(2025, "B"),
			makeItem(2023, "C"),
		];
		const { result } = renderHook(() => useHistoryGroups(items));
		expect(result.current.years).toEqual([2025, 2023, 2022]);
	});
});
