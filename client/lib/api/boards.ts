import { apiClient } from "./client";
import {
  Board,
  CreateBoardPayload,
  UpdateBoardPayload,
  BoardResponse,
  BoardsListResponse,
  BoardMembersResponse,
  AddMemberResponse,
} from "@/types/board";

export const boardsApi = {
  async getBoards(): Promise<BoardsListResponse> {
    return apiClient<BoardsListResponse>("/boards", {
      method: "GET",
    });
  },

  async getBoard(id: string): Promise<BoardResponse> {
    return apiClient<BoardResponse>(`/boards/${id}`, {
      method: "GET",
    });
  },

  async createBoard(data: CreateBoardPayload): Promise<BoardResponse> {
    return apiClient<BoardResponse>("/boards", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateBoard(id: string, data: UpdateBoardPayload): Promise<BoardResponse> {
    return apiClient<BoardResponse>(`/boards/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async deleteBoard(id: string): Promise<{ success: boolean; message: string }> {
    return apiClient<{ success: boolean; message: string }>(`/boards/${id}`, {
      method: "DELETE",
    });
  },

  async getBoardMembers(id: string): Promise<BoardMembersResponse> {
    return apiClient<BoardMembersResponse>(`/boards/${id}/members`, {
      method: "GET",
    });
  },

  async shareBoard(id: string, email: string): Promise<AddMemberResponse> {
    return apiClient<AddMemberResponse>(`/boards/${id}/members`, {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  async removeBoardMember(boardId: string, userId: string): Promise<{ success: boolean; message: string }> {
    return apiClient<{ success: boolean; message: string }>(`/boards/${boardId}/members/${userId}`, {
      method: "DELETE",
    });
  },
};
