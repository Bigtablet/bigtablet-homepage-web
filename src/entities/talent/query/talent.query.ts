import { useQuery } from "@tanstack/react-query";
import {
    GetTalentDetailApi,
    GetTalentListApi,
    GetTalentSearchApi,
} from "../api/talent.api";

/**
 * 탤런트 상세 조회 쿼리
 * @param idx - 탤런트 ID
 */
export const useTalentDetailQuery = (idx: number) =>
    useQuery({
        queryKey: ["talent", "detail", idx],
        queryFn: () => GetTalentDetailApi(idx),
        enabled: !!idx,
    });

/**
 * 탤런트 목록 조회 쿼리
 * @param isActive - 활성 여부
 * @param page - 페이지 번호
 * @param size - 페이지 크기
 */
export const useTalentListQuery = (
    isActive: boolean,
    page: number,
    size: number
) =>
    useQuery({
        queryKey: ["talent", "list", { isActive, page, size }],
        queryFn: () => GetTalentListApi(isActive, page, size),
    });

/**
 * 탤런트 검색 쿼리
 * @param keyword - 검색어
 * @param page - 페이지 번호
 * @param size - 페이지 크기
 */
export const useTalentSearchQuery = (
    keyword: string,
    page: number,
    size: number
) =>
    useQuery({
        queryKey: ["talent", "search", { keyword, page, size }],
        queryFn: () => GetTalentSearchApi(keyword, page, size),
        enabled: keyword.trim().length > 0,
    });