import { prisma } from "../config/db";
import type { CreateUserInput } from "shared/schemas/user.schema";

export const userService = {
  findAll: () => prisma.user.findMany(),

  findById: (id: string) => prisma.user.findUnique({ where: { id } }),

  create: (data: CreateUserInput) => prisma.user.create({ data }),
};