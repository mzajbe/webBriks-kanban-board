"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Board, BoardMemberUser, CreateBoardPayload, UpdateBoardPayload } from "@/types/board";
import { boardsApi } from "@/lib/api/boards";
import { useAuth } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api/client";

interface BoardContextType {
  boards: Board[];
  activeBoard: Board | null;
  members: BoardMemberUser[];
  isLoadingBoards: boolean;
  isLoadingActiveBoard: boolean;
  fetchBoards: () => Promise<Board[]>;
  selectBoard: (id: string) => Promise<void>;
  createBoard: (data: CreateBoardPayload) => Promise<Board>;
  updateBoard: (id: string, data: UpdateBoardPayload) => Promise<Board>;
  deleteBoard: (id: string) => Promise<void>;
  fetchMembers: (boardId: string) => Promise<BoardMemberUser[]>;
  shareBoard: (boardId: string, email: string) => Promise<void>;
  removeMember: (boardId: string, userId: string) => Promise<void>;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export function BoardProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [boards, setBoards] = useState<Board[]>([]);
  const [activeBoard, setActiveBoard] = useState<Board | null>(null);
  const [members, setMembers] = useState<BoardMemberUser[]>([]);
  const [isLoadingBoards, setIsLoadingBoards] = useState<boolean>(true);
  const [isLoadingActiveBoard, setIsLoadingActiveBoard] = useState<boolean>(false);

  const fetchBoards = useCallback(async (): Promise<Board[]> => {
    try {
      setIsLoadingBoards(true);
      const res = await boardsApi.getBoards();
      const loadedBoards = res.data || [];
      setBoards(loadedBoards);
      return loadedBoards;
    } catch (error) {
      console.error("Failed to load boards:", error);
      setBoards([]);
      return [];
    } finally {
      setIsLoadingBoards(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBoards();
    } else {
      setBoards([]);
      setActiveBoard(null);
      setMembers([]);
      setIsLoadingBoards(false);
    }
  }, [isAuthenticated, fetchBoards]);

  const fetchMembers = useCallback(async (boardId: string): Promise<BoardMemberUser[]> => {
    try {
      const res = await boardsApi.getBoardMembers(boardId);
      const memberList = res.data || [];
      setMembers(memberList);
      return memberList;
    } catch {
      setMembers([]);
      return [];
    }
  }, []);

  const selectBoard = useCallback(
    async (id: string) => {
      try {
        setIsLoadingActiveBoard(true);
        const res = await boardsApi.getBoard(id);
        if (res.data) {
          setActiveBoard(res.data);
          fetchMembers(id);
        }
      } catch (err) {
        if (err instanceof ApiError && err.status === 403) {
          toast.error("You do not have access to this board");
        } else if (err instanceof ApiError && err.status === 404) {
          toast.error("Board not found");
        } else {
          toast.error("Failed to load board details");
        }
        setActiveBoard(null);
      } finally {
        setIsLoadingActiveBoard(false);
      }
    },
    [fetchMembers]
  );

  const createBoard = async (data: CreateBoardPayload): Promise<Board> => {
    const res = await boardsApi.createBoard(data);
    const newBoard = res.data;
    toast.success("Board created successfully!");
    await fetchBoards();
    setActiveBoard(newBoard);
    return newBoard;
  };

  const updateBoard = async (id: string, data: UpdateBoardPayload): Promise<Board> => {
    const res = await boardsApi.updateBoard(id, data);
    const updated = res.data;
    toast.success("Board updated successfully!");
    setBoards((prev) => prev.map((b) => (b.id === id ? { ...b, ...updated } : b)));
    if (activeBoard?.id === id) {
      setActiveBoard((prev) => (prev ? { ...prev, ...updated } : updated));
    }
    return updated;
  };

  const deleteBoard = async (id: string): Promise<void> => {
    await boardsApi.deleteBoard(id);
    toast.success("Board deleted successfully");
    const updatedBoards = await fetchBoards();
    if (activeBoard?.id === id) {
      if (updatedBoards.length > 0) {
        await selectBoard(updatedBoards[0].id);
      } else {
        setActiveBoard(null);
      }
    }
  };

  const shareBoard = async (boardId: string, email: string): Promise<void> => {
    await boardsApi.shareBoard(boardId, email);
    toast.success(`User ${email} added to board!`);
    await fetchMembers(boardId);
    await fetchBoards();
  };

  const removeMember = async (boardId: string, userId: string): Promise<void> => {
    await boardsApi.removeBoardMember(boardId, userId);
    toast.success("Member removed from board");
    await fetchMembers(boardId);
    await fetchBoards();
  };

  return (
    <BoardContext.Provider
      value={{
        boards,
        activeBoard,
        members,
        isLoadingBoards,
        isLoadingActiveBoard,
        fetchBoards,
        selectBoard,
        createBoard,
        updateBoard,
        deleteBoard,
        fetchMembers,
        shareBoard,
        removeMember,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
}

export function useBoardContext(): BoardContextType {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error("useBoardContext must be used within a BoardProvider");
  }
  return context;
}
