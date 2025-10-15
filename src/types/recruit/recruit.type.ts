export enum DepartmentType {
    BUSINESS_ADMINISTRATION = "BUSINESS_ADMINISTRATION",
    SALE = "SALE",
    MARKETING = "MARKETING",
    IT = "IT",
    DESIGN = "DESIGN",
    RESEARCH_AND_DEVELOPMENT = "RESEARCH_AND_DEVELOPMENT",
}

export enum LocationType {
    SEOUL = "SEOUL",
    DAEGU = "DAEGU",
}

export enum RecruitType {
    FULL_TIME = "FULL_TIME",
    CONTRACT = "CONTRACT",
    INTERN = "INTERN",
}

export enum EducationType {
    HIGH_SCHOOL = "HIGH_SCHOOL",
    ASSOCIATE = "ASSOCIATE",
    BACHELOR = "BACHELOR",
    NO_REQUIREMENT = "NO_REQUIREMENT",
}

export interface RecruitResponse {
    idx?: number;
    title: string;
    department: DepartmentType;
    location: LocationType;
    recruitType: RecruitType;
    experiment: string;
    education: EducationType;
    companyIntroduction: string;
    mainResponsibility: string;
    qualification: string;
    preferredQualification: string;
    startDate: string;
    endDate: string;
    createdAt?: string;
    modifiedAt?: string;
}

export interface RecruitCard extends RecruitResponse {
    dday: string;
    tags: string[];
}