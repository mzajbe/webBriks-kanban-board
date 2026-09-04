import { Request, Response, NextFunction } from "express";
import { boardService } from "./board.service";
import { createBoardSchema, updateBoardSchema, addMemberSchema } from "./board.validation";
import { AppError } from "../../errors/AppError";

export const boardController = {
  async createBoard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError(401, "Unauthorized access");
      }

      const validatedData = createBoardSchema.parse(req.body);
      const board = await boardService.createBoard(userId, validatedData);

      res.status(201).json({
        success: true,
        message: "Board created successfully",
        data: board,
      });
    } catch (error) {
      next(error);
    }
  },

  async getUserBoards(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError(401, "Unauthorized access");
      }

      const boards = await boardService.getUserBoards(userId);

      res.status(200).json({
        success: true,
        message: "Boards retrieved successfully",
        data: boards,
      });
    } catch (error) {
      next(error);
    }
  },

  async getBoardById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError(401, "Unauthorized access");
      }

      const boardId = req.params.boardId as string;
      const board = await boardService.getBoardById(userId, boardId);

      res.status(200).json({
        success: true,
        message: "Board retrieved successfully",
        data: board,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateBoard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError(401, "Unauthorized access");
      }

      const boardId = req.params.boardId as string;
      const validatedData = updateBoardSchema.parse(req.body);
      const board = await boardService.updateBoard(userId, boardId, validatedData);

      res.status(200).json({
        success: true,
        message: "Board updated successfully",
        data: board,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteBoard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError(401, "Unauthorized access");
      }

      const boardId = req.params.boardId as string;
      const result = await boardService.deleteBoard(userId, boardId);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async getBoardMembers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError(401, "Unauthorized access");
      }

      const boardId = req.params.boardId as string;
      const members = await boardService.getBoardMembers(userId, boardId);

      res.status(200).json({
        success: true,
        message: "Board members retrieved successfully",
        data: members,
      });
    } catch (error) {
      next(error);
    }
  },

  async addBoardMember(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError(401, "Unauthorized access");
      }

      const boardId = req.params.boardId as string;
      const validatedData = addMemberSchema.parse(req.body);
      const addedUser = await boardService.addBoardMember(userId, boardId, validatedData.email);

      res.status(201).json({
        success: true,
        message: "Member added to board successfully",
        data: addedUser,
      });
    } catch (error) {
      next(error);
    }
  },

  async removeBoardMember(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError(401, "Unauthorized access");
      }

      const boardId = req.params.boardId as string;
      const targetUserId = req.params.userId as string;
      const result = await boardService.removeBoardMember(userId, boardId, targetUserId);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};
