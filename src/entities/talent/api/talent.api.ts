import { postParsed } from "src/shared/libs/api/zod";
import { okResponseSchema } from "src/shared/schema/response/response.schema";
import type { PostTalent } from "../schema/talent.schema";

/**
 * @author 박상민
 *
 * @description 인재풀에 신규 탤런트를 등록한다.
 * @endpoint POST /talent
 * @auth Unnecessary
 * @permission Unnecessary
 *
 * @param data - 탤런트 등록 요청 데이터 (이름, 이메일, 부서, 포트폴리오 URL)
 * @returns 성공 응답 객체
 */
export const PostTalentApi = (data: PostTalent) => postParsed("/talent", okResponseSchema, data);
