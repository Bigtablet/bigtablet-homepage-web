import { z } from "zod";

/**
 * @description
 * 공통 API 응답 타입
 * 서버 응답은 항상 `status`(number), `message`(string)를 포함하며
 * `data`는 존재할 수도, 없을 수도 있기에 Optional로 처리했습니다.
 *
 * @template T 응답 데이터 제네릭 타입
 */
export interface BaseResponse<T> {
	status: number;
	message: string;
	data?: T | null;
}

/**
 * @description
 * `data` 필드가 포함된 응답 스키마
 * 주로 GET 요청 등에서 사용됩니다.
 *
 * @example
 * const schema = baseResponseSchema(userSchema);
 */
export const baseResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
	z
		.object({
			status: z.number(),
			message: z.string(),
			data: dataSchema.optional().nullable(),
		})
		.passthrough();

/**
 * @description
 * `data`가 없는 단순 성공 응답 스키마
 * 주로 POST, PATCH, DELETE 요청에 사용됩니다.
 *
 * @example
 * const schema = okResponseSchema.parse(res.data);
 */
export const okResponseSchema = z
	.object({
		status: z.number(),
		message: z.string(),
	})
	.passthrough();

/** @description `okResponseSchema`의 타입 */
export type OkResponse = z.infer<typeof okResponseSchema>;
