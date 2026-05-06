import { cache } from "react";
import {
	type BlogDetailResponse,
	type BlogOkResponse,
	blogDetailResponseSchema,
	blogListResponseSchema,
	blogOkResponseSchema,
} from "src/entities/blog/schema/blog.schema";
import { getParsed, patchParsed } from "src/shared/libs/api/zod";
import type { ListSchema } from "src/shared/schema/list/list.schema";

/**
 * @author 박상민
 *
 * @description 블로그 목록을 페이지네이션으로 조회한다.
 * @endpoint GET /blog/list
 * @auth Unnecessary
 * @permission Unnecessary
 *
 * @param {ListSchema} options - 페이지 번호와 페이지 크기
 * @param signal - 요청 취소를 위한 AbortSignal
 * @returns 블로그 아이템 배열 (빈 데이터 시 빈 배열)
 */
export const getBlogApi = async ({ page, size }: ListSchema, signal?: AbortSignal) => {
	return getParsed("/blog/list", blogListResponseSchema, {
		params: { page, size },
		signal,
	}).then((response) => response.data ?? []);
};

/**
 * @author 박상민
 *
 * @description 블로그 상세 정보를 조회한다.
 * @endpoint GET /blog?idx={index}
 * @auth Unnecessary
 * @permission Unnecessary
 *
 * @param index - 블로그 게시글 고유 번호
 * @param signal - 요청 취소를 위한 AbortSignal
 * @returns 블로그 상세 데이터
 * @throws 응답 데이터가 비어있으면 "Empty response" 에러
 */
/**
 * react cache로 감싸서 같은 request 내 generateMetadata + prefetch 중복 fetch 방지.
 * cache 키는 인자 전체이므로 signal을 받지 않는다 — 호출부도 일관되게 signal 없이.
 */
export const getBlogDetailApi = cache(async (index: number) =>
	getParsed("/blog", blogDetailResponseSchema, {
		params: { idx: index },
	}).then((response: BlogDetailResponse) => {
		if (!response.data) throw new Error("Empty response");
		return response.data;
	}),
);

/**
 * @author 박상민
 *
 * @description 블로그 조회수를 1 증가시킨다.
 * @endpoint PATCH /blog?idx={index}
 * @auth Unnecessary
 * @permission Unnecessary
 *
 * @param index - 블로그 게시글 고유 번호
 * @returns 성공 응답 객체
 */
export const patchBlogViewApi = async (index: number) =>
	patchParsed("/blog", blogOkResponseSchema, null, {
		params: { idx: index },
	}).then((response: BlogOkResponse) => response);
