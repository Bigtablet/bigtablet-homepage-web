import { recruitCardSchema, type RecruitCard, type RecruitResponse } from "src/entities/recruit/model/schema/recruit.schema";

const calcDday = (end?: string | undefined | null): string => {
    if (!end) return "상시";
    const endDate = new Date(end); endDate.setHours(0,0,0,0);
    const today   = new Date();    today.setHours(0,0,0,0);
    const diff = Math.ceil((endDate.getTime() - today.getTime()) / 86400000);
    if (Number.isNaN(diff)) return "상시";
    if (diff > 0)  return `D-${diff}`;
    if (diff === 0) return "D-DAY";
    return "마감";
};

export const toRecruitCard = (dto: RecruitResponse): RecruitCard => {
    if (typeof dto.idx !== "number") throw new Error("RecruitCard requires numeric idx");

    const deptLabel =
        dto.department === "IT" ? "개발팀" :
            dto.department === "MARKETING" ? "마케팅" :
                dto.department === "DESIGN" ? "디자인" :
                    dto.department === "SALE" ? "영업" :
                        dto.department === "BUSINESS_ADMINISTRATION" ? "경영지원" :
                            dto.department === "RESEARCH_AND_DEVELOPMENT" ? "R&D" : String(dto.department);

    const typeLabel = dto.recruitType === "FULL_TIME" ? "정규직" :
        dto.recruitType === "CONTRACT" ? "계약직" : "인턴";

    const locLabel = dto.location === "SEOUL" ? "서울" :
        dto.location === "DAEGU" ? "대구" : String(dto.location);

    const eduLabel = dto.education === "BACHELOR" ? "대졸" :
        dto.education === "HIGH_SCHOOL" ? "고졸" :
            dto.education === "ASSOCIATE" ? "전문학사" : "학력무관";

    const dday = calcDday(dto.endDate);
    const tags = [deptLabel, typeLabel, locLabel, eduLabel, dto.experiment];

    return recruitCardSchema.parse({ ...dto, idx: dto.idx, dday, tags });
};