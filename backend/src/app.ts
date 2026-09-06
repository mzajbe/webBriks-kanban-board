import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import router from "./app/routes";
import { env } from "./app/config/env";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";

const app: Application = express();

// Trust proxy for secure cookies over reverse proxies (Vercel, Render, Railway)
app.set("trust proxy", 1);

// Global Middlewares
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      const allowedOrigins = [
        env.FRONTEND_URL,
        env.FRONTEND_URL.replace(/\/$/, ""),
        "http://localhost:3000",
      ];
      if (allowedOrigins.includes(origin) || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
        return callback(null, true);
      }
      return callback(null, true); // Allow Vercel preview deployments
    },
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// Application Routes
app.use("/api", router);

// Root Route
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Mini Kanban API",
  });
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;
