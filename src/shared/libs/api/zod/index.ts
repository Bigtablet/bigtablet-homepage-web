import BigtabletAxios from "src/shared/libs/api/axios";
import type { z } from "zod";

type AxiosConfig = Record<string, unknown>;
type WriteMethod = "post" | "put" | "patch" | "delete";

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
		return schema.parse({ status: 204, message: "No Content", data: null });
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
 * @description body를 동반하는 write 메서드(POST/PUT/PATCH/DELETE) 공용 helper.
 * Axios 메서드별 시그니처 차이를 흡수하고 응답을 Zod 스키마로 파싱한다.
 */
const writeParsed = async <S extends z.ZodTypeAny>(
	method: WriteMethod,
	url: string,
	schema: S,
	body?: unknown,
	config?: AxiosConfig,
): Promise<z.infer<S>> => {
	const response =
		method === "delete"
			? await BigtabletAxios.delete<unknown>(url, config)
			: await BigtabletAxios[method]<unknown>(url, body, config);
	return schema.parse(response.data);
};

/** POST 요청 후 Zod 스키마로 응답을 파싱한다. */
export const postParsed = <S extends z.ZodTypeAny>(
	url: string,
	schema: S,
	body?: unknown,
	config?: AxiosConfig,
) => writeParsed("post", url, schema, body, config);

/** PUT 요청 후 Zod 스키마로 응답을 파싱한다. */
export const putParsed = <S extends z.ZodTypeAny>(
	url: string,
	schema: S,
	body?: unknown,
	config?: AxiosConfig,
) => writeParsed("put", url, schema, body, config);

/** PATCH 요청 후 Zod 스키마로 응답을 파싱한다. */
export const patchParsed = <S extends z.ZodTypeAny>(
	url: string,
	schema: S,
	body?: unknown,
	config?: AxiosConfig,
) => writeParsed("patch", url, schema, body, config);

/** DELETE 요청 후 Zod 스키마로 응답을 파싱한다. */
export const deleteParsed = <S extends z.ZodTypeAny>(
	url: string,
	schema: S,
	config?: AxiosConfig,
) => writeParsed("delete", url, schema, undefined, config);
