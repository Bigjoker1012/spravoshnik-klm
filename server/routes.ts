import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.employees.list.path, async (req, res) => {
    try {
      const employees = await storage.getEmployees();
      res.status(200).json(employees);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
      res.status(500).json({ message: "Failed to fetch employees" });
    }
  });

  return httpServer;
}
