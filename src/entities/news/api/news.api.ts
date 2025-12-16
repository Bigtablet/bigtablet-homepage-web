import {NewsListResponse, newsListResponseSchema,} from "src/entities/news/model/schema/news.schema";
import {ListSchema} from "src/shared/schema/list/list.schema";
import {getParsed} from "src/shared/libs/api/zod";

// 목록
export const getNewsApi = async ({ page, size }: ListSchema): Promise<NewsListResponse> => {
    return getParsed("/news/list", newsListResponseSchema, { params: { page, size } });
};