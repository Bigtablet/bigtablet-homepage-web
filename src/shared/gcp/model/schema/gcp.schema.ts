import { z } from "zod";
import { baseResponseSchema } from "src/shared/schema/response/response.schema";

export const gcpUploadResponseSchema = baseResponseSchema(z.string());
export type GcpUploadResponse = z.infer<typeof gcpUploadResponseSchema>;