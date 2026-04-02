/**
 * @description
 * 서버 에러 코드를 사용자 친화적인 한국어 메시지로 변환하는 맵
 *
 * - 에러 코드가 있을 경우 HTTP status보다 우선 적용
 */
export const ERROR_CODE_MESSAGES: Record<string, string> = {
	// 공통
	UNAUTHORIZED: "인증이 만료되었습니다. 다시 로그인해 주세요.",
	FORBIDDEN: "해당 작업을 수행할 권한이 없습니다.",
	INTERNAL_SERVER_ERROR:
		"서버에 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",

	// 이메일 인증
	EMAIL_IS_NOT_CERTIFIED: "이메일 인증이 완료되지 않았습니다.",
	EMAIL_NOT_VALID: "인증 코드가 올바르지 않습니다.",
	EMAIL_ERROR: "이메일 발송에 실패했습니다. 잠시 후 다시 시도해 주세요.",
	EMAIL_ALREADY_EXIST: "이미 사용 중인 이메일입니다.",

	// 채용 (Recruit)
	RECRUIT_NOT_FOUND: "해당 채용 공고를 찾을 수 없습니다.",
	RECRUIT_CLOSED: "마감된 채용 공고입니다.",
	APPLICATION_ALREADY_EXIST: "이미 지원한 공고입니다.",

	// 인재풀 (Talent)
	TALENT_ALREADY_EXIST: "이미 등록된 인재 정보입니다.",

	// 파일 업로드
	FILE_TOO_LARGE: "파일 크기가 제한을 초과했습니다.",
	FILE_TYPE_NOT_ALLOWED: "허용되지 않는 파일 형식입니다.",
};
