import { Router, Request, Response } from "express";
import { authRoutes } from "../modules/auth/auth.route";
import { boardRoutes } from "../modules/board/board.route";
import { boardColumnRouter, columnRouter } from "../modules/column/column.route";
import { boardTaskRouter, taskRouter } from "../modules/task/task.route";

const router = Router();

// Health check route
router.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Mini Kanban API is running",
  });
});

// Authentication routes
router.use("/auth", authRoutes);

// Board routes
router.use("/boards", boardRoutes);

// Board-scoped column routes
router.use("/boards/:boardId/columns", boardColumnRouter);

// Standalone column routes
router.use("/columns", columnRouter);

// Board-scoped task routes
router.use("/boards/:boardId/tasks", boardTaskRouter);

// Standalone task routes
router.use("/tasks", taskRouter);

export default router;
