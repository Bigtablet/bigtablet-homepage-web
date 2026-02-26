"use client";

import { useToast } from "@bigtablet/design-system";
import { useEffect } from "react";
import { setToastRef } from "./toast-bridge";

/** useToast() 참조를 모듈 싱글톤에 저장하는 브리지 컴포넌트 */
const ToastBridgeProvider = () => {
	const toast = useToast();

	useEffect(() => {
		setToastRef(toast);
	}, [toast]);

	return null;
};

export default ToastBridgeProvider;
