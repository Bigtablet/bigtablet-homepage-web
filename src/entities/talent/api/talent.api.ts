import { getParsed, postParsed } from "src/shared/libs/api/zod";
import { okResponseSchema } from "src/shared/types/response";
import {
    PostTalent,
    PostTalentOffer,
    getTalentDetailResponseSchema,
    getTalentListResponseSchema,
    getTalentSearchSchema,
} from "../model/schema/talent.schema";

/**
 * 탤런트 상세 조회 API
 * @param idx - 탤런트 ID
 */
export const GetTalentDetailApi = (idx: number) =>
    getParsed("/talent", getTalentDetailResponseSchema, {
        params: { idx },
    });

/**
 * 탤런트 목록 조회 API
 * @param isActive - 활성 여부
 * @param page - 페이지 번호
 * @param size - 페이지 크기
 */
export const GetTalentListApi = (isActive: boolean, page: number, size: number) =>
    getParsed("/talent/list", getTalentListResponseSchema, {
        params: { isActive, page, size },
    });

/**
 * 탤런트 검색 API
 * @param keyword - 검색어
 * @param page - 페이지 번호
 * @param size - 페이지 크기
 */
export const GetTalentSearchApi = (keyword: string, page: number, size: number) =>
    getParsed("/talent/search", getTalentSearchSchema, {
        params: { keyword, page, size },
    });

/**
 * 탤런트 생성 API
 * @param data - 생성 요청 데이터
 */
export const PostTalentApi = (data: PostTalent) =>
    postParsed("/talent", okResponseSchema, data);

/**
 * 탤런트 제안 생성 API
 * @param data - 제안 요청 데이터
 */
export const PostTalentOfferApi = (data: PostTalentOffer) =>
    postParsed("/talent/offer", okResponseSchema, data);