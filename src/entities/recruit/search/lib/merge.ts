import {RecruitResponse} from "src/entities/recruit/model/schema/recruit.schema";

export const intersectByIdx = (lists: RecruitResponse[][]): RecruitResponse[] => {
    const nonEmpty = lists.filter(a => a?.length);
    if (nonEmpty.length === 0) return [];
    if (nonEmpty.length === 1) return nonEmpty[0];

    const count = new Map<number, RecruitResponse>();
    const freq = new Map<number, number>();

    for (const arr of nonEmpty) {
        const seen = new Set<number>();
        for (const it of arr) {
            if (typeof it.idx !== "number") continue;
            if (seen.has(it.idx)) continue;
            seen.add(it.idx);
            if (!count.has(it.idx)) count.set(it.idx, it);
            freq.set(it.idx, (freq.get(it.idx) ?? 0) + 1);
        }
    }
    const need = nonEmpty.length;
    return Array.from(freq.entries())
        .filter(([, n]) => n === need)
        .map(([idx]) => count.get(idx)!)
        .sort((a, b) => (b.idx! - a.idx!));
};