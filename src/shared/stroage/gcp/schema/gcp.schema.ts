import { z } from "zod";
import { baseResponseSchema } from "src/shared/types/response";

export const gcpUploadResponseSchema = baseResponseSchema(z.string());
export type GcpUploadResponse = z.infer<typeof gcpUploadResponseSchema>;