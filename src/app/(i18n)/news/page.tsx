import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { newsQueries } from "src/features/news/query/news.query";
import NewsPageClient from "./page-client";

const PAGE_SIZE = 6;

interface Props {
	searchParams: Promise<{ page?: string }>;
}

/**
 * @description
 * /news 서버 페이지. 첫 페이지 데이터를 SSR 단계에서 prefetch 후 HydrationBoundary로 전달.
 * 클라이언트는 useSuspenseQuery에서 prefetched 데이터를 즉시 받아 waterfall 제거.
 */
const NewsPage = async ({ searchParams }: Props) => {
	const params = await searchParams;
	const page = Math.max(1, Number(params?.page ?? 1));

	const queryClient = new QueryClient();
	await queryClient.prefetchQuery(newsQueries.page(page, PAGE_SIZE));

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<NewsPageClient />
		</HydrationBoundary>
	);
};

export default NewsPage;
