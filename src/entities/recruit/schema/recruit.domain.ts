import { z } from "zod";
import { recruitResponseSchema } from "src/entities/recruit/schema/recruit.schema";

export type RecruitDTO = z.infer<typeof recruitResponseSchema>;

export interface RecruitSummary {
    idx: number;
    title: string;
    dday: string;
    tags: string[];
}