"use client";

import { useParams } from "next/navigation";

/**
 * @description
 * Next.js `useParams`를 제네릭 타입으로 감싼 훅입니다.
 *
 * @template T URL 파라미터 타입
 * @returns 타입이 지정된 URL 파라미터
 */
export const BigtabletParams = <T extends Record<string, string>>() => {
	return useParams() as unknown as T;
};
