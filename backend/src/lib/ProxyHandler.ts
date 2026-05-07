import http from "http";
import https from "https";

const PARAM_ADDRESS = "address";
const PARAM_CONTENT_TYPE = "contentType";
const RESPONSE_CONTENT_TYPE = "X-user/base64-data; charset=utf-8";

const URL_MAX_LENGTH = 255;
const URL_REGEX = /^(https?:\/\/)?([a-zA-Z0-9.\-_]+)(:[0-9]{1,5})?(\/.*)?$/;

const ALLOWED_CONTENT_TYPES = new Set([
  "",
  "application/timestamp-query",
  "application/ocsp-request",
  "application/json",
]);

const KNOWN_HOSTS = new Set<string>([
  "czo.gov.ua",
  "zc.bank.gov.ua",
  "acskidd.gov.ua",
  "ca.informjust.ua",
  "csk.uz.gov.ua",
  "masterkey.ua",
  "csk.uss.gov.ua",
  "csk.ukrsibbank.com",
  "acsk.privatbank.ua",
  "ca.mil.gov.ua",
  "ca.mvs.gov.ua",
  "canbu.bank.gov.ua",
  "uakey.com.ua",
  "altersign.com.ua",
  "ca.oschadbank.ua",
  "ca.gp.gov.ua",
  "acsk.oree.com.ua",
  "ca.depositsign.com",
  "pki.pumb.ua",
  "cesaris.itsway.kiev.ua",
  "ca.credit-agricole.ua",
  "ca.e-life.com.ua",
  "ocsp.e-life.com.ua",
  "tsp.e-life.com.ua",
  "cmp.e-life.com.ua",
  "ca.bankalliance.ua",
  "ca.vchasno.ua",
  "ca.pravex.com.ua",
  "qca.ukrgasbank.com",
  "ca.tax.gov.ua",
  "ca.diia.gov.ua",
  "ca.sensebank.com.ua",
  "ca.tascombank.ua",
  "amokey.com.ua",
  "ca.monobank.ua",
  "ca.ngu.gov.ua",
  "root-test.czo.gov.ua",
  "ca-test.czo.gov.ua",
  "ca.iit.com.ua",
]);

const UNREACHABLE_HOSTS = [
  "ocsp.masterkey.ua",
  "tsp.masterkey.ua",
  "acsk.dpsu.gov.ua",
  "acsk.er.gov.ua",
  "ca.altersign.com.ua",
  "ocsp.altersign.com.ua",
  "acsk.treasury.gov.ua",
  "ocsp.treasury.gov.ua",
  "ca.treasury.gov.ua",
  "ca.tascombank.com.ua",
  "ca.szru.gov.ua",
  "va1-knedp.ssu.gov.ua",
];

const httpsAgent = new https.Agent({
  keepAlive: true,
  maxSockets: 16,
  timeout: 5_000,
});

const httpAgent = new http.Agent({
  keepAlive: true,
  maxSockets: 16,
  timeout: 5_000,
});

function isKnownHost(rawUrl: string): boolean {
  if (rawUrl.length > URL_MAX_LENGTH || !URL_REGEX.test(rawUrl)) {
    return false;
  }

  try {
    const { protocol, hostname } = new URL(rawUrl);
    if (protocol !== "http:" && protocol !== "https:") return false;
    return KNOWN_HOSTS.has(hostname);
  } catch {
    return false;
  }
}

const JSON_PATH_PREFIXES = [
  "/cloud/api/back/",
  "/ss/",
  "/api/EDG/Sign",
  "/smartid/iit/",
  "/hogsmeade/striga/v1",
  "/iit-signer/api/v1",
];

const OCSP_PATHS = new Set([
  "/services/ocsp",
  "/services/ocsp/",
  "/public/ocsp",
  "/ocsp",
  "/ocsp-rsa",
  "/ocsp-ecdsa",
  "/OCSPsrv/ocsp",
  "/queries/ocsp/",
]);

const TSP_PATHS = new Set([
  "/services/tsp",
  "/services/tsp/",
  "/services/tsp/dstu",
  "/services/tsp/dstu/",
  "/services/tsp/rsa",
  "/services/tsp/rsa/",
  "/services/tsp/ecdsa",
  "/services/tsp/ecdsa/",
  "/public/tsa",
  "/public/tsp",
  "/tsp",
  "/tsp-rsa",
  "/tsp-ecdsa",
  "/TspHTTPServer/tsp",
]);

function getContentType(rawUrl: string): string {
  try {
    const { pathname } = new URL(rawUrl);

    if (JSON_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return "application/json";

    if (OCSP_PATHS.has(pathname)) return "application/ocsp-request";
    if (TSP_PATHS.has(pathname)) return "application/timestamp-query";

    return "";
  } catch {
    return "";
  }
}

class HttpError extends Error {
  constructor(public readonly status: number) {
    super(`HTTP ${status}`);
  }
}

async function collectBody(req: http.IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

async function proxyRequest(
  method: string,
  address: string,
  contentType: string,
  body: Buffer | null
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const { protocol, hostname, port, pathname, search } = new URL(address);
    const isHttps = protocol === "https:";
    const connector = isHttps ? https : http;
    const agent = isHttps ? httpsAgent : httpAgent;

    const options: http.RequestOptions = {
      agent,
      hostname,
      port: port || undefined,
      path: pathname + (search ?? ""),
      method,
      ...(method === "POST" && body
        ? {
            headers: {
              "Content-Type": contentType,
              "Content-Length": body.length,
            },
          }
        : {}),
    };

    const req = connector.request(options, (res) => {
      const chunks: Buffer[] = [];
      res.on("data", (chunk: Buffer) => chunks.push(chunk));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    });

    req.setTimeout(5_000, () => {
      req.destroy();
      reject(new HttpError(504));
    });

    req.on("error", (err) => {
      console.error("[ProxyHandler] upstream error:", err);
      reject(new HttpError(502));
    });

    if (method === "POST" && body) req.write(body);
    req.end();
  });
}

export async function handleRequest(
  request: http.IncomingMessage,
  response: http.ServerResponse
): Promise<void> {
  try {
    const method = request.method?.toUpperCase() ?? "";

    if (method !== "GET" && method !== "POST") {
      response.writeHead(405);
      response.end();
      return;
    }

    const requestUrl = new URL(request.url ?? "", "http://localhost");
    let address = requestUrl.searchParams.get(PARAM_ADDRESS) ?? "";

    if (!address) throw new HttpError(400);

    if (!address.includes("://")) address = "https://" + address;

    if (!isKnownHost(address)) throw new HttpError(403);

    const rawContentType = requestUrl.searchParams.get(PARAM_CONTENT_TYPE);
    const contentType = rawContentType !== null ? rawContentType : getContentType(address);

    if (!ALLOWED_CONTENT_TYPES.has(contentType)) throw new HttpError(400);

    let body: Buffer | null = null;
    if (method === "POST") {
      const rawBody = await collectBody(request);
      body = Buffer.from(rawBody.toString(), "base64");
      if (!body.length) throw new HttpError(400);
    }

    const responseBuffer = await proxyRequest(method, address, contentType, body);

    response.writeHead(200, { "Content-Type": RESPONSE_CONTENT_TYPE });
    response.end(responseBuffer.toString("base64"));
  } catch (err) {
    const status = err instanceof HttpError ? err.status : 500;
    if (status === 500) console.error("[ProxyHandler] internal error:", err);
    response.writeHead(status);
    response.end();
  }
}
