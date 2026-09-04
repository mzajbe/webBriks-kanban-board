import { Router } from "express";
import { taskController } from "./task.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

// Board-scoped task routes: /api/boards/:boardId/tasks
const boardTaskRouter = Router({ mergeParams: true });
boardTaskRouter.use(authMiddleware);

boardTaskRouter.post("/", taskController.createTask);
boardTaskRouter.get("/", taskController.getBoardTasks);

// Standalone task routes: /api/tasks/:taskId
const taskRouter = Router();
taskRouter.use(authMiddleware);

taskRouter.get("/:taskId", taskController.getTaskById);
taskRouter.patch("/:taskId", taskController.updateTask);
taskRouter.patch("/:taskId/move", taskController.moveTask);
taskRouter.delete("/:taskId", taskController.deleteTask);

export { boardTaskRouter, taskRouter };
