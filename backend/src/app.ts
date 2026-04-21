import express from "express";
import cors from "cors";
import helmet from "helmet";
import { authRouter } from "./routes/auth.route";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

const isProd = process.env.NODE_ENV === "production";
app.use(helmet());
app.use(
  cors(
    isProd
      ? {
        origin: process.env.CLIENT_URL ?? "http://localhost:5173",
        credentials: true,
      }
      : {
        origin: '*',
      }
  )
);
app.use("/api/auth", authRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});
app.use(errorHandler);

export default app;