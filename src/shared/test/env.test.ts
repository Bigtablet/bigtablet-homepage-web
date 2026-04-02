import { describe, expect, it } from "vitest";
import { z } from "zod";

/**
 * env/index.ts는 모듈 로드 시 process.env를 파싱하므로
 * 직접 import 대신 스키마 로직만 단위 테스트합니다.
 */
const envSchema = z.object({
	NEXT_PUBLIC_SERVER_URL: z.url("NEXT_PUBLIC_SERVER_URL must be a valid URL"),
	NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
	NODE_ENV: z
		.enum(["development", "test", "production"])
		.default("development"),
});

describe("envSchema", () => {
	it("유효한 환경변수를 파싱한다", () => {
		const result = envSchema.parse({
			NEXT_PUBLIC_SERVER_URL: "https://api.example.com",
			NODE_ENV: "production",
		});
		expect(result.NEXT_PUBLIC_SERVER_URL).toBe("https://api.example.com");
		expect(result.NODE_ENV).toBe("production");
	});

	it("NEXT_PUBLIC_SERVER_URL이 없으면 에러를 던진다", () => {
		expect(() => envSchema.parse({ NODE_ENV: "test" })).toThrow();
	});

	it("유효하지 않은 URL이면 에러를 던진다", () => {
		expect(() =>
			envSchema.parse({
				NEXT_PUBLIC_SERVER_URL: "not-a-url",
				NODE_ENV: "test",
			}),
		).toThrow();
	});

	it("NODE_ENV 기본값은 development이다", () => {
		const result = envSchema.parse({
			NEXT_PUBLIC_SERVER_URL: "https://api.example.com",
		});
		expect(result.NODE_ENV).toBe("development");
	});

	it("SENTRY_DSN은 선택적이다", () => {
		const result = envSchema.parse({
			NEXT_PUBLIC_SERVER_URL: "https://api.example.com",
		});
		expect(result.NEXT_PUBLIC_SENTRY_DSN).toBeUndefined();
	});
});
