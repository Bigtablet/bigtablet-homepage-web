import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getRecruitListApi, getRecruitDetailApi } from "src/api/recruit/recruit.api";
import { QueryKey } from "src/queries/queryKey";
import type { RecruitResponse, RecruitCard } from "src/types/recruit/recruit.type";

const toRecruitCard = (item: RecruitResponse): RecruitCard => {
    let dday = "상시";
    if (item.endDate) {
        const end = new Date(item.endDate);
        const diff = Math.ceil((end.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        dday = diff > 0 ? `D-${diff}` : "마감";
    }

    const tags = [
        item.department === "IT" ? "개발팀" : item.department,
        item.recruitType === "FULL_TIME" ? "정규직" : item.recruitType === "CONTRACT" ? "계약직" : "인턴",
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

export const useRecruitListQuery = (
    options?: Omit<UseQueryOptions<RecruitResponse[], Error, RecruitCard[]>, "queryKey" | "queryFn" | "select">
) =>
    useQuery({
        queryKey: [QueryKey.recruit.list],
        queryFn: ({ signal }) => getRecruitListApi(signal),
        select: (data) => data.map(toRecruitCard),
        staleTime: 60_000,
        ...options,
    });

export const useRecruitDetailQuery = (
    idx: number,
    options?: Omit<UseQueryOptions<RecruitResponse, Error, RecruitCard>, "queryKey" | "queryFn" | "select">
) =>
    useQuery({
        queryKey: [QueryKey.recruit.detail, idx],
        queryFn: ({ signal }) => getRecruitDetailApi(idx, signal),
        select: toRecruitCard,
        enabled: !!idx,
        staleTime: 60_000,
        ...options,
    });