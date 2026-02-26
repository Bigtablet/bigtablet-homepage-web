"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

/**
 * @description
 * 네비게이션 로딩 상태 컨텍스트 타입입니다.
 */
type NavigationContextValue = {
	isLoading: boolean;
	setLoading: (value: boolean) => void;
};

const NavigationContext = createContext<NavigationContextValue>({
	isLoading: false,
	setLoading: () => {},
});

/**
 * @description
 * 라우팅 전환 시 로딩 상태를 관리하는 Provider입니다.
 *
 * @param children - 하위 컴포넌트
 * @returns NavigationContext Provider
 */
export const BigtabletNavigation = ({ children }: { children: React.ReactNode }) => {
	const [isLoading, setIsLoading] = useState(false);
	const pathname = usePathname();

	const setLoading = (value: boolean) => {
		setIsLoading(value);
	};

	useEffect(() => {
		setIsLoading(false);
	}, [pathname]);

	return (
		<NavigationContext.Provider value={{ isLoading, setLoading }}>
			{children}
		</NavigationContext.Provider>
	);
};

/**
 * @description
 * 네비게이션 로딩 상태를 사용하는 훅입니다.
 *
 * @returns 네비게이션 컨텍스트 값
 */
export const useNavigationStore = () => useContext(NavigationContext);
