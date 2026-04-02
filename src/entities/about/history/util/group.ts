import type { HistorySchema } from "src/entities/about/history/schema/history.schema";

/** 연혁 항목에서 표시에 필요한 필드만 추출한 타입 */
export type YearEntry = Pick<
	HistorySchema,
	"id" | "title" | "description" | "dateLabel"
>;

/** 연도별로 그룹핑된 연혁 데이터 */
export interface YearGroup {
	year: number;
	list: YearEntry[];
}

/**
 * @description 연혁 데이터를 연도별로 그룹핑한다. 최신 연도가 먼저 온다.
 *
 * @param items - 원본 연혁 데이터 배열
 * @returns 연도별 그룹 배열 (내림차순)
 *
 * @example
 * buildYearGroups([{ year: 2024, ... }, { year: 2023, ... }])
 * // [{ year: 2024, list: [...] }, { year: 2023, list: [...] }]
 */
export const buildYearGroups = (items: HistorySchema[]): YearGroup[] => {
	const byYear = new Map<number, YearEntry[]>();

	for (const historyItem of items) {
		const yearEntries = byYear.get(historyItem.year) ?? [];
		yearEntries.push({
			id: historyItem.id,
			title: historyItem.title,
			description: historyItem.description,
			dateLabel: historyItem.dateLabel,
		});
		byYear.set(historyItem.year, yearEntries);
	}

	return [...byYear.entries()]
		.sort((a, b) => b[0] - a[0]) // 최신 연도 먼저
		.map(([year, list]) => ({ year, list }));
};

/**
 * @description 연도 그룹 배열에서 연도 숫자만 추출한다.
 *
 * @param groups - 연도별 그룹 배열
 * @returns 연도 배열
 *
 * @see {@link buildYearGroups}
 */
export const yearsFromGroups = (groups: YearGroup[]) =>
	groups.map((group) => group.year);
