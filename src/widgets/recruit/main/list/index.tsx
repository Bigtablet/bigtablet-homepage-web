"use client";

import { memo, useMemo } from "react";
import type { RecruitSearchFilters } from "src/features/recruit/model/query/search/recruit.search.query";
import { useRecruitSearch } from "src/features/recruit/model/query/search/recruit.search.query";
import type { RecruitResponse, RecruitCard } from "src/entities/recruit/model/schema/recruit.schema";
import { useRecruitListQuery } from "src/features/recruit/model/query/recruit.query";
import { SkeletonList } from "src/shared/ui/skeleton/list";
import {toRecruitCards} from "src/entities/recruit/util/date";
import "./style.scss";

interface Props { filters: RecruitSearchFilters };

const isEmpty = (v?: string) => v === "" || v === undefined;

const RequestCard = memo(({ item }: { item: RecruitCard }) => {
    return (
        <a className="request-item" href={`/recruit/${item.idx}`}>
            <div className="request-item__left">
                <div className="request-item__title">{item.title}</div>
                <div className="request-item__tags">
                    {item.tags.map((t, i) => (
                        <span key={i} className="request-item__tag">{t}</span>
                    ))}
                </div>
            </div>
            {item.dday && <div className="request-item__dday">{item.dday}</div>}
        </a>
    );
});
RequestCard.displayName = "RequestCard";

const RequestList = ({ filters }: Props) => {
    const allEmpty =
        isEmpty(filters.keyword) &&
        isEmpty(filters.job) &&
        isEmpty(filters.education) &&
        isEmpty(filters.career);

    // 초기엔 전체 리스트, 검색 시엔 검색 결과
    const listQ = useRecruitListQuery({ enabled: allEmpty });
    const searchQ = useRecruitSearch(filters);

    const isSearching = !allEmpty;
    const isLoading = isSearching ? searchQ.isLoading : listQ.isLoading;
    const isError   = isSearching ? searchQ.isError   : listQ.isError;
    const error     = isSearching ? searchQ.error     : listQ.error;

    // 여기서 카드로 변환
    const data = useMemo<RecruitCard[]>(
        () => {
            const base: RecruitResponse[] = (isSearching ? searchQ.data : listQ.data) ?? [];
            return toRecruitCards(base);
        },
        [isSearching, searchQ.data, listQ.data]
    );

    return (
        <div className="request-list">
            {isLoading && (
                <>
                    {[...Array(5)].map((_, i) => <SkeletonList key={i} />)}
                </>
            )}

            {!isLoading && isError && (
                <div className="request-list__empty">{error?.message}</div>
            )}

            {!isLoading && !isError && data.length === 0 && (
                <div className="request-list__empty">공고가 없습니다.</div>
            )}

            {!isLoading && !isError && data.map((item) => (
                <RequestCard key={item.idx} item={item} />
            ))}
        </div>
    );
};

export default memo(RequestList);