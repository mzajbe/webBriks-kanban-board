import prisma from "../../config/prisma";
import { AppError } from "../../errors/AppError";
import { boardService } from "../board/board.service";
import { CreateTaskInput, UpdateTaskInput } from "./task.validation";

const assigneeSelect = {
  select: {
    id: true,
    name: true,
    email: true,
  },
};

export const taskService = {
  async createTask(userId: string, boardId: string, payload: CreateTaskInput) {
    // 1. Verify user access to board
    const hasAccess = await boardService.canAccessBoard(userId, boardId);
    if (!hasAccess) {
      throw new AppError(403, "Access denied to this board");
    }

    // 2. Verify column exists and belongs to this board
    const column = await prisma.column.findUnique({
      where: { id: payload.columnId },
      select: { id: true, boardId: true },
    });

    if (!column) {
      throw new AppError(404, "Column not found");
    }

    if (column.boardId !== boardId) {
      throw new AppError(400, "Column does not belong to this board");
    }

    // 3. If assigneeId is provided, verify user exists
    if (payload.assigneeId) {
      const assignee = await prisma.user.findUnique({
        where: { id: payload.assigneeId },
        select: { id: true },
      });
      if (!assignee) {
        throw new AppError(404, "Assignee user not found");
      }
    }

    // 4. Calculate next position automatically (at the end of the column)
    const lastTask = await prisma.task.findFirst({
      where: { columnId: payload.columnId },
      orderBy: { position: "desc" },
      select: { position: true },
    });

    const nextPosition = lastTask ? lastTask.position + 1 : 0;

    // 5. Create the task
    const task = await prisma.task.create({
      data: {
        boardId,
        columnId: payload.columnId,
        title: payload.title,
        description: payload.description ?? null,
        priority: payload.priority ?? "MEDIUM",
        position: nextPosition,
        assigneeId: payload.assigneeId ?? null,
        dueDate: payload.dueDate ? new Date(payload.dueDate) : null,
      },
      include: {
        assignee: assigneeSelect,
      },
    });

    return task;
  },

  async getBoardTasks(userId: string, boardId: string) {
    // 1. Verify user access to board
    const hasAccess = await boardService.canAccessBoard(userId, boardId);
    if (!hasAccess) {
      throw new AppError(403, "Access denied to this board");
    }

    // 2. Fetch tasks for this board ordered by columnId and position
    const tasks = await prisma.task.findMany({
      where: { boardId },
      include: {
        assignee: assigneeSelect,
      },
      orderBy: [
        { columnId: "asc" },
        { position: "asc" },
      ],
    });

    return tasks;
  },

  async getTaskById(userId: string, taskId: string) {
    // 1. Fetch task
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        assignee: assigneeSelect,
      },
    });

    if (!task) {
      throw new AppError(404, "Task not found");
    }

    // 2. Verify user access to board
    const hasAccess = await boardService.canAccessBoard(userId, task.boardId);
    if (!hasAccess) {
      throw new AppError(403, "Access denied to this board");
    }

    return task;
  },

  async updateTask(userId: string, taskId: string, payload: UpdateTaskInput) {
    // 1. Fetch task
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: { id: true, boardId: true },
    });

    if (!task) {
      throw new AppError(404, "Task not found");
    }

    // 2. Verify user access to board
    const hasAccess = await boardService.canAccessBoard(userId, task.boardId);
    if (!hasAccess) {
      throw new AppError(403, "Access denied to this board");
    }

    // 3. If updating assignee, verify user exists
    if (payload.assigneeId !== undefined && payload.assigneeId !== null) {
      const assignee = await prisma.user.findUnique({
        where: { id: payload.assigneeId },
        select: { id: true },
      });
      if (!assignee) {
        throw new AppError(404, "Assignee user not found");
      }
    }

    // 4. Update task (do not allow changing boardId, columnId, or position)
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(payload.title !== undefined && { title: payload.title }),
        ...(payload.description !== undefined && { description: payload.description }),
        ...(payload.priority !== undefined && { priority: payload.priority }),
        ...(payload.assigneeId !== undefined && { assigneeId: payload.assigneeId }),
        ...(payload.dueDate !== undefined && {
          dueDate: payload.dueDate ? new Date(payload.dueDate) : null,
        }),
      },
      include: {
        assignee: assigneeSelect,
      },
    });

    return updatedTask;
  },

  async deleteTask(userId: string, taskId: string) {
    // 1. Fetch task
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: { id: true, boardId: true, columnId: true, position: true },
    });

    if (!task) {
      throw new AppError(404, "Task not found");
    }

    // 2. Verify user access to board
    const hasAccess = await boardService.canAccessBoard(userId, task.boardId);
    if (!hasAccess) {
      throw new AppError(403, "Access denied to this board");
    }

    // 3. Delete task and shift remaining positions in a transaction
    await prisma.$transaction([
      prisma.task.delete({
        where: { id: taskId },
      }),
      prisma.task.updateMany({
        where: {
          columnId: task.columnId,
          position: { gt: task.position },
        },
        data: {
          position: { decrement: 1 },
        },
      }),
    ]);

    return { success: true, message: "Task deleted successfully" };
  },
};
