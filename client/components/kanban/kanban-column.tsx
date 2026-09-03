"use client";

import React from "react";
import { Plus, MoreHorizontal } from "lucide-react";
import { Column, Task } from "@/types/kanban";
import { TaskCard } from "@/components/kanban/task-card";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onAddTask?: (columnId: string) => void;
  onMoveColumn?: (taskId: string, targetColumnId: string) => void;
  onDeleteTask?: (taskId: string) => void;
  onEditTask?: (task: Task) => void;
}

export function KanbanColumn({
  column,
  tasks,
  onAddTask,
  onMoveColumn,
  onDeleteTask,
  onEditTask,
}: KanbanColumnProps) {
  return (
    <div
      className={cn(
        "flex w-72 md:w-80 shrink-0 flex-col rounded-3xl border p-3.5 transition-colors",
        column.bgTint,
        column.borderTint
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-1 mb-3">
        <div className="flex items-center gap-2">
          <span className={cn("h-2.5 w-2.5 rounded-full shrink-0", column.dotColor)} />
          <h2 className="text-xs font-bold text-slate-900 tracking-tight">
            {column.title}
          </h2>
          <span
            className={cn(
              "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold",
              column.badgeBg,
              column.badgeText
            )}
          >
            {tasks.length}
          </span>
        </div>

        <div className="flex items-center gap-0.5">
          <button
            onClick={() => onAddTask && onAddTask(column.id)}
            className="flex h-6 w-6 items-center justify-center rounded-full text-slate-400 hover:bg-white/80 hover:text-slate-700 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex h-6 w-6 items-center justify-center rounded-full text-slate-400 hover:bg-white/80 hover:text-slate-700 transition-colors">
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => onAddTask && onAddTask(column.id)}>
                Add New Task
              </DropdownMenuItem>
              <DropdownMenuItem>Sort by Priority</DropdownMenuItem>
              <DropdownMenuItem>Sort by Due Date</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Cards List */}
      <div className="flex-1 space-y-3 min-h-[300px]">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onMoveColumn={onMoveColumn}
            onDeleteTask={onDeleteTask}
            onEditTask={onEditTask}
          />
        ))}

        {/* Add Task Button at bottom of column */}
        <button
          onClick={() => onAddTask && onAddTask(column.id)}
          className="flex w-full items-center justify-center gap-1.5 rounded-2xl border border-dashed border-slate-300/80 bg-white/40 py-2.5 text-xs font-medium text-slate-500 hover:bg-white hover:text-slate-800 hover:border-slate-400 transition-all duration-200"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add task</span>
        </button>
      </div>
    </div>
  );
}
