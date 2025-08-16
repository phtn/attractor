import z from "zod";

export const ChatMetadataSchema = z.object({
  duration: z.number().optional(),
  model: z.string().optional(),
  totalTokens: z.number().optional(),
});

export type ChatMetadata = z.infer<typeof ChatMetadataSchema>;
