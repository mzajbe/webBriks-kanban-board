import { Router, Request, Response } from "express";

const router = Router();

// Health check route
router.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Mini Kanban API is running",
  });
});

// Future module routes:
// router.use("/auth", authRoutes);
// router.use("/users", userRoutes);
// router.use("/boards", boardRoutes);
// router.use("/columns", columnRoutes);
// router.use("/tasks", taskRoutes);

export default router;
