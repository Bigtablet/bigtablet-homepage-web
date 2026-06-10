import {
	type RecruitRequest,
	recruitRequestSchema,
} from "src/entities/recruit/schema/recruit.schema";
import type { ApplyFormValues } from "src/features/recruit/apply/form/model/apply.schema";

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

/**
 * @description 지원서 폼 값을 API 요청 페이로드로 변환한다.
 * 폼 필드 graduationEnd 를 API 계약 필드 graduationYear 로 매핑하고,
 * GED(검정고시)는 학교 관련 필드를 비운다.
 * recruitRequestSchema(.strict)로 parse 하므로 폼-API 계약 드리프트를 런타임에 차단한다.
 *
 * @param values - 검증 통과한 지원서 폼 값
 * @param jobId - 지원 공고 idx
 * @returns API 계약(RecruitRequest) 페이로드
 * @throws ZodError 계약 불일치 시
 */
export const toRecruitRequest = (values: ApplyFormValues, jobId: number): RecruitRequest => {
	const { graduationEnd, ...rest } = values;
	const isGed = values.educationLevel === "GED";

	return recruitRequestSchema.parse({
		...rest,
		jobId,
		schoolName: isGed ? "" : values.schoolName,
		graduationYear: isGed ? "" : graduationEnd,
		department: isGed ? "" : values.department,
	});
};
