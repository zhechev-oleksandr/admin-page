import { Router, type Request, type Response } from "express";
import { handleRequest } from "../lib/ProxyHandler";

export const proxyRouter = Router();

proxyRouter.all("/", (req: Request, res: Response) => {
  handleRequest(req, res);
});
