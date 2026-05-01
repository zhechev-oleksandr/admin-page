import { Router } from "express";
import { login, logout, me } from "../controllers/auth.controller";
import { upload } from "../middleware/upload.middleware";
import { requireAuth } from "../middleware/auth.middleware";

export const authRouter = Router();

authRouter.post("/login", upload.single("file"), login);
authRouter.post("/logout", logout);
authRouter.get("/me", requireAuth, me);
