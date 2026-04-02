import BigtabletAxios from "src/shared/libs/api/axios";
import type { z } from "zod";

type AxiosConfig = Record<string, unknown>;

/**
 * @description
 * 204 No Content 응답 시 빈 응답 객체 반환
 */
const handleNoContent = <S extends z.ZodTypeAny>(
	status: number,
	data: unknown,
	schema: S,
): z.infer<S> => {
	if (status === 204 || data === "" || data === null || data === undefined) {
		// baseResponseSchema 구조가 아닌 스키마에 대한 안전 처리
		try {
			return schema.parse({ status: 204, message: "No Content", data: null });
		} catch {
			return schema.parse(data);
		}
	}
	return schema.parse(data);
};

/**
 * @description GET 요청 후 Zod 스키마로 응답을 파싱한다. 204 No Content 처리 포함.
 *
 * @param url - 요청 URL
 * @param schema - 응답 검증용 Zod 스키마
 * @param config - Axios 설정 (params, signal 등)
 * @returns 스키마로 파싱된 응답 데이터
 * @throws Zod 파싱 실패 시 ZodError
 */
export const getParsed = async <S extends z.ZodTypeAny>(
	url: string,
	schema: S,
	config?: AxiosConfig,
): Promise<z.infer<S>> => {
	const response = await BigtabletAxios.get<unknown>(url, config);
	return handleNoContent(response.status, response.data, schema);
};

/**
 * @description POST 요청 후 Zod 스키마로 응답을 파싱한다.
 *
 * @param url - 요청 URL
 * @param schema - 응답 검증용 Zod 스키마
 * @param body - 요청 본문
 * @param config - Axios 설정
 * @returns 스키마로 파싱된 응답 데이터
 * @throws Zod 파싱 실패 시 ZodError
 */
export const postParsed = async <S extends z.ZodTypeAny>(
	url: string,
	schema: S,
	body?: unknown,
	config?: AxiosConfig,
): Promise<z.infer<S>> => {
	const response = await BigtabletAxios.post<unknown>(url, body, config);
	return schema.parse(response.data);
};

/**
 * @description PUT 요청 후 Zod 스키마로 응답을 파싱한다.
 *
 * @param url - 요청 URL
 * @param schema - 응답 검증용 Zod 스키마
 * @param body - 요청 본문
 * @param config - Axios 설정
 * @returns 스키마로 파싱된 응답 데이터
 * @throws Zod 파싱 실패 시 ZodError
 */
export const putParsed = async <S extends z.ZodTypeAny>(
	url: string,
	schema: S,
	body?: unknown,
	config?: AxiosConfig,
): Promise<z.infer<S>> => {
	const response = await BigtabletAxios.put<unknown>(url, body, config);
	return schema.parse(response.data);
};

/**
 * @description PATCH 요청 후 Zod 스키마로 응답을 파싱한다.
 *
 * @param url - 요청 URL
 * @param schema - 응답 검증용 Zod 스키마
 * @param body - 요청 본문
 * @param config - Axios 설정
 * @returns 스키마로 파싱된 응답 데이터
 * @throws Zod 파싱 실패 시 ZodError
 */
export const patchParsed = async <S extends z.ZodTypeAny>(
	url: string,
	schema: S,
	body?: unknown,
	config?: AxiosConfig,
): Promise<z.infer<S>> => {
	const response = await BigtabletAxios.patch<unknown>(url, body, config);
	return schema.parse(response.data);
};

/**
 * @description DELETE 요청 후 Zod 스키마로 응답을 파싱한다.
 *
 * @param url - 요청 URL
 * @param schema - 응답 검증용 Zod 스키마
 * @param config - Axios 설정
 * @returns 스키마로 파싱된 응답 데이터
 * @throws Zod 파싱 실패 시 ZodError
 */
export const deleteParsed = async <S extends z.ZodTypeAny>(
	url: string,
	schema: S,
	config?: AxiosConfig,
): Promise<z.infer<S>> => {
	const response = await BigtabletAxios.delete<unknown>(url, config);
	return schema.parse(response.data);
};
