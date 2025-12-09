import { z } from "zod";

/**
 * 첨부 URL 스키마 (URL 또는 빈 문자열 허용)
 */
const AttachUrl = z
    .string()
    .url("유효한 URL을 입력해 주세요.")
    .or(z.literal(""))
    .default("");

/**
 * 지원서 기본 스키마
 */
const baseSchema = z.object({
    jobId: z.number(),

    name: z
        .string()
        .min(2, "이름은 2자 이상 입력해 주세요.")
        .max(20, "이름은 20자 이하로 입력해 주세요."),

    phoneNumber: z
        .string()
        .regex(/^010-\d{4}-\d{4}$/, "전화번호 형식이 올바르지 않습니다. 예: 010-1234-5678"),

    email: z
        .string()
        .email("유효한 이메일 주소를 입력해주세요."),

    address: z
        .string()
        .min(1, "거주지를 입력해 주세요."),

    addressDetail: z.string().default(""),

    portfolio: z
        .string()
        .min(1, "포트폴리오 또는 이력서를 업로드해 주세요."),

    coverLetter: z.string().optional().default(""),

    profileImage: z
        .string()
        .min(1, "프로필 사진을 업로드해 주세요."),

    educationLevel: z
        .enum(["GED", "HIGH_SCHOOL", "ASSOCIATE", "BACHELOR"])
        .refine((v) => !!v, "학력 정보를 선택해주세요."),

    schoolName: z.string().optional().default(""),
    admissionYear: z.string().optional().default(""),
    graduationEnd: z.string().optional().default(""),
    department: z.string().optional().default(""),

    military: z
        .enum(["NOT_COMPLETED", "COMPLETED", "NOT_APPLICABLE"])
        .refine((v) => !!v, "병역 사항을 선택해주세요."),

    attachment1: AttachUrl,
    attachment2: AttachUrl,
    attachment3: AttachUrl,
});

/**
 * GED 여부에 따른 조건 검사
 */
export const applySchema = baseSchema.superRefine((data, ctx) => {
    const isGed = data.educationLevel === "GED";

    const admission = Number(data.admissionYear);
    const graduation = Number(data.graduationEnd);

    if (isGed) {
        if (!data.admissionYear) {
            ctx.addIssue({
                code: "custom",
                path: ["admissionYear"],
                message: "합격 연도를 입력해 주세요.",
            });
        }
        return;
    }

    const requiredFields = [
        ["schoolName", "학교명을 입력해 주세요."],
        ["admissionYear", "입학년도를 입력해 주세요."],
        ["graduationEnd", "졸업년도를 입력해 주세요."],
        ["department", "계열(학과)을 입력해 주세요."],
    ] as const;

    for (const [field, message] of requiredFields) {
        if (!data[field]) {
            ctx.addIssue({
                code: "custom",
                path: [field],
                message,
            });
        }
    }

    if (
        !Number.isNaN(admission) &&
        !Number.isNaN(graduation) &&
        graduation < admission
    ) {
        ctx.addIssue({
            code: "custom",
            path: ["graduationEnd"],
            message: "졸업일은 입학일 이후여야 합니다.",
        });
    }
});

export type ApplyFormValues = z.infer<typeof applySchema>;