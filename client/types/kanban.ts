export type Priority = 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';

export type ColumnId = 'todo' | 'in_progress' | 'review' | 'done';

export interface User {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatar?: string;
  color?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  columnId: ColumnId;
  assignee?: User;
  dueDate?: string;
  tags?: string[];
  subtasks?: {
    completed: number;
    total: number;
  };
  commentsCount?: number;
}

export interface Column {
  id: ColumnId;
  title: string;
  dotColor: string;
  bgTint: string;
  borderTint: string;
  badgeBg: string;
  badgeText: string;
}

export interface BoardItem {
  id: string;
  name: string;
  iconLetter: string;
  iconBg: string;
  iconTextColor: string;
  count: number;
  active?: boolean;
}

export interface Board {
  id: string;
  name: string;
  subtitle: string;
  totalTasks: number;
  columns: Column[];
  tasks: Task[];
}
