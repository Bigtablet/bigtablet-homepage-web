import { describe, expect, it } from "vitest";
import { intersectByIdx } from "src/entities/recruit/util/merge";

const makeItem = (idx: number) =>
	({ idx, title: `title-${idx}` }) as Parameters<
		typeof intersectByIdx
	>[0][0];

describe("intersectByIdx", () => {
	it("빈 배열 목록이면 빈 결과 반환", () => {
		expect(intersectByIdx([])).toEqual([]);
		expect(intersectByIdx([[]])).toEqual([]);
	});

	it("단일 배열이면 그대로 반환", () => {
		const list = [makeItem(1), makeItem(2)];
		expect(intersectByIdx([list])).toEqual(list);
	});

	it("두 배열의 교집합만 반환", () => {
		const a = [makeItem(1), makeItem(2), makeItem(3)];
		const b = [makeItem(2), makeItem(3), makeItem(4)];
		const result = intersectByIdx([a, b]);
		const idxs = result.map((r) => r.idx);
		expect(idxs.sort()).toEqual([2, 3]);
	});

	it("세 배열 모두에 있는 항목만 반환", () => {
		const a = [makeItem(1), makeItem(2), makeItem(3)];
		const b = [makeItem(2), makeItem(3)];
		const c = [makeItem(3), makeItem(4)];
		const result = intersectByIdx([a, b, c]);
		expect(result.map((r) => r.idx)).toEqual([3]);
	});

	it("교집합 없으면 빈 배열 반환", () => {
		const a = [makeItem(1), makeItem(2)];
		const b = [makeItem(3), makeItem(4)];
		expect(intersectByIdx([a, b])).toEqual([]);
	});

	it("결과는 idx 내림차순 정렬", () => {
		const a = [makeItem(1), makeItem(3), makeItem(5)];
		const b = [makeItem(1), makeItem(3), makeItem(5)];
		const result = intersectByIdx([a, b]);
		expect(result.map((r) => r.idx)).toEqual([5, 3, 1]);
	});

	it("중복 idx가 있어도 한 번만 카운트", () => {
		const a = [makeItem(1), makeItem(1)];
		const b = [makeItem(1)];
		const result = intersectByIdx([a, b]);
		expect(result).toHaveLength(1);
	});
});
