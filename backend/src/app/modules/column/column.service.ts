import prisma from "../../config/prisma";
import { AppError } from "../../errors/AppError";
import { boardService } from "../board/board.service";
import { CreateColumnInput, UpdateColumnInput } from "./column.validation";

export const columnService = {
  async createColumn(userId: string, boardId: string, payload: CreateColumnInput) {
    const hasAccess = await boardService.canAccessBoard(userId, boardId);
    if (!hasAccess) {
      throw new AppError(403, "Access denied to this board");
    }

    // Determine next position automatically
    const lastColumn = await prisma.column.findFirst({
      where: { boardId },
      orderBy: { position: "desc" },
      select: { position: true },
    });

    const nextPosition = lastColumn ? lastColumn.position + 1 : 0;

    const column = await prisma.column.create({
      data: {
        boardId,
        name: payload.name,
        position: nextPosition,
      },
    });

    return column;
  },

  async getBoardColumns(userId: string, boardId: string) {
    const hasAccess = await boardService.canAccessBoard(userId, boardId);
    if (!hasAccess) {
      throw new AppError(403, "Access denied to this board");
    }

    const columns = await prisma.column.findMany({
      where: { boardId },
      orderBy: { position: "asc" },
    });

    return columns;
  },

  async updateColumn(userId: string, columnId: string, payload: UpdateColumnInput) {
    const column = await prisma.column.findUnique({
      where: { id: columnId },
      select: { id: true, boardId: true },
    });

    if (!column) {
      throw new AppError(404, "Column not found");
    }

    const hasAccess = await boardService.canAccessBoard(userId, column.boardId);
    if (!hasAccess) {
      throw new AppError(403, "Access denied to this board");
    }

    const updatedColumn = await prisma.column.update({
      where: { id: columnId },
      data: { name: payload.name },
    });

    return updatedColumn;
  },

  async deleteColumn(userId: string, columnId: string) {
    const column = await prisma.column.findUnique({
      where: { id: columnId },
      select: { id: true, boardId: true },
    });

    if (!column) {
      throw new AppError(404, "Column not found");
    }

    const hasAccess = await boardService.canAccessBoard(userId, column.boardId);
    if (!hasAccess) {
      throw new AppError(403, "Access denied to this board");
    }

    await prisma.column.delete({
      where: { id: columnId },
    });

    return { success: true, message: "Column deleted successfully" };
  },

  async reorderColumns(userId: string, boardId: string, columnIds: string[]) {
    const hasAccess = await boardService.canAccessBoard(userId, boardId);
    if (!hasAccess) {
      throw new AppError(403, "Access denied to this board");
    }

    // Verify all columns belong to this board
    const columns = await prisma.column.findMany({
      where: { boardId },
      select: { id: true },
    });

    const boardColumnIds = new Set(columns.map((c) => c.id));

    for (const id of columnIds) {
      if (!boardColumnIds.has(id)) {
        throw new AppError(400, `Column ${id} does not belong to this board`);
      }
    }

    // Use a transaction to update all positions atomically
    const updates = columnIds.map((id, index) =>
      prisma.column.update({
        where: { id },
        data: { position: index },
      })
    );

    await prisma.$transaction(updates);

    // Return reordered columns
    const reordered = await prisma.column.findMany({
      where: { boardId },
      orderBy: { position: "asc" },
    });

    return reordered;
  },
};
