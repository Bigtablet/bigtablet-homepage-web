import { describe, expect, it } from "vitest";
import { z } from "zod";
import { baseResponseSchema, okResponseSchema } from "../response.schema";

describe("okResponseSchema", () => {
	it("유효한 응답을 파싱한다", () => {
		const input = { status: 200, message: "OK" };
		const result = okResponseSchema.parse(input);

		expect(result.status).toBe(200);
		expect(result.message).toBe("OK");
	});

	it("추가 필드가 있어도 passthrough로 유지한다", () => {
		const input = { status: 200, message: "OK", extra: "field" };
		const result = okResponseSchema.parse(input);

		expect((result as Record<string, unknown>).extra).toBe("field");
	});

	it("status가 없으면 파싱 에러가 발생한다", () => {
		const input = { message: "OK" };
		expect(() => okResponseSchema.parse(input)).toThrow();
	});

	it("message가 없으면 파싱 에러가 발생한다", () => {
		const input = { status: 200 };
		expect(() => okResponseSchema.parse(input)).toThrow();
	});
});

describe("baseResponseSchema", () => {
	const userSchema = z.object({
		id: z.number(),
		name: z.string(),
	});
	const schema = baseResponseSchema(userSchema);

	it("data가 포함된 응답을 파싱한다", () => {
		const input = {
			status: 200,
			message: "OK",
			data: { id: 1, name: "홍길동" },
		};
		const result = schema.parse(input);

		expect(result.status).toBe(200);
		expect(result.data?.id).toBe(1);
		expect(result.data?.name).toBe("홍길동");
	});

	it("data가 null이어도 파싱에 성공한다", () => {
		const input = { status: 200, message: "OK", data: null };
		const result = schema.parse(input);

		expect(result.data).toBeNull();
	});

	it("data가 없어도 파싱에 성공한다", () => {
		const input = { status: 200, message: "OK" };
		const result = schema.parse(input);

		expect(result.data).toBeUndefined();
	});
});
