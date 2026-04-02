import type { RecruitResponse } from "src/entities/recruit/schema/recruit.schema";

/**
 * @description 여러 채용 공고 배열의 교집합을 idx 기준으로 구한다.
 * 결과는 idx 내림차순으로 정렬된다.
 *
 * @param lists - 채용 공고 배열들
 * @returns 모든 배열에 공통으로 존재하는 채용 공고 배열
 *
 * @example
 * intersectByIdx([[item1, item2], [item2, item3]]) // [item2]
 */
export const intersectByIdx = (
	lists: RecruitResponse[][],
): RecruitResponse[] => {
	const nonEmpty = lists.filter((list) => list?.length);
	if (nonEmpty.length === 0) return [];
	if (nonEmpty.length === 1) return nonEmpty[0];

	const itemMap = new Map<number, RecruitResponse>();
	const frequencyMap = new Map<number, number>();

	for (const entries of nonEmpty) {
		const seen = new Set<number>();
		for (const recruitItem of entries) {
			if (typeof recruitItem.idx !== "number") continue;
			if (seen.has(recruitItem.idx)) continue;
			seen.add(recruitItem.idx);
			if (!itemMap.has(recruitItem.idx))
				itemMap.set(recruitItem.idx, recruitItem);
			frequencyMap.set(
				recruitItem.idx,
				(frequencyMap.get(recruitItem.idx) ?? 0) + 1,
			);
		}
	}
	const need = nonEmpty.length;
	return Array.from(frequencyMap.entries())
		.filter(([, frequency]) => frequency === need)
		.map(([idx]) => itemMap.get(idx) as RecruitResponse)
		.sort((a, b) => (b.idx ?? 0) - (a.idx ?? 0));
};
