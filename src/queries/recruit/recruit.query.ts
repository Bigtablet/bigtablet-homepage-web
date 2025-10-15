import { useQuery } from "@tanstack/react-query";
import {getRecruitListApi} from "src/apis/recruit/recruit.apis";
import type { RecruitResponse, RecruitCard } from "src/types/recruit/recruit.type";

const toCard = (item: RecruitResponse): RecruitCard => {
    let dday: string;

    if (!item.endDate) {
        dday = "상시";
    } else {
        const end = new Date(item.endDate);
        const today = new Date();
        const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        dday = diff > 0 ? `D-${diff}` : "마감";
    }

    const tags = [
        item.department === "IT" ? "개발팀" : item.department,
        item.recruitType === "FULL_TIME"
            ? "정규직"
            : item.recruitType === "CONTRACT"
                ? "계약직"
                : "인턴",
        item.location === "SEOUL" ? "서울" : item.location === "DAEGU" ? "대구" : item.location,
        item.education === "BACHELOR"
            ? "대졸"
            : item.education === "HIGH_SCHOOL"
                ? "고졸"
                : item.education === "ASSOCIATE"
                    ? "전문학사"
                    : "학력무관",
        item.experiment,
    ];

    return { ...item, dday, tags };
};

export const useRecruitListQuery = () =>
    useQuery({
        queryKey: ["recruit-list"],
        queryFn: () => getRecruitListApi(),
        select: (data) => data.map(toCard),
        staleTime: 60_000,
    });