export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface TaskAssigneeUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  color?: string;
  initials?: string;
}

export interface Task {
  id: string;
  boardId: string;
  columnId: string;
  title: string;
  description: string | null;
  priority: TaskPriority;
  position: number;
  assignee: TaskAssigneeUser | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  subtasks?: {
    completed: number;
    total: number;
  };
  commentsCount?: number;
}

export interface CreateTaskPayload {
  columnId: string;
  title: string;
  description?: string | null;
  priority?: TaskPriority;
  assigneeId?: string | null;
  dueDate?: string | null;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string | null;
  priority?: TaskPriority;
  assigneeId?: string | null;
  dueDate?: string | null;
}

export interface MoveTaskPayload {
  targetColumnId: string;
  targetPosition: number;
}

export interface TaskResponse {
  success: boolean;
  message: string;
  data: Task;
}

export interface TasksListResponse {
  success: boolean;
  message: string;
  data: Task[];
}
