import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getBlogDetailApi } from "src/entities/blog/api/blog.api";
import { blogQueries } from "src/features/blog/query/blog.query";
import { createServerQueryClient } from "src/shared/libs/api/query/server-query-client";
import BlogDetailClient from "./client";

type PageProps = {
	params: Promise<{ idx: string }>;
};

/** 블로그 상세 동적 메타데이터 */
export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
	const { idx } = await params;
	const idNum = Number(idx);
	if (!Number.isFinite(idNum) || idNum <= 0) return {};

	try {
		const blog = await getBlogDetailApi(idNum);
		const store = await cookies();
		const locale = store.get("NEXT_LOCALE")?.value === "en" ? "en" : "ko";

		const title = locale === "en" ? blog.titleEn : blog.titleKr;
		const description = (locale === "en" ? blog.summaryEn : blog.summaryKr) ?? undefined;

		return {
			title,
			description,
			openGraph: {
				title,
				description,
				type: "article",
				...(blog.imageUrl ? { images: [{ url: blog.imageUrl }] } : {}),
			},
			twitter: {
				card: "summary_large_image",
				title,
				description,
				...(blog.imageUrl ? { images: [blog.imageUrl] } : {}),
			},
		};
	} catch {
		return {};
	}
};

const BlogDetailPage = async ({ params }: PageProps) => {
	const { idx } = await params;
	const idNum = Number(idx);

	/**
	 * URL 파라미터 자체 검증만 서버에서 처리
	 * - 숫자가 아니거나
	 * - 0 이하인 경우
	 *
	 * 데이터 존재 여부 / API 에러는
	 * Client 컴포넌트에서 처리한다
	 */
	if (!Number.isFinite(idNum) || idNum <= 0) notFound();

	/* prefetch — generateMetadata와 react cache 통해 동일 요청 dedupe */
	const queryClient = createServerQueryClient();
	await queryClient.prefetchQuery(blogQueries.detail(idNum));

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<BlogDetailClient idx={idNum} />
		</HydrationBoundary>
	);
};

export default BlogDetailPage;
