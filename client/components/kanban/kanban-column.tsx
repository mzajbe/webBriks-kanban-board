"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus, MoreHorizontal, Edit2, Trash2 } from "lucide-react";
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
  onDeleteTask?: (task: Task) => void;
  onEditTask?: (task: Task) => void;
  onRenameColumn?: (column: Column) => void;
  onDeleteColumn?: (column: Column) => void;
}

export function KanbanColumn({
  column,
  tasks,
  onAddTask,
  onMoveColumn,
  onDeleteTask,
  onEditTask,
  onRenameColumn,
  onDeleteColumn,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const taskIds = tasks.map((t) => t.id);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex w-72 md:w-80 shrink-0 flex-col rounded-3xl border p-3.5 transition-all duration-200",
        column.bgTint,
        column.borderTint,
        isOver && "ring-2 ring-emerald-500/40 bg-emerald-50/30 border-emerald-300 scale-[1.005]"
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
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => onAddTask && onAddTask(column.id)}>
                <Plus className="h-3.5 w-3.5 mr-2 text-slate-500" /> Add Task
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onRenameColumn && onRenameColumn(column)}>
                <Edit2 className="h-3.5 w-3.5 mr-2 text-slate-500" /> Rename Column
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-rose-600 focus:text-rose-700 font-medium"
                onClick={() => onDeleteColumn && onDeleteColumn(column)}
              >
                <Trash2 className="h-3.5 w-3.5 mr-2 text-rose-500" /> Delete Column
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Cards List & Droppable Container */}
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div className="flex-1 space-y-3 min-h-[320px]">
          {tasks.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200/90 bg-white/40 p-4 text-center">
              <p className="text-xs font-semibold text-slate-500">No tasks</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Drag tasks here or create one.</p>
              <button
                onClick={() => onAddTask && onAddTask(column.id)}
                className="mt-3 flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-800 shadow-2xs border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <Plus className="h-3 w-3" />
                <span>Add task</span>
              </button>
            </div>
          ) : (
            <>
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onMoveColumn={onMoveColumn}
                  onDeleteTask={onDeleteTask}
                  onEditTask={onEditTask}
                />
              ))}

              
            </>
          )}
        </div>
      </SortableContext>
    </div>
  );
}
