import { z } from "zod";

export const authRequestSchema = z.object({
  signature: z.string().min(1, "Signature is required"),
  identifier: z.string().length(32, "Identifier must be 32 characters"),
  fullName:   z.string().min(1,  "Full name is required"),
  drfoCode:   z.string().length(10, "DRFO code must be 10 digits"),
});

export const authResponseSchema = z.object({
  success: z.union([z.literal(0), z.literal(1)]),
});

export type AuthRequest = z.infer<typeof authRequestSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;