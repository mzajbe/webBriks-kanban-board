import { apiClient } from "./client";
import {
  ColumnResponse,
  ColumnsListResponse,
  CreateColumnPayload,
  UpdateColumnPayload,
} from "@/types/column";

export async function getColumns(boardId: string): Promise<ColumnsListResponse> {
  return apiClient<ColumnsListResponse>(`/boards/${boardId}/columns`, {
    method: "GET",
  });
}

export async function createColumn(
  boardId: string,
  data: CreateColumnPayload
): Promise<ColumnResponse> {
  return apiClient<ColumnResponse>(`/boards/${boardId}/columns`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateColumn(
  columnId: string,
  data: UpdateColumnPayload
): Promise<ColumnResponse> {
  return apiClient<ColumnResponse>(`/columns/${columnId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteColumn(
  columnId: string
): Promise<{ success: boolean; message: string }> {
  return apiClient<{ success: boolean; message: string }>(`/columns/${columnId}`, {
    method: "DELETE",
  });
}

export async function reorderColumns(
  boardId: string,
  columnIds: string[]
): Promise<ColumnsListResponse> {
  return apiClient<ColumnsListResponse>(`/boards/${boardId}/columns/reorder`, {
    method: "PATCH",
    body: JSON.stringify({ columnIds }),
  });
}

export const columnsApi = {
  getColumns,
  createColumn,
  updateColumn,
  deleteColumn,
  reorderColumns,
};
