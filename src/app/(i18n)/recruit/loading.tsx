"use client";

import { useState } from "react";
import type { RecruitSearchFilters } from "src/entities/recruit/api/recruit.api";
import ListPageLayout from "src/shared/ui/list-page-layout";
import RecruitHeader from "src/widgets/recruit/main/header";
import RecruitListSkeleton from "src/widgets/recruit/main/list/skeleton";

const EMPTY_FILTERS: RecruitSearchFilters = {
	keyword: "",
	job: "",
	education: "",
	career: "",
};

/**
 * @description
 * /recruit 라우트 segment loading. SSR prefetchQuery 진행 중 즉시 스트리밍.
 * 정적인 헤더(검색바)는 그대로 노출하고 목록 영역에만 skeleton을 표시 —
 * 데이터에 의존하지 않는 부분까지 통째로 가리지 않도록 부분 로딩.
 */
const RecruitLoading = () => {
	/* 로딩 중에도 검색 컨트롤이 응답하도록 임시 state 보유 (hydration 시 폐기) */
	const [filters, setFilters] = useState<RecruitSearchFilters>(EMPTY_FILTERS);

	return (
		<ListPageLayout>
			<RecruitHeader filters={filters} onChange={setFilters} />
			<RecruitListSkeleton />
		</ListPageLayout>
	);
};

export default RecruitLoading;
