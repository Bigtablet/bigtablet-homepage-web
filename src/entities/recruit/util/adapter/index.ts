import { recruitCardSchema, type RecruitCard, type RecruitResponse } from "src/entities/recruit/model/schema/recruit.schema";
import {
    departmentLabel,
    educationLabel,
    recruitTypeLabel,
    locationLabel,
} from "src/entities/recruit/constants/recruit.constants";

const calcDday = (end?: string | null): string => {
    if (!end) return "상시";

    const endDate = new Date(end);
    endDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diff = Math.ceil((endDate.getTime() - today.getTime()) / 86400000);

    if (Number.isNaN(diff)) return "상시";
    if (diff > 0) return `D-${diff}`;
    if (diff === 0) return "D-DAY";
    return "마감";
};

export const toRecruitCard = (dto: RecruitResponse): RecruitCard => {
    const deptLabel = departmentLabel(dto.department);
    const typeLabel = recruitTypeLabel(dto.recruitType);
    const locLabel  = locationLabel(dto.location);
    const eduLabel  = educationLabel(dto.education);

    const dday = calcDday(dto.endDate);

    const tags = [
        deptLabel,
        typeLabel,
        locLabel,
        eduLabel,
        dto.experiment,
    ];

    return recruitCardSchema.parse({
        ...dto,
        idx: dto.idx,
        dday,
        tags,
    });
};