/**
 * @description
 * response-error-interceptor가 던지는 HttpError의 형태.
 * Object.assign으로 만들어진 Error라 instanceof로는 판별 불가 — name+status로 식별.
 */
export interface HttpError extends Error {
	name: "HttpError";
	status: number;
	code: string;
	data: unknown;
}

/** unknown error를 HttpError로 안전하게 좁힘 */
export const isHttpError = (error: unknown): error is HttpError => {
	if (!(error instanceof Error)) return false;
	if (error.name !== "HttpError") return false;
	const candidate = error as unknown as Record<string, unknown>;
	return typeof candidate.status === "number";
};
