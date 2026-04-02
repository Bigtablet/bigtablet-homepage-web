import { z } from "zod";

/**
 * @description
 * 환경변수 스키마 — 빌드/런타임 시점에 검증합니다.
 * NEXT_PUBLIC_ 변수는 빌드 시 인라인되므로 클라이언트에서도 접근 가능합니다.
 */
const envSchema = z.object({
	NEXT_PUBLIC_SERVER_URL: z.url("NEXT_PUBLIC_SERVER_URL must be a valid URL"),
	NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
	NODE_ENV: z
		.enum(["development", "test", "production"])
		.default("development"),
});

export const env = envSchema.parse({
	NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
	NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
	NODE_ENV: process.env.NODE_ENV,
});
