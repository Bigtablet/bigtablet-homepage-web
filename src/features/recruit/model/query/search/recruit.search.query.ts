"use client";

import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import {
    searchJobByDepartment,
    searchJobByEducation,
    searchJobByRecruitType,
    searchJobByTitle,
} from "src/entities/recruit/search/api/recruit.search.api";
import type { RecruitResponse } from "src/entities/recruit/model/schema/recruit.schema";
import { intersectByIdx } from "src/entities/recruit/util/merge";
import { recruitKeys } from "./keys";

export interface RecruitSearchFilters {
    keyword?: string;
    job?: string;
    education?: string;
    career?: string;
}

export const useRecruitSearch = (filters: RecruitSearchFilters) => {
    const { keyword, job, education, career } = filters;

    const enableTitle = !!keyword && keyword !== "";
    const enableDept  = !!job && job !== "";
    const enableEdu   = !!education && education !== "";
    const enableTyp   = !!career && career !== "";

    const isAnyEnabled = enableTitle || enableDept || enableEdu || enableTyp;

    const results = useQueries({
        queries: [
            {
                queryKey: recruitKeys.search("title", keyword ?? ""),
                queryFn: () => searchJobByTitle(keyword!),
                enabled: enableTitle,
                staleTime: 60_000,
            },
            {
                queryKey: recruitKeys.search("department", job ?? ""),
                queryFn: () => searchJobByDepartment(job!),
                enabled: enableDept,
                staleTime: 60_000,
            },
            {
                queryKey: recruitKeys.search("education", education ?? ""),
                queryFn: () => searchJobByEducation(education!),
                enabled: enableEdu,
                staleTime: 60_000,
            },
            {
                queryKey: recruitKeys.search("recruitType", career ?? ""),
                queryFn: () => searchJobByRecruitType(career!),
                enabled: enableTyp,
                staleTime: 60_000,
            },
        ],
    });

    const isLoading = results.some((r) => r.isLoading);
    const isError = results.some((r) => r.isError);
    const error = results.find((r) => r.error)?.error as Error | undefined;

    const data = useMemo(() => {
        if (!isAnyEnabled) return [] as RecruitResponse[];
        const arrs = results.map((r) => r.data ?? []);
        const active = arrs.filter((_, i) =>
            results[i].isFetched || results[i].isFetching || results[i].isLoading
        );
        return intersectByIdx(active);
    }, [results, isAnyEnabled]);

    return { data, isLoading, isError, error };
};