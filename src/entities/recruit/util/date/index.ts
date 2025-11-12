import type { RecruitResponse, RecruitCard } from "src/entities/recruit/model/schema/recruit.schema";
import {
    departmentLabel,
    educationLabel,
    recruitTypeLabel,
    locationLabel,
} from "src/entities/recruit/constants/recruit.constants";

const toDate = (value?: string | null) => (value ? new Date(value) : undefined);

const getDdayText = (endDate?: string | null): string => {
    const end = toDate(endDate);
    if (!end) return "상시";
    const today = new Date();
    const diff = end.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0);
    const days = Math.ceil(diff / 86400000);
    if (days < 0) return "마감";
    if (days === 0) return "D-DAY";
    return `D-${days}`;
};

const extractTags = (r: RecruitResponse): string[] => {
    const tags: string[] = [];
    if (r.department)  tags.push(departmentLabel(r.department));
    if (r.education)   tags.push(educationLabel(r.education));
    if (r.recruitType) tags.push(recruitTypeLabel(r.recruitType));
    if (r.location)    tags.push(locationLabel(r.location));
    return tags;
};

export const toRecruitCard = (r: RecruitResponse): RecruitCard => ({
    ...r,
    dday: getDdayText(r.endDate ?? null),
    tags: extractTags(r),
});

export const toRecruitCards = (arr: RecruitResponse[]) => arr.map(toRecruitCard);