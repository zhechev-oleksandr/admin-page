import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(
    process.cwd(),
    process.env.NODE_ENV === "production" ? ".env.production" : ".env"
  ),
});

export const env = {
  PORT: (process.env.PORT ?? 3000) as number,
  NODE_ENV: process.env.NODE_ENV ?? "development",
  DATABASE_URL: process.env.DATABASE_URL ?? "",
  JWT_SECRET: process.env.JWT_SECRET ?? "changeme",
  COOKIE_SECRET: process.env.COOKIE_SECRET ?? "cookie-secret-changeme",
  CLIENT_URL: process.env.CLIENT_URL ?? "http://localhost:5173",
};
