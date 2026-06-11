"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { toIdx } from "src/entities/recruit/util/format";
import { useRecruitDetailQuery } from "src/features/recruit/query/recruit.query";
import BackLink from "src/shared/ui/back-link";
import { RecruitBenefits } from "src/widgets/recruit/detail/benefits";
import { RecruitHeader } from "src/widgets/recruit/detail/header";
import { RecruitMarkdownSection } from "src/widgets/recruit/detail/markdown-section";
import { RecruitNotice } from "src/widgets/recruit/detail/notice";
import { RecruitProcess } from "src/widgets/recruit/detail/process";
import { RecruitRequestSection } from "src/widgets/recruit/detail/request";
import styles from "./style.module.scss";

const RecruitDetailClient = () => {
	const { idx } = useParams<{ locale: string; idx: string }>();
	const tCommon = useTranslations("common");
	const tDetail = useTranslations("recruit.detail");
	const tSection = useTranslations("recruit.detail.section");
	const idxNum = toIdx(idx);

	const { data, status, error } = useRecruitDetailQuery(idxNum ?? -1, {
		enabled: idxNum !== null,
	});

	const recruit = data;

	return (
		<div className={styles.recruit_detail}>
			<BackLink href="/recruit" label={tCommon("backToRecruit")} />

			{status === "pending" && (
				<div className={styles.recruit_detail_loading}>{tDetail("loading")}</div>
			)}

			{status === "error" && (
				<div className={styles.recruit_detail_error}>
					{tDetail("loadFailed")} {error instanceof Error ? error.message : ""}
				</div>
			)}

			{status === "success" && recruit && (
				<>
					<RecruitHeader recruit={recruit} />
					<RecruitMarkdownSection
						title={tSection("company")}
						content={recruit.companyIntroduction}
					/>
					<RecruitMarkdownSection
						title={tSection("position")}
						content={recruit.positionIntroduction}
					/>
					<RecruitMarkdownSection
						title={tSection("responsibility")}
						content={recruit.mainResponsibility}
					/>
					<RecruitMarkdownSection
						title={tSection("qualification")}
						content={recruit.qualification}
					/>
					{recruit.preferredQualification && (
						<RecruitMarkdownSection
							title={tSection("preferredQualification")}
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
