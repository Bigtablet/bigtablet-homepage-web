import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { blogQueries } from "src/features/blog/query/blog.query";
import BlogPageClient from "./page-client";

const DEFAULT_SIZE = 6;

interface Props {
	searchParams: Promise<{ page?: string; size?: string }>;
}

/**
 * @description
 * /blog 서버 페이지. 첫 페이지 데이터를 SSR 단계에서 prefetch.
 * HydrationBoundary로 client useSuspenseQuery에 데이터 전달 → waterfall 제거.
 */
const BlogPage = async ({ searchParams }: Props) => {
	const params = await searchParams;
	const page = Math.max(1, Number(params?.page ?? 1));
	const size = Math.max(1, Number(params?.size ?? DEFAULT_SIZE));

	const queryClient = new QueryClient();
	await queryClient.prefetchQuery(blogQueries.page(page, size));

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<BlogPageClient />
		</HydrationBoundary>
	);
};

export default BlogPage;
