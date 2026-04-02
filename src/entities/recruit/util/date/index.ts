import {
	departmentLabel,
	educationLabel,
	locationLabel,
	recruitTypeLabel,
} from "src/entities/recruit/constants/recruit.constants";
import type {
	RecruitCard,
	RecruitResponse,
} from "src/entities/recruit/schema/recruit.schema";

/**
 * @description 문자열을 Date 객체로 변환한다.
 *
 * @param value - 날짜 문자열 또는 null
 * @returns Date 객체 또는 undefined
 */
const toDate = (value?: string | null) => (value ? new Date(value) : undefined);

/**
 * @description D-Day 텍스트를 계산하여 반환한다.
 *
 * @param endDate - 마감일 문자열 (ISO 8601) 또는 null
 * @returns "D-3", "D-DAY", "마감", "상시" 등의 문자열
 *
 * @example
 * getDdayText("2026-04-05") // "D-3"
 * getDdayText(null)          // "상시"
 */
const getDdayText = (endDate?: string | null): string => {
	const end = toDate(endDate);
	if (!end) return "상시";
	const today = new Date();
	const diff = end.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0);
	const days = Math.ceil(diff / 86400000);
	if (days < 0) return "마감";
	if (days === 0) return "D-DAY";
	return `D-${days}`;
};

/**
 * @description 채용 공고에서 부서, 학력, 유형, 지역 태그를 추출한다.
 *
 * @param recruitResponse - 채용 공고 응답 데이터
 * @returns 라벨 문자열 배열
 */
const extractTags = (recruitResponse: RecruitResponse): string[] => {
	const tags: string[] = [];
	if (recruitResponse.department)
		tags.push(departmentLabel(recruitResponse.department));
	if (recruitResponse.education)
		tags.push(educationLabel(recruitResponse.education));
	if (recruitResponse.recruitType)
		tags.push(recruitTypeLabel(recruitResponse.recruitType));
	if (recruitResponse.location)
		tags.push(locationLabel(recruitResponse.location));
	return tags;
};

/**
 * @description 채용 응답 데이터를 카드 UI용 데이터로 변환한다.
 *
 * @param recruitResponse - 채용 공고 응답 데이터
 * @returns D-Day와 태그가 추가된 카드 데이터
 *
 * @example
 * toRecruitCard(recruitResponse) // { ...response, dday: "D-3", tags: ["IT", "서울"] }
 */
export const toRecruitCard = (
	recruitResponse: RecruitResponse,
): RecruitCard => ({
	...recruitResponse,
	dday: getDdayText(recruitResponse.endDate ?? null),
	tags: extractTags(recruitResponse),
});

/**
 * @description 채용 응답 배열을 카드 배열로 일괄 변환한다.
 *
 * @param recruitResponses - 채용 공고 응답 배열
 * @returns 카드 데이터 배열
 *
 * @see {@link toRecruitCard}
 */
export const toRecruitCards = (recruitResponses: RecruitResponse[]) =>
	recruitResponses.map(toRecruitCard);
