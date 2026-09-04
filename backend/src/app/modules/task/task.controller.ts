import { Request, Response, NextFunction } from "express";
import { taskService } from "./task.service";
import { createTaskSchema, updateTaskSchema, moveTaskSchema } from "./task.validation";
import { AppError } from "../../errors/AppError";

export const taskController = {
  async createTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new AppError(401, "Unauthorized");

      const boardId = req.params.boardId as string;
      const validatedData = createTaskSchema.parse(req.body);
      const task = await taskService.createTask(userId, boardId, validatedData);

      res.status(201).json({
        success: true,
        message: "Task created successfully",
        data: task,
      });
    } catch (error) {
      next(error);
    }
  },

  async getBoardTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new AppError(401, "Unauthorized");

      const boardId = req.params.boardId as string;
      const tasks = await taskService.getBoardTasks(userId, boardId);

      res.status(200).json({
        success: true,
        message: "Tasks retrieved successfully",
        data: tasks,
      });
    } catch (error) {
      next(error);
    }
  },

  async getTaskById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new AppError(401, "Unauthorized");

      const taskId = req.params.taskId as string;
      const task = await taskService.getTaskById(userId, taskId);

      res.status(200).json({
        success: true,
        message: "Task retrieved successfully",
        data: task,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new AppError(401, "Unauthorized");

      const taskId = req.params.taskId as string;
      const validatedData = updateTaskSchema.parse(req.body);
      const task = await taskService.updateTask(userId, taskId, validatedData);

      res.status(200).json({
        success: true,
        message: "Task updated successfully",
        data: task,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new AppError(401, "Unauthorized");

      const taskId = req.params.taskId as string;
      const result = await taskService.deleteTask(userId, taskId);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async moveTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new AppError(401, "Unauthorized");

      const taskId = req.params.taskId as string;
      const validatedData = moveTaskSchema.parse(req.body);
      const task = await taskService.moveTask(userId, taskId, validatedData);

      res.status(200).json({
        success: true,
        message: "Task moved successfully",
        data: task,
      });
    } catch (error) {
      next(error);
    }
  },
};
