import jwt from "jsonwebtoken";
import { env } from "../config/env";

export const authService = {
  login: async (signature: string, nonce: string, fullName: string, drfoCode: string) => {
    if (!signature.trim() || !nonce.trim()) {
      return { success: 0 as const, _token: null };
    }

    const token = jwt.sign({ nonce, fullName, drfoCode }, env.JWT_SECRET, { expiresIn: "8h" });

    return { success: 1 as const, _token: token };
  },
};
