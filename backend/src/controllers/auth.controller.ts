import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { authService } from "../services/auth.service";
import { authRequestSchema } from "shared/schemas/auth.schema";
import { env } from "../config/env";
import { prisma } from "../config/db";
import { randomBytes } from "crypto";
import { extractSignerInfo } from "../lib/extractSignerInfo";

const COOKIE_NAME = "access_token";
const CHALLENGE_TTL_MS = 10 * 60 * 1000;

const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 1000 * 60 * 60 * 8,
};

export const getChallenge: RequestHandler = async (_req, res, next) => {
  try {
    await prisma.challenge.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });

    const nonce = randomBytes(16).toString("hex");
    const expiresAt = new Date(Date.now() + CHALLENGE_TTL_MS);

    await prisma.challenge.create({ data: { nonce, expiresAt } });

    return void res.json({ nonce });
  } catch (err) {
    next(err);
  }
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
    const { signature, nonce } = parsed.data;
    const { drfoCode, fullName } = extractSignerInfo(parsed.data.signature);

    const challenge = await prisma.challenge.findUnique({ where: { nonce } });

    if (!challenge) {
      return void res.status(400).json({ success: 0, message: "Invalid challenge" });
    }
    if (challenge.used) {
      return void res.status(400).json({ success: 0, message: "Challenge already used" });
    }
    if (challenge.expiresAt < new Date()) {
      return void res.status(400).json({ success: 0, message: "Challenge expired" });
    }

    await prisma.challenge.update({
      where: { nonce },
      data: { used: true },
    });

    const result = await authService.login(signature, nonce, fullName, drfoCode);

    if (result.success === 1 && result._token) {
      res.cookie(COOKIE_NAME, result._token, cookieOptions);
    }

    return void res.status(result.success ? 200 : 401).json({
      success: result.success,
      fullName,
      drfoCode,
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
