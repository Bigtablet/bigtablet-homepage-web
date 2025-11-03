import type { HistoryItemType } from "src/widgets/about/history/type";

export interface YearGroup { year: number; list: Pick<HistoryItemType, "title">[] }

export const buildYearGroups = (items: HistoryItemType[]): YearGroup[] => {
    const byYear = new Map<number, Pick<HistoryItemType, "title">[]>();

    for (const it of items) {
        const arr = byYear.get(it.year) ?? [];
        arr.push({ title: it.title });
        byYear.set(it.year, arr);
    }

    // 연도 내림차순(최신 연도 먼저)
    return [...byYear.entries()]
        .sort((a, b) => b[0] - a[0])
        .map(([year, list]) => ({ year, list }));
};

export const yearsFromGroups = (groups: YearGroup[]) => groups.map(g => g.year);

// 현재 스크롤 위치에서 활성 연도 계산 (DOM 기반)
export const findActiveYear = (container: HTMLElement, stickyTop: number) => {
    const blocks = Array.from(container.querySelectorAll<HTMLElement>(".history__year-block"));
    if (!blocks.length) return null;

    const pivot = container.scrollTop + stickyTop + 8;
    let active = Number(blocks[0].dataset.year);

    for (const block of blocks) {
        const top = block.offsetTop;
        const bottom = top + block.offsetHeight;
        if (bottom >= pivot) {
            active = Number(block.dataset.year);
            break;
        }
    }
    return active;
};