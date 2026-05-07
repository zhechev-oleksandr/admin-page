import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { authService } from "../services/auth.service";
import { authRequestSchema } from "shared/schemas/auth.schema";
import { env } from "../config/env";

const COOKIE_NAME = "access_token";

const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 1000 * 60 * 60 * 8,
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const parsed = authRequestSchema.safeParse(req.body);

    if (!parsed.success) {
      return void res.status(400).json({
        success: 0,
        errors: parsed.error.flatten(),
      });
    }

    const result = await authService.login(
      parsed.data.signature,
      parsed.data.identifier,
      parsed.data.fullName,
      parsed.data.drfoCode
    );

    if (result.success === 1 && result._token) {
      res.cookie(COOKIE_NAME, result._token, cookieOptions);
    }

    return void res.status(result.success ? 200 : 401).json({
      success: result.success,
    });
  } catch (err) {
    next(err);
  }
};

export const logout: RequestHandler = (_req, res) => {
  res.clearCookie(COOKIE_NAME, cookieOptions);
  return void res.json({ success: 1 });
};

export const me: RequestHandler = (req, res) => {
  const token = req.cookies?.access_token;

  if (!token) {
    return void res.status(200).json({ authenticated: false, name: "", drfoCode: "" });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload;
    return void res.status(200).json({
      authenticated: true,
      name: decoded.fullName ?? "",
      drfoCode: decoded.drfoCode ?? "",
    });
  } catch {
    return void res.status(200).json({ authenticated: false, name: "", drfoCode: "" });
  }
};
