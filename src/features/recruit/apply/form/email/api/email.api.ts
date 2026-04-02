import BigtabletAxios from "src/shared/libs/api/axios";

/**
 * @author 박상민
 *
 * @description 이메일 인증 코드를 발송한다.
 * @endpoint POST /auth/email
 * @auth Unnecessary
 * @permission Unnecessary
 *
 * @param email - 인증 대상 이메일 주소
 * @returns 서버 응답 데이터
 */
export const sendEmailApi = async (email: string) => {
	const { data } = await BigtabletAxios.post("/auth/email", { email });
	return data;
};

/**
 * @author 박상민
 *
 * @description 이메일 인증 코드를 확인한다.
 * @endpoint POST /auth/email/check
 * @auth Unnecessary
 * @permission Unnecessary
 *
 * @param email - 인증 대상 이메일 주소
 * @param authCode - 사용자가 입력한 인증 코드
 * @returns 서버 응답 데이터
 */
export const checkEmailApi = async (email: string, authCode: string) => {
	const { data } = await BigtabletAxios.post("/auth/email/check", {
		email,
		authCode,
	});
	return data;
};
