"use client";

import React from "react";
import { Calendar, MoreHorizontal, Edit2, Trash2 } from "lucide-react";
import { Task } from "@/types/task";
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
  onDeleteTask?: (task: Task) => void;
  onEditTask?: (task: Task) => void;
  isOverlay?: boolean;
}

function formatDueDate(dueDateStr: string): string {
  try {
    const date = new Date(dueDateStr);
    if (isNaN(date.getTime())) return dueDateStr;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return dueDateStr;
  }
}

export function TaskCard({
  task,
  onDeleteTask,
  onEditTask,
  isOverlay = false,
}: TaskCardProps) {
  const isUrgent = task.priority === "URGENT";

  return (
    <div
      onClick={() => onEditTask && onEditTask(task)}
      className={cn(
        "group relative flex flex-col rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs transition-all duration-200 hover:shadow-md hover:border-slate-300 cursor-pointer select-none",
        isOverlay && "shadow-xl border-emerald-500 ring-2 ring-emerald-500/20 rotate-1 scale-[1.02]"
      )}
    >
      {/* Top Header Row: Priority Badge + Actions Menu */}
      <div className="flex items-center justify-between gap-2">
        <TaskPriority priority={task.priority} />

        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                className="opacity-0 group-hover:opacity-100 flex h-6 w-6 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-opacity cursor-pointer"
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onEditTask && onEditTask(task);
                }}
              >
                <Edit2 className="h-3.5 w-3.5 mr-2 text-slate-500" /> Edit Task
              </DropdownMenuItem>
              {onDeleteTask && (
                <DropdownMenuItem
                  className="text-rose-600 focus:text-rose-700 font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTask(task);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-2 text-rose-500" /> Delete Task
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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

      {/* Divider */}
      <div className="my-3 border-t border-slate-100" />

      {/* Footer Row: Assignee + Due Date */}
      <div className="flex items-center justify-between gap-2">
        <TaskAssignee assignee={task.assignee} />

        {task.dueDate && (
          <div
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium shrink-0",
              isUrgent
                ? "bg-rose-50 text-rose-600 border border-rose-100"
                : "bg-slate-50 text-slate-500 border border-slate-200/60"
            )}
          >
            <Calendar className="h-3 w-3 text-rose-400" />
            <span>{formatDueDate(task.dueDate)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
