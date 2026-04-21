import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../middleware/auth.middleware";
import { authService } from "../services/auth.service";
import { authRequestSchema } from "shared/schemas/auth.schema";

export async function login(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: 0, access_token: "", message: "Key file is required" });
    }

    const parsed = authRequestSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: 0,
        access_token: "",
        errors: parsed.error.flatten(),
      });
    }

    const result = await authService.login(
      file.buffer,
      parsed.data.text,
      parsed.data.hiddenText
    );

    return res.status(result.success ? 200 : 401).json(result);
  } catch (err) {
    next(err);
  }
}