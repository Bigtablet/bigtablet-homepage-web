import type { RecruitResponse } from "src/entities/recruit/schema/recruit.schema";
import { toRecruitCard } from "src/entities/recruit/util/adapter";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const base: RecruitResponse = {
	idx: 1,
	title: "디자이너",
	department: "DESIGN",
	location: "DAEGU",
	recruitType: "INTERN",
	experiment: "경력 무관",
	education: "NO_REQUIREMENT",
	companyIntroduction: "회사",
	positionIntroduction: "포지션",
	mainResponsibility: "업무",
	qualification: "요건",
	preferredQualification: "우대",
	startDate: "2026-01-01",
	endDate: null,
	isActive: true,
};

describe("adapter toRecruitCard", () => {
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

	it("D-day 미래 계산", () => {
		const card = toRecruitCard({ ...base, endDate: "2026-03-16" });
		expect(card.dday).toBe("D-5");
	});

	it("tags에 라벨 포함", () => {
		const card = toRecruitCard(base);
		expect(card.tags).toContain("디자인"); // DESIGN
		expect(card.tags).toContain("인턴"); // INTERN
		expect(card.tags).toContain("대구"); // DAEGU
		expect(card.tags).toContain("학력무관"); // NO_REQUIREMENT
	});

	it("zod 스키마 parse 통과 — 필드 존재 확인", () => {
		const card = toRecruitCard(base);
		expect(typeof card.idx).toBe("number");
		expect(typeof card.dday).toBe("string");
		expect(Array.isArray(card.tags)).toBe(true);
	});
});
