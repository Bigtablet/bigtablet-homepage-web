import { useRecruitListQuery, useRecruitDetailQuery } from "src/queries/recruit/recruit.query";

export const useRecruitList = () => {
    const { data, status, error } = useRecruitListQuery();
    const list = data ?? [];
    return { list, status, error, isEmpty: list.length === 0 };
};

export const useRecruitDetail = (idx: number) => {
    const { data, status, error } = useRecruitDetailQuery(idx, { enabled: !!idx });
    return { recruit: data ?? null, status, error };
};