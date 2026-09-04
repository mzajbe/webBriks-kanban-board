import { apiClient } from "./client";
import {
  TaskResponse,
  TasksListResponse,
  CreateTaskPayload,
  UpdateTaskPayload,
} from "@/types/task";

export async function getTasks(boardId: string): Promise<TasksListResponse> {
  return apiClient<TasksListResponse>(`/boards/${boardId}/tasks`, {
    method: "GET",
  });
}

export async function getTask(taskId: string): Promise<TaskResponse> {
  return apiClient<TaskResponse>(`/tasks/${taskId}`, {
    method: "GET",
  });
}

export async function createTask(
  boardId: string,
  data: CreateTaskPayload
): Promise<TaskResponse> {
  return apiClient<TaskResponse>(`/boards/${boardId}/tasks`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateTask(
  taskId: string,
  data: UpdateTaskPayload
): Promise<TaskResponse> {
  return apiClient<TaskResponse>(`/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteTask(
  taskId: string
): Promise<{ success: boolean; message: string }> {
  return apiClient<{ success: boolean; message: string }>(`/tasks/${taskId}`, {
    method: "DELETE",
  });
}

export const tasksApi = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};
