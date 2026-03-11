import type { Metadata } from "next";
import { getRecruitDetailApi } from "src/entities/recruit/api/recruit.api";
import RecruitDetailClient from "./client";

type PageProps = {
	params: { idx: string };
};

/** 채용 상세 동적 메타데이터 */
export const generateMetadata = async ({
	params,
}: PageProps): Promise<Metadata> => {
	const { idx } = params;
	const idxNum = Number(idx);
	if (!Number.isFinite(idxNum) || idxNum <= 0) return {};

	try {
		const recruit = await getRecruitDetailApi(idxNum);

		const title = `${recruit.title} | Bigtablet 채용`;
		const description =
			recruit.positionIntroduction?.slice(0, 160) ?? undefined;

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

const RecruitDetailPage = async () => {
	return <RecruitDetailClient />;
};

export default RecruitDetailPage;
