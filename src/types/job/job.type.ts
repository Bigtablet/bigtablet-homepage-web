export type Department =
    | "BUSINESS_ADMINISTRATION"
    | "SALE"
    | "MARKETING"
    | "IT"
    | "DESIGN"
    | "RESEARCH_AND_DEVELOPMENT";

export type Location = "SEOUL" | "DAEGU";

export type RecruitType = "FULL_TIME" | "CONTRACT" | "INTERN";

export type Education =
    | "HIGH_SCHOOL"
    | "ASSOCIATE"
    | "BACHELOR"
    | "NO_REQUIREMENT";

export type PostJobPayload = {
    title: string;
    department: Department;
    location: Location;
    recruitType: RecruitType;
    experiment: string;
    education: Education;
    companyIntroduction: string;
    mainResponsibility: string;
    qualification: string;
    preferredQualification?: string;
    startDate: string;
    endDate: string;
};