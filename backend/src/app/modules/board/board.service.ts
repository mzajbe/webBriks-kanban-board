import prisma from "../../config/prisma";
import { AppError } from "../../errors/AppError";
import { CreateBoardInput, UpdateBoardInput } from "./board.validation";

export const boardService = {
  // Reusable Access Control Helpers
  async isBoardOwner(userId: string, boardId: string): Promise<boolean> {
    const board = await prisma.board.findFirst({
      where: { id: boardId, ownerId: userId },
      select: { id: true },
    });
    return !!board;
  },

  async canAccessBoard(userId: string, boardId: string): Promise<boolean> {
    const board = await prisma.board.findFirst({
      where: {
        id: boardId,
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } },
        ],
      },
      select: { id: true },
    });
    return !!board;
  },

  // Service Business Methods
  async createBoard(userId: string, payload: CreateBoardInput) {
    const board = await prisma.board.create({
      data: {
        name: payload.name,
        description: payload.description,
        ownerId: userId,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return board;
  },

  async getUserBoards(userId: string) {
    const boards = await prisma.board.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } },
        ],
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            members: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return boards.map((board) => ({
      id: board.id,
      name: board.name,
      description: board.description,
      owner: board.owner,
      memberCount: board._count.members,
      isOwner: board.ownerId === userId,
      createdAt: board.createdAt,
      updatedAt: board.updatedAt,
    }));
  },

  async getBoardById(userId: string, boardId: string) {
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            members: true,
          },
        },
      },
    });

    if (!board) {
      throw new AppError(404, "Board not found");
    }

    const hasAccess = await this.canAccessBoard(userId, boardId);
    if (!hasAccess) {
      throw new AppError(403, "Access denied to this board");
    }

    return {
      id: board.id,
      name: board.name,
      description: board.description,
      owner: board.owner,
      memberCount: board._count.members,
      isOwner: board.ownerId === userId,
      createdAt: board.createdAt,
      updatedAt: board.updatedAt,
    };
  },

  async updateBoard(userId: string, boardId: string, payload: UpdateBoardInput) {
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      select: { id: true, ownerId: true },
    });

    if (!board) {
      throw new AppError(404, "Board not found");
    }

    const isOwner = await this.isBoardOwner(userId, boardId);
    if (!isOwner) {
      throw new AppError(403, "Only the board owner can update board details");
    }

    const updatedBoard = await prisma.board.update({
      where: { id: boardId },
      data: payload,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return updatedBoard;
  },

  async deleteBoard(userId: string, boardId: string) {
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      select: { id: true, ownerId: true },
    });

    if (!board) {
      throw new AppError(404, "Board not found");
    }

    const isOwner = await this.isBoardOwner(userId, boardId);
    if (!isOwner) {
      throw new AppError(403, "Only the board owner can delete the board");
    }

    await prisma.board.delete({
      where: { id: boardId },
    });

    return { success: true, message: "Board deleted successfully" };
  },

  async getBoardMembers(userId: string, boardId: string) {
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!board) {
      throw new AppError(404, "Board not found");
    }

    const hasAccess = await this.canAccessBoard(userId, boardId);
    if (!hasAccess) {
      throw new AppError(403, "Access denied to this board");
    }

    const memberList = [
      {
        id: board.owner.id,
        name: board.owner.name,
        email: board.owner.email,
        isOwner: true,
      },
      ...board.members.map((m) => ({
        id: m.user.id,
        name: m.user.name,
        email: m.user.email,
        isOwner: false,
      })),
    ];

    return memberList;
  },

  async addBoardMember(userId: string, boardId: string, email: string) {
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      select: { id: true, ownerId: true },
    });

    if (!board) {
      throw new AppError(404, "Board not found");
    }

    const isOwner = await this.isBoardOwner(userId, boardId);
    if (!isOwner) {
      throw new AppError(403, "Only the board owner can add members");
    }

    // 1. Find registered user by email
    const targetUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true },
    });

    if (!targetUser) {
      throw new AppError(404, "User not found with this email");
    }

    // 2. Prevent owner from being added as a member
    if (targetUser.id === board.ownerId) {
      throw new AppError(400, "Board owner cannot be added as a member");
    }

    // 3. Prevent duplicate membership
    const existingMembership = await prisma.boardMember.findUnique({
      where: {
        boardId_userId: {
          boardId,
          userId: targetUser.id,
        },
      },
    });

    if (existingMembership) {
      throw new AppError(409, "User is already a member of this board");
    }

    // 4. Create BoardMember
    await prisma.boardMember.create({
      data: {
        boardId,
        userId: targetUser.id,
      },
    });

    return targetUser;
  },

  async removeBoardMember(userId: string, boardId: string, targetUserId: string) {
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      select: { id: true, ownerId: true },
    });

    if (!board) {
      throw new AppError(404, "Board not found");
    }

    const isOwner = await this.isBoardOwner(userId, boardId);
    if (!isOwner) {
      throw new AppError(403, "Only the board owner can remove members");
    }

    // Do not allow removing board owner
    if (targetUserId === board.ownerId) {
      throw new AppError(400, "Cannot remove the board owner");
    }

    const membership = await prisma.boardMember.findUnique({
      where: {
        boardId_userId: {
          boardId,
          userId: targetUserId,
        },
      },
    });

    if (!membership) {
      throw new AppError(404, "Member not found on this board");
    }

    await prisma.boardMember.delete({
      where: {
        boardId_userId: {
          boardId,
          userId: targetUserId,
        },
      },
    });

    return { success: true, message: "Board member removed successfully" };
  },
};
