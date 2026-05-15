import { Router } from "express";
import { sendNotification } from "../controllers";
import { requireAuth } from "../middleware/auth.middleware";

export const notificationsRouter = Router();

notificationsRouter.post("/send", requireAuth, sendNotification);
