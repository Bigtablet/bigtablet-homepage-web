import type { RecruitResponse } from "src/entities/recruit/schema/recruit.schema";
import { toRecruitCard, toRecruitCards } from "src/entities/recruit/util/date";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const base: RecruitResponse = {
	idx: 1,
	title: "백엔드 개발자",
	department: "IT",
	location: "PANGYO",
	recruitType: "FULL_TIME",
	experiment: "3년 이상",
	education: "BACHELOR",
	companyIntroduction: "회사 소개",
	positionIntroduction: "포지션 소개",
	mainResponsibility: "주요 업무",
	qualification: "자격 요건",
	preferredQualification: "우대 사항",
	startDate: "2026-01-01",
	endDate: null,
	isActive: true,
};

describe("toRecruitCard", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2026-03-11T00:00:00Z"));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("endDate 없으면 dday = 상시", () => {
		const card = toRecruitCard(base);
		expect(card.dday).toBe("상시");
	});

	it("오늘 마감이면 dday = D-DAY", () => {
		const card = toRecruitCard({ ...base, endDate: "2026-03-11" });
		expect(card.dday).toBe("D-DAY");
	});

	it("마감된 공고는 dday = 마감", () => {
		const card = toRecruitCard({ ...base, endDate: "2026-03-01" });
		expect(card.dday).toBe("마감");
	});

	it("미래 마감이면 D-N 형식", () => {
		const card = toRecruitCard({ ...base, endDate: "2026-03-21" });
		expect(card.dday).toBe("D-10");
	});

	it("tags에 부서/학력/고용형태/지역 라벨 포함", () => {
		const card = toRecruitCard(base);
		expect(card.tags).toContain("개발"); // IT → 개발
		expect(card.tags).toContain("학사"); // BACHELOR → 학사
		expect(card.tags).toContain("정규직"); // FULL_TIME → 정규직
		expect(card.tags).toContain("판교"); // PANGYO → 판교
	});

	it("원본 필드 그대로 포함", () => {
		const card = toRecruitCard(base);
		expect(card.idx).toBe(1);
		expect(card.title).toBe("백엔드 개발자");
	});
});

describe("toRecruitCards", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2026-03-11T00:00:00Z"));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("배열을 RecruitCard 배열로 변환", () => {
		const items = [base, { ...base, idx: 2, title: "프론트엔드" }];
		const cards = toRecruitCards(items);
		expect(cards).toHaveLength(2);
		expect(cards[1].title).toBe("프론트엔드");
	});

	it("빈 배열이면 빈 결과", () => {
		expect(toRecruitCards([])).toEqual([]);
	});
});
