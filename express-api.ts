import express, { Request, Response, NextFunction } from "express";
import { Veyra } from "@veyradev/sdk";
import "dotenv/config";

const app = express();
const veyra = new Veyra({ token: process.env.VEYRA_API_KEY });
const PROJECT_ID = process.env.VEYRA_PROJECT_ID!;

app.use(express.json());

// 1. Global Request Logging Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on("finish", () => {
    veyra.events.create({
      level: res.statusCode >= 400 ? "warn" : "debug",
      source: "API-Router",
      message: `${req.method} ${req.originalUrl} - ${res.statusCode}`,
      metadata: { durationMs: Date.now() - start, ip: req.ip }
    });
  });
  next();
});

// 2. Standard Route
app.get("/api/users", (req, res) => {
  res.json({ users: [{ id: 1, name: "Star" }] });
});

// 3. Error Route (Simulates a crash)
app.get("/api/crash", (req, res) => {
  throw new Error("Database connection timeout");
});

// 4. Global Error Handler
app.use(async (err: Error, req: Request, res: Response, next: NextFunction) => {
  await veyra.events.create({
    level: "error",
    source: "Express-Error-Handler",
    message: err.message,
    metadata: { route: req.originalUrl, stack: err.stack }
  });
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // 5. Send Uptime Heartbeats
  setInterval(() => veyra.heartbeats.send(PROJECT_ID), 60 * 1000);
});
