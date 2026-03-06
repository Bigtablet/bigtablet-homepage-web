import { useEffect, useState } from "react";

/**
 * 로딩이 threshold(ms) 이상 지속될 때만 true를 반환하여 스켈레톤 깜빡임 방지.
 * 초기 마운트 시에는 즉시 스켈레톤을 표시하여 CLS(레이아웃 변경)를 방지합니다.
 */
const useDeferredLoading = (isLoading: boolean, threshold = 300): boolean => {
	const [showLoading, setShowLoading] = useState(isLoading);

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
