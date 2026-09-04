import { Request, Response, NextFunction } from "express";
import { columnService } from "./column.service";
import { createColumnSchema, updateColumnSchema, reorderColumnsSchema } from "./column.validation";
import { AppError } from "../../errors/AppError";

export const columnController = {
  async createColumn(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new AppError(401, "Unauthorized");

      const boardId = req.params.boardId as string;
      const validatedData = createColumnSchema.parse(req.body);
      const column = await columnService.createColumn(userId, boardId, validatedData);

      res.status(201).json({
        success: true,
        message: "Column created successfully",
        data: column,
      });
    } catch (error) {
      next(error);
    }
  },

  async getBoardColumns(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new AppError(401, "Unauthorized");

      const boardId = req.params.boardId as string;
      const columns = await columnService.getBoardColumns(userId, boardId);

      res.status(200).json({
        success: true,
        message: "Columns retrieved successfully",
        data: columns,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateColumn(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new AppError(401, "Unauthorized");

      const columnId = req.params.columnId as string;
      const validatedData = updateColumnSchema.parse(req.body);
      const column = await columnService.updateColumn(userId, columnId, validatedData);

      res.status(200).json({
        success: true,
        message: "Column updated successfully",
        data: column,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteColumn(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new AppError(401, "Unauthorized");

      const columnId = req.params.columnId as string;
      const result = await columnService.deleteColumn(userId, columnId);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async reorderColumns(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new AppError(401, "Unauthorized");

      const boardId = req.params.boardId as string;
      const validatedData = reorderColumnsSchema.parse(req.body);
      const columns = await columnService.reorderColumns(userId, boardId, validatedData.columnIds);

      res.status(200).json({
        success: true,
        message: "Columns reordered successfully",
        data: columns,
      });
    } catch (error) {
      next(error);
    }
  },
};
