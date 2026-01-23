import { z } from "zod";
import { baseResponseSchema } from "src/shared/schema/response/response.schema";
import { DepartmentType, EducationType, LocationType, RecruitType } from "src/entities/recruit/model/enum/recruit.enum";

export const recruitResponseSchema = z.object({
    idx: z.number(),
    title: z.string(),
    department: DepartmentType,
    location: LocationType,
    recruitType: RecruitType,
    experiment: z.string(),
    education: EducationType,
    companyIntroduction: z.string(),
    positionIntroduction: z.string(),
    mainResponsibility: z.string(),
    qualification: z.string(),
    preferredQualification: z.string(),
    startDate: z.string(),
    endDate: z.string().optional().nullable(),
    isActive: z.boolean(),
    createdAt: z.string().optional(),
    modifiedAt: z.string().optional(),
});

export type RecruitResponse = z.infer<typeof recruitResponseSchema>;

export const recruitCardSchema = recruitResponseSchema.extend({
    idx: z.number(),
    dday: z.string(),
    tags: z.array(z.string()),
});
export type RecruitCard = z.infer<typeof recruitCardSchema>;

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

export const recruitApplyResponseSchema = baseResponseSchema(z.number().nullable().optional());
export type RecruitApplyResponse = z.infer<typeof recruitApplyResponseSchema>;

export const recruitApplicantSchema = recruitRequestSchema.extend({
    idx: z.number(),
    status: z.string(),
    createdAt: z.string(),
    modifiedAt: z.string(),
});

/**
 * @description
 * 목록 응답 스키마. 서버에서 빈 데이터 시 문자열을 반환할 수 있어 union 처리
 */
export const recruitListResponseSchema = z.object({
	status: z.number(),
	message: z.string(),
	data: z.union([recruitResponseSchema.array(), z.string(), z.null()]).optional(),
}).passthrough();

export const recruitDetailResponseSchema = baseResponseSchema(recruitResponseSchema);
export type RecruitListResponse = z.infer<typeof recruitListResponseSchema>;
export type RecruitDetailResponse = z.infer<typeof recruitDetailResponseSchema>;