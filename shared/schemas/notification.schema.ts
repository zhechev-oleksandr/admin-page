import { z } from 'zod';

export const notificationRequestSchema = z.object({
  title: z.string().min(1, "Title is required"),
  body:  z.string().min(1, "Body is required"),
});

export const notificationResponseSchema = z.object({
  success: z.union([z.literal(0), z.literal(1)]),
});