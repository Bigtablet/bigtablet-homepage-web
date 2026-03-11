"use client";

import ErrorFallback from "src/shared/ui/error-fallback";

const MemberDetailError = ({ reset }: { error: Error; reset: () => void }) => {
	return (
		<ErrorFallback
			reset={reset}
			backHref="/about"
			backLabel="팀 소개로 돌아가기"
		/>
	);
};

export default MemberDetailError;
