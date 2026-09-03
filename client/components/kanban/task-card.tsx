"use client";

import React from "react";
import { Calendar, MoreHorizontal, MessageSquare, CheckSquare } from "lucide-react";
import { Task } from "@/types/kanban";
import { TaskPriority } from "@/components/kanban/task-priority";
import { TaskAssignee } from "@/components/kanban/task-assignee";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskCardProps {
  task: Task;
  onMoveColumn?: (taskId: string, targetColumnId: string) => void;
  onDeleteTask?: (taskId: string) => void;
  onEditTask?: (task: Task) => void;
}

export function TaskCard({ task, onMoveColumn, onDeleteTask, onEditTask }: TaskCardProps) {
  const isUrgent = task.priority === "URGENT";

  return (
    <div
      onClick={() => onEditTask && onEditTask(task)}
      className="group relative flex flex-col rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs transition-all duration-200 hover:shadow-md hover:border-slate-300 cursor-pointer select-none"
    >
      {/* Top Header Row: Priority Badge + Actions Menu */}
      <div className="flex items-center justify-between gap-2">
        <TaskPriority priority={task.priority} />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <button className="opacity-0 group-hover:opacity-100 flex h-6 w-6 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-opacity">
              <MoreHorizontal className="h-3.5 w-3.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => onEditTask && onEditTask(task)}>
              Edit Task
            </DropdownMenuItem>
            {onMoveColumn && (
              <>
                <DropdownMenuItem onClick={() => onMoveColumn(task.id, 'todo')}>
                  Move to Todo
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onMoveColumn(task.id, 'in_progress')}>
                  Move to In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onMoveColumn(task.id, 'review')}>
                  Move to Review
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onMoveColumn(task.id, 'done')}>
                  Move to Done
                </DropdownMenuItem>
              </>
            )}
            {onDeleteTask && (
              <DropdownMenuItem
                className="text-rose-600 focus:text-rose-700"
                onClick={() => onDeleteTask(task.id)}
              >
                Delete Task
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Task Title */}
      <h3 className="mt-2.5 text-xs font-bold leading-snug text-slate-900 tracking-tight">
        {task.title}
      </h3>

      {/* Task Description */}
      {task.description && (
        <p className="mt-1.5 text-[11px] text-slate-500 font-normal leading-relaxed line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Subtasks & Comments (if available) */}
      {(task.subtasks || (task.commentsCount && task.commentsCount > 0)) && (
        <div className="mt-2.5 flex items-center gap-3 text-[11px] text-slate-400">
          {task.subtasks && (
            <div className="flex items-center gap-1">
              <CheckSquare className="h-3 w-3 text-slate-400" />
              <span>
                {task.subtasks.completed}/{task.subtasks.total}
              </span>
            </div>
          )}
          {task.commentsCount && task.commentsCount > 0 && (
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3 text-slate-400" />
              <span>{task.commentsCount}</span>
            </div>
          )}
        </div>
      )}

      {/* Divider */}
      <div className="my-3 border-t border-slate-100" />

      {/* Footer Row: Assignee + Due Date */}
      <div className="flex items-center justify-between gap-2">
        <TaskAssignee assignee={task.assignee} />

        {task.dueDate && (
          <div
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium shrink-0",
              isUrgent || task.dueDate === "Tomorrow"
                ? "bg-rose-50 text-rose-600 border border-rose-100"
                : "bg-slate-50 text-slate-500 border border-slate-200/60"
            )}
          >
            <Calendar className="h-3 w-3 text-rose-400" />
            <span>{task.dueDate}</span>
          </div>
        )}
      </div>
    </div>
  );
}
