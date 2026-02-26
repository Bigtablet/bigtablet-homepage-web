"use client";

import { useSearchParams } from "next/navigation";

/**
 * @description
 * SearchParams를 편하게 다루기 위한 래퍼 훅입니다.
 *
 * @returns raw SearchParams와 헬퍼 메서드
 */
export const BigtabletSearchParams = () => {
	const rawParams = useSearchParams();

	return {
		raw: rawParams,

		get(key: string): string | null {
			return rawParams.get(key);
		},

		getString(key: string, defaultValue?: string): string | undefined {
			return rawParams.get(key) ?? defaultValue;
		},

		getNumber(key: string, defaultValue?: number): number | undefined {
			const rawValue = rawParams.get(key);
			if (rawValue == null) return defaultValue;
			const parsedNumber = Number(rawValue);
			return Number.isFinite(parsedNumber) ? parsedNumber : defaultValue;
		},

		getBoolean(key: string, defaultValue = false): boolean {
			const rawValue = rawParams.get(key);
			if (rawValue == null) return defaultValue;
			return ["true", "1", "yes", "on"].includes(rawValue.toLowerCase());
		},

		toString() {
			return rawParams.toString();
		},

		entries() {
			return rawParams.entries();
		},
	};
};
