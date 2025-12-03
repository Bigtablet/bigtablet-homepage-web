import { z } from "zod";
import { baseResponseSchema } from "src/shared/types/response";
import { DepartmentType, EducationType, LocationType, RecruitType } from "src/entities/recruit/enum/recruit.enum";

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

export const recruitListResponseSchema = baseResponseSchema(recruitResponseSchema.array());
export const recruitDetailResponseSchema = baseResponseSchema(recruitResponseSchema);
export type RecruitListResponse = z.infer<typeof recruitListResponseSchema>;
export type RecruitDetailResponse = z.infer<typeof recruitDetailResponseSchema>;