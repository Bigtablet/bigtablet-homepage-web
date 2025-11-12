import {z} from "zod";

/**
 * @description
 * 지원서 작성 폼(Recruit Application Form)
 *
 * [필드 요약]
 * - z.type().optional... 이 붙을 경우 이는 선택적 입력입니다.
 * - z.type().defualt("") 이 붙을 경우 이는 필수적 입력입니다.
 *
 * [주의]
 * - 전화번호는 반드시 `010-1234-5678` 형식을 따라야 합니다.
 * - 첨부 자료(`attachment1~3`)는 URL이거나 비어 있는 문자열이어야 합니다.
 * - `educationLevel`, `military`는 서버 Enum 값과 반드시 일치해야 합니다.
 */

export const applySchema = z.object({
    jobId: z.number(),
    name: z.string().min(1, "이름은 필수입니다."),
    phoneNumber: z
        .string()
        .regex(/^010-\d{4}-\d{4}$/, "전화번호 형식이 올바르지 않습니다. 예: 010-1234-5678"),
    email: z.string().email("유효한 이메일 주소를 입력해주세요."),
    address: z.string().default(""),
    addressDetail: z.string().default(""),
    portfolio: z.string().default(""),
    coverLetter: z.string().optional().default(""),
    profileImage: z.string().default(""),
    educationLevel: z.enum(["GED", "HIGH_SCHOOL", "ASSOCIATE", "BACHELOR"], {
        required_error: "학력 정보를 선택해주세요.",
    }),
    schoolName: z.string().optional().default(""),
    admissionYear: z.string().optional().default(""),
    graduationEnd: z.string().optional().default(""),
    department: z.string().optional().default(""),
    military: z.enum(["NOT_COMPLETED", "COMPLETED", "NOT_APPLICABLE"], {
        required_error: "병역 사항을 선택해주세요.",
    }),
    attachment1: z.string().url().optional().or(z.literal("")).default(""),
    attachment2: z.string().url().optional().or(z.literal("")).default(""),
    attachment3: z.string().url().optional().or(z.literal("")).default(""),
});

export type ApplyFormValues = z.infer<typeof applySchema>;