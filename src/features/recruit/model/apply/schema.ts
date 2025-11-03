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
    /** 지원자 이름 (필수) */
    name: z.string().min(1, "이름은 필수입니다."),

    /** 연락처 - 010-1234-5678 형식 (필수) */
    phoneNumber: z
        .string()
        .regex(/^010-\d{4}-\d{4}$/, "전화번호 형식이 올바르지 않습니다. 예: 010-1234-5678"),

    /** 이메일 주소 (필수, 이메일 형식 검증) */
    email: z.string().email("유효한 이메일 주소를 입력해주세요."),

    /** 기본 주소 (선택) */
    address: z.string().default(""),

    /** 상세 주소 (필수) */
    addressDetail: z.string().default(""),

    /** 포트폴리오 파일 경로 or GCP URL (필수) */
    portfolio: z.string().default(""),

    /** 자기소개서 파일 경로 or GCP URL (선택) */
    coverLetter: z.string().optional().default(""),

    /** 프로필 이미지 파일 경로 or GCP URL (필수) */
    profileImage: z.string().default(""),

    /** 최종 학력 (Enum: GED(검정고시) | HIGH_SCHOOL(고졸) | ASSOCIATE(대졸) | BACHELOR(석사, 박사)) */
    educationLevel: z.enum(["GED", "HIGH_SCHOOL", "ASSOCIATE", "BACHELOR"], {
        required_error: "학력 정보를 선택해주세요.",
    }),

    /** 학교명 (필수) */
    schoolName: z.string().optional().default(""),

    /** 입학연도 (YYYY-MM, 필수) */
    admissionYear: z.string().optional().default(""),

    /** 졸업연도 (YYYY-MM, 필수) */
    graduationEnd: z.string().optional().default(""),

    /** 전공 / 학과명 (필수) */
    department: z.string().optional().default(""),

    /** 병역 상태 (Enum: NOT_COMPLETED(미필) | COMPLETED(군필) | NOT_APPLICABLE(해당 없음)) */
    military: z.enum(["NOT_COMPLETED", "COMPLETED", "NOT_APPLICABLE"], {
        required_error: "병역 사항을 선택해주세요.",
    }),

    /** 첨부 자료 1 (URL 또는 빈 문자열 허용) */
    attachment1: z.string().url().optional().or(z.literal("")).default(""),

    /** 첨부 자료 2 (URL 또는 빈 문자열 허용) */
    attachment2: z.string().url().optional().or(z.literal("")).default(""),

    /** 첨부 자료 3 (URL 또는 빈 문자열 허용) */
    attachment3: z.string().url().optional().or(z.literal("")).default(""),
});

export type ApplyFormValues = z.infer<typeof applySchema>;