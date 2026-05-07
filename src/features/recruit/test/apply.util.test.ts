import { formatPhone010 } from "src/features/recruit/apply/form/model/apply.util";
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
