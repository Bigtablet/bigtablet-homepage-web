import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import type { Metadata } from "next";
import { getRecruitDetailApi } from "src/entities/recruit/api/recruit.api";
import { recruitQueries } from "src/features/recruit/query/recruit.query";
import RecruitDetailClient from "./client";

type PageProps = {
	params: Promise<{ idx: string }>;
};

/** 채용 상세 동적 메타데이터 */
export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
	const { idx } = await params;
	const idxNum = Number(idx);
	if (!Number.isFinite(idxNum) || idxNum <= 0) return {};

	try {
		const recruit = await getRecruitDetailApi(idxNum);

		const title = `${recruit.title} | Bigtablet 채용`;
		const description = recruit.positionIntroduction?.slice(0, 160) ?? undefined;

		return {
			title,
			description,
			openGraph: {
				title,
				description,
				type: "article",
			},
			twitter: {
				card: "summary",
				title,
				description,
			},
		};
	} catch {
		return {};
	}
};

const RecruitDetailPage = async ({ params }: PageProps) => {
	const { idx } = await params;
	const idxNum = Number(idx);

	const queryClient = new QueryClient();
	if (Number.isFinite(idxNum) && idxNum > 0) {
		/* prefetch — generateMetadata와 react cache 통해 동일 요청 dedupe */
		await queryClient.prefetchQuery(recruitQueries.detail(idxNum));
	}

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<RecruitDetailClient />
		</HydrationBoundary>
	);
};

export default RecruitDetailPage;
