"use client";

import React from "react";
import { MoreHorizontal, Edit2, Trash2 } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Column } from "@/types/column";
import { Task } from "@/types/task";
import { SortableTaskCard } from "@/components/kanban/sortable-task-card";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const COLUMN_STYLES = [
  {
    dotColor: "bg-[#1b4332]",
    bgTint: "bg-emerald-50/40",
    borderTint: "border-emerald-200/80",
    badgeBg: "bg-emerald-100",
    badgeText: "text-emerald-800",
  },
  {
    dotColor: "bg-amber-500",
    bgTint: "bg-amber-50/40",
    borderTint: "border-amber-200/80",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-800",
  },
  {
    dotColor: "bg-blue-500",
    bgTint: "bg-blue-50/40",
    borderTint: "border-blue-200/80",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-800",
  },
  {
    dotColor: "bg-purple-500",
    bgTint: "bg-purple-50/40",
    borderTint: "border-purple-200/80",
    badgeBg: "bg-purple-100",
    badgeText: "text-purple-800",
  },
  {
    dotColor: "bg-rose-500",
    bgTint: "bg-rose-50/40",
    borderTint: "border-rose-200/80",
    badgeBg: "bg-rose-100",
    badgeText: "text-rose-800",
  },
  {
    dotColor: "bg-indigo-500",
    bgTint: "bg-indigo-50/40",
    borderTint: "border-indigo-200/80",
    badgeBg: "bg-indigo-100",
    badgeText: "text-indigo-800",
  },
];

export function getColumnStyle(position: number) {
  return COLUMN_STYLES[Math.abs(position) % COLUMN_STYLES.length];
}

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  columnIndex?: number;
  isHighlighted?: boolean;
  isDragDisabled?: boolean;
  onDeleteTask?: (task: Task) => void;
  onEditTask?: (task: Task) => void;
  onRenameColumn?: (column: Column) => void;
  onDeleteColumn?: (column: Column) => void;
}

export function KanbanColumn({
  column,
  tasks,
  columnIndex = 0,
  isHighlighted = false,
  isDragDisabled = false,
  onDeleteTask,
  onEditTask,
  onRenameColumn,
  onDeleteColumn,
}: KanbanColumnProps) {
  const style = getColumnStyle(column.position ?? columnIndex);

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: "column",
      columnId: column.id,
    },
  });

  const highlighted = isHighlighted || isOver;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex w-72 md:w-80 shrink-0 flex-col rounded-3xl border p-3.5 transition-all duration-200",
        style.bgTint,
        style.borderTint,
        highlighted && "ring-2 ring-emerald-500/60 bg-emerald-50/80 shadow-md"
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-1 mb-3">
        <div className="flex items-center gap-2">
          <span className={cn("h-2.5 w-2.5 rounded-full shrink-0", style.dotColor)} />
          <h2 className="text-xs font-bold text-slate-900 tracking-tight">
            {column.name}
          </h2>
          <span
            className={cn(
              "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold",
              style.badgeBg,
              style.badgeText
            )}
          >
            {tasks.length}
          </span>
        </div>

        <div className="flex items-center gap-0.5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                onPointerDown={(e) => e.stopPropagation()}
                className="flex h-6 w-6 items-center justify-center rounded-full text-slate-400 hover:bg-white/80 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
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

      {/* Cards List Container */}
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex-1 space-y-3 min-h-[320px]">
          {tasks.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200/90 bg-white/40 p-4 text-center">
              <p className="text-xs font-semibold text-slate-500">No tasks</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Drag tasks here</p>
            </div>
          ) : (
            tasks.map((task) => (
              <SortableTaskCard
                key={task.id}
                task={task}
                disabled={isDragDisabled}
                onDeleteTask={onDeleteTask}
                onEditTask={onEditTask}
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
}
