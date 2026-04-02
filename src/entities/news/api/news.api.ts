import {
	type NewsListResponse,
	newsListResponseSchema,
} from "src/entities/news/schema/news.schema";
import { getParsed } from "src/shared/libs/api/zod";
import type { ListSchema } from "src/shared/schema/list/list.schema";

/**
 * @author 박상민
 *
 * @description 뉴스 목록을 페이지네이션으로 조회한다.
 * @endpoint GET /news/list
 * @auth Unnecessary
 * @permission Unnecessary
 *
 * @param {ListSchema} options - 페이지 번호와 페이지 크기
 * @param signal - 요청 취소를 위한 AbortSignal
 * @returns 뉴스 목록 응답 (data 배열 포함)
 */
export const getNewsApi = async (
	{ page, size }: ListSchema,
	signal?: AbortSignal,
): Promise<NewsListResponse> => {
	return getParsed("/news/list", newsListResponseSchema, {
		params: { page, size },
		signal,
	});
};
