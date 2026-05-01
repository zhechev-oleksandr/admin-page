import { useState, useEffect, useRef } from "react";
import type { EndUser as EndUserType } from "euscp";
import { EndUserSettings } from "euscp";

type Status = "idle" | "loading" | "ready" | "error";

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
        settings.httpProxyServiceURL = "/api/proxy/";
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

  async function signData(keyFile: File, password: string, identifier: string): Promise<string> {
    const eu = euRef.current;
    if (!eu) throw new Error("Бібліотеку не ініціалізовано");

    const buffer = await keyFile.arrayBuffer();
    const keyBytes = new Uint8Array(buffer);

    try {
      await eu.ReadPrivateKeyBinary(keyBytes, password);
      const signature = (await eu.SignData(identifier, true)) as string;
      return signature;
    } finally {
      await eu.ResetPrivateKey();
    }
  }

  return { status, error, signData };
};
