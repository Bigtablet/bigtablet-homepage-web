import { HttpResponse, http } from "msw";
import { checkEmailApi, sendEmailApi } from "src/features/recruit/apply/form/email/api/email.api";
import { server } from "src/test/msw/server";
import { describe, expect, it } from "vitest";

describe("sendEmailApi", () => {
	it("이메일 발송 시 서버 응답을 그대로 반환한다", async () => {
		const result = await sendEmailApi("user@example.com");
		expect(result).toEqual({ status: 200, message: "ok" });
	});

	it("서버 에러 시 예외를 throw한다", async () => {
		server.use(http.post("*/auth/email", () => HttpResponse.json(null, { status: 500 })));
		await expect(sendEmailApi("user@example.com")).rejects.toThrow();
	});
});

describe("checkEmailApi", () => {
	it("인증 코드 확인 시 서버 응답을 반환한다", async () => {
		const result = await checkEmailApi("user@example.com", "123456");
		expect(result).toEqual({ status: 200, message: "verified" });
	});

	it("잘못된 코드면 4xx 예외", async () => {
		server.use(http.post("*/auth/email/check", () => HttpResponse.json(null, { status: 400 })));
		await expect(checkEmailApi("user@example.com", "000000")).rejects.toThrow();
	});
});
