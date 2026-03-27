import { getErrorMessage } from "src/shared/libs/api/axios/error/error.util";
import { describe, expect, it } from "vitest";

describe("getErrorMessage", () => {
	it("Error 인스턴스에서 message를 추출한다", () => {
		const error = new Error("서버 오류가 발생했습니다.");
		expect(getErrorMessage(error)).toBe("서버 오류가 발생했습니다.");
	});

	it("문자열 에러를 그대로 반환한다", () => {
		expect(getErrorMessage("네트워크 에러")).toBe("네트워크 에러");
	});

	it("빈 문자열 에러일 때 fallback을 반환한다", () => {
		expect(getErrorMessage("", "기본 메시지")).toBe("기본 메시지");
	});

	it("알 수 없는 에러 타입일 때 fallback을 반환한다", () => {
		expect(getErrorMessage(42, "기본 메시지")).toBe("기본 메시지");
	});

	it("에러와 fallback 모두 없을 때 기본 메시지를 반환한다", () => {
		expect(getErrorMessage(null)).toBe("알 수 없는 오류가 발생했습니다.");
	});

	it("undefined 에러일 때 기본 메시지를 반환한다", () => {
		expect(getErrorMessage(undefined)).toBe("알 수 없는 오류가 발생했습니다.");
	});

	it("Error.message가 빈 문자열이면 fallback을 반환한다", () => {
		const error = new Error("");
		expect(getErrorMessage(error, "fallback")).toBe("fallback");
	});
});
