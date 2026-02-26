import { useEffect, useState } from "react";

/** 로딩이 threshold(ms) 이상 지속될 때만 true를 반환하여 스켈레톤 깜빡임 방지 */
const useDeferredLoading = (isLoading: boolean, threshold = 300): boolean => {
	const [showLoading, setShowLoading] = useState(false);

	useEffect(() => {
		if (!isLoading) {
			setShowLoading(false);
			return;
		}

		const timer = setTimeout(() => setShowLoading(true), threshold);
		return () => clearTimeout(timer);
	}, [isLoading, threshold]);

	return showLoading;
};

export default useDeferredLoading;
