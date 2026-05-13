import { Router } from "express";
import { login, logout, me, getChallenge } from "../controllers/auth.controller";
import { upload } from "../middleware/upload.middleware";

export const authRouter = Router();

authRouter.get("/challenge", getChallenge);
authRouter.post("/login", upload.single("file"), login);
authRouter.post("/logout", logout);
authRouter.get("/me", me);
