import { getErrorMessage } from "src/shared/libs/api/axios/error/error.util";
import { describe, expect, it } from "vitest";

/** HttpError와 동일한 구조의 에러를 생성하는 헬퍼 */
const createHttpError = (message: string, status: number, code?: string) =>
	Object.assign(new Error(message), {
		name: "HttpError",
		status,
		code,
	});

describe("getErrorMessage", () => {
	it("에러 코드가 있으면 매핑된 메시지를 반환한다", () => {
		const error = createHttpError("raw message", 400, "EMAIL_NOT_VALID");
		expect(getErrorMessage(error)).toBe("인증 코드가 올바르지 않습니다.");
	});

	it("에러 코드가 매핑에 없으면 HTTP 상태 메시지를 반환한다", () => {
		const error = createHttpError("raw message", 404, "UNKNOWN_CODE");
		expect(getErrorMessage(error)).toBe("요청한 리소스를 찾을 수 없습니다.");
	});

	it("에러 코드도 상태 매핑도 없으면 서버 메시지를 반환한다", () => {
		const error = createHttpError("커스텀 서버 메시지", 499);
		expect(getErrorMessage(error)).toBe("커스텀 서버 메시지");
	});

	it("네트워크 에러일 때 네트워크 메시지를 반환한다", () => {
		const error = createHttpError("network_error", 0);
		expect(getErrorMessage(error)).toBe("네트워크 연결을 확인해 주세요.");
	});

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
