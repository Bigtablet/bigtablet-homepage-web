import { z } from "zod";
import { baseResponseSchema, okResponseSchema } from "src/shared/types/response";

/* ---------------- Enums ---------------- */
export const DepartmentType = z.enum([
    "BUSINESS_ADMINISTRATION",
    "SALE",
    "MARKETING",
    "IT",
    "DESIGN",
    "RESEARCH_AND_DEVELOPMENT",
]);
export type DepartmentType = z.infer<typeof DepartmentType>;

export const LocationType = z.enum(["SEOUL", "DAEGU"]);
export type LocationType = z.infer<typeof LocationType>;

export const RecruitType = z.enum(["FULL_TIME", "CONTRACT", "INTERN"]);
export type RecruitType = z.infer<typeof RecruitType>;

export const EducationType = z.enum(["HIGH_SCHOOL", "ASSOCIATE", "BACHELOR", "NO_REQUIREMENT"]);
export type EducationType = z.infer<typeof EducationType>;

/* ---------------- DTOs ---------------- */
export const recruitResponseSchema = z.object({
    idx: z.number(),
    title: z.string(),
    department: DepartmentType,
    location: LocationType,
    recruitType: RecruitType,
    experiment: z.string(),
    education: EducationType,
    companyIntroduction: z.string(),
    mainResponsibility: z.string(),
    qualification: z.string(),
    preferredQualification: z.string(),
    startDate: z.string(),
    endDate: z.string().optional().nullable(),
    createdAt: z.string().optional(),
    modifiedAt: z.string().optional(),
});
export type RecruitResponse = z.infer<typeof recruitResponseSchema>;

/* 목록 카드(파생 필드 포함) */
export const recruitCardSchema = recruitResponseSchema.extend({
    idx: z.number(),
    dday: z.string(),
    tags: z.array(z.string()),
});
export type RecruitCard = z.infer<typeof recruitCardSchema>;

/* 지원서 */
export const ApplyEducationLevel = z.enum(["GED", "HIGH_SCHOOL", "ASSOCIATE", "BACHELOR"]);
export type ApplyEducationLevel = z.infer<typeof ApplyEducationLevel>;

export const ApplyMilitaryStatus = z.enum(["NOT_COMPLETED", "COMPLETED", "NOT_APPLICABLE"]);
export type ApplyMilitaryStatus = z.infer<typeof ApplyMilitaryStatus>;

export const recruitRequestSchema = z.object({
    jobId: z.number(),
    name: z.string(),
    phoneNumber: z.string(),
    email: z.string().email(),
    address: z.string(),
    addressDetail: z.string(),
    portfolio: z.string(),
    coverLetter: z.string().optional(),
    profileImage: z.string(),
    educationLevel: ApplyEducationLevel,
    schoolName: z.string().optional(),
    admissionYear: z.string().optional(),
    graduationYear: z.string().optional(),
    department: z.string().optional(),
    military: ApplyMilitaryStatus,
    attachment1: z.string().optional(),
    attachment2: z.string().optional(),
    attachment3: z.string().optional(),
}).strict();
export type RecruitRequest = z.infer<typeof recruitRequestSchema>;

export const recruitApplyResponseSchema = z.object({
    ok: z.boolean(),
    id: z.number().optional(),
});
export type RecruitApplyResponse = z.infer<typeof recruitApplyResponseSchema>;

export const recruitApplicantSchema = recruitRequestSchema.extend({
    idx: z.number(),
    status: z.string(),
    createdAt: z.string(),
    modifiedAt: z.string(),
});

/* 응답 래퍼 */
export const recruitListResponseSchema   = baseResponseSchema(recruitResponseSchema.array());
export const recruitDetailResponseSchema = baseResponseSchema(recruitResponseSchema);
export type RecruitListResponse = z.infer<typeof recruitListResponseSchema>;
export type RecruitDetailResponse = z.infer<typeof recruitDetailResponseSchema>;

/* 입력/OK */
export const jobUpsertRequestSchema = recruitResponseSchema.omit({ idx: true, createdAt: true, modifiedAt: true });
export type JobUpsertRequest = z.infer<typeof jobUpsertRequestSchema>;

export const jobOkResponseSchema = okResponseSchema;