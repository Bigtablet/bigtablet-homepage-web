/**
 * @description 전화번호를 010-XXXX-XXXX 형식으로 포맷팅한다.
 * 010으로 시작하지 않으면 자동 교체하고 11자리로 제한한다.
 *
 * @param input - 사용자 입력 문자열
 * @returns 포맷팅된 전화번호
 *
 * @example
 * formatPhone010("01012345678") // "010-1234-5678"
 * formatPhone010("010-1234")    // "010-1234"
 */
export const formatPhone010 = (input: string) => {
	let digits = input.replace(/\D/g, "");
	if (!digits.startsWith("010")) {
		digits = digits.length >= 3 ? `010${digits.slice(3)}` : "010";
	}
	digits = digits.slice(0, 11);
	if (digits.length > 3 && digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
	if (digits.length > 7) return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
	return digits;
};
