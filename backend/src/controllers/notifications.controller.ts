import type { RequestHandler } from "express";
import { firebaseMessaging } from "../config/firebase";
import { notificationRequestSchema } from "shared/schemas/notification.schema";
import { env } from "../config/env";

export const sendNotification: RequestHandler = async (req, res, next) => {
  try {
    const parsed = notificationRequestSchema.safeParse(req.body);

    if (!parsed.success) {
      return void res.status(400).json({
        success: false,
        errors: parsed.error.flatten(),
      });
    }

    const { title, body } = parsed.data;

    await firebaseMessaging.send({
      topic: env.FIREBASE_TOPIC,
      notification: { title, body },
      android: {
        priority: "high",
        notification: { sound: "default" },
      },
      apns: {
        payload: {
          aps: { sound: "default" },
        },
      },
    });

    return void res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
