import jwt from "jsonwebtoken";
import { env } from "../config/env";

export const authService = {
  login: async (signature: string, identifier: string, fullName: string, drfoCode: string) => {
    if (!signature.trim() || !identifier.trim()) {
      return { success: 0 as const, _token: null };
    }

    const token = jwt.sign({ identifier, fullName, drfoCode }, env.JWT_SECRET, { expiresIn: "8h" });

    return { success: 1 as const, _token: token };
  },
};
