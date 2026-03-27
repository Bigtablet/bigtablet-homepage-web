import type { RequestHandler } from "msw";

/**
 * MSW 핸들러 목록
 * API 테스트 시 여기에 핸들러를 추가하세요.
 *
 * @example
 * import { http, HttpResponse } from "msw";
 * http.get("/api/example", () => HttpResponse.json({ data: [] }))
 */
export const handlers: RequestHandler[] = [];
