import {
	type NewsListResponse,
	newsListResponseSchema,
} from "src/entities/news/schema/news.schema";
import { getParsed } from "src/shared/libs/api/zod";
import type { ListSchema } from "src/shared/schema/list/list.schema";

// 목록
export const getNewsApi = async ({
	page,
	size,
}: ListSchema): Promise<NewsListResponse> => {
	return getParsed("/news/list", newsListResponseSchema, {
		params: { page, size },
	});
};
