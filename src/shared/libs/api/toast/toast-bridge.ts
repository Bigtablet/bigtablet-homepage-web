/**
 * @description
 * React 트리 외부(MutationCache 등)에서 토스트를 호출하기 위한 브리지 모듈입니다.
 *
 * - `setToastRef`: ToastBridgeProvider에서 useToast() 참조를 저장
 * - `getToastRef`: MutationCache 등에서 토스트 참조를 가져와 사용
 */
type ToastRef = {
	error: (message: string) => void;
	success: (message: string) => void;
	info: (message: string) => void;
};

let toastRef: ToastRef | null = null;

export const setToastRef = (ref: ToastRef) => {
	toastRef = ref;
};

export const getToastRef = (): ToastRef | null => toastRef;
