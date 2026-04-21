import { z } from "zod";

export const authRequestSchema = z.object({
  text: z.string().min(1, "Identifier is required"),
  hiddenText: z.string().min(1, "Secret key is required"),
});

export const authResponseSchema = z.object({
  success: z.union([z.literal(0), z.literal(1)]),
  access_token: z.string(),
});

export type AuthRequest = z.infer<typeof authRequestSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;