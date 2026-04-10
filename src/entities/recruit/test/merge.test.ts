import type { RecruitResponse } from "src/entities/recruit/schema/recruit.schema";
import { intersectByIdx } from "src/entities/recruit/util/merge";
import { describe, expect, it } from "vitest";

const makeItem = (idx: number): RecruitResponse => ({
	idx,
	title: `title-${idx}`,
	department: "IT",
	location: "PANGYO",
	recruitType: "FULL_TIME",
	experiment: "",
	education: "NO_REQUIREMENT",
	companyIntroduction: "",
	positionIntroduction: "",
	mainResponsibility: "",
	qualification: "",
	preferredQualification: "",
	startDate: "2026-01-01",
	endDate: null,
	isActive: true,
});

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
		const firstList = [makeItem(1), makeItem(2), makeItem(3)];
		const secondList = [makeItem(2), makeItem(3), makeItem(4)];
		const result = intersectByIdx([firstList, secondList]);
		const idxs = result.map((recruitItem) => recruitItem.idx);
		expect(idxs.sort()).toEqual([2, 3]);
	});

	it("세 배열 모두에 있는 항목만 반환", () => {
		const firstList = [makeItem(1), makeItem(2), makeItem(3)];
		const secondList = [makeItem(2), makeItem(3)];
		const thirdList = [makeItem(3), makeItem(4)];
		const result = intersectByIdx([firstList, secondList, thirdList]);
		expect(result.map((recruitItem) => recruitItem.idx)).toEqual([3]);
	});

	it("교집합 없으면 빈 배열 반환", () => {
		const firstList = [makeItem(1), makeItem(2)];
		const secondList = [makeItem(3), makeItem(4)];
		expect(intersectByIdx([firstList, secondList])).toEqual([]);
	});

	it("결과는 idx 내림차순 정렬", () => {
		const firstList = [makeItem(1), makeItem(3), makeItem(5)];
		const secondList = [makeItem(1), makeItem(3), makeItem(5)];
		const result = intersectByIdx([firstList, secondList]);
		expect(result.map((recruitItem) => recruitItem.idx)).toEqual([5, 3, 1]);
	});

	it("중복 idx가 있어도 한 번만 카운트", () => {
		const firstList = [makeItem(1), makeItem(1)];
		const secondList = [makeItem(1)];
		const result = intersectByIdx([firstList, secondList]);
		expect(result).toHaveLength(1);
	});
});
