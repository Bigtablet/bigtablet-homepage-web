import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { recruitQueries } from "src/features/recruit/query/recruit.query";
import RecruitPageClient from "./page-client";

/**
 * @description
 * /recruit 서버 페이지. 빈 필터 기준 list 쿼리를 SSR 단계에서 prefetch.
 * 첫 페인트에 공고 카드 즉시 표시 → skeleton 깜빡임 제거.
 */
const RecruitPage = async () => {
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery(recruitQueries.list());

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<RecruitPageClient />
		</HydrationBoundary>
	);
};

export default RecruitPage;
