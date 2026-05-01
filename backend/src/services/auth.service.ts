import jwt from "jsonwebtoken";
import { env } from "../config/env";

interface AuthResult {
  success: 0 | 1;
}

export const authService = {
  /* TODO: provide a real implementation. */
  login: async (
    signature: string,
    identifier: string
  ): Promise<AuthResult & { _token?: string }> => {
    if (!signature.trim() || !identifier.trim()) {
      return { success: 0 };
    }

    const token = jwt.sign({ identifier }, env.JWT_SECRET, { expiresIn: "8h" });

    return { success: 1, _token: token };
  },
};
