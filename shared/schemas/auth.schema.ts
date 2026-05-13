import { z } from "zod";

export const authRequestSchema = z.object({
  signature: z.string().min(1, "Signature is required"),
  nonce: z.string().length(32, "Identifier must be 32 characters"),
});

export const authResponseSchema = z.object({
  success: z.union([z.literal(0), z.literal(1)]),
  fullName: z.string(),
  drfoCode: z.string(),
});

export type AuthRequest = z.infer<typeof authRequestSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;