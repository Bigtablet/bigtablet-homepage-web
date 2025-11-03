import { z } from "zod";
import BigtabletAxios from "src/shared/libs/api/axios";

type AxiosConfig = Record<string, unknown>;

export const getParsed = async <S extends z.ZodTypeAny>(
    url: string,
    schema: S,
    config?: AxiosConfig
): Promise<z.infer<S>> => {
    const res = await BigtabletAxios.get<unknown>(url, config);
    return schema.parse(res.data);
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

export const deleteParsed = async <S extends z.ZodTypeAny>(
    url: string,
    schema: S,
    config?: AxiosConfig
): Promise<z.infer<S>> => {
    const res = await BigtabletAxios.delete<unknown>(url, config);
    return schema.parse(res.data);
};