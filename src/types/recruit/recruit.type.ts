/** ===========================
 *  Server Contract Types
 *  (서버와의 계약: 변경하지 않음)
 *  =========================== */

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

export enum ApplyEducationLevel {
    GED = "GED",
    HIGH_SCHOOL = "HIGH_SCHOOL",
    ASSOCIATE = "ASSOCIATE",
    BACHELOR = "BACHELOR",
}

export enum ApplyMilitaryStatus {
    NOT_COMPLETED = "NOT_COMPLETED",
    COMPLETED = "COMPLETED",
    NOT_APPLICABLE = "NOT_APPLICABLE",
}

export interface RecruitRequest {
    jobId: number;
    name: string;
    phoneNumber: string;
    email: string;
    address: string;
    addressDetail: string;
    portfolio: string;
    coverLetter?: string;
    profileImage: string;
    educationLevel: ApplyEducationLevel; // 서버 계약: BACHELOR까지
    schoolName?: string;
    admissionYear?: string;   // YYYY-MM
    graduationYear?: string;  // YYYY-MM
    department?: string;      // 학과
    military: ApplyMilitaryStatus;
    attachment1?: string;
    attachment2?: string;
    attachment3?: string;
}

export interface RecruitApplyResponse {
    ok: boolean;
    id?: number;
}

export interface RecruitApplicant extends RecruitRequest {
    idx: number;
    jobId: number;
    status: string;
    createdAt: string;
    modifiedAt: string;
}

export type JobUpsertRequest = Omit<
    RecruitResponse,
    "idx" | "createdAt" | "modifiedAt" | "dday" | "tags"
>;

export type JobUpdateRequest = JobUpsertRequest & { idx: number };

/** ======================================
 *  Client-only Form Types & Helpers
 *  (UI 표현 보강 / 서버 전송 전 매핑)
 *  ====================================== */

/**
 * UI 표기용 상세 학위 (석/박 지원).
 * 서버에는 여전히 ApplyEducationLevel(BACHELOR)로만 전송됩니다.
 */
export type ApplyDegreeDetail = "BACHELOR" | "MASTER" | "DOCTOR";

/**
 * 성별: 병역 로직 보조용(UI에서만 사용). 서버에는 전송하지 않습니다.
 */
export type Gender = "MALE" | "FEMALE" | "OTHER";

/**
 * 클라이언트(폼) 전용 타입.
 * optional을 적극 사용해 입력 단계에서 유연하게 관리합니다.
 */
export type RecruitFormData = {
    jobId: number;
    name: string;
    phoneNumber: string;
    email: string;

    address?: string;
    addressDetail?: string;

    portfolio: string;      // 링크
    coverLetter?: string;   // 링크
    profileImage: string;   // 링크

    /**
     * 서버는 BACHELOR까지만 허용하므로,
     * UI에서 석/박 선택 시 degreeDetail로 관리 후
     * 최종 전송에서는 educationLevel=BACHELOR로 정규화합니다.
     */
    educationLevel: ApplyEducationLevel; // 서버 최종용 (대개 BACHELOR로 고정)
    degreeDetail?: ApplyDegreeDetail;    // UI 표기용 (BACHELOR | MASTER | DOCTOR)

    schoolName?: string;
    admissionYear?: string;  // YYYY-MM
    graduationYear?: string; // YYYY-MM
    department?: string;     // 학과

    gender?: Gender; // 병역 보정용 (서버 미전송)
    military: ApplyMilitaryStatus;

    attachment1?: string;
    attachment2?: string;
    attachment3?: string;
};

/**
 * UI 폼 데이터를 서버 전송 스키마(RecruitRequest)로 변환합니다.
 * - 여성(`gender === "FEMALE"`)이면 병역은 NOT_APPLICABLE로 강제 보정
 * - 석/박(`degreeDetail`이 MASTER/DOCTOR)이더라도 서버 계약상 educationLevel은 BACHELOR로 정규화
 */
export const toRecruitRequestPayload = (form: RecruitFormData): RecruitRequest => {
    const normalizedMilitary: ApplyMilitaryStatus =
        form.gender === "FEMALE" ? ApplyMilitaryStatus.NOT_APPLICABLE : form.military;

    const normalizedEducation: ApplyEducationLevel =
        form.degreeDetail === "MASTER" || form.degreeDetail === "DOCTOR"
            ? ApplyEducationLevel.BACHELOR
            : form.educationLevel;

    return {
        jobId: form.jobId,
        name: form.name,
        phoneNumber: form.phoneNumber,
        email: form.email,
        address: form.address ?? "",
        addressDetail: form.addressDetail ?? "",
        portfolio: form.portfolio,
        coverLetter: form.coverLetter,
        profileImage: form.profileImage,
        educationLevel: normalizedEducation,
        schoolName: form.schoolName,
        admissionYear: form.admissionYear,
        graduationYear: form.graduationYear,
        department: form.department,
        military: normalizedMilitary,
        attachment1: form.attachment1,
        attachment2: form.attachment2,
        attachment3: form.attachment3,
    };
};