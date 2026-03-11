"use client";

import { memo, useMemo } from "react";
import type { RecruitSearchFilters } from "src/entities/recruit/api/recruit.api";
import type {
	RecruitCard,
	RecruitResponse,
} from "src/entities/recruit/schema/recruit.schema";
import { toRecruitCards } from "src/entities/recruit/util/date";
import {
	useRecruitListQuery,
	useRecruitSearchQuery,
} from "src/features/recruit/query/recruit.query";
import useDeferredLoading from "src/shared/hooks/use-deferred-loading";
import { SkeletonList } from "src/shared/ui/skeleton/list";

import styles from "./style.module.scss";

interface Props {
	filters: RecruitSearchFilters;
}

const isEmpty = (v?: string) => v === "" || v === undefined;

const RequestCard = memo(({ item }: { item: RecruitCard }) => {
	return (
		<a className={styles.request_item} href={`/recruit/${item.idx}`}>
			<div className={styles.request_item_left}>
				<div className={styles.request_item_title}>{item.title}</div>
				<div className={styles.request_item_tags}>
					{item.tags.map((t, i) => (
						<span key={i} className={styles.request_item_tag}>
							{t}
						</span>
					))}
				</div>
			</div>
			{item.dday && <div className={styles.request_item_dday}>{item.dday}</div>}
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

	/* 목록 + 검색 쿼리 */
	const listQ = useRecruitListQuery({
		enabled: allEmpty,
	});

	const searchQ = useRecruitSearchQuery(filters, {
		enabled: !allEmpty,
	});

	const isSearching = !allEmpty;

	const isLoading = isSearching ? searchQ.isLoading : listQ.isLoading;
	const showSkeleton = useDeferredLoading(isLoading);
	const isError = isSearching ? searchQ.isError : listQ.isError;
	const error = isSearching ? searchQ.error : listQ.error;

	const data = useMemo<RecruitCard[]>(() => {
		const base: RecruitResponse[] =
			(isSearching ? searchQ.data : listQ.data) ?? [];
		return toRecruitCards(base);
	}, [isSearching, searchQ.data, listQ.data]);

	return (
		<div className={styles.request_list}>
			{showSkeleton && [...Array(5)].map((_, i) => <SkeletonList key={i} />)}

			{!isLoading && isError && (
				<div className={styles.request_list_empty}>{error?.message}</div>
			)}

			{!isLoading && !isError && data.length === 0 && (
				<div className={styles.request_list_empty}>공고가 없습니다.</div>
			)}

			{!isLoading &&
				!isError &&
				data.map((item) => <RequestCard key={item.idx} item={item} />)}
		</div>
	);
};

export default memo(RequestList);
