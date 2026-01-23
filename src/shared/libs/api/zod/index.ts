import { z } from "zod";
import BigtabletAxios from "src/shared/libs/api/axios";

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
		return schema.parse({ status: 204, message: "No Content", data: null });
	}
	return schema.parse(data);
};

export const getParsed = async <S extends z.ZodTypeAny>(
    url: string,
    schema: S,
    config?: AxiosConfig
): Promise<z.infer<S>> => {
    const res = await BigtabletAxios.get<unknown>(url, config);
    return handleNoContent(res.status, res.data, schema);
};

export const postParsed = async <S extends z.ZodTypeAny>(
    url: string,
    schema: S,
    body?: unknown,
    config?: AxiosConfig
): Promise<z.infer<S>> => {
    const res = await BigtabletAxios.post<unknown>(url, body, config);
    return schema.parse(res.data);
};

export const putParsed = async <S extends z.ZodTypeAny>(
    url: string,
    schema: S,
    body?: unknown,
    config?: AxiosConfig
): Promise<z.infer<S>> => {
    const res = await BigtabletAxios.put<unknown>(url, body, config);
    return schema.parse(res.data);
};

export const patchParsed = async <S extends z.ZodTypeAny>(
    url: string,
    schema: S,
    body?: unknown,
    config?: AxiosConfig
): Promise<z.infer<S>> => {
    const res = await BigtabletAxios.patch<unknown>(url, body, config);
    return schema.parse(res.data);
};

export const deleteParsed = async <S extends z.ZodTypeAny>(
    url: string,
    schema: S,
    config?: AxiosConfig
): Promise<z.infer<S>> => {
    const res = await BigtabletAxios.delete<unknown>(url, config);
    return schema.parse(res.data);
};