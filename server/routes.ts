import type { Express, Request, Response, NextFunction } from "express";
import { type Server } from "http";
import path from "path";
import { storage } from "./storage";
import { api } from "@shared/routes";

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.session?.authenticated) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/download-project", (_req, res) => {
    const filePath = path.resolve("client/public/spravochnik-klm.tar.gz");
    res.download(filePath, "spravochnik-klm.tar.gz");
  });

  app.post("/api/login", (req: Request, res: Response) => {
    const { password } = req.body;
    const APP_PASSWORD = process.env.APP_PASSWORD || "klm2025";
    if (password === APP_PASSWORD) {
      req.session.authenticated = true;
      res.json({ ok: true });
    } else {
      res.status(401).json({ message: "Неверный пароль" });
    }
  });

  app.post("/api/logout", (req: Request, res: Response) => {
    req.session.destroy(() => {
      res.json({ ok: true });
    });
  });

  app.get("/api/auth/check", (req: Request, res: Response) => {
    res.json({ authenticated: !!req.session?.authenticated });
  });

  app.get(api.employees.list.path, requireAuth, async (_req, res) => {
    try {
      const data = await storage.getData();
      res.status(200).json(data);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      res.status(500).json({ message: "Failed to fetch data" });
    }
  });

  return httpServer;
}
