import cors from "cors";
import "dotenv/config";
import express from "express";
import { prisma } from "./db/db.js";
import authRouter from "./routes/auth.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Liveness: is the process up?
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Readiness: can we reach the database?
app.get("/health/db", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", db: "up" });
  } catch {
    res.status(503).json({ status: "error", db: "down" });
  }
});

app.use("/v1", authRouter);

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  },
);

const port = Number(process.env.PORT ?? 8080);
const server = app.listen(port, () => console.log(`API on :${port}`));

// Close cleanly on Ctrl+C or deploy restarts
const shutdown = async () => {
  server.close();
  await prisma.$disconnect();
  process.exit(0);
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
