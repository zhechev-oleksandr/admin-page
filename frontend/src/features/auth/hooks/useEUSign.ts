import { useState, useEffect, useRef } from "react";
import type { EndUser as EndUserType } from "euscp";
import { EndUserSettings } from "euscp";
import { readFileAsUint8Array, base64ToUint8Array } from "@shared/utils/binary";

type Status = "idle" | "loading" | "ready" | "error";

export interface SignResult {
  signature: string;
  fullName: string;
  drfoCode: string;
}

export const useEUSign = () => {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const euRef = useRef<EndUserType | null>(null);

  useEffect(() => {
    async function init() {
      setStatus("loading");
      try {
        const { EndUser } = await import("euscp");
        const eu = new EndUser();

        const settings = new EndUserSettings();
        settings.language = "uk";
        settings.encoding = "UTF-8";
        const apiBase = (import.meta.env.VITE_API_URL as string | undefined) ?? "/api";
        settings.httpProxyServiceURL = `${apiBase}/proxy/`;
        settings.directAccess = false;
        settings.CAs = "/iit/CAs.json";
        settings.CACertificates = "/iit/CACertificates.p7b";

        await eu.Initialize(settings);
        euRef.current = eu;
        setStatus("ready");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Не вдалося ініціалізувати бібліотеку підпису");
        setStatus("error");
      }
    }

    init();
  }, []);

  async function signData(
    keyFile: File,
    password: string,
    identifier: string
  ): Promise<SignResult> {
    const eu = euRef.current;
    if (!eu) throw new Error("Бібліотеку не ініціалізовано");

    const keyBytes = await readFileAsUint8Array(keyFile);

    try {
      await eu.ReadPrivateKeyBinary(keyBytes, password);
      const signature = (await eu.SignData(identifier, true)) as string;
      const signatureBytes = base64ToUint8Array(signature);

      const signInfoRaw = await eu.VerifyData(identifier, signatureBytes);
      const signInfo = Array.isArray(signInfoRaw) ? signInfoRaw[0] : signInfoRaw;

      const fullName = signInfo?.ownerInfo?.subjCN || signInfo?.ownerInfo?.subjFullName || "";

      const drfoCode = (signInfo?.ownerInfo?.subjDRFOCode ?? "").replace(/\D/g, "").slice(0, 10);

      if (!fullName) throw new Error("Не вдалося отримати ПІБ з підпису");
      if (!drfoCode) throw new Error("Не вдалося отримати РНОКПП з підпису");

      return { signature, fullName, drfoCode };
    } finally {
      await eu.ResetPrivateKey();
    }
  }

  return { status, error, signData };
};
