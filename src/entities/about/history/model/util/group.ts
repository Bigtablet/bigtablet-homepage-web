import {HistorySchema} from "src/entities/about/history/model/schema/history.schema";

export type YearEntry = Pick<HistorySchema, "id" | "title" | "description" | "dateLabel">;

export interface YearGroup {
    year: number;
    list: YearEntry[];
}

export const buildYearGroups = (items: HistorySchema[]): YearGroup[] => {
    const byYear = new Map<number, YearEntry[]>();

    for (const it of items) {
        const arr = byYear.get(it.year) ?? [];
        arr.push({
            id: it.id,
            title: it.title,
            description: it.description,
            dateLabel: it.dateLabel,
        });
        byYear.set(it.year, arr);
    }

    return [...byYear.entries()]
        .sort((a, b) => b[0] - a[0]) // 최신 연도 먼저
        .map(([year, list]) => ({year, list}));
};

export const yearsFromGroups = (groups: YearGroup[]) => groups.map((g) => g.year);