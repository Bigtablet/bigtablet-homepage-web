import { buildYearGroups, yearsFromGroups } from "src/entities/about/history/util/group";
import { describe, expect, it } from "vitest";

const makeItem = (year: number, title: string, id = `${year}-${title}`) => ({
	year,
	title,
	id,
	description: undefined,
	dateLabel: undefined,
});

describe("buildYearGroups", () => {
	it("빈 배열이면 빈 결과 반환", () => {
		expect(buildYearGroups([])).toEqual([]);
	});

	it("같은 연도 항목들을 하나의 그룹으로 묶음", () => {
		const items = [makeItem(2024, "A"), makeItem(2024, "B"), makeItem(2023, "C")];
		const groups = buildYearGroups(items);
		expect(groups).toHaveLength(2);
		const g2024 = groups.find((g) => g.year === 2024);
		expect(g2024?.list).toHaveLength(2);
	});

	it("최신 연도가 앞에 오도록 내림차순 정렬", () => {
		const items = [makeItem(2022, "A"), makeItem(2025, "B"), makeItem(2023, "C")];
		const years = buildYearGroups(items).map((g) => g.year);
		expect(years).toEqual([2025, 2023, 2022]);
	});

	it("YearEntry에 필요한 필드만 포함", () => {
		const items = [makeItem(2024, "타이틀", "abc")];
		const groups = buildYearGroups(items);
		expect(groups[0].list[0]).toMatchObject({
			id: "abc",
			title: "타이틀",
		});
	});
});

describe("yearsFromGroups", () => {
	it("연도 배열만 추출", () => {
		const groups = [
			{ year: 2025, list: [] },
			{ year: 2024, list: [] },
		];
		expect(yearsFromGroups(groups)).toEqual([2025, 2024]);
	});

	it("빈 배열이면 빈 결과", () => {
		expect(yearsFromGroups([])).toEqual([]);
	});
});
