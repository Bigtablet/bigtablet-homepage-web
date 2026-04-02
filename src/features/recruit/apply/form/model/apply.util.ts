import { ApplyMilitaryStatus } from "src/entities/recruit/schema/recruit.schema";

/**
 * @description 현재 연도-월을 "YYYY-MM" 형식으로 반환한다.
 *
 * @returns "2026-04" 등의 문자열
 *
 * @example
 * currentYearMonth() // "2026-04"
 */
export const currentYearMonth = () => {
	const date = new Date();
	const month = `${date.getMonth() + 1}`.padStart(2, "0");
	return `${date.getFullYear()}-${month}`;
};

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
	if (digits.length > 3 && digits.length <= 7)
		return `${digits.slice(0, 3)}-${digits.slice(3)}`;
	if (digits.length > 7)
		return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
	return digits;
};

/**
 * @description 병역 상태 문자열을 ApplyMilitaryStatus enum으로 매핑한다.
 * 레거시 값("DONE", "PENDING", "EXEMPT")도 호환 처리한다.
 *
 * @param value - 병역 상태 문자열
 * @returns ApplyMilitaryStatus enum 값
 *
 * @example
 * mapMil("DONE")    // "COMPLETED"
 * mapMil("PENDING") // "NOT_COMPLETED"
 * mapMil("UNKNOWN") // "NOT_APPLICABLE"
 */
export const mapMil = (value: string): ApplyMilitaryStatus => {
	if (value === "DONE") return ApplyMilitaryStatus.enum.COMPLETED;
	if (value === "PENDING") return ApplyMilitaryStatus.enum.NOT_COMPLETED;
	if (value === "EXEMPT" || value === "")
		return ApplyMilitaryStatus.enum.NOT_APPLICABLE;
	const parsed = ApplyMilitaryStatus.safeParse(value);
	if (parsed.success) return parsed.data;
	return ApplyMilitaryStatus.enum.NOT_APPLICABLE;
};

export default { currentYearMonth, formatPhone010, mapMil };
