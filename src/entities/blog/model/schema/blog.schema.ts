import { z } from "zod";
import { baseResponseSchema, okResponseSchema } from "src/shared/schema/response/response.schema";

export const blogItemSchema = z.object({
    idx: z.number(),
    titleKr: z.string(),
    titleEn: z.string(),
    imageUrl: z.string().url().optional().nullable(),
    summaryKr: z.string().optional().nullable(),
    summaryEn: z.string().optional().nullable(),
    contentKr: z.string().optional().nullable(),
    contentEn: z.string().optional().nullable(),
    createdAt: z.string(),
    modifiedAt: z.string(),
    views: z.number().optional(),
});

export type BlogItem = z.infer<typeof blogItemSchema>;
export const blogListResponseSchema   = baseResponseSchema(z.array(blogItemSchema));

export type BlogDetailResponse = z.infer<typeof blogDetailResponseSchema>;
export const blogDetailResponseSchema = baseResponseSchema(blogItemSchema);

// 조회수 증가
export const blogOkResponseSchema = okResponseSchema;
export type BlogOkResponse = z.infer<typeof blogOkResponseSchema>;