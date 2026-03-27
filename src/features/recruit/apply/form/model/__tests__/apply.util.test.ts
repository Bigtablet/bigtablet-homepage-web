import { ApplyMilitaryStatus } from "src/entities/recruit/schema/recruit.schema";
import {
	currentYearMonth,
	formatPhone010,
	mapMil,
} from "src/features/recruit/apply/form/model/apply.util";
import { describe, expect, it } from "vitest";

describe("currentYearMonth", () => {
	it("YYYY-MM 형식 반환", () => {
		const result = currentYearMonth();
		expect(result).toMatch(/^\d{4}-\d{2}$/);
	});

	it("현재 연도와 월 반환", () => {
		const d = new Date();
		const expected = `${d.getFullYear()}-${`${d.getMonth() + 1}`.padStart(2, "0")}`;
		expect(currentYearMonth()).toBe(expected);
	});
});

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

describe("mapMil", () => {
	it("DONE → COMPLETED", () => {
		expect(mapMil("DONE")).toBe(ApplyMilitaryStatus.enum.COMPLETED);
	});

	it("PENDING → NOT_COMPLETED", () => {
		expect(mapMil("PENDING")).toBe(ApplyMilitaryStatus.enum.NOT_COMPLETED);
	});

	it("EXEMPT → NOT_APPLICABLE", () => {
		expect(mapMil("EXEMPT")).toBe(ApplyMilitaryStatus.enum.NOT_APPLICABLE);
	});

	it("빈 문자열 → NOT_APPLICABLE", () => {
		expect(mapMil("")).toBe(ApplyMilitaryStatus.enum.NOT_APPLICABLE);
	});

	it("유효한 enum 값을 직접 전달하면 그대로 반환한다", () => {
		expect(mapMil("COMPLETED")).toBe(ApplyMilitaryStatus.enum.COMPLETED);
		expect(mapMil("NOT_COMPLETED")).toBe(
			ApplyMilitaryStatus.enum.NOT_COMPLETED,
		);
		expect(mapMil("NOT_APPLICABLE")).toBe(
			ApplyMilitaryStatus.enum.NOT_APPLICABLE,
		);
	});

	it("알 수 없는 값 → NOT_APPLICABLE (fallback)", () => {
		expect(mapMil("UNKNOWN")).toBe(ApplyMilitaryStatus.enum.NOT_APPLICABLE);
	});
});
