import { cache } from "react";
import { getParsed, postParsed } from "src/shared/libs/api/zod";
import {
	type RecruitApplyResponse,
	type RecruitRequest,
	type RecruitResponse,
	recruitApplyResponseSchema,
	recruitDetailResponseSchema,
	recruitListResponseSchema,
} from "../schema/recruit.schema";

/** 채용 공고 검색 필터 인터페이스 */
export interface RecruitSearchFilters {
	keyword?: string;
	job?: string;
	education?: string;
	career?: string;
}

/**
 * @author 박상민
 *
 * @description 채용 공고 목록을 필터 조건으로 조회한다.
 * @endpoint GET /job/list
 * @auth Unnecessary
 * @permission Unnecessary
 *
 * @param options.page - 페이지 번호 (기본 1)
 * @param options.size - 페이지 크기 (기본 10)
 * @param options.title - 제목 검색어
 * @param options.department - 부서 필터
 * @param options.education - 학력 필터
 * @param options.recruitType - 채용 유형 필터
 * @param options.signal - 요청 취소를 위한 AbortSignal
 * @returns 채용 공고 배열 (빈 데이터 시 빈 배열)
 */
export const getRecruitListApi = async ({
	page = 1,
	size = 10,
	title,
	department,
	education,
	recruitType,
	signal,
}: {
	page?: number;
	size?: number;
	title?: string | null;
	department?: string | null;
	education?: string | null;
	recruitType?: string | null;
	signal?: AbortSignal;
} = {}): Promise<RecruitResponse[]> => {
	const { data } = await getParsed("/job/list", recruitListResponseSchema, {
		signal,
		params: {
			page,
			size,
			title,
			department,
			education,
			recruitType,
		},
	});

	// 서버에서 빈 데이터 시 문자열 반환할 수 있음
	if (!data || typeof data === "string") {
		return [];
	}
	return data;
};

/**
 * @author 박상민
 *
 * @description 채용 공고 상세 정보를 조회한다.
 * @endpoint GET /job?idx={index}
 * @auth Unnecessary
 * @permission Unnecessary
 *
 * @param index - 채용 공고 고유 번호
 * @param signal - 요청 취소를 위한 AbortSignal
 * @returns 채용 공고 상세 데이터
 * @throws 응답 데이터가 비어있으면 "Empty response" 에러
 */
/**
 * react cache로 감싸서 같은 request 내 generateMetadata + prefetch 중복 fetch 방지.
 */
export const getRecruitDetailApi = cache(async (index: number, signal?: AbortSignal) => {
	const { data } = await getParsed("/job", recruitDetailResponseSchema, {
		signal,
		params: { idx: index },
	});
	if (!data) throw new Error("Empty response");
	return data;
});

/**
 * @author 박상민
 *
 * @description 채용 공고에 지원서를 제출한다.
 * @endpoint POST /recruit
 * @auth Unnecessary
 * @permission Unnecessary
 *
 * @param body - 지원서 데이터
 * @param signal - 요청 취소를 위한 AbortSignal
 * @returns 지원 결과 응답
 */
export const postRecruitApplyApi = async (
	body: RecruitRequest,
	signal?: AbortSignal,
): Promise<RecruitApplyResponse> =>
	postParsed("/recruit", recruitApplyResponseSchema, body, { signal });
