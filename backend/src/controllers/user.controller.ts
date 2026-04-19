import type { Request, Response, NextFunction } from "express";
import { userService } from "../services/user.service";
import { createUserSchema } from "shared/schemas/user.schema";

export async function getUsers(_req: Request, res: Response, next: NextFunction) {
  try {
    const users = await userService.findAll();
    res.json(users);
  } catch (err) {
    next(err);
  }
}

export async function getUserById(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await userService.findById(<string>req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = createUserSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });
    const user = await userService.create(parsed.data);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}