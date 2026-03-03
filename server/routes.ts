import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.employees.list.path, async (_req, res) => {
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
