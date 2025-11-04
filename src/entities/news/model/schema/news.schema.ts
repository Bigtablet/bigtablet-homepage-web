import { z } from "zod";
import { baseResponseSchema } from "src/shared/types/response";

export const newsItemSchema = z.object({
    idx: z.number(),
    titleKr: z.string(),
    titleEn: z.string(),
    newsUrl: z.string().url(),
    createdAt: z.string(),
    modifiedAt: z.string(),
});
export type NewsItem = z.infer<typeof newsItemSchema>;

// 목록, 단건
export const newsListResponseSchema   = baseResponseSchema(z.array(newsItemSchema));
export const newsDetailResponseSchema = baseResponseSchema(newsItemSchema);
export type NewsListResponse   = z.infer<typeof newsListResponseSchema>;
export type NewsDetailResponse = z.infer<typeof newsDetailResponseSchema>;