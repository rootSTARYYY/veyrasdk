const express = require("express");
const { Veyra } = require("@veyradev/sdk");
require("dotenv").config();

const app = express();
const veyra = new Veyra({ token: process.env.VEYRA_API_KEY });
const PROJECT_ID = process.env.VEYRA_PROJECT_ID;

app.use(express.json());

app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    veyra.events.create({
      level: res.statusCode >= 400 ? "warn" : "debug",
      source: "API-Router",
      message: `${req.method} ${req.originalUrl} - ${res.statusCode}`,
      metadata: { durationMs: Date.now() - start }
    });
  });
  next();
});

app.get("/api/users", (req, res) => {
  res.json({ users: [{ id: 1, name: "Star" }] });
});

app.use(async (err, req, res, next) => {
  await veyra.events.create({
    level: "error",
    source: "Express-Error-Handler",
    message: err.message,
    metadata: { route: req.originalUrl }
  });
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  setInterval(() => veyra.heartbeats.send(PROJECT_ID), 60 * 1000);
});
