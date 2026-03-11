"use client";

import ErrorFallback from "src/shared/ui/error-fallback";

const RecruitDetailError = ({ reset }: { error: Error; reset: () => void }) => {
	return (
		<ErrorFallback
			reset={reset}
			backHref="/recruit"
			backLabel="채용 목록으로 돌아가기"
		/>
	);
};

export default RecruitDetailError;
