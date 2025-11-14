import type { HistoryItemType } from "src/widgets/about/history/type";

export type YearEntry = Pick<HistoryItemType, "id" | "title" | "description" | "dateLabel">;

export interface YearGroup {
    year: number;
    list: YearEntry[];
}

export const buildYearGroups = (items: HistoryItemType[]): YearGroup[] => {
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
        .map(([year, list]) => ({ year, list }));
};

export const yearsFromGroups = (groups: YearGroup[]) => groups.map((g) => g.year);

export function findActiveYear(container: HTMLElement, stickyTop: number): number | null;
export function findActiveYear(container: Window, stickyTop: number): number | null;
export function findActiveYear(container: HTMLElement | Window, stickyTop: number): number | null {
    const isWindow = (c: any): c is Window => typeof (c as Window).scrollY === "number";

    const blocks = isWindow(container)
        ? Array.from(document.querySelectorAll<HTMLElement>('[data-year]'))
        : Array.from((container as HTMLElement).querySelectorAll<HTMLElement>('[data-year]'));

    if (!blocks.length) return null;

    const scrollTop = isWindow(container) ? container.scrollY : (container as HTMLElement).scrollTop;
    const pivot = scrollTop + stickyTop + 8;

    let active = Number(blocks[0].dataset.year);
    for (const block of blocks) {
        const top = isWindow(container)
            ? block.getBoundingClientRect().top + (container as Window).scrollY
            : (block as HTMLElement).offsetTop;
        const bottom = top + block.offsetHeight;
        if (bottom >= pivot) {
            active = Number(block.dataset.year);
            break;
        }
    }
    return Number.isFinite(active) ? active : null;
}