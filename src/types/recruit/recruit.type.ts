export interface RecruitResponse {
    title: string;
    department: string;
    location: string;
    recruitType: string;
    experiment: string;
    education: string;
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