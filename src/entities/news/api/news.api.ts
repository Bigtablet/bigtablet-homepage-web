import {
    newsDetailResponseSchema,
    newsListResponseSchema,
    type NewsItem,
    type NewsDetailResponse,
} from "src/entities/news/model/schema/news.schema";
import {ListSchema} from "src/shared/schema/list/list.schema";
import {getParsed} from "src/shared/libs/api/zod";

// 목록
export const getNewsApi = async ({page, size}: ListSchema): Promise<NewsItem[]> => {
    return getParsed("/news/list", newsListResponseSchema, {
        params: {page, size},
    }).then((response) => response.data ?? [])
};

// 단건
export const getNewsDetailApi = async (idx: number): Promise<NewsItem> => {
    return getParsed("/news", newsDetailResponseSchema, {params: {idx}})
        .then((response: NewsDetailResponse) => {
            if (response!.data) throw new Error("Empty response");
            return response!.data!;
        });
};