import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./env.js";
import { logger } from "./lib/logger.js";
import { apiRateLimit, formRateLimit } from "./middleware/rateLimit.js";
import { nowPlayingRouter } from "./routes/nowPlaying.js";
import { formsRouter } from "./routes/forms.js";

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        mediaSrc: ["'self'", "https:"],
        connectSrc: ["'self'", "https:"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  })
);

app.use(
  cors({
    origin: env.allowedOrigins,
    methods: ["GET", "POST"],
    credentials: false,
  })
);

app.use(express.json({ limit: "50kb" }));

// Per-request timeout so a hung upstream call can never hold a connection
// open indefinitely.
app.use((_req, res, next) => {
  res.setTimeout(10_000, () => {
    res.status(504).json({ message: "The request took too long. Please try again." });
  });
  next();
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/nowplaying", apiRateLimit, nowPlayingRouter);
app.use("/api", formRateLimit, formsRouter);

// Deliberately no routes exist for AzuraCast admin actions (start/stop/
// restart station, media management, user management). Those endpoints
// require the API key and must never be reachable by public visitors.

app.use((_req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error("Unhandled server error", error);
  res.status(500).json({ message: "Something went wrong. Please try again." });
});

app.listen(env.port, () => {
  logger.info(`Redemption Radio API listening on port ${env.port}`, { env: env.nodeEnv });
});
