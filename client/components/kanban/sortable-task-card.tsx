"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/types/task";
import { TaskCard } from "@/components/kanban/task-card";
import { cn } from "@/lib/utils";

interface SortableTaskCardProps {
  task: Task;
  disabled?: boolean;
  onDeleteTask?: (task: Task) => void;
  onEditTask?: (task: Task) => void;
  isOwner?: boolean;
}

export function SortableTaskCard({
  task,
  disabled = false,
  onDeleteTask,
  onEditTask,
  isOwner = true,
}: SortableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    disabled,
    data: {
      type: "task",
      task,
      columnId: task.columnId,
    },
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "touch-none select-none transition-opacity",
        disabled ? "cursor-default" : "cursor-grab active:cursor-grabbing",
        isDragging && "opacity-25 pointer-events-none"
      )}
    >
      <TaskCard
        task={task}
        onDeleteTask={onDeleteTask}
        onEditTask={onEditTask}
        isOwner={isOwner}
      />
    </div>
  );
}
