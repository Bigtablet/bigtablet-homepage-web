import { MutationCache } from "@tanstack/react-query";
import { getErrorMessage } from "src/shared/libs/api/axios/error/error.util";
import { getToastRef } from "src/shared/libs/api/toast/toast-bridge";

/**
 * @description
 * 전역 mutation 에러/성공 토스트를 자동 처리하는 MutationCache 팩토리입니다.
 *
 * - `meta.errorMessage`: 에러 시 표시할 기본 메시지 (서버 메시지 우선)
 * - `meta.successMessage`: 성공 시 표시할 토스트 메시지
 * - `meta.skipGlobalErrorToast`: true면 전역 에러 토스트 비활성화
 */
export const createMutationCache = () =>
	new MutationCache({
		onError: (error, _variables, _context, mutation) => {
			if (mutation.meta?.skipGlobalErrorToast) return;
			if (!mutation.meta?.errorMessage) return;

			const toast = getToastRef();
			if (!toast) return;

			const fallback = mutation.meta.errorMessage;
			toast.error(getErrorMessage(error, fallback));
		},
		onSuccess: (_data, _variables, _context, mutation) => {
			if (!mutation.meta?.successMessage) return;

			const toast = getToastRef();
			if (!toast) return;

			toast.success(String(mutation.meta.successMessage));
		},
	});
