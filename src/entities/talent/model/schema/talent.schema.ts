import {z} from "zod";
import {baseResponseSchema} from "src/shared/types/response";

export const postTalentSchema = z.object({
    name: z.string().min(1, "이름을 입력해주세요."),
    email: z
        .string()
        .min(1, "이메일을 입력해주세요.")
        .email("유효한 이메일 형식이 아닙니다."),
    department: z.string().min(1, "희망 부서를 입력해주세요."),
    portfolioUrl: z.string().min(1, "포트폴리오 URL을 입력해주세요."),
    etcUrl: z.array(z.string()).optional(),
});

export type PostTalent = z.infer<typeof postTalentSchema>;

export type PostTalentFormValues = {
    email: string;
    name: string;
    department: string;
    portfolioUrl: string;
    etcUrl: string[];
};

export const postTalentOffer = z.object({
    idx: z.number(),
    text: z.string(),
});
export type PostTalentOffer = z.infer<typeof postTalentOffer>;

export const getTalentDetailResponseSchema = baseResponseSchema(
    z.object({
        idx: z.number(),
        email: z.string(),
        name: z.string(),
        department: z.string(),
        portfolioUrl: z.string(),
        etcUrl: z.array(z.string()).optional(),
        createdAt: z.string(),
    }),
);

export const getTalentListResponseSchema = baseResponseSchema(
    z.array(getTalentDetailResponseSchema),
);

export const getTalentSearchSchema = baseResponseSchema(
    z.array(getTalentDetailResponseSchema),
);