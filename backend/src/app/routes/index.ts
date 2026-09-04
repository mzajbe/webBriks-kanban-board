import { Router, Request, Response } from "express";
import { authRoutes } from "../modules/auth/auth.route";

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

// Future module routes:
// router.use("/users", userRoutes);
// router.use("/boards", boardRoutes);
// router.use("/columns", columnRoutes);
// router.use("/tasks", taskRoutes);

export default router;
