import { z } from "zod";
import { recruitResponseSchema } from "../schema/recruit.schema";

export type RecruitDTO = z.infer<typeof recruitResponseSchema>;

/** UI에서 쓰는 요약 도메인 */
export interface RecruitSummary {
    idx: number;
    title: string;
    dday: string;
    tags: string[];
}