import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import router from "./app/routes";

const app: Application = express();

// Global Middlewares
app.use(helmet());
app.use(cors());
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

export default app;
