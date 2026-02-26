import { z } from "zod";
import { baseResponseSchema } from "src/shared/schema/response/response.schema";

export const newsItemSchema = z.object({
    idx: z.number(),
    titleKr: z.string(),
    titleEn: z.string(),
    newsUrl: z.string().url(),
    thumbnailImageUrl: z.string(),
    createdAt: z.string(),
    modifiedAt: z.string(),
});
export type NewsItem = z.infer<typeof newsItemSchema>;

// 목록
export const newsListResponseSchema   = baseResponseSchema(z.array(newsItemSchema));baseResponseSchema(newsItemSchema);
export type NewsListResponse = z.infer<typeof newsListResponseSchema>;
