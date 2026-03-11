import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { toRecruit, toRecruitSummary } from "src/entities/recruit/util/mapper";
import type { RecruitResponse } from "src/entities/recruit/schema/recruit.schema";

const baseResponse: RecruitResponse = {
	idx: 1,
	title: "프론트엔드 개발자",
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
	createdAt: "2026-01-01",
	modifiedAt: "2026-01-01",
};

describe("toRecruit", () => {
	it("유효한 DTO를 RecruitDTO로 변환", () => {
		const result = toRecruit(baseResponse);
		expect(result).not.toBeNull();
		expect(result?.idx).toBe(1);
		expect(result?.title).toBe("프론트엔드 개발자");
	});

	it("idx가 숫자가 아니면 null 반환", () => {
		const invalid = { ...baseResponse, idx: NaN };
		expect(toRecruit(invalid)).toBeNull();
	});

	it("idx가 Infinity이면 null 반환", () => {
		const invalid = { ...baseResponse, idx: Infinity };
		expect(toRecruit(invalid)).toBeNull();
	});
});

describe("toRecruitSummary", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2026-03-11T00:00:00Z"));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("유효한 DTO를 RecruitSummary로 변환", () => {
		const result = toRecruitSummary(baseResponse);
		expect(result).not.toBeNull();
		expect(result?.idx).toBe(1);
		expect(result?.title).toBe("프론트엔드 개발자");
		expect(result?.tags).toBeInstanceOf(Array);
	});

	it("endDate 없으면 dday 빈 문자열", () => {
		const result = toRecruitSummary({ ...baseResponse, endDate: undefined });
		expect(result?.dday).toBe("");
	});

	it("마감된 공고는 dday = 마감", () => {
		const result = toRecruitSummary({
			...baseResponse,
			endDate: "2026-03-01",
		});
		expect(result?.dday).toBe("마감");
	});

	it("오늘 마감 공고는 dday = D-DAY", () => {
		const result = toRecruitSummary({
			...baseResponse,
			endDate: "2026-03-11",
		});
		expect(result?.dday).toBe("D-DAY");
	});

	it("미래 마감 공고는 D-N 형식", () => {
		const result = toRecruitSummary({
			...baseResponse,
			endDate: "2026-03-21",
		});
		expect(result?.dday).toMatch(/^D-\d+$/);
	});

	it("idx가 숫자가 아니면 null 반환", () => {
		expect(toRecruitSummary({ ...baseResponse, idx: NaN })).toBeNull();
	});
});
