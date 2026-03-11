import { applySchema } from "src/features/recruit/apply/form/model/apply.schema";
import { describe, expect, it } from "vitest";

const base = {
	jobId: 1,
	name: "홍길동",
	phoneNumber: "010-1234-5678",
	email: "test@example.com",
	address: "서울시 강남구",
	addressDetail: "",
	portfolio: "https://github.com/test",
	profileImage: "https://example.com/image.png",
	educationLevel: "BACHELOR" as const,
	schoolName: "서울대학교",
	admissionYear: "2020",
	graduationEnd: "2024",
	department: "컴퓨터공학",
	military: "NOT_APPLICABLE" as const,
	attachment1: "",
	attachment2: "",
	attachment3: "",
};

describe("applySchema", () => {
	it("유효한 데이터는 파싱 성공", () => {
		expect(() => applySchema.parse(base)).not.toThrow();
	});

	it("이름 2자 미만이면 실패", () => {
		const result = applySchema.safeParse({ ...base, name: "홍" });
		expect(result.success).toBe(false);
	});

	it("이름 20자 초과이면 실패", () => {
		const result = applySchema.safeParse({
			...base,
			name: "홍".repeat(21),
		});
		expect(result.success).toBe(false);
	});

	it("전화번호 형식 불일치이면 실패", () => {
		const result = applySchema.safeParse({
			...base,
			phoneNumber: "01012345678",
		});
		expect(result.success).toBe(false);
	});

	it("이메일 형식 불일치이면 실패", () => {
		const result = applySchema.safeParse({
			...base,
			email: "invalid-email",
		});
		expect(result.success).toBe(false);
	});

	it("attachment URL 형식 불일치이면 실패", () => {
		const result = applySchema.safeParse({
			...base,
			attachment1: "not-a-url",
		});
		expect(result.success).toBe(false);
	});

	it("attachment 빈 문자열은 허용", () => {
		expect(() => applySchema.parse({ ...base, attachment1: "" })).not.toThrow();
	});

	it("GED 학력이면 schoolName 불필요", () => {
		const data = {
			...base,
			educationLevel: "GED" as const,
			schoolName: "",
			admissionYear: "2022",
			graduationEnd: "",
			department: "",
		};
		expect(() => applySchema.parse(data)).not.toThrow();
	});

	it("GED 학력인데 admissionYear 없으면 실패", () => {
		const data = {
			...base,
			educationLevel: "GED" as const,
			admissionYear: "",
		};
		const result = applySchema.safeParse(data);
		expect(result.success).toBe(false);
	});

	it("BACHELOR인데 schoolName 없으면 실패", () => {
		const result = applySchema.safeParse({ ...base, schoolName: "" });
		expect(result.success).toBe(false);
	});

	it("졸업년도가 입학년도보다 이전이면 실패", () => {
		const result = applySchema.safeParse({
			...base,
			admissionYear: "2024",
			graduationEnd: "2020",
		});
		expect(result.success).toBe(false);
	});
});
