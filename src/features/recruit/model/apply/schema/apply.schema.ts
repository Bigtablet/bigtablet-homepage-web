import { z } from "zod";

/**
 * @description
 * 지원서 작성 폼(Recruit Application Form)
 *
 * [주의]
 * - 전화번호는 반드시 `010-1234-5678` 형식을 따라야 합니다.
 * - 첨부 자료(`attachment1~3`)는 URL이거나 비어 있는 문자열이어야 합니다.
 * - `educationLevel`, `military`는 서버 Enum 값과 반드시 일치해야 합니다.
 */

const AttachUrl = z
    .string()
    .url("유효한 URL을 입력해 주세요.")
    .optional()
    .or(z.literal(""))
    .default("");

const baseSchema = z.object({
    jobId: z.number(),

    name: z
        .string()
        .min(2, "이름은 2자 이상 입력해 주세요.")
        .max(20, "이름은 20자 이하로 입력해 주세요."),

    phoneNumber: z
        .string()
        .min(1, "전화번호를 입력해 주세요.")
        .regex(/^010-\d{4}-\d{4}$/, "전화번호 형식이 올바르지 않습니다. 예: 010-1234-5678"),

    email: z
        .string()
        .min(1, "이메일을 입력해 주세요.")
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

    educationLevel: z.enum(
        ["GED", "HIGH_SCHOOL", "ASSOCIATE", "BACHELOR"],
        { required_error: "학력 정보를 선택해주세요." }
    ),

    schoolName: z.string().optional().default(""),
    admissionYear: z.string().optional().default(""),
    graduationEnd: z.string().optional().default(""),
    department: z.string().optional().default(""),

    military: z.enum(
        ["NOT_COMPLETED", "COMPLETED", "NOT_APPLICABLE"],
        { required_error: "병역 사항을 선택해주세요." }
    ),

    attachment1: AttachUrl,
    attachment2: AttachUrl,
    attachment3: AttachUrl,
});

export const applySchema = baseSchema.superRefine((data, ctx) => {
    const isGed = data.educationLevel === "GED";

    if (isGed) {
        if (!data.admissionYear) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["admissionYear"],
                message: "합격 연도를 입력해 주세요.",
            });
        }
    } else {
        if (!data.schoolName) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["schoolName"],
                message: "학교명을 입력해 주세요.",
            });
        }
        if (!data.admissionYear) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["admissionYear"],
                message: "입학년도를 입력해 주세요.",
            });
        }
        if (!data.graduationEnd) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["graduationEnd"],
                message: "졸업년도를 입력해 주세요.",
            });
        }
        if (!data.department) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["department"],
                message: "계열(학과)을 입력해 주세요.",
            });
        }
        if (
            data.admissionYear &&
            data.graduationEnd &&
            data.graduationEnd < data.admissionYear
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["graduationEnd"],
                message: "졸업일은 입학일 이후여야 합니다.",
            });
        }
    }
});

export type ApplyFormValues = z.infer<typeof applySchema>;