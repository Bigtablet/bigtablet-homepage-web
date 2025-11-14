import {z} from "zod";

export const DepartmentType = z.enum([
    "BUSINESS_ADMINISTRATION",
    "SALE",
    "MARKETING",
    "IT",
    "DESIGN",
    "RESEARCH_AND_DEVELOPMENT",
]);
export type DepartmentType = z.infer<typeof DepartmentType>;

export const LocationType = z.enum(["DAEGU", "GASAN", "ILSAN", "PANGYO", "USA" ]);
export type LocationType = z.infer<typeof LocationType>;

export const RecruitType = z.enum(["FULL_TIME", "CONTRACT", "INTERN"]);
export type RecruitType = z.infer<typeof RecruitType>;

export const MilitaryType = z.enum(["NOT_COMPLETED", "COMPLETED", "NOT_APPLICABLE"]);
export type MilitaryType = z.infer<typeof MilitaryType>;

export const EducationType = z.enum(["HIGH_SCHOOL", "ASSOCIATE", "BACHELOR", "NO_REQUIREMENT"]);
export type EducationType = z.infer<typeof EducationType>;