import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import router from "./app/routes";
import { env } from "./app/config/env";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";

const app: Application = express();

// Global Middlewares
app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_URL,
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
