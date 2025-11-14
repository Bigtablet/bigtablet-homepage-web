import type { RecruitResponse } from "../../model/schema/recruit.schema";
import type { RecruitDTO, RecruitSummary } from "../../model/domain";

// endDate 날짜 기준 D-DAY 문자열 반환
const calcDday = (endDate?: string) => {
    if (!endDate) return "";
    const today = new Date();
    const end = new Date(endDate);
    const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (Number.isNaN(diff)) return "";
    if (diff > 0) return `D-${diff}`;
    if (diff === 0) return "D-DAY";
    return `마감`;
};

const makeTags = (dto: RecruitResponse): string[] => {
    return [dto.department, dto.location, dto.recruitType].map(String);
};

// DTO → Domain(상세)
export const toRecruit = (dto: RecruitResponse): RecruitDTO | null => {
    if (typeof dto.idx !== "number" || !Number.isFinite(dto.idx)) return null;
    return {
        idx: dto.idx,
        title: dto.title,
        department: dto.department,
        location: dto.location,
        recruitType: dto.recruitType,
        experiment: dto.experiment,
        education: dto.education,
        companyIntroduction: dto.companyIntroduction,
        mainResponsibility: dto.mainResponsibility,
        qualification: dto.qualification,
        preferredQualification: dto.preferredQualification,
        startDate: dto.startDate,
        endDate: dto.endDate,
        createdAt: dto.createdAt,
        modifiedAt: dto.modifiedAt,
    };
};

// DTO → Domain(리스트)
export const toRecruitSummary = (dto: RecruitResponse): RecruitSummary | null => {
    if (typeof dto.idx !== "number" || !Number.isFinite(dto.idx)) return null;
    return {
        idx: dto.idx,
        title: dto.title,
        dday: calcDday(dto.endDate ?? undefined),
        tags: makeTags(dto),
    };
};