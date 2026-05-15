import express from "express";
import cors from "cors";
import helmet from "helmet";
import { authRouter, proxyRouter, notificationsRouter } from "./routes";
import { errorHandler } from "./middleware/error.middleware";
import { env } from "./config/env";
import cookieParser from "cookie-parser";
import morgan from "morgan";

const app = express();

const isProd = env.NODE_ENV === "production";
app.use(helmet());
app.use(
  cors(
    isProd
      ? {
          origin: env.CLIENT_URL,
          credentials: true,
        }
      : {
          origin: "*",
        }
  )
);
app.use(morgan("dev"));
app.use(express.json({ limit: "50kb" }));
app.use(cookieParser(env.COOKIE_SECRET));
app.use("/api/proxy", proxyRouter);
app.use("/api/auth", authRouter);
app.use("/api/notifications", notificationsRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});
app.use(errorHandler);

export default app;
