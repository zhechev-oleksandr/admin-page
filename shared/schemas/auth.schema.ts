import { z } from "zod";

export const authRequestSchema = z.object({
  data: z.string().min(1, "Payload cannot be empty"),
});

export const authResponseSchema = z.object({
  success: z.union([z.literal(0), z.literal(1)]),
  access_token: z.string(),
});

export type AuthRequest = z.infer<typeof authRequestSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;