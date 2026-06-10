import type { ApplyFormValues } from "src/features/recruit/apply/form/model/apply.schema";
import { formatPhone010, toRecruitRequest } from "src/features/recruit/apply/form/model/apply.util";
import { describe, expect, it } from "vitest";

describe("formatPhone010", () => {
	it("010으로 시작하는 번호 포맷팅 — 7자리 이하", () => {
		expect(formatPhone010("01012")).toBe("010-12");
	});

	it("010으로 시작하는 11자리 번호 포맷팅", () => {
		expect(formatPhone010("01012345678")).toBe("010-1234-5678");
	});

	it("숫자 외 문자 제거 후 포맷팅", () => {
		expect(formatPhone010("010-1234-5678")).toBe("010-1234-5678");
		expect(formatPhone010("010.1234.5678")).toBe("010-1234-5678");
	});

	it("010으로 시작하지 않으면 앞을 010으로 교체", () => {
		const result = formatPhone010("01112345678");
		expect(result.startsWith("010-")).toBe(true);
	});

	it("11자리 초과 입력은 11자리로 제한", () => {
		const result = formatPhone010("010123456789999");
		expect(result).toBe("010-1234-5678");
	});

	it("숫자가 3자리 이하면 포맷 없이 반환", () => {
		expect(formatPhone010("01")).toBe("010");
	});
});

describe("toRecruitRequest", () => {
	const baseValues: ApplyFormValues = {
		jobId: 0,
		name: "홍길동",
		phoneNumber: "010-1234-5678",
		email: "test@example.com",
		address: "대구광역시 동구",
		addressDetail: "912호",
		portfolio: "https://example.com/portfolio.pdf",
		coverLetter: "",
		profileImage: "https://example.com/profile.png",
		educationLevel: "BACHELOR",
		schoolName: "한국대학교",
		admissionYear: "2018",
		graduationEnd: "2022",
		department: "컴퓨터공학과",
		military: "COMPLETED",
		attachment1: "",
		attachment2: "",
		attachment3: "",
	};

	it("폼 필드 graduationEnd 를 API 필드 graduationYear 로 매핑한다", () => {
		const request = toRecruitRequest(baseValues, 7);

		expect(request.graduationYear).toBe("2022");
		expect(request).not.toHaveProperty("graduationEnd");
		expect(request.jobId).toBe(7);
	});

	it("GED 는 학교 관련 필드를 비우고 합격 연도(admissionYear)는 유지한다", () => {
		const request = toRecruitRequest(
			{ ...baseValues, educationLevel: "GED", admissionYear: "2020" },
			7,
		);

		expect(request.schoolName).toBe("");
		expect(request.graduationYear).toBe("");
		expect(request.department).toBe("");
		expect(request.admissionYear).toBe("2020");
	});

	it("결과는 strict 한 recruitRequestSchema 계약을 통과한다", () => {
		expect(() => toRecruitRequest(baseValues, 7)).not.toThrow();
	});
});
