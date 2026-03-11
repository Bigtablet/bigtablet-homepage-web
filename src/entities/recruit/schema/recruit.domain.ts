import type { recruitResponseSchema } from "src/entities/recruit/schema/recruit.schema";
import type { z } from "zod";

export type RecruitDTO = z.infer<typeof recruitResponseSchema>;

export interface RecruitSummary {
	idx: number;
	title: string;
	dday: string;
	tags: string[];
}
