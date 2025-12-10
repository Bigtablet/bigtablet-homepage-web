import { postParsed } from "src/shared/libs/api/zod";
import { okResponseSchema } from "src/shared/schema/response/response.schema";
import {
    PostTalent,
} from "../model/schema/talent.schema";

/**
 * 탤런트 생성 API
 * @param data - 생성 요청 데이터
 */
export const PostTalentApi = (data: PostTalent) =>
    postParsed("/talent", okResponseSchema, data);