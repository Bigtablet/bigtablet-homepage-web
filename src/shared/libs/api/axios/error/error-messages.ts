/**
 * @description
 * HTTP 상태 코드별 기본 에러 메시지
 */
export const HTTP_STATUS_MESSAGES: Record<number, string> = {
	400: "잘못된 요청입니다.",
	401: "인증이 필요합니다.",
	403: "접근 권한이 없습니다.",
	404: "요청한 리소스를 찾을 수 없습니다.",
	409: "요청이 현재 상태와 충돌합니다.",
	422: "요청 데이터가 올바르지 않습니다.",
	429: "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.",
	500: "서버에 오류가 발생했습니다.",
	502: "서버 연결에 실패했습니다.",
	503: "서비스가 일시적으로 이용 불가합니다.",
};

export const DEFAULT_ERROR_MESSAGE = "알 수 없는 오류가 발생했습니다.";

export const NETWORK_ERROR_MESSAGE = "네트워크 연결을 확인해 주세요.";
