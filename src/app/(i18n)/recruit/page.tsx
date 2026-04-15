"use client";

import { useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import type { RecruitSearchFilters } from "src/entities/recruit/api/recruit.api";
import ErrorFallback from "src/shared/ui/error-fallback";
import RecruitHeader from "src/widgets/recruit/main/header";
import RequestList from "src/widgets/recruit/main/list";
import styles from "./style.module.scss";

const RecruitPage = () => {
	const [filters, setFilters] = useState<RecruitSearchFilters>({
		keyword: "",
		job: "",
		education: "",
		career: "",
	});

	return (
		<section className={styles.recruit_page}>
			<RecruitHeader filters={filters} onChange={setFilters} />

			<div className={styles.recruit_page_list}>
				<ErrorBoundary
					fallbackRender={({ resetErrorBoundary }) => (
						<ErrorFallback
							reset={resetErrorBoundary}
							backHref="/main"
							backLabel="메인으로 돌아가기"
						/>
					)}
					resetKeys={[filters]}
				>
					<RequestList filters={filters} />
				</ErrorBoundary>
			</div>
		</section>
	);
};

export default RecruitPage;
