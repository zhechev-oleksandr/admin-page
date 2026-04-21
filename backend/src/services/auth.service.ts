import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { processCredentials } from "../lib/processCredentials";

interface AuthResult {
  success: 0 | 1;
  access_token: string;
}

export const authService = {
  login: async (fileBuffer: Buffer, text: string, hiddenText: string): Promise<AuthResult> => {
    const base64Payload = processCredentials(fileBuffer, text, hiddenText);

    if (!base64Payload.trim()) {
      return { success: 0, access_token: "" };
    }

    const token = jwt.sign({ payload: base64Payload }, env.JWT_SECRET, { expiresIn: "8h" });

    return { success: 1, access_token: token };
  },
};
