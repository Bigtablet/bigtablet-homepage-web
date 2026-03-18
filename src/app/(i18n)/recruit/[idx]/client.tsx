"use client";

import { useParams } from "next/navigation";
import { useRecruitDetailQuery } from "src/features/recruit/query/recruit.query";
import BackLink from "src/shared/ui/back-link";
import { RecruitBenefits } from "./recruit-benefits";
import { RecruitHeader } from "./recruit-header";
import { RecruitMarkdownSection } from "./recruit-markdown-section";
import { RecruitNotice } from "./recruit-notice";
import { RecruitProcess } from "./recruit-process";
import { RecruitRequestSection } from "./recruit-request-section";
import { toIdx } from "./utils";
import styles from "./style.module.scss";

const RecruitDetailClient = () => {
	const { idx } = useParams<{ locale: string; idx: string }>();
	const idxNum = toIdx(idx);

	const { data, status, error } = useRecruitDetailQuery(idxNum ?? -1, {
		enabled: idxNum !== null,
	});

	const recruit = data;

	return (
		<div className={styles.recruit_detail}>
			<BackLink href="/recruit" label="채용 목록" />

			{status === "pending" && (
				<div className={styles.recruit_detail_loading}>불러오는 중…</div>
			)}

			{status === "error" && (
				<div className={styles.recruit_detail_error}>
					불러오지 못했습니다. {error instanceof Error ? error.message : ""}
				</div>
			)}

			{status === "success" && recruit && (
				<>
					<RecruitHeader recruit={recruit} idx={idx} />
					<RecruitMarkdownSection
						title="조직 소개"
						content={recruit.companyIntroduction}
					/>
					<RecruitMarkdownSection
						title="포지션 소개"
						content={recruit.positionIntroduction}
					/>
					<RecruitMarkdownSection
						title="주요 업무"
						content={recruit.mainResponsibility}
					/>
					<RecruitMarkdownSection
						title="자격 요건"
						content={recruit.qualification}
					/>
					{recruit.preferredQualification && (
						<RecruitMarkdownSection
							title="우대사항"
							content={recruit.preferredQualification}
						/>
					)}
					<RecruitBenefits />
					<RecruitProcess />
					<RecruitNotice />
					<RecruitRequestSection idx={idx} />
				</>
			)}
		</div>
	);
};

export default RecruitDetailClient;
