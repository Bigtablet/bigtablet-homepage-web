"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import type { RecruitSearchFilters } from "src/entities/recruit/api/recruit.api";
import ErrorFallback from "src/shared/ui/error-fallback";
import ListPageLayout from "src/shared/ui/list-page-layout";
import RecruitHeader from "src/widgets/recruit/main/header";
import RequestList from "src/widgets/recruit/main/list";

const RecruitPageClient = () => {
	const t = useTranslations("common");
	const [filters, setFilters] = useState<RecruitSearchFilters>({
		keyword: "",
		job: "",
		education: "",
		career: "",
	});

	return (
		<ListPageLayout>
			<RecruitHeader filters={filters} onChange={setFilters} />

			<ErrorBoundary
				fallbackRender={({ resetErrorBoundary }) => (
					<ErrorFallback reset={resetErrorBoundary} backHref="/" backLabel={t("backToMain")} />
				)}
				resetKeys={[filters]}
			>
				<RequestList filters={filters} />
			</ErrorBoundary>
		</ListPageLayout>
	);
};

export default RecruitPageClient;
