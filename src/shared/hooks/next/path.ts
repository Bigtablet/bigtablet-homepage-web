"use client";

import { usePathname } from "next/navigation";

/**
 * @description
 * 현재 pathname을 반환하는 훅입니다.
 *
 * @returns 현재 pathname
 */
export const BigtabletPathname = () => {
	return usePathname();
};
